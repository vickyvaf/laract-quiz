<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_manage_quizzes(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        // Create quiz
        $response = $this->actingAs($admin)
            ->post(route('admin.quizzes.store'), [
                'title' => 'Sample Quiz',
                'description' => 'Test Description',
                'time_limit' => 20,
            ]);

        $response->assertRedirect(route('admin.quizzes.index'));
        $this->assertDatabaseHas('quizzes', ['title' => 'Sample Quiz']);

        $quiz = Quiz::first();

        // Update quiz
        $response = $this->actingAs($admin)
            ->put(route('admin.quizzes.update', $quiz->id), [
                'title' => 'Updated Quiz Title',
                'description' => 'Test Description',
                'time_limit' => 25,
            ]);

        $response->assertRedirect(route('admin.quizzes.index'));
        $this->assertDatabaseHas('quizzes', ['title' => 'Updated Quiz Title']);

        // Delete quiz
        $response = $this->actingAs($admin)
            ->delete(route('admin.quizzes.destroy', $quiz->id));

        $response->assertRedirect(route('admin.quizzes.index'));
        $this->assertDatabaseMissing('quizzes', ['title' => 'Updated Quiz Title']);
    }

    public function test_student_cannot_manage_quizzes(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($student)
            ->post(route('admin.quizzes.store'), [
                'title' => 'Sample Quiz',
                'time_limit' => 20,
            ]);

        $response->assertStatus(403);
    }

    public function test_student_can_take_quiz_and_get_correct_score(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $quiz = Quiz::create([
            'title' => 'PHP Basics',
            'time_limit' => 15,
        ]);

        $q1 = Question::create([
            'quiz_id' => $quiz->id,
            'question_text' => 'What is the correct syntax to define a variable in PHP?',
            'type' => 'multiple_choice',
            'options' => ['$var', 'var', 'int var', '#var'],
            'correct_answer' => '$var',
        ]);

        $q2 = Question::create([
            'quiz_id' => $quiz->id,
            'question_text' => 'Explain what OOP stands for.',
            'type' => 'essay',
            'options' => null,
            'correct_answer' => 'Object Oriented Programming',
        ]);

        // Start Attempt
        $response = $this->actingAs($student)
            ->post(route('student.attempts.store', $quiz->id));

        $attempt = QuizAttempt::first();
        $response->assertRedirect(route('student.attempts.show', $attempt->id));

        // Submit Attempt: Q1 is correct, Q2 is not empty (so correct)
        $response = $this->actingAs($student)
            ->put(route('student.attempts.update', $attempt->id), [
                'answers' => [
                    [
                        'question_id' => $q1->id,
                        'answer_text' => '$var',
                    ],
                    [
                        'question_id' => $q2->id,
                        'answer_text' => 'It means Object Oriented Programming.',
                    ],
                ],
            ]);

        $response->assertRedirect(route('student.attempts.result', $attempt->id));

        // Verify score is 100% since both answers are correct
        $this->assertEquals(100.0, floatval($attempt->fresh()->score));
    }
}
