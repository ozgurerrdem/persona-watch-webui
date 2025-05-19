import { useEffect, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal as AntModal, Table, Typography, Tag, message, Modal, Form, Input, Checkbox, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const { Title } = Typography;

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { isAdmin, username: currentUsername, logout } = useAuth();

  useEffect(() => {
    console.log("isAdmin:", isAdmin);
    console.log("currentUsername:", currentUsername);
    if (!isAdmin) {
      message.error("Bu sayfaya erişim yetkiniz yok.");
      navigate("/homepage");
    } else {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/all");

      const sortedUsers = [
        ...response.data.filter((u: User) => u.username === currentUsername),
        ...response.data.filter((u: User) => u.username !== currentUsername),
      ];

      setUsers(sortedUsers);
    } catch (error) {
      message.error("Kullanıcı listesi alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setIsNewUser(false);
    setEditingUser(user);
    setIsModalVisible(true);
    form.setFieldsValue({ ...user, password: "" });
  };

  const handleAdd = () => {
    setIsNewUser(true);
    setEditingUser(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleDelete = () => {
    if (!editingUser) return;

    AntModal.confirm({
      title: "Kullanıcıyı silmek istediğinize emin misiniz?",
      icon: <ExclamationCircleOutlined />,
      okText: "Evet",
      okType: "danger",
      cancelText: "İptal",
      async onOk() {
        try {
          await api.delete(`/user/${editingUser.id}`);
          message.success("Kullanıcı silindi.");

          if (editingUser.username === currentUsername) {
            message.info("Hesabınızı sildiniz, oturum sonlandırılıyor.");
            setTimeout(() => {
              logout();
              navigate("/login");
            }, 200);
            return;
          }

          setIsModalVisible(false);
          fetchUsers();
        } catch (error) {
          message.error("Kullanıcı silinemedi.");
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (isNewUser) {
        await api.post("/user", values);
        message.success("Kullanıcı oluşturuldu.");
      } else if (editingUser) {
        await api.put(`/user/${editingUser.id}`, values);
        message.success("Kullanıcı güncellendi.");

        if (editingUser.username === currentUsername) {
          message.info("Bilgileriniz güncellendi, lütfen tekrar giriş yapın.");
          setTimeout(() => {
            logout();
            navigate("/login");
          }, 200);
          return;
        }
      }

      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error("İşlem başarısız.");
    }
  };

  const columns = [
    {
      title: "Kullanıcı Adı",
      dataIndex: "username",
    },
    {
      title: "Ad",
      dataIndex: "firstName",
    },
    {
      title: "Soyad",
      dataIndex: "lastName",
    },
    {
      title: "Yetki",
      dataIndex: "isAdmin",
      render: (isAdmin: boolean) =>
        isAdmin ? <Tag color="red">Admin</Tag> : <Tag color="blue">Kullanıcı</Tag>,
    },
    {
      title: "",
      width: 50,
      align: "right" as const,
      render: (_: any, record: User) =>
        record.username !== "admin" ? (
          <Button
            icon={<EditOutlined />}
            size="small"
            type="text"
            onClick={() => handleEdit(record)}
          />
        ) : null,
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Title level={3}>Kullanıcıları Yönet</Title>
        <Button type="primary" onClick={handleAdd}>
          Kullanıcı Ekle
        </Button>
      </div>

      <Table
        dataSource={users}
        rowKey="id"
        columns={columns}
        loading={loading}
        bordered
      />

      <Modal
        title={isNewUser ? "Yeni Kullanıcı Ekle" : "Kullanıcıyı Düzenle"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          !isNewUser && (
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              İptal
            </Button>
          ),
          !isNewUser && (
            <Button key="delete" danger onClick={handleDelete}>
              Sil
            </Button>
          ),
          <Button key="submit" type="primary" onClick={handleSave}>
            Kaydet
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Kullanıcı Adı"
            name="username"
            rules={[{ required: true, message: "Kullanıcı adı zorunlu" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ad"
            name="firstName"
            rules={[{ required: true, message: "Ad zorunlu" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Soyad"
            name="lastName"
            rules={[{ required: true, message: "Soyad zorunlu" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Şifre"
            name="password"
            rules={isNewUser ? [{ required: true, message: "Şifre zorunlu" }] : []}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="isAdmin" valuePropName="checked">
            <Checkbox>Yönetici</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageUsers;
