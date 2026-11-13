
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { addBlog } from "../services/blogService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddBlog() {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  
const handleSubmit = async (e) => {
  e.preventDefault();

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  // 1. Empty validation
  if (!trimmedTitle || !trimmedContent) {
    toast.error("Please fill all fields");
    return;
  }

  // Minimum 4 characters
if (trimmedTitle.length < 4) {
  toast.error("Heading must contain at least 4 characters");
  return;
}

  // 2. Heading maximum 40 characters
  if (trimmedTitle.length > 40) {
    toast.error("Heading must not exceed 40 characters");
    return;
  }

  // 3. Heading must contain at least one alphabet
  if (!/[a-zA-Z]/.test(trimmedTitle)) {
    toast.error("Heading cannot contain only numbers or symbols");
    return;
  }

  // 4. Description must contain minimum 10 letters
  const letterCount = (trimmedContent.match(/[a-zA-Z]/g) || []).length;

  if (letterCount < 10) {
    toast.error("Description must contain at least 10 letters");
    return;
  }

  try {
    setLoading(true);

    await addBlog(
      {
        title: trimmedTitle,
        content: trimmedContent,
      },
      user.uid
    );

    toast.success("Blog added successfully!");

    setTitle("");
    setContent("");

    navigate("/");
  } catch (error) {
    console.error("Add blog error:", error);

    if (error.message === "A blog with this heading already exists") {
      toast.error("This heading already exists!");
    } else {
      toast.error("Failed to add blog");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <h1>Add New Blog</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Blog Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
          />
        </div>

        <div>
          <label>Blog Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog..."
            rows="6"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Blog"}
        </button>
        <button
  type="button"
  onClick={() => navigate("/")}
>
  Cancel
</button>
      </form>
    </div>
  );
}

export default AddBlog;
