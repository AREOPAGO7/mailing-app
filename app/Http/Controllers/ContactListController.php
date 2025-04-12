<?php

namespace App\Http\Controllers;

use App\Models\ContactList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactListController extends Controller
{
    public function index(): Response
    {
        // Fetch contact lists for the logged-in user
        $lists = ContactList::where('user_id', auth()->id())
            ->withCount('contacts') // Include the count of contacts
            ->get();

        return Inertia::render('Lists/Index', [
            'lists' => $lists,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Associate the contact list with the logged-in user
        ContactList::create([
            'name' => $request->name,
            'user_id' => auth()->id(),
        ]);

        return redirect()->back();
    }

    public function update(Request $request, ContactList $list)
    {
        // Ensure the contact list belongs to the logged-in user
        if ($list->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $list->update($request->all());

        return redirect()->back();
    }

    public function destroy(ContactList $list)
    {
        // Ensure the contact list belongs to the logged-in user
        if ($list->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $list->delete();

        return redirect()->back();
    }

    public function show(ContactList $list): Response
    {
        // Ensure the contact list belongs to the logged-in user
        if ($list->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $list->load('contacts');

        return Inertia::render('Lists/Show', [
            'list' => $list,
        ]);
    }
}