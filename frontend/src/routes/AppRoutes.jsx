import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import CustomerLayout from "../layouts/CustomerLayout";
import AgentLayout from "../layouts/AgentLayout";
import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/customer/HomePage";
import CustomerLoginPage from "../pages/customer/CustomerLoginPage";
import RegisterPage from "../pages/customer/RegisterPage";
import TicketPage from "../pages/customer/TicketPage";

import AgentLoginPage from "../pages/agent/AgentLoginPage";
import AgentDashboardPage from "../pages/agent/AgentDashboardPage";
import AgentQueuePage from "../pages/agent/AgentQueuePage";
import AgentTicketChatPage from "../pages/agent/AgentTicketChatPage";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import AgentManagementPage from "../pages/admin/AgentManagementPage";
import FAQManagementPage from "../pages/admin/FAQManagementPage";
import KBManagementPage from "../pages/admin/KBManagementPage";
import TicketMonitoringPage from "../pages/admin/TicketMonitoringPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<CustomerLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute allowedRole="customer">
              <TicketPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/agent" element={<AgentLoginPage />} />

      <Route
        path="/agent"
        element={
          <ProtectedRoute allowedRole="agent">
            <AgentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AgentDashboardPage />} />
        <Route path="queue" element={<AgentQueuePage />} />
        <Route path="tickets/:ticketId" element={<AgentTicketChatPage />} />
      </Route>

      <Route path="/admin" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="agents" element={<AgentManagementPage />} />
        <Route path="faqs" element={<FAQManagementPage />} />
        <Route path="knowledge-base" element={<KBManagementPage />} />
        <Route path="tickets" element={<TicketMonitoringPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;