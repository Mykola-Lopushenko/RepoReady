const axios = require("axios");

function getGithubHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function getRepoDetails(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}`;

  const response = await axios.get(url, {
    headers: getGithubHeaders(),
  });

  return response.data;
}

async function getRepoContents(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents`;

  const response = await axios.get(url, {
    headers: getGithubHeaders(),
  });

  return response.data;
}

async function getReadme(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/readme`;

  const response = await axios.get(url, {
    headers: getGithubHeaders(),
  });

  const base64Content = response.data.content;
  const decodedContent = Buffer.from(base64Content, "base64").toString("utf-8");

  return decodedContent;
}

module.exports = {
  getRepoDetails,
  getRepoContents,
  getReadme,
};