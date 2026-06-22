import { Outlet } from "react-router-dom";
import CustomerNavbar from "../components/customer/CustomerNavbar";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7F4EE]">
      <CustomerNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;