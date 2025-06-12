import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function Stream() {
  const posts = useQuery(api.posts.getStream);
  const toggleLike = useMutation(api.posts.toggleLike);

  const handleLike = async (postId: string) => {
    try {
      await toggleLike({ postId: postId as any });
    } catch (error) {
      toast.error("Failed to update like");
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
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">No photos yet</h2>
        <p className="text-gray-500">Be the first to share a photo!</p>
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
              <span className="text-sm font-medium text-gray-900">
                {post.user?.name || post.user?.email || "Anonymous"}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(post._creationTime).toLocaleDateString()}
              </span>
            </div>
            {post.caption && (
              <p className="text-gray-700 text-sm mb-3">{post.caption}</p>
            )}
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleLike(post._id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  post.isLiked
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{post.isLiked ? "❤️" : "🤍"}</span>
                <span>{post.likeCount}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
