import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../../components/common/GlassCard";
import { getAgentQueue } from "../../api/agentApi";

const statusClass = {
  Open: "bg-red-100 text-red-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-blue-100 text-blue-700",
  Closed: "bg-green-100 text-green-700",
};

const priorityClass = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

const AgentQueuePage = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    status_filter: "",
    priority_filter: "",
  });
  const [error, setError] = useState("");

  const loadQueue = async () => {
    try {
      const data = await getAgentQueue(filters);
      setTickets(data);
      setError("");
    } catch (err) {
      setError("Unable to load agent queue");
    }
  };

  useEffect(() => {
    loadQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);

    try {
      const data = await getAgentQueue(updatedFilters);
      setTickets(data);
    } catch (err) {
      setError("Unable to filter queue");
    }
  };

  const clearFilters = async () => {
    const emptyFilters = {
      status_filter: "",
      priority_filter: "",
    };

    setFilters(emptyFilters);
    const data = await getAgentQueue(emptyFilters);
    setTickets(data);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#09152e]">
            Support Request Queue
          </h1>
          <p className="text-[#45464d] mt-1">
            View only tickets assigned to your request type.
          </p>
        </div>

        <button
          onClick={loadQueue}
          className="bg-[#09152e] text-white px-6 py-3 rounded-lg font-bold shadow-sm hover:bg-[#1f2a44] flex items-center justify-center gap-2"
        >
          Refresh
          <span className="material-symbols-outlined text-[18px]">refresh</span>
        </button>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      <GlassCard className="p-5 mb-6">
        <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
              Status
            </label>
            <select
              name="status_filter"
              value={filters.status_filter}
              onChange={handleFilterChange}
              className="input-glass w-full rounded-lg px-4 py-3 mt-1"
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
              Priority
            </label>
            <select
              name="priority_filter"
              value={filters.priority_filter}
              onChange={handleFilterChange}
              className="input-glass w-full rounded-lg px-4 py-3 mt-1"
            >
              <option value="">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="border border-[#09152e]/20 text-[#09152e] px-5 py-3 rounded-lg font-bold hover:bg-[#09152e]/5"
          >
            Clear
          </button>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-white/50 border-b border-[#09152e]/10">
              <tr>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">
                  ID
                </th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">
                  Subject
                </th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">
                  Type
                </th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">
                  Priority
                </th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">
                  Status
                </th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">
                  Sentiment
                </th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {tickets.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-[#45464d]">
                    No tickets found in your queue.
                  </td>
                </tr>
              )}

              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-[#09152e]/10 hover:bg-white/40 transition-colors"
                >
                  <td className="px-5 py-4 font-bold text-[#09152e]">
                    #{ticket.id}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-bold text-[#09152e] line-clamp-1">
                      {ticket.subject}
                    </p>
                    <p className="text-sm text-[#45464d] line-clamp-1">
                      {ticket.summary || ticket.description}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="bg-[#d9e2ff] text-[#09152e] px-3 py-1 rounded-full text-xs font-bold">
                      {ticket.request_type}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        priorityClass[ticket.priority] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        statusClass[ticket.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="bg-[#eadeca] text-[#372800] px-3 py-1 rounded-full text-xs font-bold">
                      {ticket.sentiment}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => navigate(`/agent/tickets/${ticket.id}`)}
                      className="bg-[#09152e] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1f2a44]"
                    >
                      Open Chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default AgentQueuePage;