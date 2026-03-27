import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Layout;