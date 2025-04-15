<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

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

    // Add accessors for time fields
    public function getTimeStartAttribute($value)
    {
        return Carbon::createFromFormat('H:i:s', $value)->format('H:i');
    }

    public function getTimeEndAttribute($value)
    {
        return Carbon::createFromFormat('H:i:s', $value)->format('H:i');
    }

    // Add mutators for time fields
    public function setTimeStartAttribute($value)
    {
        $this->attributes['time_start'] = Carbon::createFromFormat('H:i', $value)->format('H:i:s');
    }

    public function setTimeEndAttribute($value)
    {
        $this->attributes['time_end'] = Carbon::createFromFormat('H:i', $value)->format('H:i:s');
    }

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
