import { createBrowserRouter } from "react-router-dom";

// Import your components
import HomeLayout from "../pages/HomeLayout";
import ErrorPage from "../pages/ErrorPage";
import AboutPage from "../pages/AboutPage";
import PrivacyPage from "../pages/PrivacyPage";
import ContactPage from "../pages/ContactPage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import HomePage from "../pages/HomePage";

// Import your protected routes
import RedirectAuthUser from "../features/auth/RedirectAuthUser";
import VerifyEmailPage from "../pages/VerifyEmailPage";

// Define your routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "about-us",
        element: <AboutPage />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPage />,
      },
      {
        path: "contact-us",
        element: <ContactPage />,
      },
      {
        path: "login",
        element: (
          <RedirectAuthUser>
            <LoginPage />
          </RedirectAuthUser>
        ),
      },
      {
        path: "signup",
        element: (
          <RedirectAuthUser>
            <SignUpPage />
          </RedirectAuthUser>
        ),
      },
      {
        path: "verify-email",
        element: (
          <RedirectAuthUser>
            <VerifyEmailPage />
          </RedirectAuthUser>
        ),
      },
    ],
  },
]);

export default router;
