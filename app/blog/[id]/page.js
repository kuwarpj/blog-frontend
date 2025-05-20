import BlogDetails from "@/components/Blog/BlogPage";
import React from "react";

export default function Page({ params }) {
  const { id } = params;

  return <BlogDetails blogId={id} />;
}
