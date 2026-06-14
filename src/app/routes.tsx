import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { ProductDetail } from "./components/ProductDetail";
import { AuthProvider } from "./admin/authContext";
import { Login } from "./admin/Login";
import { ProtectedRoute } from "./admin/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "product/:id", Component: ProductDetail },
    ],
  },
  {
    path: "/admin",
    Component: () => (
      <AuthProvider>
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome to the admin panel. Select an option from the menu.</p>
            </div>
          </div>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: "/admin/login",
    Component: () => (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
  },
]);
