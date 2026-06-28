<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/quizzes/index', [
            'quizzes' => Quiz::withCount('questions')->latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_limit' => 'required|integer|min:1',
        ]);

        Quiz::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Quiz created successfully.')]);

        return redirect()->route('admin.quizzes.index');
    }

    public function update(Request $request, Quiz $quiz): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_limit' => 'required|integer|min:1',
        ]);

        $quiz->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Quiz updated successfully.')]);

        return redirect()->route('admin.quizzes.index');
    }

    public function destroy(Quiz $quiz): RedirectResponse
    {
        $quiz->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Quiz deleted successfully.')]);

        return redirect()->route('admin.quizzes.index');
    }
}
