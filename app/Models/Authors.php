<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Authors extends Model
{
    protected $table = 'authors';
    protected $fillable = ['name'];
    public $timestamps = false;

    ///-----------This is one to many connection to resources---//
    public function resources(){
        return $this->hasMany(Resources::class);
    }
}
