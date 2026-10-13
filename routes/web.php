<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\CallbackRequestController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LegalPageController;
use App\Http\Controllers\LesznoController;
use App\Http\Controllers\NewsletterSubscriptionController;
use App\Http\Controllers\PartnerApplicationController;
use App\Http\Controllers\PartnerProgramController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProjectBriefController;
use App\Http\Controllers\ServicePageController;
use Illuminate\Support\Facades\Route;

/*
 * Polish site without a prefix, English site under /en (App\Services\LocalizedRoutes). An English route is named like
 * its Polish twin with an `en.` prefix; the language itself comes from the path (App\Http\Middleware\SetLocale).
 */
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/tworzenie-stron-internetowych', [ServicePageController::class, 'websites'])->name('services.websites');
Route::get('/tworzenie-stron-internetowych/leszno', [LesznoController::class, 'index'])->name('leszno');
Route::get('/sklepy-internetowe', [ServicePageController::class, 'stores'])->name('services.stores');
Route::get('/aplikacje-webowe', [ServicePageController::class, 'apps'])->name('services.apps');
Route::get('/aplikacje-mobilne', [ServicePageController::class, 'mobile'])->name('services.mobile');
Route::get('/automatyzacja-ai', [ServicePageController::class, 'ai'])->name('services.ai');
Route::get('/devops-i-chmura', [ServicePageController::class, 'devops'])->name('services.devops');
Route::get('/partnerzy', [PartnerProgramController::class, 'index'])->name('partners');
Route::get('/partnerzy/regulamin', [LegalPageController::class, 'partnerTerms'])->name('partners.terms');
Route::get('/o-nas', [AboutController::class, 'index'])->name('about');
Route::get('/realizacje', [PortfolioController::class, 'index'])->name('projects.index');
Route::get('/realizacje/{project:slug}', [PortfolioController::class, 'show'])->name('projects.show');
Route::get('/polityka-prywatnosci', [LegalPageController::class, 'privacy'])->name('privacy');
Route::get('/regulamin', [LegalPageController::class, 'terms'])->name('terms');

Route::middleware('throttle:forms')->group(function () {
    Route::post('/kontakt', [ContactMessageController::class, 'store'])->name('contact-messages.store');
    Route::post('/brief', [ProjectBriefController::class, 'store'])->name('project-briefs.store');
    Route::post('/oddzwonimy', [CallbackRequestController::class, 'store'])->name('callback-requests.store');
    Route::post('/newsletter', [NewsletterSubscriptionController::class, 'store'])->name('newsletter-subscriptions.store');
    Route::post('/partnerzy', [PartnerApplicationController::class, 'store'])->name('partner-applications.store');
});

Route::prefix('en')->name('en.')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/website-development', [ServicePageController::class, 'websites'])->name('services.websites');
    Route::get('/website-development/leszno', [LesznoController::class, 'index'])->name('leszno');
    Route::get('/online-stores', [ServicePageController::class, 'stores'])->name('services.stores');
    Route::get('/web-applications', [ServicePageController::class, 'apps'])->name('services.apps');
    Route::get('/mobile-apps', [ServicePageController::class, 'mobile'])->name('services.mobile');
    Route::get('/ai-automation', [ServicePageController::class, 'ai'])->name('services.ai');
    Route::get('/devops-cloud', [ServicePageController::class, 'devops'])->name('services.devops');
    Route::get('/partners', [PartnerProgramController::class, 'index'])->name('partners');
    Route::get('/partners/terms', [LegalPageController::class, 'partnerTerms'])->name('partners.terms');
    Route::get('/about', [AboutController::class, 'index'])->name('about');
    Route::get('/projects', [PortfolioController::class, 'index'])->name('projects.index');
    Route::get('/projects/{project:slug}', [PortfolioController::class, 'show'])->name('projects.show');
    Route::get('/privacy-policy', [LegalPageController::class, 'privacy'])->name('privacy');
    Route::get('/terms', [LegalPageController::class, 'terms'])->name('terms');

    Route::middleware('throttle:forms')->group(function () {
        Route::post('/contact', [ContactMessageController::class, 'store'])->name('contact-messages.store');
        Route::post('/brief', [ProjectBriefController::class, 'store'])->name('project-briefs.store');
        Route::post('/callback', [CallbackRequestController::class, 'store'])->name('callback-requests.store');
        Route::post('/newsletter', [NewsletterSubscriptionController::class, 'store'])->name('newsletter-subscriptions.store');
        Route::post('/partners', [PartnerApplicationController::class, 'store'])->name('partner-applications.store');
    });
});
