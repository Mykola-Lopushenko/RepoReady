const express = require("express");
const router = express.Router();
const { analyzeReadmeWithAI } = require("../services/aiService");
const parseGitHubUrl = require("../utils/parseGitHubUrl");
const {
  getRepoDetails,
  getRepoContents,
  getReadme,
} = require("../services/githubService");
const { calculateScore } = require("../services/scoringService");

router.post("/analyze", async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: "repoUrl is required" });
    }

    const { owner, repo } = parseGitHubUrl(repoUrl);

    const repoData = await getRepoDetails(owner, repo);
    const contents = await getRepoContents(owner, repo);

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

    const fileNames = contents.map((item) => item.name);

    const hasReadme = fileNames.some(
      (name) => name.toLowerCase() === "readme.md"
    );
    const hasPackageJson = fileNames.includes("package.json");
    const hasDockerfile = fileNames.includes("Dockerfile");
    const hasSrcFolder = fileNames.includes("src");
    const hasTestsFolder =
      fileNames.includes("tests") || fileNames.includes("__tests__");
    const hasGithubFolder = fileNames.includes(".github");
    const hasEnvExample =
      fileNames.includes(".env.example") || fileNames.includes(".env.sample");

    const checks = {
      hasReadme,
      hasPackageJson,
      hasDockerfile,
      hasSrcFolder,
      hasTestsFolder,
      hasGithubFolder,
      hasEnvExample,
    };

    const scoreResult = calculateScore({
      fileNames,
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
      rootFiles: fileNames,
      checks,
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