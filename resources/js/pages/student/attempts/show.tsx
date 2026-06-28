import { Head, useForm } from '@inertiajs/react';
import { Clock, Send } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { update } from '@/actions/App/Http/Controllers/Student/AttemptController';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    time_limit: number;
}

interface Question {
    id: number;
    question_text: string;
    type: 'multiple_choice' | 'essay';
    options: string[] | null;
}

interface Attempt {
    id: number;
    started_at: string;
}

interface Props {
    attempt: Attempt;
    quiz: Quiz;
    questions: Question[];
}

export default function Show({ attempt, quiz, questions }: Props) {
    const totalSeconds = quiz.time_limit * 60;
    const [timeLeft, setTimeLeft] = useState(totalSeconds);
    const formRef = useRef<HTMLFormElement>(null);

    // Initialize form answers
    const { data, setData, put, processing } = useForm({
        answers: questions.map((q) => ({
            question_id: q.id,
            answer_text: '',
        })),
    });

    const submitQuiz = () => {
        put(update.url(attempt.id));
    };

    // Countdown Timer
    useEffect(() => {
        // Calculate remaining seconds based on start time to handle refreshes accurately
        const startTime = new Date(attempt.started_at).getTime();
        const endTime = startTime + totalSeconds * 1000;

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = Math.max(0, Math.floor((endTime - now) / 1000));
            setTimeLeft(distance);

            if (distance === 0) {
                // Auto submit when time runs out
                clearInterval(interval);
                alert("Time's up! Your quiz will be automatically submitted.");
                submitQuiz();
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAnswerChange = (questionId: number, text: string) => {
        const updated = data.answers.map((ans) => {
            if (ans.question_id === questionId) {
                return { ...ans, answer_text: text };
            }

            return ans;
        });
        setData('answers', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            confirm(
                'Are you sure you want to submit your quiz? You cannot modify your answers after submitting.',
            )
        ) {
            submitQuiz();
        }
    };

    // Format seconds to MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isTimeUrgent = timeLeft < 60; // Less than 1 minute

    return (
        <>
            <Head title={`Attempting - ${quiz.title}`} />
            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                {/* Floating/Fixed Header for Timer */}
                <div className="sticky top-0 z-20 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/80">
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                            {quiz.title}
                        </h1>
                        <p className="text-xs text-neutral-500">
                            Solve all questions before timer expires.
                        </p>
                    </div>
                    <div
                        className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${
                            isTimeUrgent
                                ? 'animate-pulse border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400'
                                : 'border-brand-100 bg-brand-50 text-brand-700 dark:border-brand-900/40 dark:bg-brand-950/20 dark:text-brand-400'
                        }`}
                    >
                        <Clock className="size-5" />
                        <span className="font-mono text-lg font-extrabold">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {questions.map((question, index) => {
                        const currentAnswer =
                            data.answers.find(
                                (a) => a.question_id === question.id,
                            )?.answer_text || '';

                        return (
                            <div
                                key={question.id}
                                className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-bold tracking-wider text-neutral-600 uppercase dark:bg-neutral-800 dark:text-neutral-300">
                                        Question {index + 1}
                                    </span>
                                </div>
                                <h3 className="text-base leading-relaxed font-semibold text-neutral-900 dark:text-white">
                                    {question.question_text}
                                </h3>

                                {question.type === 'multiple_choice' &&
                                question.options ? (
                                    <div className="grid gap-3 pt-2 pl-2">
                                        {question.options.map((opt, oIdx) => {
                                            const isSelected =
                                                currentAnswer === opt;

                                            return (
                                                <label
                                                    key={oIdx}
                                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                                                        isSelected
                                                            ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/10'
                                                            : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/40'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question_${question.id}`}
                                                        value={opt}
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            handleAnswerChange(
                                                                question.id,
                                                                opt,
                                                            )
                                                        }
                                                        className="size-4 border-neutral-300 text-brand-500 focus:ring-brand-500"
                                                    />
                                                    <span
                                                        className={`text-sm font-medium ${isSelected ? 'text-brand-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300'}`}
                                                    >
                                                        {opt}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="pt-2 pl-2">
                                        <Textarea
                                            rows={4}
                                            value={currentAnswer}
                                            onChange={(e) =>
                                                handleAnswerChange(
                                                    question.id,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Write your answer here..."
                                            className="w-full rounded-xl"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-6"
                        >
                            <Send className="size-4" /> Submit Quiz
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Quizzes',
            href: '/student/quizzes',
        },
        {
            title: 'Quiz Workspace',
            href: '#',
        },
    ],
};
