import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { useLang } from '../i18n';

// Shared dialog shell: closes on Escape and on a click outside the panel.
const Modal = ({ title, onClose, className = 'max-w-lg', children }: {
  title: string;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}) => {
  const { t } = useLang();
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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/55 p-3 sm:p-6"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`card-ink p-5 sm:p-8 w-full max-h-[90vh] relative overflow-hidden flex flex-col ${className}`}
      >
        <button
          onClick={onClose}
          aria-label={t('close')}
          title={t('close')}
          className="chunky p-0 w-10 h-10 absolute top-3 right-3 sm:top-5 sm:right-5 z-10"
        >
          <X size={20} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Modal;
