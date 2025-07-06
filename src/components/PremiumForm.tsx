import React from 'react';

interface PremiumFormProps {
  title: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'email' | 'password';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    required?: boolean;
  }>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  cancelLabel?: string;
  icon?: React.ReactNode;
}

export default function PremiumForm({
  title,
  fields,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel = 'Cancelar',
  icon
}: PremiumFormProps) {
  return (
    <div className="premium-form-card">
      <div className="premium-form-title">
        {icon && <span className="premium-form-icon">{icon}</span>}
        {title}
      </div>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field, idx) => (
            <div key={field.name + idx}>
              <label className="premium-form-label">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  value={field.value}
                  onChange={field.onChange}
                  className="premium-form-select"
                  required={field.required}
                >
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={field.value}
                  onChange={field.onChange}
                  className="premium-form-input"
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </div>
          ))}
        </div>
        <div className="premium-form-actions">
          <button type="submit" className="premium-form-btn">
            {submitLabel}
          </button>
          <button type="button" onClick={onCancel} className="premium-form-btn secondary">
            {cancelLabel}
          </button>
        </div>
      </form>
    </div>
  );
} 