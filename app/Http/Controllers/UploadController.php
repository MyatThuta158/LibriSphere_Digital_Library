<?php
namespace App\Http\Controllers;

use App\Models\Resources; // Make sure to import the Resources model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function uploadChunk(Request $request)
    {
        ob_clean();
        // Get Resumable.js parameters
        $resumableIdentifier  = $request->input('resumableIdentifier');
        $resumableFilename    = $request->input('resumableFilename');
        $resumableChunkNumber = $request->input('resumableChunkNumber'); // current chunk
        $resumableTotalChunks = $request->input('resumableTotalChunks'); // total chunks

        // Validate required parameters
        if (! $resumableIdentifier || ! $resumableFilename || ! $resumableChunkNumber || ! $resumableTotalChunks) {
            return response()->json(['error' => 'Missing upload parameters.'], 400);
        }

        // Optional: get the resource id if this is an update process
        $resourceId = $request->input('id');

        // Create a temporary folder to store chunks, if it does not exist
        $tempDir = storage_path('app/temp_uploads/' . $resumableIdentifier);
        if (! file_exists($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        // Save the current chunk (Resumable.js sends the chunk as "file")
        $chunkFile = $tempDir . '/' . $resumableChunkNumber;
        $request->file('file')->move($tempDir, $resumableChunkNumber);

        // Count the uploaded chunks (exclude . and ..)
        $chunks = array_diff(scandir($tempDir), ['.', '..']);

        // If all chunks have been uploaded, merge them
        if (count($chunks) == $resumableTotalChunks) {
            // Define the final file path (adjust the directory if needed)
            $finalDirectory = storage_path('app/public/resources/');
            if (! file_exists($finalDirectory)) {
                mkdir($finalDirectory, 0777, true);
            }
            $finalFilePath = $finalDirectory . $resumableFilename;

            // Open the final file for writing
            $output = fopen($finalFilePath, 'wb');
            // Loop through each chunk and append its contents to the final file
            for ($i = 1; $i <= $resumableTotalChunks; $i++) {
                $chunkPath = $tempDir . '/' . $i;
                $chunk     = fopen($chunkPath, 'rb');
                while ($buffer = fread($chunk, 4096)) {
                    fwrite($output, $buffer);
                }
                fclose($chunk);
            }
            fclose($output);

            // Cleanup: remove the temporary chunks and folder
            array_map('unlink', glob("$tempDir/*"));
            rmdir($tempDir);

            // Initialize $resource as null. If updating an existing resource, delete the old file first and update.
            $resource = null;
            if ($resourceId) {
                $resource = Resources::find($resourceId);
                if ($resource && $resource->file && Storage::disk('public')->exists($resource->file)) {
                    Storage::disk('public')->delete($resource->file);
                }
                // Update the resource record with the new file path
                if ($resource) {
                    $resource->file = 'resources/' . $resumableFilename;
                    $resource->save();
                }
            }

            // Return the final file path and resource id (if available)
            return response()->json([
                'message'    => 'Upload complete',
                'filePath'   => 'resources/' . $resumableFilename,
                'resourceId' => $resource ? $resource->id : null,
            ], 200);
        }

        // If not all chunks are received yet, return a simple acknowledgment
        return response()->json(['message' => 'Chunk uploaded'], 200);
    }
}
