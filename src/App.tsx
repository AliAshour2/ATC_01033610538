import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/AppRoutes";
import store from "./app/store";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AppRoutes />
        <Toaster />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
