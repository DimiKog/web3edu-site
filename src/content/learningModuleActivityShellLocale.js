export const LEARNING_MODULE_ACTIVITY_SHELL_COPY = {
    en: {
        headerPill: "Web3Edu · Learning Module",
        breadcrumbDashboard: "Dashboard",
        breadcrumbModules: "Learning Modules",
        backToDashboard: "Back to Dashboard",
        dashboardPath: "/dashboard",
    },
    gr: {
        headerPill: "Web3Edu · Εκπαιδευτική Ενότητα",
        breadcrumbDashboard: "Πίνακας Ελέγχου",
        breadcrumbModules: "Εκπαιδευτικές Ενότητες",
        backToDashboard: "Επιστροφή στον Πίνακα Ελέγχου",
        dashboardPath: "/dashboard-gr",
    },
};

export function getLearningModuleActivityShellCopy(lang = "en") {
    return LEARNING_MODULE_ACTIVITY_SHELL_COPY[lang] || LEARNING_MODULE_ACTIVITY_SHELL_COPY.en;
}
