import { useEffect, useState } from "react";
import GlassCard from "../../components/common/GlassCard";
import { getAdminTickets } from "../../api/adminApi";

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

const TicketMonitoringPage = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    try {
      const data = await getAdminTickets();
      setTickets(data);
      setError("");
    } catch (err) {
      setError("Unable to load tickets");
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#09152e]">
            Ticket Monitoring
          </h1>
          <p className="text-[#45464d] mt-1">
            View all customer tickets across IT, HR, and Facilities.
          </p>
        </div>

        <button
          onClick={loadTickets}
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

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-white/50 border-b border-[#09152e]/10">
              <tr>
                <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">ID</th>
                <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Subject</th>
                <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Type</th>
                <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Priority</th>
                <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Status</th>
                <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Sentiment</th>
                <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Created</th>
              </tr>
            </thead>

            <tbody>
              {tickets.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-[#45464d]">
                    No tickets found.
                  </td>
                </tr>
              )}

              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-[#09152e]/10 hover:bg-white/40">
                  <td className="px-5 py-4 font-bold text-[#09152e]">#{ticket.id}</td>

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

                  <td className="px-5 py-4 text-[#45464d] text-sm">
                    {new Date(ticket.created_at).toLocaleString()}
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

export default TicketMonitoringPage;