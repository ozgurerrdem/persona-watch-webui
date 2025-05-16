import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useState } from "react";

const { Title } = Typography;

function Login() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);

            const response = await api.post("/user/login", values);

            localStorage.setItem("username", response.data.username);
            localStorage.setItem("fullname", `${response.data.firstName} ${response.data.lastName}`);
            localStorage.setItem("isAdmin", response.data.isAdmin);
            navigate("/homepage");
        } catch (err: any) {
            const errorMessage =
                err.response?.data && typeof err.response.data === "string"
                    ? err.response.data
                    : "Giriş başarısız";

            // Bildirimi düzgün göstermek için küçük gecikme (render çakışmalarını önler)
            setTimeout(() => {
                message.error(errorMessage);
            }, 100);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
            }}
        >
            <Card
                title={<Title level={3}>Giriş Yap</Title>}
                bordered={false}
                style={{
                    width: 400,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "#fff",
                }}
            >
                <Form
                    form={form}
                    name="login-form"
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        label="Kullanıcı Adı"
                        rules={[{ required: true, message: "Kullanıcı adı zorunludur" }]}
                    >
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Şifre"
                        rules={[{ required: true, message: "Şifre zorunludur" }]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Giriş Yap
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default Login;
