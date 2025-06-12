import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { Stream } from "./Stream";
import { MyPhotos } from "./MyPhotos";
import { Upload } from "./Upload";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-primary">PhotoStream</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-4">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [activeTab, setActiveTab] = useState<"stream" | "my-photos" | "upload">("stream");

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Unauthenticated>
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome to PhotoStream</h1>
          <p className="text-xl text-secondary mb-8">Share your photos with the world</p>
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="mb-6">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("stream")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "stream"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Stream
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "upload"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setActiveTab("my-photos")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "my-photos"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              My Photos
            </button>
          </nav>
        </div>

        {activeTab === "stream" && <Stream />}
        {activeTab === "upload" && <Upload onUploadSuccess={() => setActiveTab("stream")} />}
        {activeTab === "my-photos" && <MyPhotos />}
      </Authenticated>
    </div>
  );
}
