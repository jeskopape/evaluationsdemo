"use client"

import React, { useState } from "react";

// --- Definition der Eingabekomponente ---
export default function Eingabeprozess({ onProzessChange }: { onProzessChange: (prozess: string) => void }) {
  const [text, setText] = useState("");
// --- onProzessChange wird aufgerufen, wenn sich der Text ändert ---
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    onProzessChange(e.target.value);
  }

  return (
    // --- Rückgabe des Texteingabefeldes ---
    <textarea
      value={text}
      onChange={handleChange}
      rows={5}
      style={{ width: '100%', marginBottom: 16 }}
      placeholder="Füge hier die Prozessbeschreibung ein"
    />
  );
} 