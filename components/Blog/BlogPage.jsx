"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Send, CornerDownLeft } from "lucide-react";

import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CommentItem = ({ comment, onReplyClick, replyingToId, setReplyingToId, level = 0 }) => (
  <div className={`pl-${level * 6}  border-gray-200 mb-4`}>
    <Card>
      <CardContent>
        <div className="flex items-center space-x-2 mb-1">
          <div className="font-semibold">{comment?.author?.email}</div>
        </div>
        <p className="mb-2 whitespace-pre-wrap">{comment?.content}</p>
        <button
          onClick={() => setReplyingToId(comment._id)}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          <CornerDownLeft size={16} /> Reply
        </button>

        {comment.replies?.map((reply) => (
          <CommentItem
            key={reply._id}
            comment={reply}
            onReplyClick={onReplyClick}
            replyingToId={replyingToId}
            setReplyingToId={setReplyingToId}
            level={level + 1}
          />
        ))}
      </CardContent>
    </Card>
  </div>
);

const BlogPage = ({ blogId }) => {
  const [blog, setBlog] = useState(null);
  const [loadingBlog, setLoadingBlog] = useState(true);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [replyingToId, setReplyingToId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchBlog = async () => {
    try {
      const res = await apiClient(`/api/v1/blog/${blogId}`);
      setBlog(res?.data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch blog");
    } finally {
      setLoadingBlog(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await apiClient(`/api/v1/comments/${blogId}`);
      setComments(res?.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch comments");
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    setSubmitting(true);
    try {
      await apiClient("/api/v1/comments/createcomment", "POST", {
        blogId,
        content: newComment,
        parentComment: replyingToId,
      });
      setNewComment("");
      setReplyingToId(null);
      toast.success("Comment posted");
      fetchComments();
    } catch (error) {
      toast.error(error.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingBlog) {
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
        className="rounded-md object-cover border"
      />
      <p className="text-gray-700 whitespace-pre-wrap">{blog.description}</p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>

        {loadingComments ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin h-6 w-6 text-muted" />
          </div>
        ) : (
          <>
            {comments.length === 0 && (
              <p className="text-gray-500 mb-4">No comments yet. Be the first..</p>
            )}

            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                replyingToId={replyingToId}
                setReplyingToId={setReplyingToId}
              />
            ))}
          </>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-2">
          {replyingToId && (
            <div className="text-sm text-blue-600 flex items-center gap-2">
              Replying to comment{" "}
              <button
                type="button"
                onClick={() => setReplyingToId(null)}
                className="underline hover:text-blue-800"
              >
                (cancel)
              </button>
            </div>
          )}
          <Label htmlFor="comment">Your Comment</Label>
          <Textarea
            id="comment"
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyingToId ? "Write your reply..." : "Write a comment..."}
          />
          <Button type="submit" disabled={submitting} className="flex items-center gap-2">
            {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Send size={16} />}
            {replyingToId ? "Reply" : "Comment"}
          </Button>
        </form>
      </section>
    </div>
  );
};

export default BlogPage;
