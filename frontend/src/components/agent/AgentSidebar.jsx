import BrandLogo from "../common/BrandLogo";
import SidebarLink from "../common/SidebarLink";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AgentSidebar = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/agent");
  };

  return (
    <aside className="hidden md:flex flex-col h-full w-[280px] bg-[#f3f4f5]/80 backdrop-blur-2xl border-r border-white/40 shadow-md fixed left-0 top-0 z-40 p-6 gap-4">
      <div className="mb-8">
        <BrandLogo title="Agent Portal" subtitle="Service Excellence" />
      </div>

      <div className="glass-panel rounded-xl p-4 mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#45464d]">
          Logged in as
        </p>
        <h3 className="text-[#09152e] font-bold mt-1">
          {authUser?.name || "Agent"}
        </h3>
        <p className="text-sm text-[#45464d]">{authUser?.email}</p>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <SidebarLink to="/agent/dashboard" icon="dashboard" label="Dashboard" />
        <SidebarLink to="/agent/queue" icon="queue" label="View Queue" />
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#45464d] hover:bg-red-50 hover:text-red-700 transition-all font-medium"
      >
        <span className="material-symbols-outlined text-[21px]">logout</span>
        Logout
      </button>
    </aside>
  );
};

export default AgentSidebar;