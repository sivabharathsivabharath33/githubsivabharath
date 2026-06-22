const BrandLogo = ({ title = "SmartDesk", subtitle = "AI Service Desk" }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-lg bg-[#1F2A44] flex items-center justify-center shadow-sm">
        <span className="material-symbols-outlined text-white text-[26px]">
          support_agent
        </span>
      </div>

      <div>
        <h1 className="text-[#1F2A44] font-extrabold text-xl leading-tight">
          {title}
        </h1>
        <p className="text-[#45464d] text-xs font-semibold tracking-wide">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default BrandLogo;