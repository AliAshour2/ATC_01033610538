import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/AppRoutes";
import store from "./app/store";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
