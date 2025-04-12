<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Template; // Import the Template model
use App\Models\ContactList; // Import the ContactList model
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function index(): Response
    {
        // Fetch campaigns for the logged-in user
        $campaigns = Campaign::with(['template', 'contactList'])
            ->where('user_id', auth()->id())
            ->get();

        // Fetch templates and lists for the logged-in user
        $templates = Template::where('user_id', auth()->id())->get();
        $lists = ContactList::where('user_id', auth()->id())->get();

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

        // Associate the campaign with the logged-in user
        Campaign::create(array_merge($data, ['user_id' => auth()->id()]));

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