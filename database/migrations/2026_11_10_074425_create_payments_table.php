<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('vessel_docking_id')
                ->unique()
                ->constrained('vessel_dockings')
                ->onDelete('cascade');

            $table->enum('payment_status', [
                'Pending',
                'Paid',
                'Unpaid'
            ])->default('Pending');

            $table->decimal('amount_paid', 14, 2)
                ->default(0);

            $table->timestamp('paid_at')
                ->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};