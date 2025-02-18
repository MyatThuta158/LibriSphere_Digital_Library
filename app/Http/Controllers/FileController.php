<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FileController extends Controller
{
    public function download(Request $request)
    {
        // Define the path to your file. This example uses a file stored in storage/app/public.
        $filePath = public_path('test_files/Jon_Gordon_The_Power_of_a_Positive_Team_Proven_Principles_and_Practices.pdf');

        // Check if the file exists
        if (! file_exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        // Return the file as a download response with an optional custom file name
        return response()->download($filePath, 'downloaded_sample.pdf');
    }
}
