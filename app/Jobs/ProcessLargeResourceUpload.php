<?php
namespace App\Jobs;

use App\Models\Resources;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ProcessLargeResourceUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $data;
    protected $tempPhotoPath;
    protected $tempFilePath;
    protected $userId;

    public function __construct($data, $tempPhotoPath, $tempFilePath, $userId)
    {
        $this->data          = $data;
        $this->tempPhotoPath = $tempPhotoPath;
        $this->tempFilePath  = $tempFilePath;
        $this->userId        = $userId;
    }

    public function handle()
    {
        // Move files from temporary location to permanent storage.
        $finalPhotoName = 'resources/' . basename($this->tempPhotoPath);
        $finalFileName  = 'resources/' . basename($this->tempFilePath);

        Storage::disk('public')->move($this->tempPhotoPath, $finalPhotoName);
        Storage::disk('public')->move($this->tempFilePath, $finalFileName);

        // Create the resource record.
        $resource = Resources::create([
            'code'            => $this->data['code'],
            'name'            => $this->data['name'],
            'publish_date'    => $this->data['date'],
            'cover_photo'     => $finalPhotoName,
            'ISBN'            => $this->data['ISBN'] ?? null,
            'file'            => $finalFileName,
            'author_id'       => $this->data['author'],
            'Description'     => $this->data['Description'],
            'MemberViewCount' => 0,
        ]);

        // Process genres (assuming it is a JSON encoded array).
        $genreArr = json_decode($this->data['genre'], true);
        $resource->genre()->attach($genreArr);
    }
}
