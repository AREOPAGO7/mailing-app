<?php

namespace App\Console\Commands;

use App\Models\Campaign;
use App\Models\CampaignLog;
use App\Models\Contact;
use App\Models\ContactList;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;
use Resend\Laravel\Facades\Resend;
use Illuminate\Support\Facades\Config;
use App\Models\SmtpConfig;

class SendCampaignEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'campaigns:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send campaign emails to contact lists';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $currentDay = $now->format('l'); 
        $currentTime = $now->format('H:i:s');
        $currentDate = $now->format('Y-m-d');

        $this->info("Current time: {$currentTime}");
        $this->info("Current day: {$currentDay}");
        $this->info("Current date: {$currentDate}");

        // Get all campaigns that match date and day criteria
        $campaigns = Campaign::whereDate('start_date', '<=', $currentDate)
            ->whereJsonContains('days_active', $currentDay)
            ->get();
            $this->info("\nFound {$campaigns->count()} campaigns matching date criteria");


        $this->info("\nFound {$campaigns->count()} campaigns matching date and day criteria");

        // Filter campaigns by time in PHP
        $campaignsToProcess = $campaigns->filter(function($campaign) use ($currentTime) {
            $startTime = Carbon::createFromFormat('H:i:s', $campaign->time_start);
            $endTime = Carbon::createFromFormat('H:i:s', $campaign->time_end);
            $currentTimeObj = Carbon::createFromFormat('H:i:s', $currentTime);

            // If end time is less than start time, it means it spans to the next day
            if ($endTime->lt($startTime)) {
                $endTime->addDay();
            }

            $isWithinTime = $startTime->lte($currentTimeObj) && $endTime->gte($currentTimeObj);

            $this->info("\nCampaign: {$campaign->name}");
            $this->info("Time start: {$campaign->time_start}");
            $this->info("Time end: {$campaign->time_end}");
            $this->info("Is within time range: " . ($isWithinTime ? '✓' : '✗'));

            return $isWithinTime;
        });

        $this->info("\nFound {$campaignsToProcess->count()} campaigns to process");

        foreach ($campaignsToProcess as $campaign) {
            $this->sendCampaign($campaign);
        }
    }

    private function sendCampaign(Campaign $campaign)
    {
        $this->info("\nProcessing campaign: {$campaign->name}");
    
        // Check if campaign has a contact list
        if (!$campaign->list_id) {
            $this->error("Campaign {$campaign->name} has no associated contact list");
            return;
        }

        // Fetch the user's SMTP configuration
        $smtpConfig = SmtpConfig::where('user_id', $campaign->user_id)->first();

        if ($smtpConfig) {
            // Override mail configuration dynamically
            Config::set('mail.mailers.smtp', [
                'transport' => 'smtp',
                'host' => $smtpConfig->mail_host ?? config('mail.mailers.smtp.host'),
                'port' => $smtpConfig->mail_port ?? config('mail.mailers.smtp.port'),
                'encryption' => $smtpConfig->mail_encryption ?? config('mail.mailers.smtp.encryption'),
                'username' => $smtpConfig->mail_username,
                'password' => $smtpConfig->mail_password,
            ]);

            Config::set('mail.from.address', $smtpConfig->mail_from_address);
            Config::set('mail.from.name', $smtpConfig->mail_from_name ?? config('mail.from.name'));

            $this->info("Using custom SMTP configuration for user ID: {$campaign->user_id}");
        } else {
            $this->info("No custom SMTP configuration found for user ID: {$campaign->user_id}. Using default .env configuration.");
        }
    
        // Create campaign log
        $log = CampaignLog::create([
            'campaign_id' => $campaign->id,
            'user_id' => $campaign->user_id,
            'started_at' => now(),
        ]);
    
        // Load the contact list without the global scope
        $list = ContactList::withoutGlobalScope('ownedByUser')
            ->with('contacts')
            ->find($campaign->list_id);
        
        if (!$list) {
            $this->error("List not found for campaign {$campaign->name} (ID: {$campaign->id})");
            $log->update([
                'completed_at' => now(),
                'errors' => ['Contact list not found or has been deleted']
            ]);
            return;
        }
    
        $this->info("Found list: {$list->name}");

        $contacts = $list->contacts()->get();

        $this->info("Found {$contacts->count()} contacts to send to");

        $log->update(['total_contacts' => $contacts->count()]);
        $errors = [];

        foreach ($contacts as $contact) {
            try {
                $this->info("Sending to: {$contact->email}");

                // Fetch the template content if a template is selected
                $templateContent = $campaign->template_id 
                    ? \App\Models\Template::find($campaign->template_id)->content 
                    : $campaign->body;
                
                // Send the email
                Mail::send([], [], function ($message) use ($campaign, $contact, $templateContent) {
                    $message->from(config('mail.from.address'))
                        ->to($contact->email)
                        ->subject($campaign->subject)
                        ->html($templateContent); // Use the template content as the email body
                });

                $log->increment('successful_sends');
                $this->info("Successfully sent to {$contact->email}");
            } catch (\Exception $e) {
                $log->increment('failed_sends');
                $errors[] = [
                    'email' => $contact->email,
                    'error' => $e->getMessage()
                ];
                $this->error("Failed to send to {$contact->email}: {$e->getMessage()}");
            }
        }

        // Update log with completion status
        $log->update([
            'completed_at' => now(),
            'errors' => $errors
        ]);

        $this->info("Completed processing campaign: {$campaign->name}");
    }
}
