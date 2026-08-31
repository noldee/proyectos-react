export const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <div className="w-12 h-12 border-4 border-white/20 border-t-sky-400 rounded-full animate-spin" />
      <p className="text-xs font-semibold tracking-widest text-slate-300 uppercase animate-pulse">
        Cargando clima...
      </p>
    </div>
  );
};
