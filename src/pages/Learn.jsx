// src/pages/Learn.jsx
export default function Learn() {
  const suggestedTopics = [
    'What are blue-chip stocks?',
    'Explain P/E ratio',
    'How to read financial statements',
    "What's dollar-cost averaging?",
    'Value investing vs growth investing',
    'How to analyze a balance sheet'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">Learn</h1>
        <p className="text-slate-400">Your AI investing tutor</p>
      </div>

      {/* Coming Soon Placeholder */}
      <div className="bg-slate-700 rounded-lg p-12 border border-slate-600 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-bold text-white mb-2">Educational Chat Coming Soon!</h2>
        <p className="text-slate-400 mb-6">
          Get answers to your investment questions without tying them to specific stocks or your portfolio.
        </p>

        <div className="bg-slate-600 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-white mb-3">Suggested Topics:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedTopics.map((topic, idx) => (
              <button
                key={idx}
                className="bg-slate-500 hover:bg-slate-400 text-white px-3 py-2 rounded text-sm transition"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <p className="text-slate-300 text-sm">
          Ask anything about investing, market concepts, strategies, or financial analysis!
        </p>
      </div>
    </div>
  );
}