import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { ProductDetail } from "./components/ProductDetail";
import { Contact } from "./components/Contact";
import { AuthProvider } from "./admin/authContext";
import { Login } from "./admin/Login";
import { ProtectedRoute } from "./admin/ProtectedRoute";
import { ProductsList } from "./admin/ProductsList";
import { ProductForm } from "./admin/ProductForm";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "product/:id", Component: ProductDetail },
      { path: "contact", Component: Contact },
    ],
  },
  {
    path: "/admin",
    Component: () => (
      <AuthProvider>
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <ProductsList />
            </div>
          </div>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: "/admin/products/new",
    Component: () => (
      <AuthProvider>
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <ProductForm />
            </div>
          </div>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: "/admin/products/:id/edit",
    Component: () => (
      <AuthProvider>
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <ProductForm />
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
