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
        
Schema::create('vessels', function (Blueprint $table) {
    $table->string('vessel_imo_number', 10)->primary();
    $table->string('vessel_name');
    $table->string('flag_country');
    $table->decimal('vessel_gt', 12, 2);
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vessels');
    }
};
