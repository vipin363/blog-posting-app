
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import BlogList from "./pages/BlogList";
import AddBlog from "./pages/AddBlog";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditBlog from "./pages/EditBlog";

function App() {
  return (
    <BrowserRouter>
     <Navbar />
     <ToastContainer
    position="top-right"
    autoClose={3000}
    theme="dark"
  />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
         <Route element={<ProtectedRoute />}>
          <Route path="/" element={<BlogList />} />
          <Route path="/add-blog" element={<AddBlog />} />
          <Route path="/edit-blog/:id" element={<EditBlog />} />       
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
