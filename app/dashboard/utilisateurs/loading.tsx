export default function UtilisateursLoading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="mb-6">
        <div className="h-7 w-40 bg-slate-200 rounded-lg mb-2" />
        <div className="h-4 w-24 bg-slate-100 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-10 w-64 bg-slate-100 rounded-xl mb-4" />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-slate-50/60 px-4 py-3.5 flex gap-8">
              {["Utilisateur", "Rôle", "Inscrit le"].map((h) => (
                <div key={h} className="h-3 w-20 bg-slate-200 rounded" />
              ))}
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1">
                  <div className="h-3.5 w-32 bg-slate-200 rounded mb-1.5" />
                  <div className="h-3 w-44 bg-slate-100 rounded" />
                </div>
                <div className="w-20 h-5 bg-slate-100 rounded-full" />
                <div className="w-16 h-3 bg-slate-100 rounded hidden sm:block" />
                <div className="w-16 h-7 bg-slate-100 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="h-5 w-40 bg-slate-200 rounded mb-5" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
                <div className="h-10 w-full bg-slate-100 rounded-xl" />
              </div>
            ))}
            <div className="h-10 w-full bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
