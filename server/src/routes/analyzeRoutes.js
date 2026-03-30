const express = require("express");
const router = express.Router();

const parseGitHubUrl = require("../utils/parseGitHubUrl");
const {
  getRepoDetails,
  getRepoContents,
  getReadme,
} = require("../services/githubService");
const { calculateScore } = require("../services/scoringService");
const { analyzeReadmeWithAI } = require("../services/aiService");

router.post("/analyze", async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: "repoUrl is required" });
    }

    const { owner, repo } = parseGitHubUrl(repoUrl);

    const repoData = await getRepoDetails(owner, repo);
    const rootContents = await getRepoContents(owner, repo);

    let clientContents = [];
    let serverContents = [];

    const rootFileNames = rootContents.map((item) => item.name);

    if (rootFileNames.includes("client")) {
      try {
        clientContents = await getRepoContents(owner, repo, "client");
      } catch (e) {
        clientContents = [];
      }
    }

    if (rootFileNames.includes("server")) {
      try {
        serverContents = await getRepoContents(owner, repo, "server");
      } catch (e) {
        serverContents = [];
      }
    }

    let readmeContent = "";
    try {
      readmeContent = await getReadme(owner, repo);
    } catch (e) {
      readmeContent = "";
    }

    const readmeLower = readmeContent.toLowerCase();

    const hasDescription = readmeLower.length > 50;
    const hasInstallation =
      readmeLower.includes("install") || readmeLower.includes("setup");
    const hasUsage =
      readmeLower.includes("usage") || readmeLower.includes("how to use");
    const hasDemo =
      readmeLower.includes("demo") ||
      readmeLower.includes("live") ||
      readmeLower.includes("http");
    const hasScreenshots =
      readmeLower.includes("screenshot") || readmeLower.includes("preview");

    const clientFileNames = clientContents.map((item) => item.name);
    const serverFileNames = serverContents.map((item) => item.name);

    const scoreResult = calculateScore({
      rootFileNames,
      clientFileNames,
      serverFileNames,
      readmeText: readmeContent,
    });

    let aiAnalysis = null;
    try {
      if (readmeContent && readmeContent.trim()) {
        aiAnalysis = await analyzeReadmeWithAI(readmeContent);
      }
    } catch (e) {
      aiAnalysis = "AI analysis is currently unavailable.";
    }

    return res.json({
      message: "Repository analyzed successfully",
      repoName: repoData.name,
      owner: repoData.owner.login,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      mainLanguage: repoData.language,
      defaultBranch: repoData.default_branch,
      lastUpdated: repoData.updated_at,
      htmlUrl: repoData.html_url,
      rootFiles: rootFileNames,
      clientFiles: clientFileNames,
      serverFiles: serverFileNames,
      score: scoreResult,
      readmeAnalysis: {
        hasDescription,
        hasInstallation,
        hasUsage,
        hasDemo,
        hasScreenshots,
      },
      aiAnalysis,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.response?.data?.message || error.message,
    });
  }
});

module.exports = router;