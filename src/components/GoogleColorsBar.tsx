export function GoogleColorsBar({ className = "h-1" }: { className?: string }) {
  return (
    <div className={`w-full flex ${className}`} aria-hidden="true">
      <div className="flex-1 bg-[#4285F4]" /> {/* Blue */}
      <div className="flex-1 bg-[#EA4335]" /> {/* Red */}
      <div className="flex-1 bg-[#FBBC04]" /> {/* Yellow */}
      <div className="flex-1 bg-[#34A853]" /> {/* Green */}
    </div>
  );
}

export function GoogleDots({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-hidden="true">
      <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
      <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
      <span className="w-2 h-2 rounded-full bg-[#FBBC04]" />
      <span className="w-2 h-2 rounded-full bg-[#34A853]" />
    </span>
  );
}
