<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\TemplateController;  // Add this line
use App\Http\Controllers\SmtpConfigController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('dashboard');

Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
])->group(function () {
    Route::get('lists', function () {
        $lists = \App\Models\ContactList::withCount('contacts')->get();
        return Inertia::render('lists', [
            'lists' => $lists
        ]);
    })->name('lists');

    Route::post('/lists', [\App\Http\Controllers\ContactListController::class, 'store']);
    Route::put('/lists/{list}', [\App\Http\Controllers\ContactListController::class, 'update']);
    Route::delete('/lists/{list}', [\App\Http\Controllers\ContactListController::class, 'destroy']);
    Route::get('/lists/{list}', [\App\Http\Controllers\ContactListController::class, 'show'])->name('lists.show');
    Route::get('/lists/{list}/contacts', [\App\Http\Controllers\ContactListController::class, 'show'])->name('lists.contacts');
    Route::post('/lists/{list}/contacts', [\App\Http\Controllers\ContactController::class, 'store'])->name('contacts.store');
    Route::put('/contacts/{contact}', [\App\Http\Controllers\ContactController::class, 'update'])->name('contacts.update');
    Route::delete('/contacts/{contact}', [\App\Http\Controllers\ContactController::class, 'destroy'])->name('contacts.destroy');
    Route::post('/lists/{list}/contacts/import', [\App\Http\Controllers\ContactController::class, 'import'])->name('contacts.import');
    // Add these template routes
    Route::get('/templates', [TemplateController::class, 'index'])->name('templates.index');
    Route::post('/templates', [TemplateController::class, 'store'])->name('templates.store');
    Route::put('/templates/{template}', [TemplateController::class, 'update'])->name('templates.update');    
    Route::delete('/templates/{template}', [TemplateController::class, 'destroy'])->name('templates.destroy');
    Route::resource('campaigns', CampaignController::class)->except(['show']);
    Route::post('/smtp-config', [SmtpConfigController::class, 'store'])->name('smtp-config.store');
    Route::get('/smtp-config', [SmtpConfigController::class, 'index'])->name('smtp-config.index');
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
