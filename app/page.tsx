"use client"
// --- Import der Komponenten ---
import BpmnViewerComponent from "../components/BpmnViewer";
import EingabeXML from "../components/EingabeXML";
import Eingabeprozess from "../components/Eingabeprozess";
import React, { useState } from "react";
import { semantikanalyse } from "./utils/semantikprompts";
import { fehlerklassifikation } from "./utils/fehlerklassifikation";
import Bewertung from "../components/Bewertung";
import ReactMarkdown from "react-markdown";

export default function Home() {
  // --- State für die Eingabefelder --- 
  const [bpmnXML, setBpmnXML] = useState("");
  const [prozessbeschreibung, setProzessbeschreibung] = useState("");
  const [inputFormaldiagnose, setInputFormaldiagnose] = useState("");

  // --- State für alle LLM-Prompts und Antworten ---
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerTwo, setAnswerTwo] = useState("");
  const [answerThree, setAnswerThree] = useState("");
  const [answerFour, setAnswerFour] = useState("");

  // --- Erste LLM-Prompt-Route  mit Prompt als Eingabe---
  async function sendPrompt() {
    if (!prompt) return;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setAnswer(data.answer ?? data.error ?? "Funktioniert nicht");
    } catch (err: any) {
      setAnswer("Fehler: " + err.message);
    }
  }

  // --- Zweite LLM-Prompt-Route  mit semantikanalyse, XML und Beschreibung als Eingabe---
  async function sendPromptAlt() {
    try {
      const res = await fetch("/api/chat/raw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          semantikanalyse,
          bpmnXML,
          prozessbeschreibung
        }),
      });

      const data = await res.json();
      setAnswerTwo(data.answer ?? data.error ?? "Funktioniert nicht");
    } catch (err: any) {
      setAnswerTwo("Fehler: " + err.message);
    }
  }

  // --- Dritte LLM-Prompt-Route mit fehlerklassifikation, XML und Beschreibung als Eingabe---
  async function sendPromptThree() {
    try {
      const res = await fetch("/api/chat/raw/routeThree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fehlerklassifikation,
          bpmnXML,
          prozessbeschreibung
        }),
      });

      const data = await res.json();
      setAnswerThree(data.answer ?? data.error ?? "Funktioniert nicht");
    } catch (err: any) {
      setAnswerThree("Fehler: " + err.message);
    }
  }

  // --- Vierte LLM-Prompt-Route mit vorherigen Fehlermdeldungen ---
  async function sendPromptFour() {
    try {
      const res = await fetch("/api/chat/raw/routeFour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisAnswer: answerTwo,
          classificationAnswer: answerThree,
        }),
      });
      const data = await res.json();
      setAnswerFour(data.answer ?? data.error ?? "Funktioniert nicht");
    } catch (err: any) {
      setAnswerFour("Fehler: " + err.message);
    }
  }

  return (
    <div>
       {/* Überschrift */}
      <h1 className="flex justify-center font-bold text-3xl mt-4">Evaluationsdemonstration für LLM-generierte BPMN-Modelle</h1>
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
        <h2 className="flex justify-center font-bold text-xl mt-8"> Qualitätsanalyse: Eingabemaske für das BPMN-Modell</h2>
        <p>1) Trage hier die LLM-generierte XML und die Prozessbeschreibung ein</p>
        
         {/* Schritt 1: XML-Eingabe */}
        <div className="my-4 p-4 bg-white border rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Schritt 1: BPMN-XML einfügen</h3>
          <EingabeXML onXmlChange={setBpmnXML} />
        </div>

        {/* Schritt 2: Prozessbeschreibung */}
        <div className="my-4 p-4 bg-white border rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Schritt 2: Prozessbeschreibung eingeben</h3>
          <Eingabeprozess onProzessChange={setProzessbeschreibung} />
        </div>
        
        {/* Visualisierungsmodul des BPMN-Modells */}
        <h2 className="flex justify-center font-bold text-xl">Visualisierungsmodul des BPMN-Modells</h2>
        <BpmnViewerComponent xml={bpmnXML} />
        
        {/* Qualitätsanalyse: Syntaxprüfung */}
        <h1 className="flex justify-center font-bold text-xl">Qualitätsanalyse: Syntaxprüfung</h1>
        <p>1) Trage hier die Fehlermeldungen aus der Regel-Validierung ein, um die Formaldiagnose zu starten und Vorschläge zu generieren</p>
        <p>2) Notiere die Fehleranzahl und die korrigierte Gesamtelementanzahl für die spätere Bewertung</p>

        {/* OpenAI UI + Styling */}
        <div style={{ marginTop: 24 }}>
          {/* Prompteingabe (Fehlermeldungen) */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Eintrag in folgendem Format: NR ; Element : (Elementbezeichnung) ; Fehler : (Fehlermeldung)"
            style={{ width: "100%", minHeight: 100, padding: 8 }}
          />
          <button
            onClick={sendPrompt}
            className="border px-4 py-2 rounded hover:bg-gray-100 block mx-auto mt-2"
          >
            Formaldiagnose + Vorschläge generieren
          </button>

          {/* Antwort 1 mit React-Markdown-Viewer */}
          {answer && (
            <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none bg-gray-50 p-4 rounded">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          )}
        </div>

      </section>
      <section className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
        {/* Qualitätsanalyse: Semantikprüfung */}
        <div className="flex justify-center font-bold text-xl">Qualitätsanalyse: Semantikprüfung</div>
        <p> 1) Zum Ausführen der Inhaltsanalyse und Modellvalidierung drücke den Knopf "Analyse- und Diagnose"</p>

        {/* Zweite OpenAI UI */}
        <div style={{ marginTop: 24 }}>
          <button
            onClick={sendPromptAlt}
            className="border px-4 py-2 rounded hover:bg-gray-100 block mx-auto mt-2"
          >
            Analyse- und Diagnose
          </button>

          {/* Antwort 2 mit React-Markdown-Viewer */}
          {answerTwo && (
            <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none bg-gray-50 p-4 rounded">
              <ReactMarkdown>{answerTwo}</ReactMarkdown>
            </div>
          )}
        </div>

        <h2 className="flex justify-center font-bold text-xl mt-8">Semantische Qualitätsanalyse: Fehlerklassifikation</h2>
        <p>2) Zum Ausführen der Fehlerklassifikation drücke den Knopf "Fehlerklassifikation"</p>
       
        {/* Dritte OpenAI UI */}
        <div style={{ marginTop: 24 }}>
          <button
            onClick={sendPromptThree}
            className="border px-4 py-2 rounded hover:bg-gray-100 block mx-auto mt-2"
          >
            Fehlerklassifikation
          </button>

          {/* Antwort 3 mit React-Markdown-Viewer */}
          {answerThree && (
            <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none bg-gray-50 p-4 rounded">
              <ReactMarkdown>{answerThree}</ReactMarkdown>
            </div>
          )}
        </div>
        
        <h2 className="flex justify-center font-bold text-xl mt-8">Semantische Qualitätsanalyse: Verbesserungsvorschläge</h2>
        <p>3) Zum Generieren von Verbesserungsvorschlägen drücke den Knopf "Verbesserungsvorschläge generieren"</p>
       
        {/* Vierte OpenAI UI */}
        <div style={{ marginTop: 24 }}>
          <button
            onClick={sendPromptFour}
            className="border px-4 py-2 rounded hover:bg-gray-100 block mx-auto mt-2"
          >
            Verbesserungsvorschläge generieren
          </button>

          {/* Antwort 4 mit React-Markdown-Viewer */}
          {answerFour && (
            <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none bg-gray-50 p-4 rounded">
              <ReactMarkdown>{answerFour}</ReactMarkdown>
            </div>
          )}
        </div>
      </section>
      <section className="bg-purple-50 border border-purple-200 rounded-lg p-6 my-8">
        <h1 className="flex justify-center font-bold text-2xl">Die Qualitätsbewertung</h1>

        <p>1) Trage hier die einzelnen Werte zur Bewertung ein</p>

        {/* Die Qualitätsbewertung */}
        <Bewertung />
      </section>
    </div>
  );
}
