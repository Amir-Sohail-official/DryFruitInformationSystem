// import React from "react";
// import { useAuth } from "../AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function DashboardNavbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/signin");
//   };

//   const goToHome = () => {
//     navigate("/admin/dashboard");
//   };

//   return (
//     <nav className="navbar navbar-expand-lg fixed-top admin-navbar">
//       <div className="container-fluid d-flex align-items-center justify-content-between">
//         <div className="d-flex align-items-center gap-2">
//           <button
//             className="navbar-toggler border-0 me-2"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#dashboardSidebar"
//             aria-controls="dashboardSidebar"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="22"
//               height="22"
//               fill="currentColor"
//               className="bi bi-list"
//               viewBox="0 0 16 16"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4
//                  a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4
//                  a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
//               />
//             </svg>
//           </button>

//           <span
//             onClick={goToHome}
//             className="navbar-brand d-flex align-items-center gap-2 mb-0"
//             style={{ cursor: "pointer" }}
//           >
//             <span className="brand-text">🏠 DryFruitFinder</span>
//           </span>
//         </div>

//         {/* Welcome Text */}
//         <div className="flex-grow-1 text-center d-none d-md-block">
//           <span className="welcome-text">
//             Welcome to Dashboard
//             {user?.firstName ? `, ${user.firstName}` : ""}
//           </span>
//         </div>

//         <button
//           onClick={handleLogout}
//           className="btn btn-sm btn-logout rounded-pill px-3 py-1 d-flex align-items-center gap-2"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="16"
//             height="16"
//             fill="currentColor"
//             className="bi bi-power"
//             viewBox="0 0 16 16"
//           >
//             <path d="M7.5 1v7h1V1z" />
//             <path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812" />
//           </svg>
//           <span className="d-none d-sm-inline">Logout</span>
//         </button>
//       </div>
//     </nav>
//   );
// }
import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const goToHome = () => {
    navigate("/admin/dashboard");
  };

  const goToProfile = () => {
    navigate("/admin/dashboard/profile");
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top admin-navbar">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Left side: brand and sidebar toggle */}
        <div className="d-flex align-items-center gap-2">
          <button
            className="navbar-toggler border-0 me-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#dashboardSidebar"
            aria-controls="dashboardSidebar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4
                 a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4
                 a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </button>

          <span
            onClick={goToHome}
            className="navbar-brand d-flex align-items-center gap-2 mb-0"
            style={{ cursor: "pointer" }}
          >
            <span className="brand-text">🏠 DryFruitFinder</span>
          </span>
        </div>

        {/* Middle: welcome text */}
        <div className="flex-grow-1 text-center d-none d-md-block">
          <span className="welcome-text">
            Welcome to Dashboard
            {user?.firstName ? `, ${user.firstName}` : ""}
          </span>
        </div>

        {/* Right side: Profile + Logout */}
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={goToProfile}
            className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 d-flex align-items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 10a2 2 0 1 0-6 0 2 2 0 0 0 6 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 1 0 0 14A7 7 0 0 0 8 1z"
              />
            </svg>
            <span className="d-none d-sm-inline">Profile</span>
          </button>

          <button
            onClick={handleLogout}
            className="btn btn-sm btn-logout rounded-pill px-3 py-1 d-flex align-items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-power"
              viewBox="0 0 16 16"
            >
              <path d="M7.5 1v7h1V1z" />
              <path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812" />
            </svg>
            <span className="d-none d-sm-inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
