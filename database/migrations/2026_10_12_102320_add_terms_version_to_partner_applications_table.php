<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The version of the partner programme terms the applicant accepted (its effective date, YYYY-MM-DD); empty for the
     * applications sent before the terms were published.
     */
    public function up(): void
    {
        Schema::table('partner_applications', function (Blueprint $table) {
            $table->string('terms_version', 10)->nullable()->after('message');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partner_applications', function (Blueprint $table) {
            $table->dropColumn('terms_version');
        });
    }
};
