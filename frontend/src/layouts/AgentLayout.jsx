import { Outlet } from "react-router-dom";
import AgentSidebar from "../components/agent/AgentSidebar";

const AgentLayout = () => {
  return (
    <div className="min-h-screen page-bg flex">
      <AgentSidebar />
      <main className="md:ml-[280px] w-full min-h-screen h-screen overflow-hidden p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AgentLayout;