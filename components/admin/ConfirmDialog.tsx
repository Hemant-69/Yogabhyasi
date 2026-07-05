"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center p-4">
        {/* Warning Icon Banner */}
        <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>

        {/* Title & Description */}
        <h3 className="font-serif font-bold text-xl text-sage-950 mb-2">{title}</h3>
        <p className="text-sm text-sage-600 font-light leading-relaxed mb-6">
          {description}
        </p>

        {/* Actions button group */}
        <div className="flex items-center gap-3 w-full">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isLoading || isSubmitting}
            className="rounded-xl"
          >
            {cancelText}
          </Button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || isSubmitting}
            className="flex-1 py-3 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-900/10 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 tracking-wide"
          >
            {isLoading || isSubmitting ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
