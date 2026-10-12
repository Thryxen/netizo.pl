<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The services (App\Enums\Service values) whose pages show the project among their projects.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->json('services')->nullable()->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('services');
        });
    }
};
