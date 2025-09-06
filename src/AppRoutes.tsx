import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login/Login";
import Homepage from "./pages/Homepage";
import NewsFeed from "./pages/Sharings/SharingFeed";
import ManageUsers from "./pages/Users/ManageUsers";
import ManageScan from "./pages/Scan/ManageScan";

export default function AppRoutes() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  if (isLoggedIn && (location.pathname === "/" || location.pathname === "/login")) {
    return <Navigate to="/homepage" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/homepage/*" element={<Homepage />}>
        <Route index element={<NewsFeed />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="manage-scan" element={<ManageScan />} />
      </Route>
      <Route path="*" element={<Navigate to={isLoggedIn ? "/homepage" : "/login"} replace />} />
    </Routes>
  );
}
