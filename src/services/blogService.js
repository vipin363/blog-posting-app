
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  addDoc,
  serverTimestamp,
   doc,
  getDoc,
   updateDoc,
  deleteDoc
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

// Fetch logged-in user's blogs
export const getBlogs = async (userId) => {
  const blogsRef = collection(db, "blogs");

  const q = query(
    blogsRef,
    where("authorId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Add new blog
export const addBlog = async (blogData, userId) => {
  const blogsRef = collection(db, "blogs");

  // Check duplicate heading for the same user
  const q = query(
    blogsRef,
    where("authorId", "==", userId)
  );

  const snapshot = await getDocs(q);

  const isDuplicate = snapshot.docs.some((doc) => {
    return (
      doc.data().title.trim().toLowerCase() ===
      blogData.title.trim().toLowerCase()
    );
  });

  if (isDuplicate) {
    throw new Error("A blog with this heading already exists");
  }

  const docRef = await addDoc(blogsRef, {
    title: blogData.title.trim(),
    content: blogData.content.trim(),
    authorId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

export const getBlogById = async (blogId) => {
  const blogRef = doc(db, "blogs", blogId);

  const snapshot = await getDoc(blogRef);

  if (!snapshot.exists()) {
    throw new Error("Blog not found");
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};





export const updateBlog = async (blogId, blogData, userId) => {
  const blogRef = doc(db, "blogs", blogId);

  const snapshot = await getDoc(blogRef);

  if (!snapshot.exists()) {
    throw new Error("Blog not found");
  }

  // Check blog ownership
  if (snapshot.data().authorId !== userId) {
    throw new Error("You are not allowed to edit this blog");
  }

  // Check duplicate heading
  const q = query(
    collection(db, "blogs"),
    where("authorId", "==", userId)
  );

  const blogsSnapshot = await getDocs(q);

  const isDuplicate = blogsSnapshot.docs.some((blog) => {
    return (
      blog.id !== blogId &&
      blog.data().title.trim().toLowerCase() ===
        blogData.title.trim().toLowerCase()
    );
  });

  if (isDuplicate) {
    throw new Error("A blog with this heading already exists");
  }

  // Update blog
  await updateDoc(blogRef, {
    title: blogData.title.trim(),
    content: blogData.content.trim(),
    updatedAt: serverTimestamp(),
  });
};


// Delete blog
export const deleteBlog = async (blogId, userId) => {
  const blogRef = doc(db, "blogs", blogId);

  // Get the blog
  const snapshot = await getDoc(blogRef);

  if (!snapshot.exists()) {
    throw new Error("Blog not found");
  }

  // Check blog ownership
  if (snapshot.data().authorId !== userId) {
    throw new Error("You are not allowed to delete this blog");
  }

  // Delete the blog
  await deleteDoc(blogRef);
};