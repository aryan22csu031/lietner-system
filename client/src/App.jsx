import { Routes, Route, BrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "./utils/authSlice";

function App() {
  const dispatch = useDispatch();
  const [auth, checkAuth] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/auth/check");
        console.log(response);

        if (response.data.user) {
          dispatch(loginSuccess(response.data.user));
          checkAuth(true);
        }
      } catch (error) {
        console.log("Not authenticated", error);
      }
    };

    checkLoginStatus();
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={checkAuth ? <Homepage /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
