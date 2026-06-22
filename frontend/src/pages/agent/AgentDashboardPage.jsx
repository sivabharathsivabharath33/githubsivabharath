import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassCard from "../../components/common/GlassCard";
import { getAgentDashboard, getAgentQueue } from "../../api/agentApi";

const StatCard = ({ icon, label, value, accent = "navy" }) => {
  const iconClass =
    accent === "gold"
      ? "bg-[#C6A75E] text-white"
      : accent === "red"
      ? "bg-red-100 text-red-700"
      : accent === "green"
      ? "bg-green-100 text-green-700"
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

const statusClass = {
  Open: "bg-red-100 text-red-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-blue-100 text-blue-700",
  Closed: "bg-green-100 text-green-700",
};

const AgentDashboardPage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [highPriorityTickets, setHighPriorityTickets] = useState([]);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      const data = await getAgentDashboard();
      setStats(data);

      const highTickets = await getAgentQueue({
        priority_filter: "High",
      });

      setHighPriorityTickets(highTickets);
    } catch (err) {
      setError("Unable to load agent dashboard");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#09152e]">
            Agent Dashboard
          </h1>
          <p className="text-[#45464d] mt-1">
            Welcome back, {stats?.agent_name || "Agent"}. Manage your assigned support queue.
          </p>
        </div>

        <Link
          to="/agent/queue"
          className="bg-[#09152e] text-white px-6 py-3 rounded-lg font-bold shadow-sm hover:bg-[#1f2a44] flex items-center justify-center gap-2"
        >
          View Queue
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      <GlassCard className="p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#45464d]">
              Assigned Department
            </p>
            <h2 className="text-2xl font-extrabold text-[#09152e] mt-1">
              {stats?.request_type || "Support"} Queue
            </h2>
          </div>

          <span className="bg-[#eadeca] text-[#372800] px-4 py-2 rounded-full text-sm font-bold">
            {stats?.request_type || "Agent"}
          </span>
        </div>
      </GlassCard>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon="confirmation_number"
          label="Total Assigned Tickets"
          value={stats?.total_assigned_tickets}
        />
        <StatCard
          icon="radio_button_checked"
          label="Open Tickets"
          value={stats?.open_tickets}
          accent="red"
        />
        <StatCard
          icon="pending_actions"
          label="In Progress"
          value={stats?.in_progress_tickets}
          accent="gold"
        />
        <StatCard
          icon="task_alt"
          label="Closed Tickets"
          value={stats?.closed_tickets}
          accent="green"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <StatCard
          icon="priority_high"
          label="High Priority Tickets"
          value={stats?.high_priority_tickets}
          accent="red"
        />
        <StatCard
          icon="today"
          label="Today's Queue Size"
          value={stats?.today_queue_size}
          accent="gold"
        />
        <StatCard
          icon="verified"
          label="Resolved Tickets"
          value={stats?.resolved_tickets}
          accent="green"
        />
      </div>

      {/* HIGH PRIORITY TICKETS LIST */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-[#09152e]">
              High Priority Tickets
            </h2>
            <p className="text-[#45464d] text-sm mt-1">
              Urgent tickets that need quick attention.
            </p>
          </div>

          <button
            onClick={() => navigate("/agent/queue")}
            className="bg-[#C6A75E] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#ab8e48] flex items-center gap-2"
          >
            View All
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        </div>

        {highPriorityTickets.length === 0 ? (
          <div className="bg-white/60 rounded-xl border border-white/50 p-6 text-center">
            <span className="material-symbols-outlined text-[#C6A75E] text-[42px]">
              task_alt
            </span>
            <p className="text-[#09152e] font-bold mt-2">
              No high priority tickets right now
            </p>
            <p className="text-[#45464d] text-sm mt-1">
              Your urgent queue is currently clear.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
            {highPriorityTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => navigate(`/agent/tickets/${ticket.id}`)}
                className="w-full bg-white/60 border border-white/50 rounded-xl p-4 text-left hover:bg-white/80 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-extrabold text-[#09152e]">
                        #TCK-{String(ticket.id).padStart(3, "0")}
                      </span>

                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-[11px] font-bold">
                        High
                      </span>

                      <span
                        className={`px-2 py-1 rounded-full text-[11px] font-bold ${
                          statusClass[ticket.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#09152e]">
                      {ticket.subject}
                    </h3>

                    <p className="text-sm text-[#45464d] line-clamp-1 mt-1">
                      {ticket.summary || ticket.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[#09152e] font-bold text-sm">
                    Open
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default AgentDashboardPage;