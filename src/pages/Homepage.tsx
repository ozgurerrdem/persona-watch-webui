import { Button, Dropdown, Layout, Typography, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const { Header, Content } = Layout;
const { Text } = Typography;

function Homepage() {
    const navigate = useNavigate();

    const username = localStorage.getItem("username") ?? "";
    const fullname = localStorage.getItem("fullname") ?? username;
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    useEffect(() => {
        if (!username) {
            navigate("/login");
        }
    }, [navigate, username]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const capitalizeName = (name: string) =>
        name
            .split(" ")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(" ");

    const menuItems = [
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
        <Layout style={{ minHeight: "100vh" }}>
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

                <div style={{ cursor: "pointer", fontWeight: 600, fontSize: "1.1rem" }} onClick={() => navigate("/homepage")}>
                    PersonaWatch
                </div>

                <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
                    <Button type="text">
                        <Text strong>Merhaba, {capitalizeName(fullname)}</Text> <DownOutlined />
                    </Button>
                </Dropdown>
            </Header>

            <Content style={{ padding: "2rem" }}>
                <Outlet />
            </Content>
        </Layout>
    );
}

export default Homepage;
