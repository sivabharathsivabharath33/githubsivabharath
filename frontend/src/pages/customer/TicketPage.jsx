import { useEffect, useState } from "react";

import GlassCard from "../../components/common/GlassCard";
import PrimaryButton from "../../components/common/PrimaryButton";

import {
  createTicket,
  getMyTickets,
  getTicketDetails,
  getTicketMessages,
  sendCustomerMessage,
} from "../../api/ticketApi";

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

const TicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
  });

  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    try {
      const data = await getMyTickets();
      setTickets(data);

      if (data.length > 0 && !selectedTicket) {
        handleSelectTicket(data[0].id);
      }
    } catch (err) {
      setError("Unable to load tickets");
    }
  };

  const handleSelectTicket = async (ticketId) => {
    try {
      const ticket = await getTicketDetails(ticketId);
      const ticketMessages = await getTicketMessages(ticketId);

      setSelectedTicket(ticket);
      setMessages(ticketMessages);
      setError("");
    } catch (err) {
      setError("Unable to load ticket details");
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) return;

    try {
      setLoading(true);
      setError("");

      const ticket = await createTicket(formData);

      setFormData({
        subject: "",
        description: "",
      });

      await loadTickets();
      await handleSelectTicket(ticket.id);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      setMessageLoading(true);

      await sendCustomerMessage(selectedTicket.id, newMessage);
      setNewMessage("");

      const ticketMessages = await getTicketMessages(selectedTicket.id);
      setMessages(ticketMessages);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to send message");
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="w-full max-w-[1700px] mx-auto px-4 md:px-6 py-5 h-[calc(100vh-76px)] overflow-hidden">
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-[#1F2A44]">
          My Support Tickets
        </h1>
        <p className="text-[#45464d] mt-1">
          Create, view, and track your service desk requests.
        </p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[360px_1fr] gap-5 h-[calc(100vh-200px)] min-h-0">
        {/* LEFT TICKET LIST */}
        <GlassCard className="p-5 overflow-hidden h-full">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#09152e]">
                Previous Tickets
              </h2>
              <p className="text-sm text-[#45464d]">
                Open tickets are red, closed tickets are green
              </p>
            </div>

            <span className="bg-[#d9e2ff] text-[#09152e] px-3 py-1 rounded-full text-xs font-bold">
              {tickets.length}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto h-[calc(100%-80px)] pr-1">
            {tickets.length === 0 && (
              <div className="bg-white/50 rounded-lg p-4 border border-white/40">
                <p className="text-[#45464d] text-sm">
                  No tickets created yet.
                </p>
              </div>
            )}

            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => handleSelectTicket(ticket.id)}
                className={`w-full text-left bg-white/60 border rounded-xl p-4 transition-all hover:bg-white/80 ${
                  selectedTicket?.id === ticket.id
                    ? "border-[#09152e]/30 shadow-sm"
                    : "border-white/50"
                }`}
              >
                <div className="flex justify-between gap-3 mb-2">
                  <h3 className="font-bold text-[#09152e] line-clamp-1">
                    {ticket.subject}
                  </h3>

                  <span
                    className={`px-2 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                      statusClass[ticket.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <p className="text-sm text-[#45464d] line-clamp-2 mb-3">
                  {ticket.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-[#d9e2ff] text-[#09152e] px-2 py-1 rounded-full font-bold">
                    {ticket.request_type}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full font-bold ${
                      priorityClass[ticket.priority] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* RIGHT SIDE */}
        <div className="grid xl:grid-cols-[390px_1fr] gap-5 min-h-0">
          {/* CREATE TICKET */}
          <GlassCard className="p-6 h-fit">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-lg bg-[#1F2A44] flex items-center justify-center">
                <span className="material-symbols-outlined text-white">
                  add_comment
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#09152e]">
                  Create New Ticket
                </h2>
                <p className="text-sm text-[#45464d]">
                  AI will classify type, priority, and sentiment
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                  Subject
                </label>
                <input
                  className="input-glass w-full rounded-lg px-4 py-3 mt-1"
                  placeholder="Example: VPN is not connecting"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                  Description
                </label>
                <textarea
                  className="input-glass w-full rounded-lg px-4 py-3 mt-1 min-h-[120px] resize-none"
                  placeholder="Describe your issue clearly..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <PrimaryButton type="submit" disabled={loading}>
                {loading ? "Creating..." : "Submit Ticket"}
                <span className="material-symbols-outlined text-[18px]">
                  send
                </span>
              </PrimaryButton>
            </form>
          </GlassCard>

          {/* TICKET DETAILS + CHAT */}
          <GlassCard className="p-6 flex flex-col h-full min-h-0">
            {!selectedTicket ? (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <span className="material-symbols-outlined text-[#09152e] text-[54px]">
                    forum
                  </span>
                  <h3 className="font-bold text-[#09152e] text-xl mt-3">
                    Select a ticket
                  </h3>
                  <p className="text-[#45464d] text-sm mt-1">
                    Ticket details and chat thread will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-[#09152e]/10 pb-4 mb-4">
                  <div className="flex justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-[#09152e]">
                        {selectedTicket.subject}
                      </h2>
                      <p className="text-sm text-[#45464d] mt-1">
                        {selectedTicket.summary}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold h-fit ${
                        statusClass[selectedTicket.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {selectedTicket.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-[#d9e2ff] text-[#09152e] px-3 py-1 rounded-full font-bold">
                      {selectedTicket.request_type}
                    </span>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold ${
                        priorityClass[selectedTicket.priority] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {selectedTicket.priority}
                    </span>

                    <span className="text-xs bg-[#eadeca] text-[#372800] px-3 py-1 rounded-full font-bold">
                      {selectedTicket.sentiment}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                  {messages.map((msg) => {
                    const isCustomer = msg.sender_role === "customer";

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isCustomer ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                            isCustomer
                              ? "bg-white/70 text-[#191c1d] rounded-bl-sm border border-white/50"
                              : "bg-[#09152e] text-white rounded-br-sm"
                          }`}
                        >
                          <div className="flex justify-between gap-4 mb-1">
                            <p
                              className={`text-xs font-bold ${
                                isCustomer ? "text-[#09152e]" : "text-white"
                              }`}
                            >
                              {msg.sender_name}
                            </p>

                            <p
                              className={`text-[11px] ${
                                isCustomer
                                  ? "text-[#45464d]"
                                  : "text-white/70"
                              }`}
                            >
                              {new Date(msg.created_at).toLocaleString()}
                            </p>
                          </div>

                          <p className="text-sm leading-relaxed">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedTicket.status === "Closed" ? (
                  <div className="bg-green-50 text-green-700 rounded-lg px-4 py-3 text-sm font-semibold">
                    This ticket is closed. You cannot send new messages.
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      className="input-glass flex-1 rounded-lg px-4 py-3"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                    />

                    <button
                      onClick={handleSendMessage}
                      disabled={messageLoading}
                      className="bg-[#09152e] text-white px-5 py-3 rounded-lg font-bold hover:bg-[#1f2a44]"
                    >
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default TicketPage;