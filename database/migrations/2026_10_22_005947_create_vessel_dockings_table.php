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

            $table->string('vessel_imo_number', 10);

            $table->foreign('vessel_imo_number')
                ->references('vessel_imo_number')
                ->on('vessels')
                ->restrictOnDelete();

            $table->foreignId('berth_slot_id')
                ->constrained('berth_slots')
                ->restrictOnDelete();

            $table->foreignId('berth_rate_id')
                ->constrained('berth_rates')
                ->restrictOnDelete();

            $table->dateTime('arrival_time');
            $table->dateTime('departure_time')->nullable();

            $table->decimal('total_hours', 10, 2)->default(0);
            $table->decimal('total_berth_fee', 12, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vessel_dockings');
    }
};
