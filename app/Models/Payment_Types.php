<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment_Types extends Model
{
    protected $table   = 'payment_types';
    public $fillable   = ['PaymentTypeName', 'AccountName', 'AccountNumber', 'BankName', 'BankLogo', 'QR_Scan'];
    public $timestamps = false;

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'payment_types_id');
    }
}
