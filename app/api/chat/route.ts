import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { syntaxformaldiagnose } from "../../utils/syntaxprompt";

// Route für die Syntaxprüfung (Formaldiagnose + Vorschläge) 
// Hier wird der OPENAI_API_KEY verwendet (Genauso in der .env bennenen)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST für die Syntaxprüfung
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    

    if (!prompt) {
      return NextResponse.json({ error: "Gib die Fehlermeldungen ein" }, { status: 400 });
    }

    // EIgenschaften der Route (Model 4o, syntaxformaldiagnose und prompt als Input)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: syntaxformaldiagnose + " " + prompt }],
      max_tokens: 10000,
    });

    // Antwort der Route oder Fehlermeldung
    const answer = completion.choices[0].message?.content ?? "";
    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
