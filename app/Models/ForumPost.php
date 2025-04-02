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

    public function discussions()
    {
        // Explicitly set the foreign key on the discussions table and the local key from forum_posts.
        return $this->hasMany(Discussion::class, 'ForumPostId', 'ForumPostId');
    }

    public function votes()
    {
        // Explicitly set the foreign key on the votes table and the local key from forum_posts.
        return $this->hasMany(Votes::class, 'ForumPostId', 'ForumPostId');
    }

}
