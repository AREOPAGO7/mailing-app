<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Template;
use App\Models\ContactList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CampaignController extends Controller
{
    public function index(): Response
    {
        $campaigns = Campaign::with(['template', 'contactList'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        $templates = Template::where('user_id', Auth::id())->get();
        $lists = ContactList::where('user_id', Auth::id())->get();

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
            'subject' => 'nullable|string|max:255',
            'body' => 'nullable|string',
            'start_date' => 'required|date|after_or_equal:today',
            'days_active' => 'required|array',
            'days_active.*' => 'required|string|in:Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
            'time_start' => 'required|date_format:H:i',
            'time_end' => 'required|date_format:H:i|after:time_start',
        ]);

        // Format times to include seconds
        $data['time_start'] = Carbon::createFromFormat('H:i', $data['time_start'])->format('H:i:s');
        $data['time_end'] = Carbon::createFromFormat('H:i', $data['time_end'])->format('H:i:s');

        // Verify template and list ownership
        $template = Template::findOrFail($data['template_id']);
        $list = ContactList::findOrFail($data['list_id']);

        if ($template->user_id !== Auth::id() || $list->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'Unauthorized access to template or list.');
        }

        try {
            Campaign::create([
                'name' => $data['name'],
                'template_id' => $data['template_id'],
                'list_id' => $data['list_id'],
                'subject' => $data['subject'],
                'body' => $data['body'],
                'start_date' => $data['start_date'],
                'days_active' => $data['days_active'],
                'time_start' => $data['time_start'],
                'time_end' => $data['time_end'],
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->with('success', 'Campaign created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create campaign. Please try again.');
        }
    }

    public function update(Request $request, Campaign $campaign)
    {
        // Check if the user owns this campaign
        if ($campaign->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'Unauthorized access.');
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'template_id' => 'required|exists:templates,id',
            'list_id' => 'required|exists:contact_lists,id',
            'subject' => 'nullable|string|max:255',
            'body' => 'nullable|string',
            'start_date' => 'required|date|after_or_equal:today',
            'days_active' => 'required|array',
            'days_active.*' => 'required|string|in:Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
            'time_start' => 'required|date_format:H:i',
            'time_end' => 'required|date_format:H:i|after:time_start',
        ]);

        // Format times to include seconds
        $data['time_start'] = Carbon::createFromFormat('H:i', $data['time_start'])->format('H:i:s');
        $data['time_end'] = Carbon::createFromFormat('H:i', $data['time_end'])->format('H:i:s');

        // Verify template and list ownership
        $template = Template::findOrFail($data['template_id']);
        $list = ContactList::findOrFail($data['list_id']);

        if ($template->user_id !== Auth::id() || $list->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'Unauthorized access to template or list.');
        }

        try {
            $campaign->update($data);
            return redirect()->back()->with('success', 'Campaign updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update campaign. Please try again.');
        }
    }

    public function destroy(Campaign $campaign)
    {
        // Check if the user owns this campaign
        if ($campaign->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'Unauthorized access.');
        }

        try {
            $campaign->delete();
            return redirect()->back()->with('success', 'Campaign deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete campaign. Please try again.');
        }
    }
}