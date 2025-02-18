<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request_Resources extends Model
{
    use HasFactory;

    protected $table='request_resources';
    protected $fillable=['Title','user_id','ISBN','Author','Language','PublishYear','Resource_Photo','Admin_Comment','NotificationStatus'];
    public $timestamps=true;

    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }
}
