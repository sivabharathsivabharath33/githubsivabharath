const PrimaryButton = ({ children, type = "button", variant = "primary", className = "", ...props }) => {
  const buttonClass = variant === "gold" ? "btn-gold" : "btn-primary";

  return (
    <button
      type={type}
      className={`w-full flex justify-center items-center gap-2 py-3 px-6 rounded-lg font-bold text-sm shadow-sm ${buttonClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;