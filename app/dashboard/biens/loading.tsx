export default function BiensLoading() {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-40 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-24 bg-slate-100 rounded" />
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-10 w-72 bg-slate-100 rounded-xl mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-44 bg-slate-200" />
            <div className="p-5">
              <div className="h-4 w-3/4 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-1/2 bg-slate-100 rounded mb-4" />
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="h-5 w-24 bg-slate-200 rounded mb-1" />
                  <div className="h-3 w-16 bg-slate-100 rounded" />
                </div>
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2">
                <div className="flex-1 h-8 bg-slate-100 rounded-lg" />
                <div className="w-8 h-8 bg-slate-100 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
