import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { semantikanalyse } from "../../../utils/semantikprompts";

//Semantikprüfung (Analyse- und Diagnose)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { semantikanalyse, bpmnXML, prozessbeschreibung } = await req.json();

    if (!semantikanalyse || !bpmnXML || !prozessbeschreibung) {
      return NextResponse.json({ error: "Gib die XML und Prozessbeschreibung ein" }, { status: 400 });
    }

    // Eigenschaften (Model 4o, semantikanalyse und prozessbeschreibung als Input)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `${semantikanalyse}\n\nProzessbeschreibung:\n${prozessbeschreibung}\n\nBPMN-XML:\n${bpmnXML}`
        }
      ],
      max_tokens: 10000,
    });

    // Antwort der Route oder Fehlermeldung
    const answer = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
