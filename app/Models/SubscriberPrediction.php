<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriberPrediction extends Model
{
    // Specify the table name since it doesn't follow Laravel's convention
    protected $table = 'SubscriberPrediction';

    // Define the primary key if different from the default
    protected $primaryKey = 'id';

    // Disable timestamps as they're not in your migration
    public $timestamps = false;

    // Specify which fields are mass assignable
    protected $fillable = [
        'SubscriptionPlanName',
        'Accuracy',
        'PredictedDate',
        '7DaysReport',
        '14DaysReport',
        '28DaysReport',
        'AdminId',
    ];

    // Cast PredictedDate to a date instance
    protected $casts = [
        'PredictedDate' => 'date',
    ];

    // Set the date format for serialization (e.g., to JSON)
    protected $dateFormat = 'Y-m-d';

    // Define the relationship to the Admin model
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'AdminId');
    }
}
