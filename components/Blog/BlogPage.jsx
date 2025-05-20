"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const BlogDetails = ({ blogId }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const res = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/${blogId}`
      );
      setBlog(res?.data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-muted" />
      </div>
    );
  }

  if (!blog) {
    return <div className="text-center text-red-500 mt-10">Blog not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      <Image
        src={blog.blogImage}
        alt={blog.title}
        width={800}
        height={400}
        className="rounded-md object-cover"
      />
      <p className="text-gray-700">{blog.description}</p>
    </div>
  );
};

export default BlogDetails;
