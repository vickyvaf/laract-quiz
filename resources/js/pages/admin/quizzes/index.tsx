import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, Plus, ArrowRight, X } from 'lucide-react';
import { store, update, destroy } from '@/actions/App/Http/Controllers/Admin/QuizController';
import { index as questionsIndex } from '@/actions/App/Http/Controllers/Admin/QuestionController';

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    time_limit: number;
    questions_count: number;
}

interface Props {
    quizzes: Quiz[];
}

export default function Index({ quizzes }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

    const { data, setData, post, put, delete: destroyRecord, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        time_limit: 30,
    });

    const openCreate = () => {
        clearErrors();
        reset();
        setEditingQuiz(null);
        setIsFormOpen(true);
    };

    const openEdit = (quiz: Quiz) => {
        clearErrors();
        setData({
            title: quiz.title,
            description: quiz.description || '',
            time_limit: quiz.time_limit,
        });
        setEditingQuiz(quiz);
        setIsFormOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingQuiz) {
            put(update.url(editingQuiz.id), {
                onSuccess: () => {
                    setIsFormOpen(false);
                    reset();
                },
            });
        } else {
            post(store.url(), {
                onSuccess: () => {
                    setIsFormOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this quiz? This will delete all its questions.')) {
            destroyRecord(destroy.url(id));
        }
    };

    return (
        <>
            <Head title="Manage Quizzes" />
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Quiz Management</h1>
                        <p className="text-sm text-neutral-500">Create, edit, and manage online quizzes and their questions.</p>
                    </div>
                    {!isFormOpen && (
                        <Button onClick={openCreate} className="flex items-center gap-2">
                            <Plus className="size-4" /> Add Quiz
                        </Button>
                    )}
                </div>

                {isFormOpen && (
                    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                                {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)} className="rounded-full">
                                <X className="size-4" />
                            </Button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Quiz Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                    placeholder="e.g. Laravel Intermediate Test"
                                />
                                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="What is this quiz about?"
                                />
                                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="time_limit">Time Limit (Minutes)</Label>
                                <Input
                                    id="time_limit"
                                    type="number"
                                    value={data.time_limit}
                                    onChange={(e) => setData('time_limit', parseInt(e.target.value) || 0)}
                                    required
                                    min="1"
                                />
                                {errors.time_limit && <p className="text-xs text-red-500">{errors.time_limit}</p>}
                            </div>

                            <div className="flex items-center gap-3 justify-end">
                                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {editingQuiz ? 'Save Changes' : 'Create Quiz'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="flex flex-col justify-between rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs hover:shadow-md transition-shadow"
                        >
                            <div>
                                <div className="flex items-start justify-between">
                                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white leading-tight">{quiz.title}</h3>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                                        {quiz.time_limit} Min
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-500 mt-2 line-clamp-2">
                                    {quiz.description || 'No description provided.'}
                                </p>
                                <div className="mt-4 text-xs font-medium text-neutral-400">
                                    {quiz.questions_count} Questions
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(quiz)} title="Edit Quiz">
                                        <Edit className="size-4 text-neutral-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(quiz.id)} title="Delete Quiz">
                                        <Trash2 className="size-4 text-red-500" />
                                    </Button>
                                </div>
                                <Link href={questionsIndex.url(quiz.id)}>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        Questions <ArrowRight className="size-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                    {quizzes.length === 0 && (
                        <div className="col-span-full text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                            <p className="text-neutral-500">No quizzes available. Click "Add Quiz" to create one.</p>
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
            title: 'Quiz Management',
            href: '/admin/quizzes',
        },
    ],
};
