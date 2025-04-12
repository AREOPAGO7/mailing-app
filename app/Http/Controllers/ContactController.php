<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\ContactList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(ContactList $list): Response
    {
        // Ensure the contact list belongs to the logged-in user
        if ($list->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $contacts = $list->contacts()->get();

        return Inertia::render('Contacts/Index', [
            'list' => $list,
            'contacts' => $contacts,
        ]);
    }

    public function store(Request $request, ContactList $list)
    {
        // Ensure the contact list belongs to the logged-in user
        if ($list->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
        ]);

        // Create the contact and associate it with the logged-in user
        $list->contacts()->create(array_merge($request->all(), [
            'user_id' => auth()->id(),
        ]));

        return redirect()->back()->with('success', 'Contact created successfully!');
    }

    public function update(Request $request, Contact $contact)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255'
        ]);

        $contact->update($request->all());

        return redirect()->back();
    }

    public function destroy(Contact $contact)
    {
        // Ensure the contact belongs to the logged-in user
        if ($contact->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $contact->delete();

        return redirect()->back();
    }

    public function import(Request $request, ContactList $list)
    {
        $request->validate([
            'contacts' => 'required|array',
            'contacts.*.first_name' => 'required|string|max:255',
            'contacts.*.last_name' => 'required|string|max:255',
            'contacts.*.email' => 'required|email|max:255',
            'contacts.*.phone' => 'required|string|max:255'
        ]);

        foreach ($request->contacts as $contactData) {
            $list->contacts()->create($contactData);
        }

        return redirect()->back();
    }

    public function export(ContactList $list, string $format)
    {
        $contacts = $list->contacts()->get();
        $filename = 'contacts_' . $list->name . '.' . $format;

        if ($format === 'csv') {
            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"'
            ];

            $handle = fopen('php://temp', 'r+');
            fputcsv($handle, ['Prénom', 'Nom', 'Email', 'Téléphone']);

            foreach ($contacts as $contact) {
                fputcsv($handle, [
                    $contact->first_name,
                    $contact->last_name,
                    $contact->email,
                    $contact->phone
                ]);
            }

            rewind($handle);
            $content = stream_get_contents($handle);
            fclose($handle);

            return response($content, 200, $headers);
        }

        if ($format === 'pdf') {
            $pdf = app()->make('dompdf.wrapper');
            $pdf->loadView('exports.contacts', ['contacts' => $contacts]);
            return $pdf->download($filename);
        }

        abort(400, 'Format non supporté');
    }
}