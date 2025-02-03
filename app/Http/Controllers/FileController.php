<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function getStoredFile($filename)
    {
        $filePath = storage_path($filename);  // Example path

        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found.'], 404);
        }

        // Get the file content
        $fileContent = file_get_contents($filePath);
        $mimeType = mime_content_type($filePath);

        // Ensure the file is a valid PDF (you can check if it's really a PDF)
        if ($mimeType !== 'application/pdf') {
            return response()->json(['error' => 'Invalid file type.'], 400);
        }

        // Return the file as a blob (PDF)
        return response($fileContent, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }
}
