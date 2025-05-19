import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "antd";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./AppRoutes";

const { Content } = Layout;

function App() {
  return (
    <Router>
      <AuthProvider>
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
      </AuthProvider>
    </Router>
  );
}

export default App;
