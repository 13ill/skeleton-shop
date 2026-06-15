import { RouterProvider } from "react-router";
import { router } from "./routes";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";

export default function App() {
  return (
    <SiteSettingsProvider>
      <RouterProvider router={router} />
    </SiteSettingsProvider>
  );
}
