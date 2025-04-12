<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'list_id',
        'user_id', // Add this
    ];

    public function list()
    {
        return $this->belongsTo(ContactList::class, 'list_id');
    }

    public function campaigns()
    {
        return $this->belongsToMany(Campaign::class, 'contact_campaigns', 'contact_id', 'campaign_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeOwnedBy($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}