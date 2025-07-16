"use client"
import React, { useState } from "react";

// --- Definition der XML-Eingabe ---
export default function EingabeXML({ onXmlChange }: { onXmlChange: (xml: string) => void }) {
  const [text, setText] = useState("");

  // --- Sobdald sich der Text ändert, wird onXml Change aufgerufen
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    onXmlChange(e.target.value);
  }
// --- Rückgabe der Eingabekomponente ---
  return (
    <textarea
      value={text}
      onChange={handleChange}
      rows={5}
      style={{ width: '100%', marginBottom: 16 }}
      placeholder="Füge hier den XML-Code ein"
    />
  );
} 