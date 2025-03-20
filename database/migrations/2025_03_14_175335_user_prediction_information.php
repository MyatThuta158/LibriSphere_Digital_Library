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
        Schema::create('user_prediction_information', function (Blueprint $table) {
            $table->id()->primary()->autoIncrement();
            $table->string('Accuracy');
            $table->date('PredictedDate');
            $table->string('7DaysReport');
            $table->string('14DaysReport');
            $table->string('28DaysReport');
            $table->unsignedBigInteger('AdminId');

            $table->foreign('AdminId')->references('id')->on('admins');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_prediction_information');
    }
};
