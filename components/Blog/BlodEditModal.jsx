"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";
import { Loader2 } from "lucide-react";

const BlogEditModal = ({ isOpen, onClose, blog, onUpdateSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    blogImage: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(blog);

  useEffect(() => {
    if (blog) {
      setForm({
        title: blog.title || "",
        description: blog.description || "",
        blogImage: blog.blogImage || "",
      });
      setImagePreview(blog.blogImage || "");
      setImageFile(null);
    } else {
      setForm({ title: "", description: "", blogImage: "" });
      setImageFile(null);
      setImagePreview("");
    }
  }, [blog]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);

      if (imageFile) {
        formData.append("blogImage", imageFile);
      } else if (isEdit) {
        formData.append("blogImage", form.blogImage);
      }

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/${blog._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/createblog`;

      await apiClient(url, method, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        isEdit ? "Blog updated successfully!" : "Blog created successfully!"
      );
      onUpdateSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Blog" : "Create Blog"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Make changes to your blog post and save."
              : "Fill in the details to create a new blog post."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="cursor-pointer"
          />
          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="cursor-pointer"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-lg w-full h-40 object-cover"
            />
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Blog"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlogEditModal;
