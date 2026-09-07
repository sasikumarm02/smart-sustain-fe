import { Form, Input, Select as AntSelect, Steps, ConfigProvider } from 'antd';
import React from 'react';

export const cardTheme = {
  token: {
    colorPrimary: '#25a5cb',
    borderRadius: 12,
    colorBorder: '#cbd5e1',
    colorText: '#1e293b',
  },
};

export const Card: React.FC<any> = ({ children, className = '' }) => (
  <ConfigProvider theme={cardTheme}>
    <div className={`bg-white border border-slate-100 rounded-2xl p-6 shadow-xl shadow-slate-200/50 text-slate-800 ${className}`}>
      {children}
    </div>
  </ConfigProvider>
);

export const PrimaryButton: React.FC<any> = ({ children, className = '', ...props }) => (
  <button
    className={`bg-[#25a5cb] hover:bg-[#1f93b5] active:bg-[#1a82a1] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-cyan-500/20 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const SecondaryButton: React.FC<any> = ({ children, className = '', ...props }) => (
  <button
    className={`bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const TextInput: React.FC<any> = ({ label, required, error, className = '', wrapperClassName = '', ...props }) => (
  <ConfigProvider theme={cardTheme}>
    <div className={`space-y-1.5 ${wrapperClassName}`}>
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <Input
        size="large"
        className={`w-full !rounded-xl !text-xs !py-2.5 ${className}`}
        status={error ? 'error' : undefined}
        {...props}
      />
      {error && <div className="text-[11px] text-rose-500 font-semibold">{error}</div>}
    </div>
  </ConfigProvider>
);

export const Select: React.FC<any> = ({ label, required, options = [], placeholder, value, onChange, error, className = '', ...props }) => {
  const formattedOptions = options.map((opt: any, idx: number) => {
    const val = typeof opt === 'object' ? (opt.value ?? opt.id ?? idx) : opt;
    const lbl = typeof opt === 'object' ? (opt.label ?? opt.name ?? val) : opt;
    return { value: val, label: lbl };
  });

  return (
    <ConfigProvider theme={cardTheme}>
      <div className="space-y-1.5">
        {label && (
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <AntSelect
          size="large"
          className={`w-full ${className}`}
          placeholder={placeholder}
          value={value || undefined}
          onChange={(val) => {
            if (onChange) {
              onChange({ target: { value: val } });
            }
          }}
          options={formattedOptions}
          status={error ? 'error' : undefined}
          {...props}
        />
        {error && <div className="text-[11px] text-rose-500 font-semibold">{error}</div>}
      </div>
    </ConfigProvider>
  );
};

export const MultiSelect: React.FC<any> = ({
  label,
  required,
  options = [],
  value = [],
  onChange,
  placeholder = "Select facilities...",
  error,
  className = "",
  ...props
}) => {
  const formattedOptions = options.map((opt: any, idx: number) => {
    const val = typeof opt === 'object' ? (opt.value ?? opt.id ?? idx) : opt;
    const lbl = typeof opt === 'object' ? (opt.label ?? opt.name ?? val) : opt;
    return { value: val, label: lbl };
  });

  return (
    <ConfigProvider theme={cardTheme}>
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <AntSelect
          mode="multiple"
          size="large"
          className="w-full"
          placeholder={placeholder}
          value={value}
          onChange={(nextVal) => onChange?.(nextVal)}
          options={formattedOptions}
          status={error ? 'error' : undefined}
          maxTagCount="responsive"
          {...props}
        />
        {error && <div className="text-[11px] text-rose-500 font-semibold">{error}</div>}
      </div>
    </ConfigProvider>
  );
};

export const Stepper: React.FC<any> = ({ steps = [], currentStep = 1 }) => (
  <div className="flex items-center justify-between w-full overflow-x-auto py-1">
    {steps.map((st: any, idx: number) => {
      const stepNumber = idx + 1;
      const isCompleted = currentStep > stepNumber;
      const isActive = currentStep === stepNumber;

      return (
        <React.Fragment key={idx}>
          <div className="flex items-center gap-2.5 shrink-0">
            <span
              className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                isCompleted
                  ? 'bg-[#25a5cb] text-white shadow-cyan-500/20'
                  : isActive
                  ? 'bg-[#25a5cb] text-white shadow-cyan-500/30 ring-4 ring-cyan-500/15'
                  : 'bg-white border border-slate-300 text-slate-400'
              }`}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                stepNumber
              )}
            </span>
            <span
              className={`text-xs whitespace-nowrap ${
                isActive
                  ? 'text-[#1d769f] font-extrabold'
                  : isCompleted
                  ? 'text-slate-700 font-semibold'
                  : 'text-slate-400 font-medium'
              }`}
            >
              {st.label}
            </span>
          </div>

          {idx < steps.length - 1 && (
            <div
              className={`flex-1 h-[2px] mx-3 min-w-[20px] transition-colors ${
                currentStep > stepNumber ? 'bg-[#25a5cb]' : 'bg-slate-200'
              }`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export const SelectionSummary: React.FC<any> = ({ title = "Selection Summary", items = [], status }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
    {title && <div className="font-bold text-slate-800 text-sm">{title}</div>}
    
    <div className="space-y-3.5">
      {items.map((it: any, idx: number) => {
        const label = typeof it === "object" && it !== null ? it.label : `Item ${idx + 1}`;
        const value = typeof it === "object" && it !== null ? it.value : it;

        return (
          <div key={idx} className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {label}
            </div>
            <div className="text-xs font-bold text-slate-900">
              {value || "—"}
            </div>
          </div>
        );
      })}
    </div>

    {status && (
      <div className="pt-3 border-t border-slate-100 space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          STATUS
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
          <span
            className={`h-2 w-2 rounded-full ${
              typeof status === "object" && status?.variant === "for-review"
                ? "bg-amber-500"
                : "bg-slate-400"
            }`}
          />
          {typeof status === "object" ? status.label : status}
        </div>
      </div>
    )}
  </div>
);

export const Breadcrumb: React.FC<any> = ({ items = [] }) => (
  <div className="flex items-center gap-1.5 text-xs">
    {items.map((it: any, idx: number) => (
      <React.Fragment key={idx}>
        <span className={idx === items.length - 1 ? "font-bold text-slate-900" : "text-slate-500"}>
          {it.label}
        </span>
        {idx < items.length - 1 && <span className="text-slate-400">›</span>}
      </React.Fragment>
    ))}
  </div>
);

export const ErrorState: React.FC<any> = ({ title, description, className = '' }) => (
  <div className={`p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs ${className}`}>
    <div className="font-bold mb-1">{title}</div>
    <div>{description}</div>
  </div>
);
