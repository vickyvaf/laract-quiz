import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, Plus, ArrowLeft, X, CheckCircle, HelpCircle } from 'lucide-react';
import { store, update, destroy } from '@/actions/App/Http/Controllers/Admin/QuestionController';
import { index as quizzesIndex } from '@/actions/App/Http/Controllers/Admin/QuizController';

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
    correct_answer: string;
}

interface Props {
    quiz: Quiz;
    questions: Question[];
}

export default function Index({ quiz, questions }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [options, setOptions] = useState<string[]>(['', '']);

    const { data, setData, post, put, delete: destroyRecord, processing, errors, reset, clearErrors, transform } = useForm({
        question_text: '',
        type: 'multiple_choice' as 'multiple_choice' | 'essay',
        correct_answer: '',
    });

    const openCreate = () => {
        clearErrors();
        reset();
        setOptions(['', '']);
        setEditingQuestion(null);
        setIsFormOpen(true);
    };

    const openEdit = (q: Question) => {
        clearErrors();
        setData({
            question_text: q.question_text,
            type: q.type,
            correct_answer: q.correct_answer,
        });
        setOptions(q.options || ['', '']);
        setEditingQuestion(q);
        setIsFormOpen(true);
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index: number) => {
        const updated = options.filter((_, i) => i !== index);
        setOptions(updated);
        // If correct answer was this option, clear it
        if (data.correct_answer === options[index]) {
            setData('correct_answer', '');
        }
    };

    const handleOptionChange = (index: number, val: string) => {
        const updated = [...options];
        const oldVal = updated[index];
        updated[index] = val;
        setOptions(updated);
        // Sync correct answer value if it matched the old option value
        if (data.correct_answer === oldVal) {
            setData('correct_answer', val);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clean options for multiple choice
        const cleanOptions = data.type === 'multiple_choice' ? options.filter(opt => opt.trim() !== '') : null;

        transform((data) => ({
            ...data,
            options: cleanOptions,
        }));

        if (editingQuestion) {
            put(update.url([quiz.id, editingQuestion.id]), {
                onSuccess: () => {
                    setIsFormOpen(false);
                    reset();
                },
            });
        } else {
            post(store.url(quiz.id), {
                onSuccess: () => {
                    setIsFormOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this question?')) {
            destroyRecord(destroy.url([quiz.id, id]));
        }
    };

    return (
        <>
            <Head title={`Questions - ${quiz.title}`} />
            <div className="p-6 max-w-7xl mx-auto space-y-6 w-full">
                <div className="flex items-center gap-4">
                    <Link href={quizzesIndex.url()}>
                        <Button variant="outline" size="icon" className="rounded-full">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{quiz.title}</h1>
                        <p className="text-sm text-neutral-500">Manage questions for this quiz.</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Questions List ({questions.length})</h2>
                    {!isFormOpen && (
                        <Button onClick={openCreate} className="flex items-center gap-2">
                            <Plus className="size-4" /> Add Question
                        </Button>
                    )}
                </div>

                {isFormOpen && (
                    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-md font-bold text-neutral-900 dark:text-white">
                                {editingQuestion ? 'Edit Question' : 'Add New Question'}
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)} className="rounded-full">
                                <X className="size-4" />
                            </Button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="question_text">Question Text</Label>
                                <textarea
                                    id="question_text"
                                    rows={3}
                                    value={data.question_text}
                                    onChange={(e) => setData('question_text', e.target.value)}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Enter your question here..."
                                />
                                {errors.question_text && <p className="text-xs text-red-500">{errors.question_text}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="type">Question Type</Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => {
                                        const typeVal = e.target.value as 'multiple_choice' | 'essay';
                                        setData('type', typeVal);
                                        setData('correct_answer', '');
                                    }}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="multiple_choice">Multiple Choice (Pilihan Ganda)</option>
                                    <option value="essay">Essay</option>
                                </select>
                                {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
                            </div>

                            {data.type === 'multiple_choice' ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Choices / Options</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addOption} className="flex items-center gap-1">
                                            <Plus className="size-3" /> Add Choice
                                        </Button>
                                    </div>
                                    <div className="grid gap-2">
                                        {options.map((option, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <Input
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                    required
                                                    placeholder={`Choice ${idx + 1}`}
                                                />
                                                {options.length > 2 && (
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(idx)}>
                                                        <Trash2 className="size-4 text-red-500" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="correct_answer">Correct Answer Choice</Label>
                                        <select
                                            id="correct_answer"
                                            value={data.correct_answer}
                                            onChange={(e) => setData('correct_answer', e.target.value)}
                                            required
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            <option value="">Select correct choice</option>
                                            {options.filter(o => o.trim() !== '').map((opt, idx) => (
                                                <option key={idx} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        {errors.correct_answer && <p className="text-xs text-red-500">{errors.correct_answer}</p>}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-2">
                                    <Label htmlFor="correct_answer">Correct Answer Guideline / Keyword</Label>
                                    <Input
                                        id="correct_answer"
                                        value={data.correct_answer}
                                        onChange={(e) => setData('correct_answer', e.target.value)}
                                        required
                                        placeholder="Explain correct answer keywords for reference"
                                    />
                                    {errors.correct_answer && <p className="text-xs text-red-500">{errors.correct_answer}</p>}
                                </div>
                            )}

                            <div className="flex items-center gap-3 justify-end">
                                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {editingQuestion ? 'Save Changes' : 'Add Question'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-4 w-full">
                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs flex flex-col justify-between md:flex-row md:items-start gap-4"
                        >
                            <div className="space-y-3 flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                        No. {index + 1}
                                    </span>
                                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${question.type === 'multiple_choice'
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                        }`}>
                                        {question.type === 'multiple_choice' ? 'Multiple Choice' : 'Essay'}
                                    </span>
                                </div>
                                <p className="font-semibold text-neutral-800 dark:text-neutral-100">{question.question_text}</p>

                                {question.type === 'multiple_choice' && question.options && (
                                    <div className="grid gap-2 pl-4">
                                        {question.options.map((opt, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <div className={`size-2.5 rounded-full ${opt === question.correct_answer ? 'bg-green-500' : 'bg-neutral-300'}`} />
                                                <span className={opt === question.correct_answer ? 'font-bold text-neutral-900 dark:text-white' : ''}>
                                                    {opt}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
                                    <CheckCircle className="size-4" />
                                    <span>Correct Answer: {question.correct_answer}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-start mt-4 md:mt-0">
                                <Button variant="ghost" size="icon" onClick={() => openEdit(question)} title="Edit Question">
                                    <Edit className="size-4 text-neutral-500" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(question.id)} title="Delete Question">
                                    <Trash2 className="size-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {questions.length === 0 && (
                        <div className="px-5 text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                            <p className="text-neutral-500">No questions added yet. Click "Add Question" to start building.</p>
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
        {
            title: 'Questions',
            href: '#',
        },
    ],
};
