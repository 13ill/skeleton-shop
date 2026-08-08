import { RouterProvider } from "react-router";
import { router } from "./routes";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import { CategoriesProvider } from "./context/CategoriesContext";

export default function App() {
  return (
    <SiteSettingsProvider>
      <CategoriesProvider>
        <RouterProvider router={router} />
      </CategoriesProvider>
    </SiteSettingsProvider>
  );
}
