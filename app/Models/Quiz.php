<?php

namespace App\Models;

use App\Services\ActivityLogger;
use Database\Factories\QuizFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'description', 'time_limit'])]
class Quiz extends Model
{
    /** @use HasFactory<QuizFactory> */
    use HasFactory;

    /** @return HasMany<Question, $this> */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    /** @return HasMany<QuizAttempt, $this> */
    public function attempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    protected static function booted(): void
    {
        static::created(function (Quiz $quiz) {
            ActivityLogger::log('quiz_created', "Created quiz: '{$quiz->title}' (ID: {$quiz->id}).");
        });

        static::updated(function (Quiz $quiz) {
            ActivityLogger::log('quiz_updated', "Updated quiz: '{$quiz->title}' (ID: {$quiz->id}).");
        });

        static::deleted(function (Quiz $quiz) {
            ActivityLogger::log('quiz_deleted', "Deleted quiz: '{$quiz->title}' (ID: {$quiz->id}).");
        });
    }
}
