import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Award, Play } from 'lucide-react';
import { store } from '@/actions/App/Http/Controllers/Student/AttemptController';

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    time_limit: number;
    questions_count: number;
    latest_score: number | null;
    latest_attempt_id: number | null;
}

interface Props {
    quizzes: Quiz[];
}

export default function Index({ quizzes }: Props) {
    const { post, processing } = useForm();

    const startQuiz = (quizId: number) => {
        if (confirm('Do you want to start this quiz? Your time limit will begin immediately.')) {
            post(store.url(quizId));
        }
    };

    return (
        <>
            <Head title="Available Quizzes" />
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Online Quizzes</h1>
                    <p className="text-sm text-neutral-500">Test your knowledge with multiple-choice and essay questions.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="flex flex-col justify-between rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
                        >
                            <div>
                                <h3 className="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-brand-500 transition-colors">
                                    {quiz.title}
                                </h3>
                                <p className="text-sm text-neutral-500 mt-2 line-clamp-3">
                                    {quiz.description || 'No description provided.'}
                                </p>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="size-4 text-brand-500" />
                                        <span>{quiz.time_limit} Minutes</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen className="size-4 text-brand-500" />
                                        <span>{quiz.questions_count} Questions</span>
                                    </div>
                                </div>

                                {quiz.latest_score !== null && (
                                    <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Award className="size-5 text-green-600 dark:text-green-400" />
                                            <span className="text-xs font-bold text-green-700 dark:text-green-300">Latest Score</span>
                                        </div>
                                        <span className="text-sm font-extrabold text-green-700 dark:text-green-300">{quiz.latest_score.toFixed(0)}/100</span>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                    <Button
                                        onClick={() => startQuiz(quiz.id)}
                                        disabled={processing || quiz.questions_count === 0}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <Play className="size-4 fill-current" />
                                        {quiz.latest_score !== null ? 'Re-attempt Quiz' : 'Start Quiz'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {quizzes.length === 0 && (
                        <div className="col-span-full text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                            <p className="text-neutral-500">No quizzes are currently available. Check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Quizzes',
            href: '/student/quizzes',
        },
    ],
};
