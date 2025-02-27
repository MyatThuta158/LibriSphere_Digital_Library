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
        Schema::create('forum_posts', function (Blueprint $table) {
            $table->increments('ForumPostId');
            $table->unsignedInteger('UserId');
            $table->string('Title');
            $table->text('Description');
            $table->string('Photo1')->nullable();
            $table->string('Photo2')->nullable();
            $table->string('Photo3')->nullable();
            $table->integer('PostViews');
            $table->timestamps();
            $table->foreign('UserId')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forum_posts');
    }
};
