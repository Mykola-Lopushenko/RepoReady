function calculateScore({
  rootFileNames = [],
  clientFileNames = [],
  serverFileNames = [],
  readmeText = "",
}) {
  const root = rootFileNames.map((f) => f.toLowerCase());
  const client = clientFileNames.map((f) => f.toLowerCase());
  const server = serverFileNames.map((f) => f.toLowerCase());
  const readme = (readmeText || "").toLowerCase();

  const strengths = [];
  const recommendations = [];

  const hasClientFolder = root.includes("client");
  const hasServerFolder = root.includes("server");
  const isFullstackRepo = hasClientFolder && hasServerFolder;

  const hasRootPackageJson = root.includes("package.json");
  const hasClientPackageJson = client.includes("package.json");
  const hasServerPackageJson = server.includes("package.json");

  const hasAnyPackageJson =
    hasRootPackageJson || hasClientPackageJson || hasServerPackageJson;

  const hasRootSrc = root.includes("src");
  const hasClientSrc = client.includes("src");
  const hasServerSrc = server.includes("src");

  const hasAnySrc = hasRootSrc || hasClientSrc || hasServerSrc;

  const hasRootEnvExample =
    root.includes(".env.example") || root.includes(".env.sample");
  const hasClientEnvExample =
    client.includes(".env.example") || client.includes(".env.sample");
  const hasServerEnvExample =
    server.includes(".env.example") || server.includes(".env.sample");

  const hasAnyEnvExample =
    hasRootEnvExample || hasClientEnvExample || hasServerEnvExample;

  const hasRootGithub = root.includes(".github");
  const hasDockerfile = root.includes("dockerfile");

  const hasRootTests = root.includes("tests") || root.includes("__tests__");
  const hasClientTests =
    client.includes("tests") || client.includes("__tests__");
  const hasServerTests =
    server.includes("tests") || server.includes("__tests__");

  const hasAnyTests = hasRootTests || hasClientTests || hasServerTests;

  // Documentation
  let documentationScore = 0;
  const documentationMax = 5;

  if (root.includes("readme.md")) {
    documentationScore++;
    strengths.push("README file is present");
  } else {
    recommendations.push("Add a README file");
  }

  if (readme.includes("install") || readme.includes("setup")) {
    documentationScore++;
    strengths.push("README includes installation instructions");
  } else {
    recommendations.push("Add installation instructions to README");
  }

  if (readme.includes("usage") || readme.includes("how to use")) {
    documentationScore++;
    strengths.push("README includes usage section");
  } else {
    recommendations.push("Add usage section to README");
  }

  if (readme.includes("demo") || readme.includes("live") || readme.includes("http")) {
    documentationScore++;
    strengths.push("README includes demo or live link");
  } else {
    recommendations.push("Add demo or live project link");
  }

  if (readme.length > 200) {
    documentationScore++;
    strengths.push("README has meaningful project detail");
  } else {
    recommendations.push("Add more project detail to README");
  }

  // Structure
  let structureScore = 0;
  const structureMax = 3;

  if (hasAnyPackageJson) {
    structureScore++;
    strengths.push("package.json is present");
  } else {
    recommendations.push("Add package.json for project setup");
  }

  if (hasAnySrc || isFullstackRepo) {
    structureScore++;
    if (isFullstackRepo) {
      strengths.push("Repository uses a client/server full-stack structure");
    } else {
      strengths.push("src folder is present");
    }
  } else {
    recommendations.push("Add a src folder or clearer project structure");
  }

  if (hasAnyEnvExample) {
    structureScore++;
    strengths.push(".env.example or .env.sample is present");
  } else {
    recommendations.push("Add .env.example or .env.sample for setup clarity");
  }

  // Engineering
  let engineeringScore = 0;
  const engineeringMax = 2;

  if (hasRootGithub) {
    engineeringScore++;
    strengths.push(".github folder is present");
  } else {
    recommendations.push("Add a .github folder for workflows or templates");
  }

  if (hasDockerfile) {
    engineeringScore++;
    strengths.push("Dockerfile is present");
  } else {
    recommendations.push("Add a Dockerfile to improve deployment readiness");
  }

  if (!hasAnyTests) {
    recommendations.push("Add tests to improve engineering quality");
  } else {
    strengths.push("Tests are present");
  }

  const overallScore =
    documentationScore + structureScore + engineeringScore;
  const maxScore = documentationMax + structureMax + engineeringMax;

  return {
    overallScore,
    maxScore,
    categories: {
      documentation: {
        score: documentationScore,
        max: documentationMax,
      },
      structure: {
        score: structureScore,
        max: structureMax,
      },
      engineering: {
        score: engineeringScore,
        max: engineeringMax,
      },
    },
    strengths,
    recommendations,
  };
}

module.exports = { calculateScore };
