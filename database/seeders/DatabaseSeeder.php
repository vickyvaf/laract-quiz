<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Quiz;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users (idempotent)
        User::firstOrCreate(
            ['email' => 'admin@laract.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        User::firstOrCreate(
            ['email' => 'student@laract.com'],
            [
                'name' => 'Peserta Student',
                'password' => Hash::make('password'),
                'role' => 'student',
            ]
        );

        // 2. Seed Quizzes & Questions (idempotent)
        $quiz1 = Quiz::firstOrCreate(
            ['title' => 'Laravel Basics Quiz'],
            [
                'description' => 'Test your core knowledge on Laravel routing, controllers, Eloquent, and Artisan commands.',
                'time_limit' => 15,
            ]
        );

        if ($quiz1->wasRecentlyCreated) {
            Question::create([
                'quiz_id' => $quiz1->id,
                'question_text' => 'What is the default template engine used by Laravel?',
                'type' => 'multiple_choice',
                'options' => ['Blade', 'Twig', 'Smarty', 'Latte'],
                'correct_answer' => 'Blade',
            ]);

            Question::create([
                'quiz_id' => $quiz1->id,
                'question_text' => 'Which Artisan command is used to run outstanding database migrations?',
                'type' => 'multiple_choice',
                'options' => ['php artisan migrate', 'php artisan db:seed', 'php artisan migrate:fresh', 'php artisan make:migration'],
                'correct_answer' => 'php artisan migrate',
            ]);

            Question::create([
                'quiz_id' => $quiz1->id,
                'question_text' => 'Explain the concept and purpose of Middleware in Laravel.',
                'type' => 'essay',
                'options' => null,
                'correct_answer' => 'Middleware provides a convenient mechanism for inspecting and filtering HTTP requests entering your application. For example, verifying authentication or CSRF tokens.',
            ]);
        }

        $quiz2 = Quiz::firstOrCreate(
            ['title' => 'General Web Development'],
            [
                'description' => 'Basic HTML, CSS, and version control concepts.',
                'time_limit' => 10,
            ]
        );

        if ($quiz2->wasRecentlyCreated) {
            Question::create([
                'quiz_id' => $quiz2->id,
                'question_text' => 'What does HTML stand for?',
                'type' => 'multiple_choice',
                'options' => ['Hyper Text Markup Language', 'Hyperlink and Text Markup Language', 'Home Tool Markup Language', 'Hyper Text Makeup Language'],
                'correct_answer' => 'Hyper Text Markup Language',
            ]);

            Question::create([
                'quiz_id' => $quiz2->id,
                'question_text' => 'What is the main purpose of Git?',
                'type' => 'essay',
                'options' => null,
                'correct_answer' => 'Git is a distributed version control system designed to track changes in source code during software development and facilitate collaboration among programmers.',
            ]);
        }
    }
}
