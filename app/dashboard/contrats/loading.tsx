export default function ContratsLoading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-32 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-20 bg-slate-100 rounded" />
        </div>
        <div className="h-10 w-40 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-10 w-72 bg-slate-100 rounded-xl mb-4" />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-slate-50/60 px-4 py-3.5 flex gap-8">
          {["Bien", "Locataire", "Période", "Loyer", "Statut"].map((h) => (
            <div key={h} className="h-3 w-16 bg-slate-200 rounded" />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-4 py-4 border-b border-gray-50 last:border-0">
            <div className="flex-1">
              <div className="h-3.5 w-36 bg-slate-200 rounded mb-1.5" />
              <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
            <div className="flex-1">
              <div className="h-3.5 w-28 bg-slate-200 rounded mb-1.5" />
              <div className="h-3 w-36 bg-slate-100 rounded" />
            </div>
            <div className="w-32 h-3 bg-slate-100 rounded hidden md:block" />
            <div className="w-24 h-4 bg-slate-200 rounded" />
            <div className="w-16 h-5 bg-slate-100 rounded-full" />
            <div className="w-16 h-8 bg-slate-100 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
