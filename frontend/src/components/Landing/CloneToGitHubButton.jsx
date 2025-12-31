// src/components/CloneToGitHubButton.jsx
import { useState, useEffect } from 'react';
import { authAPI, githubAPI } from '../services/api';

export const CloneToGitHubButton = ({ projectId, projectName, projectDescription }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [formData, setFormData] = useState({
    repo_name: projectName || '',
    description: projectDescription || '',
    private: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    checkGitHubStatus();
  }, []);

  const checkGitHubStatus = async () => {
    try {
      const status = await authAPI.getGitHubStatus();
      setGithubConnected(status.connected);
      setGithubUsername(status.github_username);
    } catch (err) {
      console.error('Failed to check GitHub status:', err);
    }
  };

  const handleConnectGitHub = async () => {
    try {
      const config = await authAPI.getGitHubConfig();
      window.location.href = config.authorization_url;
    } catch (err) {
      setError('Failed to connect to GitHub');
    }
  };

  const handleClone = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await githubAPI.cloneToGitHub(projectId, formData);
      
      setSuccess({
        message: 'Project cloned successfully!',
        url: result.repository.url,
        repoName: result.repository.full_name,
      });

      // Close modal after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(null);
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to clone project to GitHub');
    } finally {
      setIsLoading(false);
    }
  };

  if (!githubConnected) {
    return (
      <button
        onClick={handleConnectGitHub}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.218.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.086.636-1.336-2.22-.252-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.336 1.909-1.296 2.747-1.026 2.747-1.026.546 1.376.202 2.393.1 2.646.64.698 1.027 1.59 1.027 2.682 0 3.841-2.338 4.687-4.566 4.935.359.308.678.92.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.577.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" fillRule="evenodd"/>
        </svg>
        <span>Connect GitHub</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.218.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.086.636-1.336-2.22-.252-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.336 1.909-1.296 2.747-1.026 2.747-1.026.546 1.376.202 2.393.1 2.646.64.698 1.027 1.59 1.027 2.682 0 3.841-2.338 4.687-4.566 4.935.359.308.678.92.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.577.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" fillRule="evenodd"/>
        </svg>
        <span>Clone to GitHub</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="glassmorphism rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Clone to GitHub</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-sm text-gray-400">
              Connected as: <span className="text-primary">{githubUsername}</span>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 space-y-2">
                <p className="text-green-300 text-sm">{success.message}</p>
                <a 
                  href={success.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm block"
                >
                  View on GitHub: {success.repoName} →
                </a>
              </div>
            )}

            <form onSubmit={handleClone} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Repository Name
                </label>
                <input
                  type="text"
                  value={formData.repo_name}
                  onChange={(e) => setFormData({ ...formData, repo_name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="my-awesome-project"
                  required
                  disabled={isLoading || success}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-[#2C2C2C] border border-[#4A4A4A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={3}
                  placeholder="Project description..."
                  disabled={isLoading || success}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={formData.private}
                  onChange={(e) => setFormData({ ...formData, private: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary focus:ring-offset-gray-800"
                  disabled={isLoading || success}
                />
                <label htmlFor="private" className="text-sm text-gray-300">
                  Make repository private
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Cloning...</span>
                  </>
                ) : success ? (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Cloned Successfully!</span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.218.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.086.636-1.336-2.22-.252-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.336 1.909-1.296 2.747-1.026 2.747-1.026.546 1.376.202 2.393.1 2.646.64.698 1.027 1.59 1.027 2.682 0 3.841-2.338 4.687-4.566 4.935.359.308.678.92.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.577.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    <span>Clone to GitHub</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};