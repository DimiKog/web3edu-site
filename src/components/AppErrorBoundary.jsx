import React from "react";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center px-6 bg-slate-50 dark:bg-[#090C14]">
          <div className="max-w-lg w-full rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/70 p-6 shadow-xl text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Something went wrong
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              A component crashed. You can reload and continue.
            </p>
            <button
              onClick={this.handleReload}
              className="mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] text-white font-semibold cursor-pointer"
            >
              Reload app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
