export default function TenantDashboardLoading() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8 animate-pulse">
      <div className="mb-6">
        <div className="h-7 w-48 bg-slate-200 rounded-lg mb-2" />
        <div className="h-4 w-32 bg-slate-100 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="h-4 w-24 bg-slate-100 rounded mb-3" />
            <div className="h-7 w-12 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-40 bg-slate-200" />
        <div className="p-5">
          <div className="h-5 w-3/4 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-1/2 bg-slate-100 rounded mb-4" />
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-100">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-3 w-20 bg-slate-100 rounded mb-1.5" />
                <div className="h-4 w-28 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
