import { useEffect, useState } from "react";
import GlassCard from "../../components/common/GlassCard";
import { getAdminUsers, updateUserStatus } from "../../api/adminApi";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data);
      setError("");
    } catch (err) {
      setError("Unable to load users");
    }
  };

  const handleStatusChange = async (userId, statusValue) => {
    try {
      await updateUserStatus(userId, statusValue);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to update user status");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#09152e]">
            User Management
          </h1>
          <p className="text-[#45464d] mt-1">
            View registered customers and manage their account status.
          </p>
        </div>

        <button
          onClick={loadUsers}
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
          <table className="w-full min-w-[900px]">
            <thead className="bg-white/50 border-b border-[#09152e]/10">
              <tr>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">ID</th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">Name</th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">Email</th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">Employee ID</th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">Department</th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">Status</th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-[#45464d]">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-[#45464d]">
                    No users found.
                  </td>
                </tr>
              )}

              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#09152e]/10 hover:bg-white/40">
                  <td className="px-5 py-4 font-bold text-[#09152e]">#{user.id}</td>
                  <td className="px-5 py-4 font-bold text-[#09152e]">{user.name}</td>
                  <td className="px-5 py-4 text-[#45464d]">{user.email}</td>
                  <td className="px-5 py-4 text-[#45464d]">{user.employee_id || "-"}</td>
                  <td className="px-5 py-4 text-[#45464d]">{user.department || "-"}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        handleStatusChange(
                          user.id,
                          user.status === "active" ? "inactive" : "active"
                        )
                      }
                      className="bg-[#09152e] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1f2a44]"
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
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

export default UserManagementPage;