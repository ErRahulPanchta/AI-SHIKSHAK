import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/layout/Layout";

function App() {
  const { fetchUser, loading } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
}

export default App;