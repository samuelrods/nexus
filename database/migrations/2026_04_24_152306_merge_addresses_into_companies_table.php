<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add address columns to companies table
        Schema::table('companies', function (Blueprint $table) {
            $table->string('street_address')->nullable()->after('industry');
            $table->string('city')->nullable()->after('street_address');
            $table->string('state', 50)->nullable()->after('city');
            $table->string('zip_code', 10)->nullable()->after('state');
        });

        // 2. Migrate existing data
        $companies = DB::table('companies')->get();
        foreach ($companies as $company) {
            if ($company->address_id) {
                $address = DB::table('addresses')->where('id', $company->address_id)->first();
                if ($address) {
                    DB::table('companies')->where('id', $company->id)->update([
                        'street_address' => $address->street_address,
                        'city' => $address->city,
                        'state' => $address->state,
                        'zip_code' => $address->zip_code,
                    ]);
                }
            }
        }

        // 3. Drop foreign key and column from companies
        Schema::table('companies', function (Blueprint $table) {
            $table->dropForeign(['address_id']);
            $table->dropColumn('address_id');
        });

        // 4. Drop addresses table
        Schema::dropIfExists('addresses');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Recreate addresses table
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->string('street_address');
            $table->string('city');
            $table->string('state', 50);
            $table->string('zip_code', 10);
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
        });

        // 2. Add address_id back to companies
        Schema::table('companies', function (Blueprint $table) {
            $table->foreignId('address_id')->nullable()->constrained();
        });

        // 3. Migrate data back
        $companies = DB::table('companies')->get();
        foreach ($companies as $company) {
            if ($company->street_address) {
                $addressId = DB::table('addresses')->insertGetId([
                    'street_address' => $company->street_address,
                    'city' => $company->city,
                    'state' => $company->state,
                    'zip_code' => $company->zip_code,
                    'organization_id' => $company->organization_id,
                ]);

                DB::table('companies')->where('id', $company->id)->update([
                    'address_id' => $addressId,
                ]);
            }
        }

        // 4. Drop address columns from companies
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['street_address', 'city', 'state', 'zip_code']);
        });
    }
};
