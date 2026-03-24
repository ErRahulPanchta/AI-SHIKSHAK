import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />   
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;