"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import { format } from "date-fns";
import BlogEditModal from "./BlodEditModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const BlogTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      const res = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/myblogs`
      );
      setBlogs(res?.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setIsEditing(true);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedBlog(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedBlog(null);
  };

  const handleUpdateSuccess = () => {
    fetchBlogs();
  };

  const openDeleteDialog = (blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;
    try {
      await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/${blogToDelete._id}`,
        "DELETE"
      );
      toast.success("Blog deleted successfully!");
      fetchBlogs();
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete blog");
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreateModal}>Create Blog</Button>
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableCaption>A list of your blog posts.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-right">Created At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog._id}>
                <TableCell>
                  <Image
                    src={blog.blogImage}
                    alt={blog.title}
                    width={100}
                    height={60}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell className="max-w-xs truncate">{blog.description}</TableCell>
                <TableCell>{blog.author?.email}</TableCell>
                <TableCell className="text-right">
                  {blog.createdAt
                    ? format(new Date(blog.createdAt), "yyyy-MM-dd")
                    : "-"}
                </TableCell>

                <TableCell className="text-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/blog/${blog._id}`)}
                    className="cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(blog)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openDeleteDialog(blog)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Total Blogs</TableCell>
              <TableCell className="text-center">{blogs.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <BlogEditModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        blog={selectedBlog}
        isEditing={isEditing}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogTable;
