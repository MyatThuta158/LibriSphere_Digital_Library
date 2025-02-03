<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reviews extends Model
{
    protected $table = 'reviews';

    // Define the fillable attributes (columns you want to mass assign)
    protected $fillable = [
        'resource_id','user_id','ReviewStar','ReviewMessage'
        
    ];

    public $timestamps = true;

    public function resource()
    {
        return $this->belongsTo(Resources::class);
    }

    // Relationship with User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
