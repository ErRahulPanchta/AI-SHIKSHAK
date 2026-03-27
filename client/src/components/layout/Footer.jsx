const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10 py-6 text-center text-sm text-gray-500">

      <p>
        © {new Date().getFullYear()} AI SHIKSHAK. All rights reserved.
      </p>

      <p className="mt-1">
        Built with MERN 🚀
      </p>

    </footer>
  );
};

export default Footer;