<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['quiz_id', 'question_text', 'type', 'options', 'correct_answer'])]
class Question extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'options' => 'array',
        ];
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    protected static function booted(): void
    {
        static::created(function (Question $question) {
            $quizTitle = $question->quiz?->title ?? 'Unknown Quiz';
            \App\Services\ActivityLogger::log('question_created', "Added question: '{$question->question_text}' to quiz '{$quizTitle}' (Quiz ID: {$question->quiz_id}).");
        });

        static::updated(function (Question $question) {
            $quizTitle = $question->quiz?->title ?? 'Unknown Quiz';
            \App\Services\ActivityLogger::log('question_updated', "Updated question ID {$question->id} in quiz '{$quizTitle}'.");
        });

        static::deleted(function (Question $question) {
            $quizTitle = $question->quiz?->title ?? 'Unknown Quiz';
            \App\Services\ActivityLogger::log('question_deleted', "Deleted question ID {$question->id} from quiz '{$quizTitle}'.");
        });
    }
}
