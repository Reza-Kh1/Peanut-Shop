import { useRoutes } from "react-router-dom";
import routes from "./routes/routes";
import axios from "axios";
import "./index.css";
import { Toaster } from "react-hot-toast";
axios.defaults.baseURL = import.meta.env.VITE_PUBLIC_URL_API;
axios.defaults.withCredentials = true;
function App() {
  const route = useRoutes(routes);
  return (
    <>
      {route}
      <Toaster reverseOrder={true} />
    </>
  );
}

export default App;
