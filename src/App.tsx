import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import ManageUsers from "./pages/ManageUsers";
import { Layout } from "antd";
import NewsFeed from "./pages/NewsFeed";

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout>
        <Content
          style={{
            paddingLeft: "10%",
            paddingRight: "10%",
            minHeight: "100vh",
            backgroundColor: "#f5f5f5",
          }}
        >
          <AppRoutes />
        </Content>
      </Layout>
    </Router>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("username");

  if ((location.pathname === "/" || location.pathname === "/login") && isLoggedIn) {
    return <Navigate to="/homepage" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/homepage/*" element={<Homepage />}>
        <Route index element={<NewsFeed />} />
        <Route path="manage-users" element={<ManageUsers />} />
      </Route>
    </Routes>
  );
}

export default App;
