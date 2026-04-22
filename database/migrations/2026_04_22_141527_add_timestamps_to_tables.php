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
        Schema::table('contacts', function (Blueprint $table) {
            $table->timestamps();
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->timestamps();
        });

        Schema::table('deals', function (Blueprint $table) {
            $table->timestamps();
        });

        Schema::table('leads', function (Blueprint $table) {
            $table->timestamp('updated_at')->nullable();
        });

        Schema::table('organizations', function (Blueprint $table) {
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn('updated_at');
        });

        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn('updated_at');
        });

        Schema::table('deals', function (Blueprint $table) {
            $table->dropTimestamps();
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->dropTimestamps();
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->dropTimestamps();
        });
    }
};
