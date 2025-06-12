import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

interface UploadProps {
  onUploadSuccess: () => void;
}

export function Upload({ onUploadSuccess }: UploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Step 1: Get upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Step 2: Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      
      if (!result.ok) {
        throw new Error("Upload failed");
      }
      
      const { storageId } = await result.json();
      
      // Step 3: Create post
      await createPost({
        imageId: storageId,
        caption: caption || undefined,
      });
      
      toast.success("Photo uploaded successfully!");
      setSelectedFile(null);
      setCaption("");
      onUploadSuccess();
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6">Upload a Photo</h2>
        
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-6xl mb-4">📸</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your image here or click to browse
            </p>
            <p className="text-gray-500">
              Supports JPG, PNG, GIF up to 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={() => setSelectedFile(null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption (optional)
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption for your photo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </div>
            
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Share Photo"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
