<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment__types', function (Blueprint $table) {
            $table->id()->primary()->autoIncrement();
            $table->string("PaymentTypeName");
            $table->string("AccountName");
            $table->string('AccountNumber');
            $table->string('BankName');
            $table->text('QR_Scan');
          
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment__types');
    }
};
