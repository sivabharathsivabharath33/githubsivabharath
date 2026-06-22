import { useEffect, useState } from "react";
import GlassCard from "../../components/common/GlassCard";
import { getAdminDashboard } from "../../api/adminApi";

const StatCard = ({ icon, label, value, accent = "navy" }) => {
  const iconClass =
    accent === "gold"
      ? "bg-[#C6A75E] text-white"
      : accent === "red"
      ? "bg-red-100 text-red-700"
      : accent === "green"
      ? "bg-green-100 text-green-700"
      : accent === "blue"
      ? "bg-[#d9e2ff] text-[#09152e]"
      : "bg-[#09152e] text-white";

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#45464d] text-sm font-semibold">{label}</p>
          <h2 className="text-3xl font-extrabold text-[#09152e] mt-2">
            {value ?? 0}
          </h2>
        </div>

        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
    </GlassCard>
  );
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      const data = await getAdminDashboard();
      setStats(data);
      setError("");
    } catch (err) {
      setError("Unable to load admin dashboard");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#09152e]">
          Admin Dashboard
        </h1>
        <p className="text-[#45464d] mt-1">
          Monitor users, agents, tickets, FAQs, and knowledge base documents.
        </p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon="groups" label="Total Users" value={stats?.total_users} />
        <StatCard icon="support_agent" label="Total Agents" value={stats?.total_agents} accent="gold" />
        <StatCard icon="confirmation_number" label="Total Tickets" value={stats?.total_tickets} accent="blue" />
        <StatCard icon="quiz" label="Total FAQs" value={stats?.total_faqs} accent="green" />
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon="radio_button_checked" label="Open Tickets" value={stats?.open_tickets} accent="red" />
        <StatCard icon="pending_actions" label="In Progress" value={stats?.in_progress_tickets} accent="gold" />
        <StatCard icon="verified" label="Resolved Tickets" value={stats?.resolved_tickets} accent="blue" />
        <StatCard icon="task_alt" label="Closed Tickets" value={stats?.closed_tickets} accent="green" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-lg bg-[#09152e] flex items-center justify-center">
              <span className="material-symbols-outlined text-white">priority_high</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#09152e]">High Priority Tickets</h2>
              <p className="text-sm text-[#45464d]">Tickets needing faster attention</p>
            </div>
          </div>

          <h3 className="text-5xl font-extrabold text-[#09152e]">
            {stats?.high_priority_tickets ?? 0}
          </h3>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-lg bg-[#C6A75E] flex items-center justify-center">
              <span className="material-symbols-outlined text-white">database</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#09152e]">Knowledge Base Documents</h2>
              <p className="text-sm text-[#45464d]">Uploaded RAG source documents</p>
            </div>
          </div>

          <h3 className="text-5xl font-extrabold text-[#09152e]">
            {stats?.total_kb_documents ?? 0}
          </h3>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminDashboardPage;