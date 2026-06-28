<?php

namespace Tests\Feature\Admin;

use App\Models\ActivityLog;
use App\Models\Quiz;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_quiz_generates_activity_log(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin);

        Quiz::create([
            'title' => 'Test PHPUnit Quiz',
            'description' => 'A quiz created by automated test',
            'time_limit' => 15,
        ]);

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'quiz_created',
            'user_id' => $admin->id,
            'status' => 'success',
        ]);
    }

    public function test_non_admin_cannot_access_activity_logs_page(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($student)->get('/admin/activity-logs');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_activity_logs_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin/activity-logs');

        $response->assertStatus(200);
    }

    public function test_admin_can_fetch_paginated_activity_logs_api(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        // Create some logs
        ActivityLog::create([
            'user_id' => $admin->id,
            'action' => 'test_action',
            'description' => 'Testing description',
            'status' => 'success',
        ]);

        $response = $this->actingAs($admin)->getJson('/admin/api/activity-logs');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'current_page',
                'first_page_url',
                'next_page_url',
            ]);
    }
}
