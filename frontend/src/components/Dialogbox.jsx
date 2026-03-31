import React from "react";

function Dialogbox({ isOpen, setIsOpen, title, message, buttonText, onClose }) {
  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#131720] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-fadeIn">
        {/* Top accent */}
        <div className="h-0.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600" />

        <div className="p-6 space-y-4">
          {/* Title */}
          <h2 className="text-base font-bold text-white">{title}</h2>

          {/* Message */}
          <p className="text-sm text-gray-400 leading-relaxed">{message}</p>

          {/* Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleClose}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/30"
            >
              {buttonText || "OK"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dialogbox;