import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../pages/HomeLayout";
import ErrorPage from "../pages/ErrorPage";
import AboutPage from "../pages/AboutPage";
import PrivacyPage from "../pages/PrivacyPage";
import ContactPage from "../pages/ContactPage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import HomePage from "../pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "about-us", element: <AboutPage /> },
      { path: "privacy-policy", element: <PrivacyPage /> },
      { path: "contact-us", element: <ContactPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
    ],
  },
]);

export default router;
