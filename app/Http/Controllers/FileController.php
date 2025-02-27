<?php
namespace App\Http\Controllers;

use App\Models\Resources;

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

}
