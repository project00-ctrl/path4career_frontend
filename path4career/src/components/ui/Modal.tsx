/**
 * Reusable Modal Component
 * Used for displaying Risk Analyzer results and other content in a popup
 */

import { X } from 'lucide-react';
import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  size = 'md',
  closeButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-96',
    md: 'w-[28rem]',
    lg: 'w-2xl',
    xl: 'w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-background border border-border rounded-2xl shadow-2xl ${sizeClasses[size]} max-h-[90vh] overflow-y-auto animate-scale-in`}
        style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {/* Header */}
        {title && (
          <div className="sticky top-0 border-b border-border bg-background/95 backdrop-blur px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            {closeButton && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
