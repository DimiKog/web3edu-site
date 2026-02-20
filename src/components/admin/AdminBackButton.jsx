import { useNavigate } from "react-router-dom";

export default function AdminBackButton({ to, label = "Back" }) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(to)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800/80 transition"
        >
            <span className="text-slate-400">←</span>
            {label}
        </button>
    );
}
