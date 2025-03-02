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
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('ForumPostId');
            $table->unsignedBigInteger('vote_type_id');
            $table->timestamps();

            // Ensure that a user can only vote once per post
            $table->unique(['user_id', 'ForumPostId']);

            // Set up foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('ForumPostId')->references('ForumPostId')->on('forum_posts')->onDelete('cascade');
            $table->foreign('vote_type_id')->references('id')->on('vote_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
