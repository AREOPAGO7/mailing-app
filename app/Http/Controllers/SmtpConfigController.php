<?php

namespace App\Http\Controllers;

use App\Models\SmtpConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SmtpConfigController extends Controller
{
    public function index(): Response
    {
        $smtpConfig = SmtpConfig::where('user_id', Auth::id())->first();

        return Inertia::render('SmtpConfig/Index', [
            'smtpConfig' => $smtpConfig,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'mail_username' => 'required|email',
            'mail_password' => 'required|string',
            'mail_from_address' => 'required|email',
        ]);

        SmtpConfig::updateOrCreate(
            ['user_id' => Auth::id()],
            $request->only('mail_username', 'mail_password', 'mail_from_address')
        );

        return redirect()->back()->with('success', 'SMTP configuration saved successfully.');
    }
}
