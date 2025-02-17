import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../api";
import { loginStart, loginSuccess, loginFailure } from "../utils/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await axios.post("/auth/login", { email, password });
      dispatch(loginSuccess(response.data.user));
      navigate("/");
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="flex justify-center items-center text-center bg-green-500 border-none rounded-sm mt-2 p-[5px] cursor-pointer">
          <Link to={"/register"} className="text-white font-bold">
            <button>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
