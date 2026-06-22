const TextInput = ({
  label,
  icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <div className="space-y-1">
      <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
        {label}
      </label>

      <div className="relative rounded-lg input-glass">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-[#45464d] opacity-70">
              {icon}
            </span>
          </div>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-transparent border-none focus:ring-0 py-3 pr-3 rounded-lg text-[#191c1d] ${
            icon ? "pl-12" : "pl-3"
          }`}
        />
      </div>
    </div>
  );
};

export default TextInput;