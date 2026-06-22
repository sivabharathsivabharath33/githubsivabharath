import { useEffect, useState } from "react";
import GlassCard from "../../components/common/GlassCard";
import {
  getAdminAgents,
  createAgent,
  updateAgent,
  deleteAgent,
} from "../../api/adminApi";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  request_type: "IT",
};

const AgentManagementPage = () => {
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingAgentId, setEditingAgentId] = useState(null);
  const [error, setError] = useState("");

  const loadAgents = async () => {
    try {
      const data = await getAdminAgents();
      setAgents(data);
      setError("");
    } catch (err) {
      setError("Unable to load agents");
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingAgentId(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAgentId) {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }

        await updateAgent(editingAgentId, updateData);
      } else {
        await createAgent(formData);
      }

      resetForm();
      await loadAgents();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save agent");
    }
  };

  const handleEdit = (agent) => {
    setEditingAgentId(agent.id);
    setFormData({
      name: agent.name,
      email: agent.email,
      password: "",
      request_type: agent.request_type,
      status: agent.status,
    });
  };

  const handleDelete = async (agentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this agent?");
    if (!confirmDelete) return;

    try {
      await deleteAgent(agentId);
      await loadAgents();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete agent");
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#09152e]">
          Agent Management
        </h1>
        <p className="text-[#45464d] mt-1">
          Create and manage IT, HR, and Facilities support agents.
        </p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="grid xl:grid-cols-[420px_1fr] gap-6">
        <GlassCard className="p-6 h-fit">
          <h2 className="text-2xl font-bold text-[#09152e] mb-1">
            {editingAgentId ? "Edit Agent" : "Add New Agent"}
          </h2>
          <p className="text-[#45464d] text-sm mb-5">
            Agents can login only after admin creates them.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                Agent Name
              </label>
              <input
                className="input-glass w-full rounded-lg px-4 py-3 mt-1"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="IT Agent"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                Email
              </label>
              <input
                className="input-glass w-full rounded-lg px-4 py-3 mt-1"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="agent@company.com"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                Password
              </label>
              <input
                className="input-glass w-full rounded-lg px-4 py-3 mt-1"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={editingAgentId ? "Leave empty to keep old password" : "agent123"}
                required={!editingAgentId}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                Request Type
              </label>
              <select
                className="input-glass w-full rounded-lg px-4 py-3 mt-1"
                name="request_type"
                value={formData.request_type}
                onChange={handleChange}
              >
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Facilities">Facilities</option>
              </select>
            </div>

            {editingAgentId && (
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-[#191c1d]">
                  Status
                </label>
                <select
                  className="input-glass w-full rounded-lg px-4 py-3 mt-1"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#09152e] text-white px-5 py-3 rounded-lg font-bold hover:bg-[#1f2a44]"
            >
              {editingAgentId ? "Update Agent" : "Create Agent"}
            </button>

            {editingAgentId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full border border-[#09152e]/20 text-[#09152e] px-5 py-3 rounded-lg font-bold hover:bg-[#09152e]/5"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </GlassCard>

        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-white/50 border-b border-[#09152e]/10">
                <tr>
                  <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Name</th>
                  <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Email</th>
                  <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Type</th>
                  <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Status</th>
                  <th className="text-left px-5 py-4 text-xs uppercase text-[#45464d]">Action</th>
                </tr>
              </thead>

              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.id} className="border-b border-[#09152e]/10 hover:bg-white/40">
                    <td className="px-5 py-4 font-bold text-[#09152e]">{agent.name}</td>
                    <td className="px-5 py-4 text-[#45464d]">{agent.email}</td>
                    <td className="px-5 py-4">
                      <span className="bg-[#d9e2ff] text-[#09152e] px-3 py-1 rounded-full text-xs font-bold">
                        {agent.request_type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          agent.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(agent)}
                        className="bg-[#09152e] text-white px-4 py-2 rounded-lg text-sm font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(agent.id)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-bold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {agents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-[#45464d]">
                      No agents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AgentManagementPage;