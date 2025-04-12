<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('template_id')->constrained('templates')->onDelete('cascade');
            $table->foreignId('list_id')->constrained('contact_lists')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Add user_id
            $table->string('subject');
            $table->text('body');
            $table->date('start_date');
            $table->json('days_active'); // ex: ["L", "M", "M", "J", "V"]
            $table->time('time_start');
            $table->time('time_end');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};