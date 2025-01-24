<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    protected $table = 'genres';
    protected $fillable = ['name'];
    public $timestamps = false;


    ///-----------This is many to many connection to resources---//
    function resources(){
        return $this->belongsToMany(Resources::class);
    }
}
