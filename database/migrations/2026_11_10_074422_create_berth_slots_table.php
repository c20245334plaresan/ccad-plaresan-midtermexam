<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('berth_slots', function (Blueprint $table) {
            $table->id();

            $table->string('berth_slot', 50)->unique();

            $table->enum('status', [
                'Available',
                'Occupied'
            ])->default('Available');

            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('berth_slots');
    }
};