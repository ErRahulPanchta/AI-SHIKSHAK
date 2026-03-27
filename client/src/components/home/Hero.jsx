import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-blue-50 py-16 px-6 text-center">

      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Learn. Write. Grow.
      </h1>

      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        AI SHIKSHAK is a platform to share knowledge, write blogs,
        and grow your learning journey with the community.
      </p>

      <div className="flex justify-center gap-4">

        <Link
          to="/blogs"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Explore Blogs
        </Link>

        <Link
          to="/create-blog"
          className="border border-blue-500 text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-100"
        >
          Start Writing
        </Link>

      </div>

    </section>
  );
};

export default Hero;