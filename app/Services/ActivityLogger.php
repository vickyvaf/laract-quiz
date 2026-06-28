<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    /**
     * Record an activity log in the database.
     */
    public static function log(string $action, string $description, string $status = 'success'): ActivityLog
    {
        $user = Auth::user();

        return ActivityLog::create([
            'user_id' => $user?->id,
            'user_name' => $user?->name,
            'user_role' => $user?->role,
            'action' => $action,
            'description' => $description,
            'status' => $status,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }
}
