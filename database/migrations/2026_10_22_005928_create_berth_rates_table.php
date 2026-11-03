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
      
Schema::create('berth_rates', function (Blueprint $table) {
    $table->id();
    $table->decimal('hourly_berth_rate', 10, 2);
    $table->date('effective_from');
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('berth_rates');
    }
};
