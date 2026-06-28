<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function index(Request $request): Response
    {
        $quizzes = Quiz::withCount('questions')
            ->latest()
            ->get()
            ->map(function ($quiz) use ($request) {
                $latestAttempt = $quiz->attempts()
                    ->where('user_id', $request->user()->id)
                    ->whereNotNull('completed_at')
                    ->latest()
                    ->first();

                return [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'description' => $quiz->description,
                    'time_limit' => $quiz->time_limit,
                    'questions_count' => $quiz->questions_count,
                    'latest_score' => $latestAttempt ? $latestAttempt->score : null,
                    'latest_attempt_id' => $latestAttempt ? $latestAttempt->id : null,
                ];
            });

        return Inertia::render('student/quizzes/index', [
            'quizzes' => $quizzes,
        ]);
    }
}
