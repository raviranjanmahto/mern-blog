import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>
        <p className="text-lg text-gray-700 mb-6">
          Welcome to Our Company! We are dedicated to providing high-quality
          products and exceptional customer service. Our team is passionate
          about innovation and committed to making a positive impact in our
          industry.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Our Mission
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Our mission is to deliver innovative solutions that meet the needs of
          our customers. We strive to create value through continuous
          improvement and a customer-centric approach. Our goal is to exceed
          your expectations and build long-lasting relationships.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Our Values
        </h2>
        <ul className="list-disc list-inside text-lg text-gray-700 mb-6">
          <li>
            Integrity: We operate with honesty and transparency in all our
            dealings.
          </li>
          <li>
            Excellence: We are committed to delivering the highest quality
            products and services.
          </li>
          <li>
            Innovation: We embrace new ideas and technologies to drive progress.
          </li>
          <li>
            Customer Focus: We prioritize the needs and satisfaction of our
            customers.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
        <p className="text-lg text-gray-700 mb-6">
          Our team consists of talented professionals who are experts in their
          respective fields. Together, we work towards achieving our vision and
          delivering outstanding results for our clients. Meet our dedicated
          team members who make it all possible.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Contact Us
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          We’d love to hear from you! If you have any questions or would like to
          learn more about our services, please{" "}
          <a
            href="mailto:contact@ourcompany.com"
            className="text-blue-600 hover:underline"
          >
            email us
          </a>{" "}
          or visit our{" "}
          <Link to="/contact-us" className="text-blue-600 hover:underline">
            Contact Page
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default About;
