import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          At Our Company, we are committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, and safeguard your
          personal information when you use our website and services.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Information Collection
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          We collect personal information that you provide to us directly, such
          as when you register an account, make a purchase, or contact us. This
          information may include your name, email address, phone number, and
          other relevant details.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Cookies and Tracking Technologies
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Our website uses cookies to store your preferences and enhance your
          experience. We use cookies to remember your login information, so you
          don&apos;t have to re-enter it each time you visit our site. Cookies
          also help us analyze site traffic and usage patterns.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          We use cookies to store tokens for authentication purposes. These
          tokens are used to manage your session and ensure a secure login
          experience. The tokens are stored in your browser&apos;s cookies and
          are only accessible by our server.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Data Caching
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          To improve the performance of our services, we use caching mechanisms.
          For example, we use Node-Cache to store responses from Google APIs and
          other frequently accessed data. This helps reduce the time it takes to
          retrieve data and improves overall user experience.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Data Security
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          We implement various security measures to protect your personal
          information from unauthorized access, alteration, disclosure, or
          destruction. This includes using secure servers and encryption
          techniques to safeguard data in transit.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Your Choices
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          You have the option to accept or decline cookies. Most web browsers
          automatically accept cookies, but you can usually modify your browser
          settings to decline cookies if you prefer.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Changes to This Policy
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          We may update our Privacy Policy from time to time. Any changes will
          be posted on this page, and we encourage you to review this policy
          periodically to stay informed about how we are protecting your
          information.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Contact Us
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          If you have any questions or concerns about our Privacy Policy, please
          contact us at{" "}
          <a
            href="mailto:support@ourcompany.com"
            className="text-blue-600 hover:underline"
          >
            support@ourcompany.com
          </a>
          .
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
