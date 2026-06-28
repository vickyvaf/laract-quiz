<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    public function index(Quiz $quiz): Response
    {
        return Inertia::render('admin/questions/index', [
            'quiz' => $quiz,
            'questions' => $quiz->questions()->latest()->get(),
        ]);
    }

    public function store(Request $request, Quiz $quiz): RedirectResponse
    {
        $validated = $request->validate([
            'question_text' => 'required|string',
            'type' => 'required|string|in:multiple_choice,essay',
            'options' => 'required_if:type,multiple_choice|nullable|array',
            'options.*' => 'required_if:type,multiple_choice|string',
            'correct_answer' => 'required|string',
        ]);

        $quiz->questions()->create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Question created successfully.')]);

        return back();
    }

    public function update(Request $request, Quiz $quiz, Question $question): RedirectResponse
    {
        $validated = $request->validate([
            'question_text' => 'required|string',
            'type' => 'required|string|in:multiple_choice,essay',
            'options' => 'required_if:type,multiple_choice|nullable|array',
            'options.*' => 'required_if:type,multiple_choice|string',
            'correct_answer' => 'required|string',
        ]);

        $question->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Question updated successfully.')]);

        return back();
    }

    public function destroy(Quiz $quiz, Question $question): RedirectResponse
    {
        $question->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Question deleted successfully.')]);

        return back();
    }
}
