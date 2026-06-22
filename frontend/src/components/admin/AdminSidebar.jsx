import BrandLogo from "../common/BrandLogo";
import SidebarLink from "../common/SidebarLink";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <aside className="hidden md:flex flex-col h-full w-[280px] bg-[#f3f4f5]/80 backdrop-blur-2xl border-r border-white/40 shadow-md fixed left-0 top-0 z-40 p-6 gap-4">
      <div className="mb-8">
        <BrandLogo title="Admin Portal" subtitle="System Control" />
      </div>

      <div className="glass-panel rounded-xl p-4 mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#45464d]">
          Logged in as
        </p>
        <h3 className="text-[#09152e] font-bold mt-1">
          {authUser?.name || "Admin"}
        </h3>
        <p className="text-sm text-[#45464d]">{authUser?.email}</p>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <SidebarLink to="/admin/dashboard" icon="dashboard" label="Dashboard" />
        <SidebarLink to="/admin/users" icon="groups" label="Users" />
        <SidebarLink to="/admin/agents" icon="support_agent" label="Agents" />
        <SidebarLink to="/admin/faqs" icon="quiz" label="FAQs" />
        <SidebarLink to="/admin/knowledge-base" icon="database" label="Knowledge Base" />
        <SidebarLink to="/admin/tickets" icon="confirmation_number" label="Tickets" />
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

export default AdminSidebar;