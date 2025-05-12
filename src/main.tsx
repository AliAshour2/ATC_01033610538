import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import store from "./app/store.ts";

// import { createBrowserRouter, RouterProvider } from "react-router";

// const router = createBrowserRouter([
//   {
//     path: "/",
//   },
// ]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      {/* <RouterProvider router={router} /> */}
      <App />
    </Provider>
  </StrictMode>
);
