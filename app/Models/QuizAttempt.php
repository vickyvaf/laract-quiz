<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'quiz_id', 'started_at', 'completed_at', 'score'])]
class QuizAttempt extends Model
{
    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'score' => 'float',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }

    protected static function booted(): void
    {
        static::created(function (QuizAttempt $attempt) {
            $quizTitle = $attempt->quiz?->title ?? 'Unknown Quiz';
            $studentEmail = $attempt->user?->email ?? 'Unknown Student';
            \App\Services\ActivityLogger::log('attempt_started', "Student '{$studentEmail}' started quiz '{$quizTitle}' (Attempt ID: {$attempt->id}).");
        });

        static::updated(function (QuizAttempt $attempt) {
            if ($attempt->wasChanged('completed_at') && $attempt->completed_at !== null) {
                $quizTitle = $attempt->quiz?->title ?? 'Unknown Quiz';
                $studentEmail = $attempt->user?->email ?? 'Unknown Student';
                \App\Services\ActivityLogger::log('attempt_submitted', "Student '{$studentEmail}' completed quiz '{$quizTitle}' with score {$attempt->score} (Attempt ID: {$attempt->id}).");
            }
        });
    }
}
