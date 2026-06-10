"use client";

interface ResultCardProps {
  title: string;
  subtitle: string;
  icon: string;
  content: string;
}

export function ResultCard({ title, subtitle, icon, content }: ResultCardProps) {
  return (
    <div className="ornament-border rounded-2xl bg-navy-900/60 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-gold-500 text-2xl">{icon}</span>
        <div>
          <h2 className="text-xl font-bold text-gold-gradient tracking-wider">
            {title}
          </h2>
          <p className="text-xs text-navy-400 tracking-wider mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent mb-4" />
      <p className="text-navy-100 leading-relaxed text-[0.95rem]">{content}</p>
    </div>
  );
}
