import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm text-gray-400">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors min-h-[100px] ${className}`}
        {...props}
      />
    </div>
  )
);

Textarea.displayName = "Textarea";
