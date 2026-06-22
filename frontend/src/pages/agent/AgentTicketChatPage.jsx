import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import GlassCard from "../../components/common/GlassCard";

import {
  getAgentTicketDetails,
  getAgentTicketMessages,
  sendAgentReply,
  updateAgentTicketStatus,
  getAgentAISuggestion,
} from "../../api/agentApi";

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

const AgentTicketChatPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [error, setError] = useState("");

  const loadTicket = async () => {
    try {
      const ticketData = await getAgentTicketDetails(ticketId);
      const messageData = await getAgentTicketMessages(ticketId);

      setTicket(ticketData);
      setMessages(messageData);
      setStatusValue(ticketData.status);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load ticket");
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim()) return;

    try {
      await sendAgentReply(ticketId, reply);
      setReply("");
      setAiSuggestion("");
      await loadTicket();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to send reply");
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const updatedTicket = await updateAgentTicketStatus(ticketId, statusValue);
      setTicket(updatedTicket);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to update status");
    }
  };

  const handleAISuggestion = async () => {
    try {
      setLoadingSuggestion(true);
      const data = await getAgentAISuggestion(ticketId);
      setAiSuggestion(data.suggested_reply);
      setReply(data.suggested_reply);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to generate AI suggestion");
    } finally {
      setLoadingSuggestion(false);
    }
  };

  useEffect(() => {
    loadTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate("/agent/queue")}
            className="text-[#45464d] hover:text-[#09152e] text-sm font-bold flex items-center gap-1 mb-2"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Queue
          </button>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#09152e]">
            Ticket Chat
          </h1>

          <p className="text-[#45464d] mt-1">
            Review the customer request and send a professional response.
          </p>
        </div>

        {ticket && (
          <div className="flex items-center gap-3">
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              className="input-glass rounded-lg px-4 py-3 font-semibold"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <button
              onClick={handleStatusUpdate}
              className="bg-[#09152e] text-white px-5 py-3 rounded-lg font-bold hover:bg-[#1f2a44]"
            >
              Update Status
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      {!ticket ? (
        <GlassCard className="p-8">
          <p className="text-[#45464d]">Loading ticket...</p>
        </GlassCard>
      ) : (
        <div className="grid xl:grid-cols-[360px_1fr] gap-6 min-h-0 flex-1">
          {/* LEFT DETAILS */}
          <GlassCard className="p-6 overflow-y-auto">
            <div className="w-12 h-12 rounded-lg bg-[#09152e] flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-white">
                confirmation_number
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-[#09152e] mb-2">
              {ticket.subject}
            </h2>

            <p className="text-[#45464d] text-sm leading-relaxed mb-5">
              {ticket.description}
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-[#45464d]">Ticket ID</span>
                <span className="font-bold text-[#09152e]">#{ticket.id}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-[#45464d]">Request Type</span>
                <span className="bg-[#d9e2ff] text-[#09152e] px-3 py-1 rounded-full text-xs font-bold">
                  {ticket.request_type}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-[#45464d]">Priority</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    priorityClass[ticket.priority] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {ticket.priority}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-[#45464d]">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    statusClass[ticket.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-[#45464d]">Sentiment</span>
                <span className="bg-[#eadeca] text-[#372800] px-3 py-1 rounded-full text-xs font-bold">
                  {ticket.sentiment}
                </span>
              </div>
            </div>

            <div className="bg-white/60 rounded-xl border border-white/50 p-4">
              <p className="text-xs uppercase tracking-wider font-bold text-[#45464d] mb-2">
                AI Summary
              </p>
              <p className="text-sm text-[#09152e] font-semibold leading-relaxed">
                {ticket.summary || "No summary available"}
              </p>
            </div>

            <button
              onClick={handleAISuggestion}
              disabled={loadingSuggestion || ticket.status === "Closed"}
              className="w-full mt-5 bg-[#C6A75E] text-white px-5 py-3 rounded-lg font-bold hover:bg-[#ab8e48] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loadingSuggestion ? "Generating..." : "Generate AI Reply"}
              <span className="material-symbols-outlined text-[18px]">
                auto_awesome
              </span>
            </button>

            {aiSuggestion && (
              <div className="mt-4 bg-[#ffdf98]/40 border border-[#C6A75E]/30 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wider font-bold text-[#372800] mb-2">
                  AI Suggestion
                </p>
                <p className="text-sm text-[#372800] leading-relaxed whitespace-pre-line">
                  {aiSuggestion}
                </p>
              </div>
            )}
          </GlassCard>

          {/* RIGHT CHAT */}
          <GlassCard className="p-6 flex flex-col min-h-0">
            <div className="border-b border-[#09152e]/10 pb-4 mb-4">
              <h2 className="text-2xl font-bold text-[#09152e]">
                Conversation Thread
              </h2>
              <p className="text-sm text-[#45464d]">
                Customer messages appear on the left. Agent replies appear on the right.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              {messages.map((msg) => {
                const isAgent = msg.sender_role === "agent";

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                        isAgent
                          ? "bg-[#09152e] text-white rounded-br-sm"
                          : "bg-white/70 text-[#191c1d] rounded-bl-sm border border-white/50"
                      }`}
                    >
                      <div className="flex justify-between gap-4 mb-1">
                        <p
                          className={`text-xs font-bold ${
                            isAgent ? "text-white" : "text-[#09152e]"
                          }`}
                        >
                          {msg.sender_name}
                        </p>

                        <p
                          className={`text-[11px] ${
                            isAgent ? "text-white/70" : "text-[#45464d]"
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>

                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {ticket.status === "Closed" ? (
              <div className="bg-green-50 text-green-700 rounded-lg px-4 py-3 text-sm font-semibold">
                This ticket is closed. You cannot send new replies.
              </div>
            ) : (
              <div className="flex gap-3">
                <textarea
                  className="input-glass flex-1 rounded-lg px-4 py-3 min-h-[54px] max-h-[130px] resize-none"
                  placeholder="Type your response..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />

                <button
                  onClick={handleSendReply}
                  className="bg-[#09152e] text-white px-5 py-3 rounded-lg font-bold hover:bg-[#1f2a44] h-[54px]"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default AgentTicketChatPage;