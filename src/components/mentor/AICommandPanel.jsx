import { useState } from "react";

export default function AICommandPanel({
  title,
  placeholder,
  onApply,
  onCancel,
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setBusy(true);
    await onApply(text.trim());
    setBusy(false);
    setText("");
  };

  return (
    <div className="mt-3 border rounded-lg p-3 bg-white">
      <p className="text-xs font-semibold">{title}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder || "Describe the change..."}
        className="w-full border rounded-md px-3 py-2 text-sm mt-2"
      />

      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={onCancel}
          disabled={busy}
          className="text-sm border px-3 py-1 rounded-md disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={busy || !text.trim()}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md disabled:opacity-60"
        >
          {busy ? "Applying..." : "Apply"}
        </button>
      </div>
    </div>
  );
}
