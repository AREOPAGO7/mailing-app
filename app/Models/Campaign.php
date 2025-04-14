<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Campaign extends Model
{
    use HasFactory;

    // Add user_id to the fillable array in your Campaign model
    protected $fillable = [
        'name',
        'template_id',
        'list_id',
        'user_id', // Add this line
        'subject',
        'body',
        'start_date',
        'days_active',
        'time_start',
        'time_end'
    ];

    protected $casts = [
        'days_active' => 'array',
        'start_date' => 'date',
    ];

    // Add validation rules as a static property
    public static $rules = [
        'name' => 'required|string',
        'list_id' => 'required|exists:contact_lists,id',
        'subject' => 'required|string',
        'body' => 'required|string',
        'start_date' => 'required|date',
        'days_active' => 'required|array',
        'time_start' => 'required',
        'time_end' => 'required',
    ];

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function contactList(): BelongsTo
    {
        return $this->belongsTo(ContactList::class, 'list_id');
    }
}
