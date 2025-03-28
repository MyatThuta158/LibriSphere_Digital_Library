<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discussion extends Model
{
    use HasFactory;

    protected $table      = 'discussions';
    protected $primaryKey = 'id';
    public $timestamps    = true;

    protected $fillable = [
        'UserId',
        'ForumPostId',
        'Content',
        'NotiStatus',
    ];

    /**
     * Get the user that owns the discussion.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'UserId', 'id');
    }

    /**
     * Get the forum post that this discussion belongs to.
     */
    public function forumPost()
    {
        return $this->belongsTo(ForumPost::class, 'ForumPostId', 'ForumPostId');
    }
}
