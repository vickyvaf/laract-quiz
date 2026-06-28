import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle, XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { index as quizzesIndex } from '@/actions/App/Http/Controllers/Student/QuizController';

interface Quiz {
    id: number;
    title: string;
    description: string | null;
}

interface Answer {
    id: number;
    question_text: string;
    type: 'multiple_choice' | 'essay';
    options: string[] | null;
    student_answer: string;
    correct_answer: string;
    is_correct: boolean;
}

interface Attempt {
    id: number;
    score: number;
    completed_at: string;
}

interface Props {
    attempt: Attempt;
    quiz: Quiz;
    answers: Answer[];
}

export default function Result({ attempt, quiz, answers }: Props) {
    const totalQuestions = answers.length;
    const correctAnswersCount = answers.filter(a => a.is_correct).length;

    // Duolingo styled score coloring
    const isPassing = attempt.score >= 60;

    return (
        <>
            <Head title={`Quiz Result - ${quiz.title}`} />
            <div className="p-6 max-w-7xl mx-auto space-y-6 w-full">
                
                {/* Result Card */}
                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                    <div className={`p-4 rounded-full ${isPassing ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'}`}>
                        <Award className="size-16" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white leading-tight">Quiz Completed!</h1>
                        <p className="text-sm text-neutral-500">{quiz.title}</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Your Score</span>
                        <span className={`text-5xl font-black ${isPassing ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                            {attempt.score.toFixed(0)}
                        </span>
                        <span className="text-xs text-neutral-400 mt-1">
                            {correctAnswersCount} out of {totalQuestions} questions correct
                        </span>
                    </div>

                    <div className="pt-4 flex items-center gap-3">
                        <Link href={quizzesIndex.url()}>
                            <Button className="flex items-center gap-2">
                                <ArrowLeft className="size-4" /> Available Quizzes
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Review Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Review Answers</h2>

                    {answers.map((answer, index) => (
                        <div 
                            key={answer.id}
                            className={`rounded-2xl border p-6 bg-white dark:bg-neutral-900 space-y-4 shadow-xs ${
                                answer.is_correct 
                                    ? 'border-green-200 dark:border-green-900/40' 
                                    : 'border-red-200 dark:border-red-900/40'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                            Question {index + 1}
                                        </span>
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                            answer.type === 'multiple_choice' 
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                        }`}>
                                            {answer.type === 'multiple_choice' ? 'Multiple Choice' : 'Essay'}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 leading-normal">
                                        {answer.question_text}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-1.5 font-bold text-sm">
                                    {answer.is_correct ? (
                                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                            <CheckCircle className="size-5" /> <span>Correct</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                            <XCircle className="size-5" /> <span>Incorrect</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-sm">
                                <div>
                                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Your Answer:</span>
                                    <p className={`font-medium mt-1 ${answer.is_correct ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-400'}`}>
                                        {answer.student_answer || '(No answer provided)'}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Correct Answer:</span>
                                    <p className="font-medium text-neutral-700 dark:text-neutral-300 mt-1">
                                        {answer.correct_answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

Result.layout = {
    breadcrumbs: [
        {
            title: 'Quizzes',
            href: '/student/quizzes',
        },
        {
            title: 'Quiz Result',
            href: '#',
        },
    ],
};
