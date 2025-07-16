"use client";
import React, { useState } from "react";

type Props = {
  onFormalChange: (text: string) => void;
};

// --- Definition der Syntaxprüfungskomponente --- 
export default function Syntaxpruefung({ onFormalChange }: Props) {
  const [errors, setErrors] = useState("");

  // --- Rückgabe der Syntaxprüfungseingabe im vorgegebenen Format ---
  return (
  
    <div style={{ marginTop: 24, marginBottom: 16 }}>
      
      <textarea
        value={errors}
        onChange={(e) => {
          setErrors(e.target.value);
          onFormalChange(e.target.value);
        }}
        placeholder="Eintrag in folgendem Format: NR ; Element : (Elementbezeichnung) ; Fehler : (Fehlermeldung)"
        rows={4}
        style={{ width: "100%", padding: 8 }}
      />
    </div>
  );
}
