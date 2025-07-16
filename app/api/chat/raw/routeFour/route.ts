import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { verbesserungen } from "../../../../utils/verbesserungen";

// Semantikanalyse (Verbesserungsvorschläge)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// POST für die Semantikprüfung
export async function POST(req: NextRequest) {
  try {
    const { analysisAnswer, classificationAnswer } = await req.json();

    if (!analysisAnswer || !classificationAnswer) {
      return NextResponse.json({ error: "Führe erstmal die restliche Analyse durch" }, { status: 400 });
    }
    // Eigenschaften (Model 4o, verbesserungen (Prompt), Analyse und Fehlerklassifikation als Input)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: `${verbesserungen}\n\nAnalyse der Elemente und Übereinstimmung:\n${analysisAnswer}\n\nFehlerklassifikation:\n${classificationAnswer}` }],
      max_tokens: 1000,
    });

    // Antwort der Route oder Fehlermeldung
    const answer = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
