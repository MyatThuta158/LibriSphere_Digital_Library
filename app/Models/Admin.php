<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;


class Admin extends Authenticatable
{

    use HasFactory, Notifiable,HasApiTokens,HasRoles;

    protected $table='admins';
    protected $guard_name = 'api';
    protected $fillable = ['Name','Email','Password','Role','Gender','PhoneNumber','ProfilePicture'];
    public $timestamps=true;

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'admin_id');
    }
 
}
