<?php

use App\Models\Organization;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->string('slug')->after('name')->nullable()->unique();
        });

        // Populate existing organizations with slugs
        $organizations = Organization::all();
        foreach ($organizations as $organization) {
            $organization->slug = Str::slug($organization->name);

            // Ensure uniqueness if multiple orgs have the same name
            $originalSlug = $organization->slug;
            $count = 1;
            while (Organization::where('slug', $organization->slug)->where('id', '!=', $organization->id)->exists()) {
                $organization->slug = $originalSlug.'-'.$count++;
            }

            $organization->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
