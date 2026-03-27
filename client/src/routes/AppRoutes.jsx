import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";
import RoleGuard from "../components/common/RoleGuard";

// Pages
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import BlogList from "../pages/blog/BlogList";
import BlogDetails from "../pages/blog/BlogDetails";
import CreateBlog from "../pages/blog/CreateBlog";
import EditBlog from "../pages/blog/EditBlog";
import MyBlogs from "../pages/dashboard/MyBlogs";
import AdminDashboard from "../pages/admin/AdminDashboard";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/blogs" element={<BlogList />} />
      <Route path="/blogs/:slug" element={<BlogDetails />} />

      {/* PROTECTED */}
      <Route
        path="/create-blog"
        element={
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-blog/:id"
        element={
          <ProtectedRoute>
            <EditBlog />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-blogs"
        element={
          <ProtectedRoute>
            <MyBlogs />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <RoleGuard role="admin">
            <AdminDashboard />
          </RoleGuard>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}