import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import ReactMarkdown from "react-markdown";


function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub URL");
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await axios.post("http://localhost:5000/api/analyze", {
        repoUrl,
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error analyzing repository");
    } finally {
      setLoading(false);
    }
  };

  const scorePercent =
    (result?.score?.overallScore / result?.score?.maxScore) * 100 || 0;

  let scoreColor = "#22c55e";
  if (scorePercent < 40) scoreColor = "#ef4444";
  else if (scorePercent < 70) scoreColor = "#f59e0b";

  const getPercent = (score, max) => {
    if (!max) return 0;
    return (score / max) * 100;
  };

  return (
    <div className="page">
      <div className="container">
        <div className="hero">
          <h1 className="title">RepoReady</h1>
          <p className="subtitle">
            Analyze a GitHub repository and see how portfolio-ready it is.
          </p>
        </div>

        <div className="search-card">
          <div className="input-group">
            <input
              type="text"
              placeholder="Paste GitHub repository URL"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="input"
            />

            <motion.button
              onClick={handleAnalyze}
              className="button"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <span className="button-content">
                  <span className="spinner"></span>
                  Analyzing
                </span>
              ) : (
                "Analyze"
              )}
            </motion.button>
          </div>

          {error && <p className="error">{error}</p>}
        </div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.htmlUrl}
              className="card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="card-header">
                <div>
                  <h2 className="repo-title">{result.repoName}</h2>
                  <p className="repo-description">
                    <strong>Description:</strong>{" "}
                    {result.description || "No description available."}
                  </p>
                </div>

                <a
                  href={result.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="repo-link"
                >
                  View on GitHub
                </a>
              </div>

              <div className="meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Owner</span>
                  <span className="meta-value">{result.owner}</span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">Language</span>
                  <span className="meta-value">
                    {result.mainLanguage || "N/A"}
                  </span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">Stars</span>
                  <span className="meta-value">{result.stars}</span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">Score</span>
                  <span className="meta-value">
                    {result.score.overallScore} / {result.score.maxScore}
                  </span>
                </div>
              </div>

              <div className="score-block">
                <div className="score-row">
                  <h3 className="section-title">Portfolio Score</h3>
                  <span className="score-pill">{Math.round(scorePercent)}%</span>
                </div>

                <div className="progress-bar">
                  <motion.div
                    className="progress"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${scorePercent}%`,
                      background: scoreColor,
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </div>

                {result.score.categories && (
                  <div className="category-grid">
                    <div className="category-card">
                      <span>Documentation</span>
                      <strong>
                        {result.score.categories.documentation.score} /{" "}
                        {result.score.categories.documentation.max}
                      </strong>

                      <div className="mini-bar">
                        <motion.div
                          className="mini-progress"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${getPercent(
                              result.score.categories.documentation.score,
                              result.score.categories.documentation.max
                            )}%`,
                          }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                        />
                      </div>
                    </div>

                    <div className="category-card">
                      <span>Structure</span>
                      <strong>
                        {result.score.categories.structure.score} /{" "}
                        {result.score.categories.structure.max}
                      </strong>

                      <div className="mini-bar">
                        <motion.div
                          className="mini-progress"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${getPercent(
                              result.score.categories.structure.score,
                              result.score.categories.structure.max
                            )}%`,
                          }}
                          transition={{ duration: 0.6, delay: 0.18 }}
                        />
                      </div>
                    </div>

                    <div className="category-card">
                      <span>Engineering</span>
                      <strong>
                        {result.score.categories.engineering.score} /{" "}
                        {result.score.categories.engineering.max}
                      </strong>

                      <div className="mini-bar">
                        <motion.div
                          className="mini-progress"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${getPercent(
                              result.score.categories.engineering.score,
                              result.score.categories.engineering.max
                            )}%`,
                          }}
                          transition={{ duration: 0.6, delay: 0.26 }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="section">
                <h4 className="section-title">
                  Strengths ({result.score.strengths.length})
                </h4>

                {result.score.strengths.length > 0 ? (
                  <div className="list">
                    {result.score.strengths.map((item, i) => (
                      <motion.div
                        key={i}
                        className="strength"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                      >
                        <span className="badge success">✓</span>
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-text">No strengths detected yet.</p>
                )}
              </div>

              <div className="section">
                <h4 className="section-title">
                  Recommendations ({result.score.recommendations.length})
                </h4>

                {result.score.recommendations.length > 0 ? (
                  <div className="list">
                    {result.score.recommendations.map((item, i) => (
                      <motion.div
                        key={i}
                        className="recommendation"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                      >
                        <span className="badge danger">!</span>
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-text">No recommendations. Great job.</p>
                )}
              </div>

              {result.aiAnalysis && (
                <div className="section">
                  <h4 className="section-title">AI README Analysis</h4>
                  <div className="ai-analysis">
                    <ReactMarkdown>{result.aiAnalysis}</ReactMarkdown>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;