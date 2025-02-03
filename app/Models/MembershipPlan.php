<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MembershipPlan extends Model
{
    protected $table="membership_plans";
    public $timestamps=false;
    protected $fillable=['PlanName','Duration','Price','Description'];

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'membership_plans_id');
    }
}
