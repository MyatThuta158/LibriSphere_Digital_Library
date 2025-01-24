<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table='admins';
    protected $fillable = ['Name','Email','Password','Role','Gender','PhoneNumber','ProfilePicture'];
    public $timestamps=true;
 
}
