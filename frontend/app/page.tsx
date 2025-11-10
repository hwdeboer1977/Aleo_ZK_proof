"use client";

import { useDynamicContext, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";

export default function Home() {
  const { user } = useDynamicContext();
  const [birthYear, setBirthYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerateProof = async () => {
    if (!birthYear) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/prove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthYear: parseInt(birthYear) }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ success: false, error: "Failed to generate proof" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Aleo ZK Proof Demo
          </h1>
          <DynamicWidget />
        </div>

        {user ? (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="flex items-center gap-2 text-green-600">
              <span className="text-2xl">✅</span>
              <p className="font-medium">
                Connected as {user.email || user.userId}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Your Birth Year
                </label>
                <input
                  type="number"
                  placeholder="e.g., 2000"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full max-w-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleGenerateProof}
                disabled={loading || !birthYear}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loading ? "⏳ Generating ZK Proof..." : "🔐 Generate ZK Proof"}
              </button>
            </div>

            {result && (
              <div
                className={`mt-6 p-6 rounded-lg ${
                  result.success
                    ? result.isAdult
                      ? "bg-green-50 border-2 border-green-200"
                      : "bg-red-50 border-2 border-red-200"
                    : "bg-red-50 border-2 border-red-200"
                }`}
              >
                {result.success ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">
                        {result.isAdult ? "✅" : "❌"}
                      </span>
                      <p className="text-xl font-bold">
                        {result.isAdult ? "Age ≥ 18 Verified" : "Age < 18"}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>Verification Method:</strong> Zero-Knowledge
                        Proof (Aleo)
                      </p>
                      <p>
                        <strong>Current Year:</strong> {result.currentYear}
                      </p>
                      <p className="italic text-gray-600">
                        🔒 Your exact birth year and age remain private
                      </p>
                    </div>

                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 font-medium">
                        🔍 Technical Details
                      </summary>
                      <div className="mt-2 text-xs bg-gray-50 p-3 rounded border">
                        <p>
                          <strong>Birth Year (Private Input):</strong>{" "}
                          {result.birthYear}
                        </p>
                        <p>
                          <strong>Age (Computed):</strong> {result.age}
                        </p>
                        <p>
                          <strong>Threshold:</strong> 18 years
                        </p>
                        <p>
                          <strong>Result:</strong>{" "}
                          {result.isAdult ? "PASS" : "FAIL"}
                        </p>
                        <p className="mt-2 text-gray-500">
                          Note: These details are shown for demo purposes. In
                          production, only the verification result would be
                          visible to third parties.
                        </p>
                      </div>
                    </details>
                  </>
                ) : (
                  <p className="text-red-700 flex items-center gap-2">
                    <span className="text-2xl">❌</span>
                    {result.error}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg">
              Please connect your wallet to generate zero-knowledge proofs
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
