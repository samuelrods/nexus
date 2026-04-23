<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("leads", function (Blueprint $table) {
            $table->dropForeign(["contact_id"]);
            $table->dropForeign(["company_id"]);
            
            $table->foreign("contact_id")->references("id")->on("contacts")->cascadeOnDelete();
            $table->foreign("company_id")->references("id")->on("companies")->cascadeOnDelete();
        });

        Schema::table("deals", function (Blueprint $table) {
            $table->dropForeign(["lead_id"]);
            $table->dropForeign(["contact_id"]);
            $table->dropForeign(["company_id"]);
            
            $table->foreign("lead_id")->references("id")->on("leads")->cascadeOnDelete();
            $table->foreign("contact_id")->references("id")->on("contacts")->cascadeOnDelete();
            $table->foreign("company_id")->references("id")->on("companies")->cascadeOnDelete();
        });

        Schema::table("activities", function (Blueprint $table) {
            $table->dropForeign(["contact_id"]);
            $table->dropForeign(["lead_id"]);
            
            $table->foreign("contact_id")->references("id")->on("contacts")->cascadeOnDelete();
            $table->foreign("lead_id")->references("id")->on("leads")->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table("leads", function (Blueprint $table) {
            $table->dropForeign(["contact_id"]);
            $table->dropForeign(["company_id"]);
            
            $table->foreign("contact_id")->references("id")->on("contacts");
            $table->foreign("company_id")->references("id")->on("companies");
        });

        Schema::table("deals", function (Blueprint $table) {
            $table->dropForeign(["lead_id"]);
            $table->dropForeign(["contact_id"]);
            $table->dropForeign(["company_id"]);
            
            $table->foreign("lead_id")->references("id")->on("leads");
            $table->foreign("contact_id")->references("id")->on("contacts");
            $table->foreign("company_id")->references("id")->on("companies");
        });

        Schema::table("activities", function (Blueprint $table) {
            $table->dropForeign(["contact_id"]);
            $table->dropForeign(["lead_id"]);
            
            $table->foreign("contact_id")->references("id")->on("contacts");
            $table->foreign("lead_id")->references("id")->on("leads");
        });
    }
};