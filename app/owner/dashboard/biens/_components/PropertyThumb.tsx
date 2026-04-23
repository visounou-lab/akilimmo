"use client";

import { useState } from "react";

interface Props {
  src: string | null | undefined;
  title: string;
}

export default function PropertyThumb({ src, title }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
        <svg className="w-8 h-8 text-slate-300 mb-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
        </svg>
        <p className="text-center text-xs font-medium text-slate-400 line-clamp-2 leading-tight">{title}</p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      onError={() => setFailed(true)}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}
