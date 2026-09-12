import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showTag?: boolean;
}

export default function Logo({ className = 'h-8 w-auto', showTag = true }: LogoProps) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 select-none group">
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-9 h-9 transition-transform group-hover:scale-105"
        >
          <rect width="48" height="48" rx="14" fill="#10B981" fillOpacity="0.15" />
          <path
            d="M18 30C15.5 25 18 18 24 16C30 14 34 18 36 24C38 30 42 34 46 32C50 30 51 24 48 20"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M30 18C32.5 23 30 30 24 32C18 34 14 30 12 24C10 18 6 14 2 16"
            stroke="#0284C7"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="34" cy="18" r="3.5" fill="#10B981" />
          <circle cx="16" cy="32" r="3" fill="#0284C7" />
          <path
            d="M26 14L28 11M36 22L39 23M14 28L11 27"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="font-headline font-extrabold text-2xl tracking-tight text-on-surface dark:text-white">
        Eco<span className="text-[#10b981]">Loop</span>
      </span>
      {showTag && (
        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#e0f2fe] dark:bg-[#0369a1]/30 text-[#0369a1] dark:text-[#7dd3fc] font-headline text-[10px] font-bold tracking-wider uppercase">
          SOCIETY
        </span>
      )}
    </Link>
  );
}
