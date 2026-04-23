export default function OwnerDashboardLoading() {
  return (
    <div className="p-6 lg:p-8 animate-pulse">
      <div className="mb-6">
        <div className="h-7 w-48 bg-slate-200 rounded-lg mb-2" />
        <div className="h-4 w-36 bg-slate-100 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="h-4 w-28 bg-slate-100 rounded mb-3" />
            <div className="h-7 w-16 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
                <div className="flex-1">
                  <div className="h-3.5 w-40 bg-slate-200 rounded mb-1.5" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
                <div className="h-5 w-16 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
