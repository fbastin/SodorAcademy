import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

// Shared dialog shell: closes on Escape and on a click outside the panel.
const Modal = ({ title, onClose, className = 'max-w-lg', children }: {
  title: string;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 md:p-10 w-full max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col ${className}`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          title="Close (Esc)"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X size={24} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Modal;
