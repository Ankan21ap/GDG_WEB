import { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: string;
  className?: string;
  variant?: "banner" | "compact" | "cards";
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function Countdown({ targetDate, className = "", variant = "cards" }: CountdownProps) {
  const [time, setTime] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    function calculate() {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTime({ days, hours, minutes, seconds, isPast: false });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (time.isPast) {
    return (
      <div className={`text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full inline-flex items-center gap-2 ${className}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Event In Progress or Concluded
      </div>
    );
  }

  const pad = (num: number) => String(num).padStart(2, "0");

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-2 text-xs font-mono font-medium text-[#3C4043] ${className}`}>
        <span className="text-[#5F6368]">Starts in:</span>
        <span className="text-[#202124] font-bold">{time.days}d</span>
        <span>:</span>
        <span className="text-[#202124] font-bold">{pad(time.hours)}h</span>
        <span>:</span>
        <span className="text-[#202124] font-bold">{pad(time.minutes)}m</span>
        <span>:</span>
        <span className="text-[#1A73E8] font-bold">{pad(time.seconds)}s</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="text-[11px] uppercase tracking-widest text-[#5F6368] font-bold mb-2.5">
        Event Starts In
      </span>
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5 text-center w-full max-w-sm">
        <div className="bg-white border border-neutral-200/90 rounded-xl p-2 sm:p-2.5 shadow-xs">
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#202124] block">
            {pad(time.days)}
          </span>
          <span className="text-[10px] text-[#5F6368] font-medium tracking-wide uppercase">
            Days
          </span>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-xl p-2 sm:p-2.5 shadow-xs">
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#202124] block">
            {pad(time.hours)}
          </span>
          <span className="text-[10px] text-[#5F6368] font-medium tracking-wide uppercase">
            Hours
          </span>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-xl p-2 sm:p-2.5 shadow-xs">
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#202124] block">
            {pad(time.minutes)}
          </span>
          <span className="text-[10px] text-[#5F6368] font-medium tracking-wide uppercase">
            Minutes
          </span>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-xl p-2 sm:p-2.5 shadow-xs">
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#1A73E8] block">
            {pad(time.seconds)}
          </span>
          <span className="text-[10px] text-[#5F6368] font-medium tracking-wide uppercase">
            Seconds
          </span>
        </div>
      </div>
    </div>
  );
}
