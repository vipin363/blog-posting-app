import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      formData.email.trim(),
      formData.password
    );

    console.log("Logged in user:", userCredential.user);

    toast.success("Login successful!");

    setFormData({
      email: "",
      password: ""
    });

  } catch (error) {
    console.error(error);

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      toast.error("Invalid email or password!");
    } else {
      toast.error(error.message);
    }
  }
};

  return (
    <div>
      <h1>Welcome Back</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Login
        </button>

      </form>
<ToastContainer position="top-right" />
    </div>

    
  );
}

export default Login;
