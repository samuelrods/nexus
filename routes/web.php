<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DealController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return Inertia::render('LandingPage');
});

Route::middleware(['auth', 'check_organitation'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::get('/organizations/settings', [OrganizationController::class, 'settings'])->name('organizations.settings');
    Route::apiResource('organizations', OrganizationController::class)->withoutMiddleware('check_organitation');

    Route::resource('members', MemberController::class);

    Route::controller(InvitationController::class)->group(function () {
        Route::post('/invitations', 'store')->name('invitations.store');
        Route::put('/invitations/{invitation}', 'update')->name('invitations.update');
    })->withoutMiddleware('check_organitation');

    Route::resource('roles', RoleController::class);
    Route::resource('contacts', ContactController::class);
    Route::resource('companies', CompanyController::class);
    Route::resource('leads', LeadController::class);
    Route::resource('deals', DealController::class);
    Route::resource('activities', ActivityController::class);

    Route::get('/api/companies-options', [CompanyController::class, 'getCompaniesOptions'])->name('api.companies.options');
    Route::get('/api/contacts-options', [ContactController::class, 'getContactsOptions'])->name('api.contacts.options');
    Route::get('/api/leads-options', [LeadController::class, 'getLeadsOptions'])->name('api.leads.options');

    Route::put('/users/organization', [UserController::class, 'setOrganization'])
        ->name('users.organization')
        ->withoutMiddleware('check_organitation');
});

require __DIR__ . '/auth.php';
