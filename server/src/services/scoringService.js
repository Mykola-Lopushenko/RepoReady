function calculateScore({ fileNames, readmeText }) {
  let strengths = [];
  let recommendations = [];

  const files = fileNames.map((f) => f.toLowerCase());
  const readme = (readmeText || "").toLowerCase();

  // Documentation
  let documentationScore = 0;
  const documentationMax = 5;

  if (files.includes("readme.md")) {
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
  }

  // Structure
  let structureScore = 0;
  const structureMax = 3;

  if (files.includes("package.json")) {
    structureScore++;
    strengths.push("package.json is present");
  } else {
    recommendations.push("Add package.json if this is a Node.js project");
  }

  if (files.includes("src")) {
    structureScore++;
  } else {
    recommendations.push("Add a src folder for cleaner project structure");
  }

  if (files.includes(".env.example") || files.includes(".env.sample")) {
    structureScore++;
  } else {
    recommendations.push("Add .env.example or .env.sample for setup clarity");
  }

  // Engineering
  let engineeringScore = 0;
  const engineeringMax = 2;

  if (files.includes(".github")) {
    engineeringScore++;
  } else {
    recommendations.push("Add a .github folder for workflows or templates");
  }

  if (files.includes("dockerfile")) {
    engineeringScore++;
  } else {
    recommendations.push("Add a Dockerfile to improve deployment readiness");
  }

  if (!files.includes("tests") && !files.includes("__tests__")) {
    recommendations.push("Add tests to improve engineering quality");
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
