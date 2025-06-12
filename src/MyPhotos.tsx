import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function MyPhotos() {
  const posts = useQuery(api.posts.getMyPosts);
  const deletePost = useMutation(api.posts.deletePost);

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) {
      return;
    }
    
    try {
      await deletePost({ postId: postId as any });
      toast.success("Photo deleted successfully");
    } catch (error) {
      toast.error("Failed to delete photo");
    }
  };

  if (posts === undefined) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">No photos uploaded</h2>
        <p className="text-gray-500">Upload your first photo to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <img
            src={post.imageUrl || ""}
            alt={post.caption || "Photo"}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">
                {new Date(post._creationTime).toLocaleDateString()}
              </span>
              <span className="text-sm text-gray-600">
                {post.likeCount} {post.likeCount === 1 ? "like" : "likes"}
              </span>
            </div>
            {post.caption && (
              <p className="text-gray-700 text-sm mb-3">{post.caption}</p>
            )}
            <button
              onClick={() => handleDelete(post._id)}
              className="w-full px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
            >
              Delete Photo
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
