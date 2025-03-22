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
        Schema::create('electronic_resources', function (Blueprint $table) {
            $table->bigInteger('id')->primary()->autoIncrement();
            $table->string('code');
            $table->string('name');
            $table->string('publish_date');
            $table->unsignedBigInteger('resource_typeId');
            $table->string('ISBN')->nullable();
            $table->text('cover_photo');
            $table->text('file');
            $table->text('Description');
            $table->integer('MemberViewCount');
            $table->foreignId('author_id')->constrained('authors')->onDelete('cascade');
            $table->foreign('resource_typeId')->references('id')->on('resource_file_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('electronic_resources');
    }
};
