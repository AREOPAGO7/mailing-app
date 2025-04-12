<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'template_id', 'list_id', 'user_id', 'subject', 'body', 'start_date', 'days_active', 'time_start', 'time_end',
    ];

    protected $casts = [
        'days_active' => 'array',
        'start_date' => 'date',
    ];

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function contactList()
    {
        return $this->belongsTo(ContactList::class, 'list_id');
    }

    public function contacts()
    {
        return $this->belongsToMany(Contact::class, 'contact_campaigns', 'campaign_id', 'contact_id');
    }

    // Add the relationship to the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
