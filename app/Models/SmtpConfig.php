<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmtpConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'mail_username',
        'mail_password',
        'mail_from_address',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
