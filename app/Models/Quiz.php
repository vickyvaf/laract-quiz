<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['title', 'description', 'time_limit'])]
class Quiz extends Model
{
    use HasFactory;

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    protected static function booted(): void
    {
        static::created(function (Quiz $quiz) {
            \App\Services\ActivityLogger::log('quiz_created', "Created quiz: '{$quiz->title}' (ID: {$quiz->id}).");
        });

        static::updated(function (Quiz $quiz) {
            \App\Services\ActivityLogger::log('quiz_updated', "Updated quiz: '{$quiz->title}' (ID: {$quiz->id}).");
        });

        static::deleted(function (Quiz $quiz) {
            \App\Services\ActivityLogger::log('quiz_deleted', "Deleted quiz: '{$quiz->title}' (ID: {$quiz->id}).");
        });
    }
}
