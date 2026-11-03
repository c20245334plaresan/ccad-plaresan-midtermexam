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
       
Schema::create('berth_slots', function (Blueprint $table) {
    $table->id();
    $table->string('slot_code')->unique();
    $table->string('status')->default('Available');
    $table->timestamps();
});

      
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('berth_slots');
    }
};
