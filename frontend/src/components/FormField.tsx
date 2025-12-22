import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
}

export function FormField({ label, required, children, error }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm text-muted-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full px-3 py-2.5 bg-background border ${error ? 'border-destructive' : 'border-border'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
      {...props}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function TextArea({ error, className = '', ...props }: TextAreaProps) {
  return (
    <textarea
      className={`w-full px-3 py-2.5 bg-background border ${error ? 'border-destructive' : 'border-border'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
}

export function Select({ error, options, className = '', ...props }: SelectProps) {
  return (
    <select
      className={`w-full px-3 py-2.5 bg-background border ${error ? 'border-destructive' : 'border-border'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
      {...props}
    >

     
      <option value="">Select category</option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}





interface ImageInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  error?: boolean;
  value?: string | null;
  onChange?: (value: string | null, file?: File | null) => void;
}

export function ImageInput({
  error,
  className = '',
  value,
  onChange,
  ...props
}: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // You can still upload `file` to your backend
    onChange?.(objectUrl, file);
  }

  function handleRemove() {
    setPreview(null);
    onChange?.(null, null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-2">

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={`w-full px-3 py-2.5 bg-background border ${
          error ? 'border-destructive' : 'border-border'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
        onChange={handleChange}
        {...props}
      />
      
      {preview && (
        <div className="relative w-32 h-32">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg border border-border"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}

      
    </div>
  );
}
