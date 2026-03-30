function parseGitHubUrl(repoUrl) {
  if (!repoUrl || typeof repoUrl !== "string") {
    throw new Error("A valid GitHub URL is required");
  }

  const trimmedUrl = repoUrl.trim();

  const githubRegex = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?\/?$/i;
  const match = trimmedUrl.match(githubRegex);

  if (!match) {
    throw new Error("Invalid GitHub repository URL");
  }

  const owner = match[1];
  const repo = match[2];

  return { owner, repo };
}

module.exports = parseGitHubUrl;