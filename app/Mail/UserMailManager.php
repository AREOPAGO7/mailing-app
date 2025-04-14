<?php

namespace App\Mail;

use App\Models\SmtpConfig;
use Illuminate\Support\Facades\Auth;
use Illuminate\Mail\MailManager as BaseMailManager;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Component\Mailer\Transport\Smtp\Auth\LoginAuthenticator;

class UserMailManager extends BaseMailManager
{
    protected function createSmtpTransport(array $config)
    {
        if (Auth::check()) {
            $smtpConfig = SmtpConfig::where('user_id', Auth::id())->first();
            
            if ($smtpConfig) {
                $transport = new EsmtpTransport(
                    'smtp-relay.brevo.com',
                    587,
                    true,
                    null,
                    null,
                    null,
                    [
                        new LoginAuthenticator()
                    ]
                );
                
                $transport->setUsername($smtpConfig->mail_username);
                $transport->setPassword($smtpConfig->mail_password);
                
                return new \Illuminate\Mail\Transport\SmtpTransport($transport);
            }
        }
        
        return parent::createSmtpTransport($config);
    }
} 