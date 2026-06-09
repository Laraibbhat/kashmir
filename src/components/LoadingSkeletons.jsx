import React from "react";

function LoadingSkeletons() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8 animate-pulse">
        <div className="h-14 w-3/5 rounded-2xl bg-slate-200" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
            <div className="h-8 w-4/5 rounded-lg bg-slate-200" />
            <div className="h-4 w-full rounded-lg bg-slate-200" />
            <div className="h-4 w-5/6 rounded-lg bg-slate-200" />
            <div className="h-4 w-2/3 rounded-lg bg-slate-200" />
          </div>
          <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
            <div className="h-8 w-2/3 rounded-lg bg-slate-200" />
            <div className="h-4 w-full rounded-lg bg-slate-200" />
            <div className="h-4 w-4/5 rounded-lg bg-slate-200" />
            <div className="h-4 w-3/5 rounded-lg bg-slate-200" />
          </div>
        </div>
        <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="h-8 w-2/5 rounded-lg bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-24 rounded-3xl bg-slate-200" />
            <div className="h-24 rounded-3xl bg-slate-200" />
            <div className="h-24 rounded-3xl bg-slate-200" />
          </div>
        </div>
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <div className="h-8 w-1/3 rounded-lg bg-slate-200" />
          <div className="h-4 w-full rounded-lg bg-slate-200" />
          <div className="h-4 w-11/12 rounded-lg bg-slate-200" />
          <div className="h-4 w-3/4 rounded-lg bg-slate-200" />
        </div>
      </div>
    </main>
  );
}

export default LoadingSkeletons;
