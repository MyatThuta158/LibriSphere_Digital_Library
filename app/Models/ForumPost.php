<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ForumPost extends Model
{

    protected $primaryKey = 'ForumPostId';

    protected $fillable = [
        'UserId',
        'Title',
        'Description',
        'Photo1',
        'Photo2',
        'Photo3',
        'File',
        'PostViews',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'UserId');
    }
}
