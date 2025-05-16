import { Button, Dropdown, Menu, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") ?? "";
  const fullname = localStorage.getItem("fullname") ?? username;
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const capitalizeName = (name: string) =>
    name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");

  const handleLogout = () => {
    localStorage.clear();
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
        <Typography.Text strong>Merhaba, {capitalizeName(fullname)}</Typography.Text> <DownOutlined />
      </Button>
    </Dropdown>
  );
}
