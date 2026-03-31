import React, { useState } from "react";

function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 mb-5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
      <div className="flex items-center gap-2.5">
        <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-xs font-medium text-amber-400">
          <span className="font-bold">Disclaimer:</span> This project is for educational purposes only. None of the listings are real.
        </p>
      </div>
      <button onClick={() => setDismissed(true)} className="text-amber-600 hover:text-amber-400 transition-colors shrink-0">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default DisclaimerBanner;