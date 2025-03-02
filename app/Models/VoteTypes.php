<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class VoteTypes extends Model
{
    // Specify the table name (optional if following Laravel naming conventions)
    protected $table = 'vote_types';

    // Allow mass assignment for the 'VoteType' field.
    protected $fillable = ['VoteType'];

    /**
     * Define a one-to-many relationship to the Vote model.
     *
     * Each vote type can be associated with multiple votes.
     */
    public function votes()
    {
        return $this->hasMany(Votes::class, 'vote_type_id');
    }
}
