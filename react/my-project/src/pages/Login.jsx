import { useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const getWether = async () => {
    const response = await axiosInstance.get(
        "/WeatherForecast"
      );
    console.log(response);
  }
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "/login", // change to your API
        {
          email: email,
          password: password
        }
      );

      const data = response.data;

      // store tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      setMessage("Login successful!");

      // console.log("Access Token:", data.accessToken);
      // console.log("Refresh Token:", data.refreshToken);

    } catch (error) {
      console.error(error);
      setMessage("Login failed");
    }
  };

  return (
    <>
    <button onClick={getWether}>
          get wether
        </button>
    <div style={styles.container}>

      <form onSubmit={handleLogin} style={styles.form}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>
        
        <p>{message}</p>
        
      </form>

    </div>
    </>
  );
}

const styles = {

  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f4f4"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  input: {
    marginBottom: "15px",
    padding: "10px",
    fontSize: "16px"
  },

  button: {
    padding: "10px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};