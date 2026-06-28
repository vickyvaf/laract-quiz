<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AttemptController extends Controller
{
    public function store(Request $request, Quiz $quiz): RedirectResponse
    {
        $attempt = QuizAttempt::create([
            'user_id' => $request->user()->id,
            'quiz_id' => $quiz->id,
            'started_at' => Carbon::now(),
        ]);

        return redirect()->route('student.attempts.show', $attempt->id);
    }

    public function show(QuizAttempt $attempt): Response
    {
        if ($attempt->user_id !== auth()->id()) {
            abort(403);
        }

        $attempt->load(['quiz.questions']);

        return Inertia::render('student/attempts/show', [
            'attempt' => $attempt,
            'quiz' => $attempt->quiz,
            'questions' => $attempt->quiz->questions->map(fn ($q) => [
                'id' => $q->id,
                'question_text' => $q->question_text,
                'type' => $q->type,
                'options' => $q->options,
            ]),
        ]);
    }

    public function update(Request $request, QuizAttempt $attempt): RedirectResponse
    {
        if ($attempt->user_id !== auth()->id()) {
            abort(403);
        }

        if ($attempt->completed_at) {
            return redirect()->route('student.attempts.result', $attempt->id);
        }

        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.answer_text' => 'nullable|string',
        ]);

        $attempt->load('quiz.questions');
        $questions = $attempt->quiz->questions->keyBy('id');

        $correctCount = 0;
        $totalQuestions = $questions->count();

        foreach ($validated['answers'] as $ansData) {
            $question = $questions->get($ansData['question_id']);
            if (! $question) {
                continue;
            }

            $answerText = $ansData['answer_text'] ?? '';
            $isCorrect = false;

            if ($question->type === 'multiple_choice') {
                $isCorrect = trim(strtolower($answerText)) === trim(strtolower($question->correct_answer));
            } else {
                $isCorrect = ! empty(trim($answerText));
            }

            if ($isCorrect) {
                $correctCount++;
            }

            Answer::create([
                'quiz_attempt_id' => $attempt->id,
                'question_id' => $question->id,
                'answer_text' => $answerText,
                'is_correct' => $isCorrect,
            ]);
        }

        $score = $totalQuestions > 0 ? ($correctCount / $totalQuestions) * 100 : 0;

        $attempt->update([
            'completed_at' => Carbon::now(),
            'score' => $score,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Quiz submitted successfully.')]);

        return redirect()->route('student.attempts.result', $attempt->id);
    }

    public function result(QuizAttempt $attempt): Response
    {
        if ($attempt->user_id !== auth()->id()) {
            abort(403);
        }

        $attempt->load(['quiz.questions', 'answers.question']);

        return Inertia::render('student/attempts/result', [
            'attempt' => $attempt,
            'quiz' => $attempt->quiz,
            'answers' => $attempt->answers->map(fn ($a) => [
                'id' => $a->id,
                'question_text' => $a->question->question_text,
                'type' => $a->question->type,
                'options' => $a->question->options,
                'student_answer' => $a->answer_text,
                'correct_answer' => $a->question->correct_answer,
                'is_correct' => $a->is_correct,
            ]),
        ]);
    }
}
