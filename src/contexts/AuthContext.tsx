import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

type AuthContextType = {
  isLoggedIn: boolean;
  username: string | null;
  fullName: string | null;
  isAdmin: boolean;
  login: (data: {
    token: string;
    username: string;
    fullName: string;
    isAdmin: boolean;
  }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedFullName = localStorage.getItem("fullname");
    const storedIsAdmin = localStorage.getItem("isAdmin") === "true";

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setFullName(storedFullName);
      setIsAdmin(storedIsAdmin);

      api.get("/user/validate")
        .then((res) => {
          if (res.data !== true) {
            handleLogout();
          }
        })
        .catch(() => {
          handleLogout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername(null);
    setFullName(null);
    setIsAdmin(false);
    navigate("/login");
  };

  const login = (data: {
    token: string;
    username: string;
    fullName: string;
    isAdmin: boolean;
  }) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("fullname", data.fullName);
    localStorage.setItem("isAdmin", String(data.isAdmin));

    setIsLoggedIn(true);
    setUsername(data.username);
    setFullName(data.fullName);
    setIsAdmin(data.isAdmin);
  };

  const logout = () => {
    handleLogout();
  };

  if (isLoading) return null;

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, username, fullName, isAdmin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
