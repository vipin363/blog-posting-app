
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { getBlogById, updateBlog } from "../services/blogService";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blog = await getBlogById(id);

        // Check ownership
        if (blog.authorId !== user.uid) {
          toast.error("You cannot edit this blog");
          navigate("/");
          return;
        }

        setTitle(blog.title);
        setContent(blog.content);
      } catch (error) {
        console.error("Fetch blog error:", error);
        toast.error("Failed to load blog");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBlog();
    }
  }, [id, user, navigate]);

  if (loading) return <p>Loading blog...</p>;


const handleUpdate = async (e) => {
  e.preventDefault();

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  // Heading validation
  if (trimmedTitle.length < 4 || trimmedTitle.length > 40) {
    toast.error("Heading must be between 4 and 40 characters");
    return;
  }

  if (!/[a-zA-Z]/.test(trimmedTitle)) {
    toast.error("Heading cannot contain only numbers or symbols");
    return;
  }

  // Description validation
  const letterCount = (trimmedContent.match(/[a-zA-Z]/g) || []).length;

  if (letterCount < 10) {
    toast.error("Description must contain at least 10 letters");
    return;
  }

  try {
    setLoading(true);

    await updateBlog(
      id,
      {
        title: trimmedTitle,
        content: trimmedContent,
      },
      user.uid
    );

    toast.success("Blog updated successfully!");
    navigate("/");
  } catch (error) {
    console.error("Update blog error:", error);
    toast.error(error.message || "Failed to update blog");
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <h1>Edit Blog</h1>

     <form onSubmit={handleUpdate}>
  <div>
    <label>Blog Heading</label>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  </div>

  <div>
    <label>Blog Description</label>
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      rows="6"
    />
  </div>

  <button type="submit" disabled={loading}>
    {loading ? "Updating..." : "Update Blog"}
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

export default EditBlog;
