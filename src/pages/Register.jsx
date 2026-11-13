
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };


const validateForm = () => {

  const nameRegex = /^[A-Za-z ]+$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Name validation
  if (!nameRegex.test(formData.name.trim())) {
    toast.error("Name must contain only letters and spaces");
    return false;
  }

  // Email validation
  if (!emailRegex.test(formData.email.trim())) {
    toast.error("Please enter a valid email");
    return false;
  }

  // Password validation
  if (!passwordRegex.test(formData.password)) {
    toast.error(
      "Password must contain 8 characters, uppercase, lowercase, number and special character"
    );
    return false;
  }

  // Confirm password validation
  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  return true;
};


  const handleSubmit = async (e) => {
    e.preventDefault();

         if (!validateForm()) {
    return;
  }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      toast.success("Registration successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

    }catch (error) {
  if (error.code === "auth/email-already-in-use") {
    toast.error("Email already registered!");
  } else {
    toast.error(error.message);
  }

  console.error(error);
}
  };

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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

        <input
  type="password"
  name="confirmPassword"
  placeholder="Confirm Password"
  value={formData.confirmPassword}
  onChange={handleChange}
  required
/>

        <button type="submit">
          Register
        </button>
      </form>

      <ToastContainer position="top-right" />
    </div>
  );
}

export default Register;
