<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/activity-logs/index');
    }

    public function apiIndex(Request $request): JsonResponse
    {
        $logs = ActivityLog::latest()->paginate(50);

        return response()->json($logs);
    }
}
