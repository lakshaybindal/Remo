import { useState } from "react";
import axios from "axios";

export default function ReadmeGenerator() {
  const [githubUrl, setGithubUrl] = useState("");
  const [readmeContent, setReadmeContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generateReadme = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setReadmeContent("");

    try {
      const response = await axios.post(
        "http://localhost:3000/user/repo",
        {
          repourl: githubUrl,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      // Extract the markdown content from the response
      const content = response.data.readme.replace(
        /markdown\n([\s\S]*?)/,
        "$1"
      );
      setReadmeContent(content);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to generate README"
          : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(readmeContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <title>README Generator</title>
      <meta
        name="description"
        content="Generate beautiful README files from GitHub URLs"
      />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-2">
            README Generator
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Generate professional README files automatically by just providing
            your GitHub repository URL
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={generateReadme} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="Enter GitHub repository URL..."
                className="flex-1 px-6 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Generating..." : "Generate README"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {readmeContent && (
            <div className="relative rounded-xl overflow-hidden border border-gray-700 shadow-xl">
              <div className="flex justify-between items-center bg-gray-800 px-6 py-3 border-b border-gray-700">
                <h3 className="font-medium text-gray-300">README.md</h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm text-gray-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-6 bg-gray-800 overflow-x-auto text-gray-200 font-mono text-sm">
                {readmeContent}
              </pre>
            </div>
          )}

          {!readmeContent && !isLoading && (
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
              <div className="max-w-md mx-auto">
                <svg
                  className="mx-auto h-12 w-12 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-400">
                  No README generated yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter a GitHub repository URL above to generate a beautiful
                  README
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <svg
                  className="h-12 w-12 text-purple-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="mt-4 text-gray-400">
                  Analyzing repository and generating README...
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
