import { useLocation } from "react-router-dom";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import H6 from "@material-tailwind/react/Heading6";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getAdminType } from "./AdminTypes";

export default function AdminNavbarWithSidebar() {
  const location = useLocation().pathname;
  const [showSidebar, setShowSidebar] = useState("-left-64");
  var admin_type = getAdminType();

  function renderAdmin(param) {
    switch (param) {
      case "0":
        return "Admin";
      case "1":
        return "Faculty";
      default:
        return "Staff";
    }
  }

  return (
    <>
      <AdminNavbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div
        className={`h-screen fixed top-0 md:left-0 ${showSidebar} overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white w-64 z-10 py-4 px-6 transition-all duration-300`}
      >
        <div className="flex-col items-stretch min-h-full flex-nowrap px-0 relative">
          <p className="mt-2 text-center w-full inline-block">
            <H6 color="gray">{renderAdmin(admin_type)} Portal</H6>
          </p>
          <div className="flex flex-col">
            <hr className="my-4 min-w-full" />

            <ul className="flex-col min-w-full flex list-none">
              
              {admin_type === "0" && (
                <li className="rounded-lg mb-2 text-gray-700">
                  <NavLink
                    to="/admin/manage-admins"
                    exact="true"
                    className={
                      location !== "/admin/manage-admins"
                        ? "flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                        : "flex items-center gap-4 text-sm font-light px-4 py-3 rounded-lg bg-gradient-to-tr from-[#000000] to-[#090909] text-white shadow-md"
                    }
                  >
                    <AdminPanelSettingsIcon size="2xl" />
                    Admins
                  </NavLink>
                </li>
              )}

              <li className="rounded-lg mb-2 text-gray-700">
                <NavLink
                  to="/admin/profile"
                  exact="true"
                  className={
                    location !== "/admin/profile"
                      ? "flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                      : "flex items-center gap-4 text-sm font-light px-4 py-3 rounded-lg bg-gradient-to-tr from-[#000000] to-[#090909] text-white shadow-md"
                  }
                >
                  <AccountCircleIcon size="2xl" />
                  Profile
                </NavLink>
              </li>

              <li className="rounded-lg mb-2 text-gray-700">
                <NavLink
                  to="/admin/complaints"
                  exact="true"
                  className={
                    location !== "/admin/complaints"
                      ? "flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                      : "flex items-center gap-4 text-sm font-light px-4 py-3 rounded-lg bg-gradient-to-tr from-[#000000] to-[#090909] text-white shadow-md"
                  }
                >
                  <AccountCircleIcon size="2xl" />
                  Complaints
                </NavLink>
              </li>

              <li className="rounded-lg mb-2 text-gray-700">
                <NavLink
                  to="/admin/solvedcomplaints"
                  exact="true"
                  className={
                    location !== "/admin/solvedcomplaints"
                      ? "flex items-center gap-4 text-sm text-gray-700 font-light px-4 py-3 rounded-lg"
                      : "flex items-center gap-4 text-sm font-light px-4 py-3 rounded-lg bg-gradient-to-tr from-[#000000] to-[#090909] text-white shadow-md"
                  }
                >
                  <AccountCircleIcon size="2xl" />
                  Solved Complaints
                </NavLink>
              </li>
              
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}