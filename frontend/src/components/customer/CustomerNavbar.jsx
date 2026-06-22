import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../common/BrandLogo";
import { useAuth } from "../../context/AuthContext";

const CustomerNavbar = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
        <Link to="/">
          <BrandLogo title="SmartDesk" subtitle="Smart Service Portal" />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm font-semibold text-[#45464d] hover:text-[#09152e]"
          >
            Home
          </Link>

          {authUser?.role === "customer" && (
            <Link
              to="/tickets"
              className="text-sm font-semibold text-[#45464d] hover:text-[#09152e]"
            >
              My Tickets
            </Link>
          )}

          {!authUser ? (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-[#09152e]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-[#1F2A44] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-[#1f2a44]"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-[#09152e] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-[#1f2a44]"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavbar;