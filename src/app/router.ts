import { createBrowserRouter } from "react-router";
import HomePage from "../routes/HomePage";
import NotFoundPage from "../routes/NotFoundPage";
import RootLayout from "./RootLayout";
import RouteErrorBoundary from "./RouteErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        // A pathless route, so a page that crashes shows its error inside the layout.
        ErrorBoundary: RouteErrorBoundary,
        // On a first visit to a lazy page, the layout (navbar, skip link) shows while the page's code loads.
        HydrateFallback: () => null,
        children: [
          { index: true, Component: HomePage },
          {
            path: "discography",
            lazy: {
              Component: async () =>
                (await import("../routes/DiscographyPage")).default,
            },
          },
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
]);
