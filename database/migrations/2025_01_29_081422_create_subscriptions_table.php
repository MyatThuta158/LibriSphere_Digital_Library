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
            $table->foreignId('admin_id')->nullable()->constrained('admins')->onDelete('cascade');
            $table->foreignId('membership_plans_id')->constrained('membership_plans')->onDelete('cascade');
            $table->foreignId('payment_types_id')->constrained('payment_types')->onDelete('cascade');
            $table->foreignId('users_id')->constrained('users')->onDelete('cascade');
            $table->text('PaymentScreenShot');
            $table->string('PaymentAccountName');
            $table->string('PaymentAccountNumber');
            $table->string('PaymentDate');
            $table->string('MemberstartDate');
            $table->string('MemberEndDate');
            $table->string('PaymentStatus');
            $table->date('AdminApprovedDate')->nullable();
            $table->enum("SubscriptionStatus", ["inactive", "active", "expired"]);
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
