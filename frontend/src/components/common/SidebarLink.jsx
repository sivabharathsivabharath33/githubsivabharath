import { NavLink } from "react-router-dom";

const SidebarLink = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium ${
          isActive
            ? "bg-[#09152e] text-white shadow-sm"
            : "text-[#45464d] hover:bg-[#09152e]/5 hover:text-[#09152e]"
        }`
      }
    >
      <span className="material-symbols-outlined text-[21px]">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarLink;