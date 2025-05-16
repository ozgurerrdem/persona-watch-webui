import { Layout } from "antd";
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";

const { Content } = Layout;

function Homepage() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") ?? "";

  useEffect(() => {
    if (!username) {
      navigate("/login");
    }
  }, [navigate, username]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Content style={{ padding: "2rem" }}>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default Homepage;
