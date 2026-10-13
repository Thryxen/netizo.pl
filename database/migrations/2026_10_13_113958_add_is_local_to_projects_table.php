<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Projects for clients from the region, shown on the Leszno page (LesznoController). Treepro, the project the page
     * was written around, starts marked.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->boolean('is_local')->default(false)->after('services');
        });

        DB::table('projects')->where('slug', 'treepropl')->update(['is_local' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('is_local');
        });
    }
};
