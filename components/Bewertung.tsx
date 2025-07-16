import React, { useState, ChangeEvent } from "react";

export default function Bewertung() {

  // Syntaxbewertung definitionen 
  const [syntaxGesamt, setSyntaxGesamt] = useState<number>(0);
  const [syntaxFehler, setSyntaxFehler] = useState<number>(0);

  // Semantikbewertung definitionen  
  const [semGesamt, setSemGesamt] = useState<number>(0);
  const [abgedeckt, setAbgedeckt] = useState<number>(0);
  const [simulation, setSimulation] = useState<number>(0); 
  const [fehlerKl1, setFehlerKl1] = useState<number>(0); 

  // Ergebnis-State für einzelne BEewertungen 
  const [syntaxScore, setSyntaxScore] = useState<number | null>(null);
  const [semantikScore, setSemantikScore] = useState<number | null>(null);
  const [gesamtScore, setGesamtScore] = useState<number | null>(null);

  // PArser für die Eingabe der Bewertungen
  const parseNum = (e: ChangeEvent<HTMLInputElement>, setter: (v: number) => void) => {
    setter(parseFloat(e.target.value) || 0);
  };

  // Aus dem Framework beschriebene Gleichverteillung mit EIngabekriterien >0 
  const calcScores = () => {
    const sScore = syntaxGesamt > 0 ? syntaxFehler / syntaxGesamt : 0;
    const semScore = semGesamt > 0
      ? ((abgedeckt / semGesamt) + simulation + (fehlerKl1 / 4)) / 3
      : 0;
    setSyntaxScore(sScore);
    setSemantikScore(semScore);
    setGesamtScore((sScore + semScore) / 2);
  };

  return (
    <div className="mt-8 flex flex-col items-center">

      {/* Syntaxbewertung */}
      <h2 className="font-bold text-lg mb-2">Syntaxbewertung</h2>
      <div className="flex flex-col items-center space-y-3 w-full">

        {/* Eingabe Gesamtelementanzahl nach Korrektur */}
        <label className="flex flex-col text-sm w-full max-w-xs">
          Gesamtelementanzahl nach Korrektur:
          <input
            type="number"
            min="0"
            className="border mt-1 p-1 w-full max-w-xs"
            onChange={(e) => parseNum(e, setSyntaxGesamt)}
          />
        </label>

        {/* Eingabe Signavio-Syntaxfehler */}
        <label className="flex flex-col text-sm w-full max-w-xs">
          Syntaxfehler aus Signavio:
          <input
            type="number"
            min="0"
            className="border mt-1 p-1 w-full max-w-xs"
            onChange={(e) => parseNum(e, setSyntaxFehler)}
          />
        </label>

        {/* Ausgabe des syntaktischen Qualitätsscores */}
        {syntaxScore !== null && (
          <p className="mt-1">Syntaktischer Qualitätsscore: {syntaxScore.toFixed(2)}</p>
        )}
      </div>

      {/* Semantikbewertung */}
      <h2 className="font-bold text-lg mt-6 mb-2">Semantikbewertung</h2>
      <div className="flex flex-col items-center space-y-3 w-full mt-6">

        {/* Eingabe Gesamtelementanzahl aus LLM-Ausgabe */}
        <label className="flex flex-col text-sm w-full max-w-xs">
          Gesamtelementanzahl aus LLM-Ausgabe:
          <input
            type="number"
            min="0"
            className="border mt-1 p-1 w-full max-w-xs"
            onChange={(e) => parseNum(e, setSemGesamt)}
          />
        </label>

        {/* Eingabe Abgedeckte Elemente aus LLM-Ausgabe */}
        <label className="flex flex-col text-sm w-full max-w-xs">
          Abgedeckte Elemente aus LLM-Ausgabe:
          <input
            type="number"
            min="0"
            className="border mt-1 p-1 w-full max-w-xs"
            onChange={(e) => parseNum(e, setAbgedeckt)}
          />
        </label>

        {/* Eingabe Simulationsfähigkeit */}
        <label className="flex flex-col text-sm w-full max-w-xs">
          Simulationsfähigkeit (0 oder 1):
          <input
            type="number"
            min="0"
            max="1"
            className="border mt-1 p-1 w-full max-w-xs"
            onChange={(e) => parseNum(e, setSimulation)}
          />
        </label>

        {/* Eingabe Anzahl der positiven Fehlerklassifikationen */}
        <label className="flex flex-col text-sm w-full max-w-xs">
          Anzahl der positiven Fehlerklassifikationen (1):
          <input
            type="number"
            min="0"
            className="border mt-1 p-1 w-full max-w-xs"
            onChange={(e) => parseNum(e, setFehlerKl1)}
          />
        </label>

        {/* Ausgabe des semantischen Qualitätsscores */}
        {semantikScore !== null && (
          <p className="mt-1">Semantischer Qualitätsscore: {semantikScore.toFixed(2)}</p>
        )}
      </div>

      {/* Gesamtwualitätsscore Button */}
      <div className="mt-4">
        <button
          onClick={calcScores}
          className="border px-4 py-2 rounded hover:bg-gray-100 mt-4"
        >
          Gesamtqualitätsscore berechnen
        </button>
        {/* Ausgabe des Gesamtqualitätsscores */}
        {gesamtScore !== null && (
          <p className="mt-2 font-bold">Gesamtqualitätsscore: {gesamtScore.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
}