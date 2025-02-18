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
        Schema::create('request_resources', function (Blueprint $table) {
            $table->id()->primary()->autoIncrement();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('Title');
            $table->string('ISBN')->nullable();
            $table->string('Author')->nullable();
            $table->string('Language');
            $table->string('PublishYear')->nullable();
            $table->text('Resource_Photo')->nullable();
            $table->text('Admin_Comment')->nullable();
            $table->string('NotificationStatus');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_resources');
    }
};
