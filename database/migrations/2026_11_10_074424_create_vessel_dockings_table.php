<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vessel_dockings', function (Blueprint $table) {
            $table->id();

            // Vessel Foreign Key
            $table->foreignId('vessel_id')
                ->constrained('vessels')
                ->onDelete('restrict');

            // Berth Slot Foreign Key
            $table->foreignId('berth_slot_id')
                ->constrained('berth_slots')
                ->onDelete('restrict');

            // Berth Rate Foreign Key
            $table->foreignId('berth_rate_id')
                ->constrained('berth_rates')
                ->onDelete('restrict');

            $table->dateTime('arrival_time');

            $table->dateTime('departure_time')
                ->nullable();

            $table->decimal('total_hours', 12, 2)
                ->default(0);

            $table->decimal('total_berth_fee', 14, 2)
                ->default(0);

            $table->timestamps();

            $table->index('arrival_time');
            $table->index('departure_time');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vessel_dockings');
    }
};