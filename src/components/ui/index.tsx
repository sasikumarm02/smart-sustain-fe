import React from 'react';

export const Card: React.FC<any> = ({ children, className = '' }) => (
  <div className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-slate-800 ${className}`}>
    {children}
  </div>
);

export const PrimaryButton: React.FC<any> = ({ children, className = '', ...props }) => (
  <button
    className={`bg-[#0d7a46] hover:bg-[#096036] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold py-2 px-5 rounded-md transition-colors shadow-sm ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const SecondaryButton: React.FC<any> = ({ children, className = '', ...props }) => (
  <button
    className={`bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2 px-4 rounded-md transition-colors shadow-sm ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const TextInput: React.FC<any> = ({ label, required, error, className = '', wrapperClassName = '', ...props }) => (
  <div className={`space-y-1 ${wrapperClassName}`}>
    {label && (
      <label className="block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <input
      className={`w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0d7a46] focus:ring-1 focus:ring-[#0d7a46] transition-colors ${className}`}
      {...props}
    />
    {error && <div className="text-[11px] text-red-500 font-semibold">{error}</div>}
  </div>
);

export const Select: React.FC<any> = ({ label, required, options = [], placeholder, error, className = '', ...props }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <select
      className={`w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d7a46] focus:ring-1 focus:ring-[#0d7a46] transition-colors ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt: any, idx: number) => {
        const val = typeof opt === 'object' ? (opt.value ?? opt.id ?? idx) : opt;
        const lbl = typeof opt === 'object' ? (opt.label ?? opt.name ?? val) : opt;
        return (
          <option key={`${val}-${idx}`} value={val}>
            {lbl}
          </option>
        );
      })}
    </select>
    {error && <div className="text-[11px] text-red-500 font-semibold">{error}</div>}
  </div>
);

export const MultiSelect: React.FC<any> = ({
  label,
  required,
  options = [],
  value = [],
  onChange,
  placeholder = "Select facilities...",
  error,
  className = "",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optVal: string) => {
    const nextValue = value.includes(optVal)
      ? value.filter((v: string) => v !== optVal)
      : [...value, optVal];
    onChange?.(nextValue);
  };

  return (
    <div className={`space-y-1 relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs min-h-[38px] cursor-pointer flex items-center justify-between gap-2 focus:outline-none focus:border-[#0d7a46] transition-colors"
      >
        <div className="flex flex-wrap gap-1 items-center">
          {value.length === 0 ? (
            <span className="text-slate-400">{placeholder}</span>
          ) : (
            options
              .filter((opt: any) => {
                const val = typeof opt === "object" ? (opt.value ?? opt.id) : opt;
                return value.includes(val);
              })
              .map((opt: any, idx: number) => {
                const val = typeof opt === "object" ? (opt.value ?? opt.id) : opt;
                const lbl = typeof opt === "object" ? (opt.label ?? opt.name) : opt;
                return (
                  <span
                    key={`${val}-${idx}`}
                    className="inline-flex items-center gap-1 bg-[#f0fdf4] text-[#0d7a46] border border-[#0d7a46]/30 px-2 py-0.5 rounded text-[11px] font-medium"
                  >
                    {lbl}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(val);
                      }}
                      className="hover:text-red-600 font-bold ml-0.5 cursor-pointer"
                    >
                      ×
                    </span>
                  </span>
                );
              })
          )}
        </div>
        <span className="text-slate-400 text-[10px]">▼</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto py-1">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-400 text-center">No facilities available</div>
          ) : (
            options.map((opt: any, idx: number) => {
              const val = typeof opt === "object" ? (opt.value ?? opt.id ?? idx) : opt;
              const lbl = typeof opt === "object" ? (opt.label ?? opt.name ?? val) : opt;
              const selected = value.includes(val);

              return (
                <div
                  key={`${val}-${idx}`}
                  onClick={() => toggleOption(val)}
                  className={`px-3 py-1.5 text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    selected ? "bg-[#f0fdf4] text-[#0d7a46] font-semibold" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>{lbl}</span>
                  {selected && <span className="text-[#0d7a46] font-bold">✓</span>}
                </div>
              );
            })
          )}
        </div>
      )}
      {error && <div className="text-[11px] text-red-500 font-semibold">{error}</div>}
    </div>
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
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                isCompleted
                  ? 'bg-[#0d7a46] text-white'
                  : isActive
                  ? 'bg-[#0d7a46] text-white'
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
                  ? 'text-slate-900 font-bold'
                  : isCompleted
                  ? 'text-slate-700 font-medium'
                  : 'text-slate-400 font-normal'
              }`}
            >
              {st.label}
            </span>
          </div>

          {idx < steps.length - 1 && (
            <div
              className={`flex-1 h-[2px] mx-3 min-w-[20px] transition-colors ${
                currentStep > stepNumber ? 'bg-[#0d7a46]' : 'bg-slate-200'
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
