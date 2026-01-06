import { useState } from "react";

const MentorAPIChange = () => {
  const [provider, setProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");

  const saveKey = async () => {
    await fetch("/api/mentor/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, apiKey }),
    });

    setApiKey(""); // wipe immediately
  };

  return (
    <div>
      <select value={provider} onChange={(e) => setProvider(e.target.value)}>
        <option value="openai">OpenAI</option>
        <option value="gemini">Gemini</option>
      </select>

      <input
        type="password"
        placeholder="Paste your API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <button onClick={saveKey}>Save key</button>
    </div>
  );
};

export default MentorAPIChange;
