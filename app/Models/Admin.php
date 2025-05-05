<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Admin extends Authenticatable
{

    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    protected $table      = 'admins';
    protected $guard_name = 'api';
    protected $fillable   = ['Name', 'Email', 'Password', 'role', 'Gender', 'PhoneNumber', 'ProfilePicture'];
    public $timestamps    = true;

    public static function store(array $data)
    {
        return self::create($data);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'admin_id');
    }

    public function userPredictionInformation()
    {
        return $this->hasMany(UserPredictionInformation::class, 'AdminId');
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class, 'admin_id');
    }

    public function revenuePredictions()
    {
        return $this->hasMany(RevenuePrediction::class, 'AdminId', 'id');
    }

}
