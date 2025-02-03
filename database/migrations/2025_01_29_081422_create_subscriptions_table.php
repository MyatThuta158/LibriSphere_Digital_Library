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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id()->primary()->autoIncrement();
            $table->foreignId('admin_id')->constrained('admins')->onDelete('cascade');
            $table->foreignId('membership_plans_id')->constrained('membership_plans')->onDelete('cascade');
            $table->foreignId('payment__types_id')->constrained('payment__types')->onDelete('cascade');
            $table->foreignId('users_id')->constrained('users')->onDelete('cascade');
            $table->text('PaymentScreenShot');
            $table->string('PaymentAccountName');
            $table->string('PaymentAccountNumber');
            $table->string('PaymentDate');
            $table->string('MemberstartDate');
            $table->string('MemberEndDate');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
