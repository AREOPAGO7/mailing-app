<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Template;
use App\Models\ContactList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;  // Add this import

class CampaignController extends Controller
{
    public function index(): Response
    {
        $campaigns = Campaign::with(['template', 'contactList'])->get();
        $templates = Template::all();
        $lists = ContactList::all();
        return Inertia::render('Campaigns/Index', [
            'campaigns' => $campaigns,
            'templates' => $templates,
            'lists' => $lists,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'template_id' => 'required|exists:templates,id',
            'list_id' => 'required|exists:contact_lists,id',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'start_date' => 'required|date',
            'days_active' => 'required|array',
            'days_active.*' => 'string',
            'time_start' => 'required|date_format:H:i',
            'time_end' => 'required|date_format:H:i',
        ]);

      
            // Debug the data
            \Log::info('Creating campaign with data:', [
                'name' => $data['name'],
                'template_id' => $data['template_id'],
                'list_id' => $data['list_id'],
                'subject' => $data['subject'],
                'body' => $data['body'],
                'start_date' => $data['start_date'],
                'days_active' => $data['days_active'],
                'time_start' => $data['time_start'],
                'time_end' => $data['time_end'],
                'user_id' => Auth::id(),  // Verify this is being included
            ]);
        
            $campaign = Campaign::create([
                'name' => $data['name'],
                'template_id' => $data['template_id'],
                'list_id' => $data['list_id'],
                'subject' => $data['subject'],
                'body' => $data['body'],
                'start_date' => $data['start_date'],
                'days_active' => $data['days_active'],
                'time_start' => $data['time_start'],
                'time_end' => $data['time_end'],
                'user_id' => Auth::id(),  // Make sure this line is present
            ]);
        

        return redirect()->back()->with('success', 'Campaign created successfully!');
    }

    public function update(Request $request, Campaign $campaign)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'template_id' => 'required|exists:templates,id',
            'list_id' => 'required|exists:contact_lists,id',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'start_date' => 'required|date',
            'days_active' => 'required|array',
            'days_active.*' => 'string',
            'time_start' => 'required|date_format:H:i',
            'time_end' => 'required|date_format:H:i',
        ]);

        // Update the campaign attributes
        $campaign->fill($data);

        // Save the updated campaign
        $campaign->save();

        return redirect()->back()->with('success', 'Campaign updated successfully!');
    }

    public function destroy(Campaign $campaign)
    {
        $campaign->delete();

        return redirect()->back()->with('success', 'Campaign deleted successfully!');
    }
}