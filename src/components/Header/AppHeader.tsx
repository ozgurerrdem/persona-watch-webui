import { Layout, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";

const { Header } = Layout;

export default function AppHeader() {
  const navigate = useNavigate();

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e8e8e8",
        padding: "0 24px",
      }}
    >
      <div
        style={{ cursor: "pointer", fontWeight: 600, fontSize: "1.1rem" }}
        onClick={() => navigate("/homepage")}
      >
        PersonaWatch
      </div>

      <UserMenu />
    </Header>
  );
}
