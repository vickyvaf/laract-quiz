<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\QuizController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Student\AttemptController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function (Request $request) {
    if (auth()->check()) {
        return $request->user()->isAdmin()
            ? redirect()->route('admin.quizzes.index')
            : redirect()->route('student.quizzes.index');
    }

    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Admin Group
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('quizzes', [QuizController::class, 'index'])->name('quizzes.index');
        Route::post('quizzes', [QuizController::class, 'store'])->name('quizzes.store');
        Route::put('quizzes/{quiz}', [QuizController::class, 'update'])->name('quizzes.update');
        Route::delete('quizzes/{quiz}', [QuizController::class, 'destroy'])->name('quizzes.destroy');

        Route::get('quizzes/{quiz}/questions', [QuestionController::class, 'index'])->name('questions.index');
        Route::post('quizzes/{quiz}/questions', [QuestionController::class, 'store'])->name('questions.store');
        Route::put('quizzes/{quiz}/questions/{question}', [QuestionController::class, 'update'])->name('questions.update');
        Route::delete('quizzes/{quiz}/questions/{question}', [QuestionController::class, 'destroy'])->name('questions.destroy');

        Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
        Route::get('api/activity-logs', [ActivityLogController::class, 'apiIndex'])->name('activity-logs.api');
        Route::redirect('activity-log', 'activity-logs');
    });

    // Student Group
    Route::middleware('student')->prefix('student')->name('student.')->group(function () {
        Route::get('quizzes', [App\Http\Controllers\Student\QuizController::class, 'index'])->name('quizzes.index');
        Route::post('quizzes/{quiz}/attempt', [AttemptController::class, 'store'])->name('attempts.store');
        Route::get('attempts/{attempt}', [AttemptController::class, 'show'])->name('attempts.show');
        Route::put('attempts/{attempt}', [AttemptController::class, 'update'])->name('attempts.update');
        Route::get('attempts/{attempt}/result', [AttemptController::class, 'result'])->name('attempts.result');
    });
});

require __DIR__.'/settings.php';
