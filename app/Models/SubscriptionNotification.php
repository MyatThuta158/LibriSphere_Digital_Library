<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionNotification extends Model
{
    use HasFactory;

    protected $table = 'subscription_notifications';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'SubscriptionId',
        'Description',
        'WatchStatus',
    ];

    /**
     * Get the subscription that owns the notification.
     */
    public function subscription()
    {
        return $this->belongsTo(Subscription::class, 'SubscriptionId');
    }
}
