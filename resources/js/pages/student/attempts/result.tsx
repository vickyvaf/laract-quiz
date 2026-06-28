import { Head, Link } from '@inertiajs/react';
import { Award, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { index as quizzesIndex } from '@/actions/App/Http/Controllers/Student/QuizController';
import { Button } from '@/components/ui/button';

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
    const correctAnswersCount = answers.filter((a) => a.is_correct).length;

    // Duolingo styled score coloring
    const isPassing = attempt.score >= 60;

    return (
        <>
            <Head title={`Quiz Result - ${quiz.title}`} />
            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                {/* Result Card */}
                <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div
                        className={`rounded-full p-4 ${isPassing ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'}`}
                    >
                        <Award className="size-16" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl leading-tight font-extrabold text-neutral-900 dark:text-white">
                            Quiz Completed!
                        </h1>
                        <p className="text-sm text-neutral-500">{quiz.title}</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                            Your Score
                        </span>
                        <span
                            className={`text-5xl font-black ${isPassing ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}
                        >
                            {attempt.score.toFixed(0)}
                        </span>
                        <span className="mt-1 text-xs text-neutral-400">
                            {correctAnswersCount} out of {totalQuestions}{' '}
                            questions correct
                        </span>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <Link href={quizzesIndex.url()}>
                            <Button className="flex items-center gap-2">
                                <ArrowLeft className="size-4" /> Available
                                Quizzes
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Review Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                        Review Answers
                    </h2>

                    {answers.map((answer, index) => (
                        <div
                            key={answer.id}
                            className={`space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:bg-neutral-900 ${
                                answer.is_correct
                                    ? 'border-green-200 dark:border-green-900/40'
                                    : 'border-red-200 dark:border-red-900/40'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-bold tracking-wider text-neutral-600 uppercase dark:bg-neutral-800 dark:text-neutral-300">
                                            Question {index + 1}
                                        </span>
                                        <span
                                            className={`rounded px-2 py-0.5 text-xs font-bold tracking-wider uppercase ${
                                                answer.type ===
                                                'multiple_choice'
                                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                            }`}
                                        >
                                            {answer.type === 'multiple_choice'
                                                ? 'Multiple Choice'
                                                : 'Essay'}
                                        </span>
                                    </div>
                                    <h3 className="leading-normal font-semibold text-neutral-800 dark:text-neutral-100">
                                        {answer.question_text}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-1.5 text-sm font-bold">
                                    {answer.is_correct ? (
                                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                            <CheckCircle className="size-5" />{' '}
                                            <span>Correct</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                            <XCircle className="size-5" />{' '}
                                            <span>Incorrect</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-3 border-t border-neutral-100 pt-2 text-sm dark:border-neutral-800">
                                <div>
                                    <span className="block text-xs font-bold tracking-wider text-neutral-400 uppercase">
                                        Your Answer:
                                    </span>
                                    <p
                                        className={`mt-1 font-medium ${answer.is_correct ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-400'}`}
                                    >
                                        {answer.student_answer ||
                                            '(No answer provided)'}
                                    </p>
                                </div>

                                <div>
                                    <span className="block text-xs font-bold tracking-wider text-neutral-400 uppercase">
                                        Correct Answer:
                                    </span>
                                    <p className="mt-1 font-medium text-neutral-700 dark:text-neutral-300">
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
