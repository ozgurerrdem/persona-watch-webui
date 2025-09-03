import { Button, Dropdown, Menu, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function UserMenu() {
  const navigate = useNavigate();
  const { username, fullName, isAdmin, logout } = useAuth();
  const displayName = fullName || username || "";

  const capitalizeName = (name: string) =>
    name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "homepage",
      label: "Anasayfa",
      onClick: () => navigate("/homepage"),
    },
    ...(isAdmin
      ? [
          {
            key: "manage-users",
            label: "Kullanıcıları Yönet",
            onClick: () => navigate("/homepage/manage-users"),
          },
        ]
      : []),
    {
      key: "logout",
      label: "Çıkış Yap",
      onClick: handleLogout,
    },
  ];

  const menu = <Menu items={menuItems} />;

  return (
    <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
      <Button type="text">
        <Typography.Text strong>Merhaba, {capitalizeName(displayName)}</Typography.Text> <DownOutlined />
      </Button>
    </Dropdown>
  );
}
