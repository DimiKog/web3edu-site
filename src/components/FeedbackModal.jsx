import { useState } from "react";
import { useAccount } from "wagmi";

const COPY = {
    en: {
        title: "🎉 Lab completed!",
        subtitle: "Help us improve Web3Edu — this takes ~2 minutes.",
        duration: "How long did it take?",
        difficulty: "Difficulty (1 = too easy, 5 = too hard)",
        clarity: "Were the instructions clear?",
        issues: "Any bugs or issues? (optional)",
        recommend: "Would you recommend this lab?",
        submit: "Submit feedback",
        submitting: "Submitting…",
        skip: "Skip",
        selectPlaceholder: "Select…",
        durationOptions: {
            '<10': 'Less than 10 minutes',
            '10-20': '10–20 minutes',
            '20-30': '20–30 minutes',
            '30-45': '30–45 minutes',
            '45-60': '45–60 minutes',
            '60+': 'More than 60 minutes'
        },
        clarityOptions: {
            'very-clear': 'Very clear',
            'mostly-clear': 'Mostly clear',
            'somewhat-unclear': 'Somewhat unclear',
            'confusing': 'Confusing'
        }
    },
    gr: {
        title: "🎉 Ολοκληρώσατε το εργαστήριο!",
        subtitle: "Βοηθήστε μας να βελτιώσουμε το Web3Edu — ~2 λεπτά.",
        duration: "Πόσο χρόνο σας πήρε;",
        difficulty: "Δυσκολία (1 = πολύ εύκολο, 5 = πολύ δύσκολο)",
        clarity: "Ήταν σαφείς οι οδηγίες;",
        issues: "Υπήρχαν προβλήματα ή σφάλματα; (προαιρετικό)",
        recommend: "Θα προτείνατε αυτό το εργαστήριο;",
        submit: "Υποβολή σχολίων",
        submitting: "Υποβολή…",
        skip: "Παράλειψη",
        selectPlaceholder: "Επιλέξτε…",
        durationOptions: {
            '<10': 'Λιγότερο από 10 λεπτά',
            '10-20': '10–20 λεπτά',
            '20-30': '20–30 λεπτά',
            '30-45': '30–45 λεπτά',
            '45-60': '45–60 λεπτά',
            '60+': 'Πάνω από 60 λεπτά'
        },
        clarityOptions: {
            'very-clear': 'Πολύ σαφείς',
            'mostly-clear': 'Αρκετά σαφείς',
            'somewhat-unclear': 'Κάπως ασαφείς',
            'confusing': 'Μπερδεμένες'
        }
    }
};

function inferLabType(labId) {
    if (!labId) return "unknown";
    if (labId.startsWith("lab")) return "foundation";
    if (labId.startsWith("poe")) return "applied";
    return "applied";
}

export default function FeedbackModal({
    isOpen,
    onClose,
    labId,
    labTitle,
    labType,
    language,
    onSubmit,
    submitterAddressOverride = null,
}) {
    const lang = language === "gr" ? "gr" : "en";
    const t = COPY[lang];
    const resolvedLabType = labType || inferLabType(labId);

    const { address } = useAccount();
    const walletForSubmit = address ?? submitterAddressOverride;

    const [duration, setDuration] = useState("");
    const [difficulty, setDifficulty] = useState(3);
    const [clarity, setClarity] = useState("");
    const [issues, setIssues] = useState("");
    const [recommend, setRecommend] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!walletForSubmit) return;

        setSubmitting(true);
        setSubmitError("");

        const payload = {
            labId,
            labTitle,
            labType: resolvedLabType,
            walletAddress: walletForSubmit,
            duration,
            difficulty,
            clarity,
            issues,
            recommend,
            timestamp: new Date().toISOString()
        };

        try {
            await onSubmit(payload);
            localStorage.setItem(`feedback_${labId}`, "true");
            onClose();
        } catch (err) {
            console.error("Feedback submit failed:", err);
            setSubmitError(
                lang === "gr"
                    ? "Η υποβολή απέτυχε. Δοκιμάστε ξανά."
                    : "Submission failed. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-2">
                    {t.title}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    {t.subtitle}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t.duration}
                        </label>
                        <select
                            required
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full rounded-lg border p-2 bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                        >
                            <option value="">{t.selectPlaceholder}</option>
                            {Object.entries(t.durationOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t.difficulty}
                        </label>
                        <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setDifficulty(n)}
                                    className={`w-10 h-10 rounded-lg font-semibold ${difficulty === n
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-200 dark:bg-slate-700"
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Clarity */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t.clarity}
                        </label>
                        <select
                            required
                            value={clarity}
                            onChange={(e) => setClarity(e.target.value)}
                            className="w-full rounded-lg border p-2 bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                        >
                            <option value="">{t.selectPlaceholder}</option>
                            {Object.entries(t.clarityOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Issues */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t.issues}
                        </label>
                        <textarea
                            rows={3}
                            value={issues}
                            onChange={(e) => setIssues(e.target.value)}
                            className="w-full rounded-lg border p-2 bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                        />
                    </div>

                    {/* Recommend */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t.recommend}
                        </label>
                        <div className="flex gap-4 justify-center">
                            {["yes", "no"].map((v) => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => setRecommend(v)}
                                    className={`px-6 py-2 rounded-lg font-medium ${recommend === v
                                        ? v === "yes"
                                            ? "bg-green-600 text-white"
                                            : "bg-red-600 text-white"
                                        : "bg-slate-200 dark:bg-slate-700"
                                        }`}
                                >
                                    {v === "yes" ? "👍 Yes" : "👎 No"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-50"
                        >
                            {submitting ? t.submitting : t.submit}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg"
                        >
                            {t.skip}
                        </button>
                    </div>
                    {submitError && (
                        <p className="text-sm text-red-600 dark:text-red-400 text-center">
                            {submitError}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
