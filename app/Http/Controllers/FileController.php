<?php
namespace App\Http\Controllers;

use App\Models\Resources;
use Illuminate\Http\Request;

class FileController extends Controller
{
    public function download($id)
    {
        // Retrieve the resource record from the database using the ID
        $resource = Resources::find($id);
        //dd($resource);

        // If the resource isn’t found, return an error response
        if (! $resource) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        // Construct the file path using the file attribute from the resource record.
        // Assuming the file attribute stores the filename (e.g., "Jon_Gordon_The_Power_of_a_Positive_Team_Proven_Principles_and_Practices.pdf")
        $filePath = public_path('storage/' . $resource->file);

        // Check if the file exists on the server
        if (! file_exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        // Optionally, set a custom download name. For example, you might use the resource name:
        $downloadName = $resource->name . '.' . pathinfo($resource->file, PATHINFO_EXTENSION);

        // Return the file as a download response
        return response()->download($filePath, $downloadName);
    }

    public function stream(Request $request, $id)
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Expose-Headers: Content-Range, Accept-Ranges, Content-Length");
        header("Cache-Control: no-cache, must-revalidate");
        header("Expires: 0");

        $resource = Resources::find($id);
        if (! $resource) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        $filePath = public_path('storage/' . $resource->file);
        if (! file_exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $size   = filesize($filePath);
        $length = $size;
        $start  = 0;
        $end    = $size - 1;

        if ($request->headers->has('Range')) {
            $range         = $request->header('Range');
            list(, $range) = explode('=', $range, 2);
            if (strpos($range, ',') !== false) {
                return response()->json(['error' => 'Multiple ranges not supported'], 416);
            }
            if ($range) {
                $rangeParts = explode('-', $range);
                $start      = intval($rangeParts[0]);
                if (isset($rangeParts[1]) && is_numeric($rangeParts[1])) {
                    $end = intval($rangeParts[1]);
                }
                $length = $end - $start + 1;
                header('HTTP/1.1 206 Partial Content');
                header("Content-Range: bytes $start-$end/$size");
            }
        }

        header("Content-Length: $length");
        header("Content-Type: video/mp4");
        header("Accept-Ranges: bytes");

        $fp = fopen($filePath, 'rb');
        fseek($fp, $start);
        $buffer = 1024 * 8; // 8KB chunks
        while (! feof($fp) && ftell($fp) <= $end) {
            if (ftell($fp) + $buffer > $end) {
                $buffer = $end - ftell($fp) + 1;
            }
            set_time_limit(0);
            echo fread($fp, $buffer);
            flush();
        }
        fclose($fp);
        exit;
    }

}
