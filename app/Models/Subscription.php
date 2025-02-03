<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $table = 'subscriptions';

    // Define the fillable attributes (columns you want to mass assign)
    protected $fillable = [
        'admin_id',
        'membership_plans_id',
        'payment__types_id',
        'users_id',
        'PaymentScreenShot',
        'PaymentAccountName',
        'PaymentAccountNumber',
        'PaymentDate',
        'MemberstartDate',
        'MemberEndDate',
    ];

    public $timestamps = false;


    // Relationship with Admin model
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }

    // Relationship with MembershipPlan model
    public function membershipPlan()
    {
        return $this->belongsTo(MembershipPlan::class, 'membership_plans_id');
    }

    // Relationship with PaymentType model
    public function paymentType()
    {
        return $this->belongsTo(Payment_Types::class, 'payment__types_id');
    }

    // Relationship with User model
    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }
}
