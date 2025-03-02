<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Votes extends Model
{
    // Define the table name if needed (Laravel will infer "votes" by default)
    protected $table = 'votes';

    // Attributes that are mass assignable.
    protected $fillable = [
        'user_id',
        'ForumPostId',
        'vote_type_id',
    ];

    /**
     * Get the user who cast the vote.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the post that was voted on.
     */
    public function ForumPost()
    {
        return $this->belongsTo(ForumPost::class);
    }

    /**
     * Get the vote type associated with this vote.
     */
    public function voteType()
    {
        return $this->belongsTo(VoteTypes::class, 'vote_type_id');
    }
}
