<?php

namespace App\Providers;

use App\Models\SmtpConfig;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(255);

        if (Auth::check()) {
            $smtpConfig = SmtpConfig::where('user_id', Auth::id())->first();

            if ($smtpConfig) {
                Config::set('mail.mailers.smtp.username', $smtpConfig->mail_username);
                Config::set('mail.mailers.smtp.password', $smtpConfig->mail_password);
                Config::set('mail.from.address', $smtpConfig->mail_from_address);
            }
        }
    }
}
