import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

// Configure Vertex AI (Gemma)
function createVertexClient() {
  const projectId = process.env.DIALOGFLOW_CX_PROJECT_ID;
  const location = process.env.DIALOGFLOW_CX_LOCATION || 'us-central1';
  if (!projectId) {
    throw new Error('Missing project id for Vertex AI');
  }
  return new VertexAI({ project: projectId, location });
}

const MODEL_ID = process.env.VERTEX_GEMMA_MODEL || 'gemma-2-9b-it';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const vertex = createVertexClient();
    const model = vertex.getGenerativeModel({ model: MODEL_ID });

    const systemInstruction = `You are a data structuring assistant. Extract aircraft maintenance table data.
Return only valid JSON with schema:
{
  "flights": [
    {
      "icao24": string,
      "flightNumber": string,
      "aircraftType": string,
      "status": string,
      "maintenanceType": "A-Check" | "B-Check" | "C-Check" | "D-Check"
    }
  ]
}
Rules:
- Use exact keys.
- Infer missing fields sensibly.
- Do NOT include any extra text or markdown.
`;

    const prompt = `${systemInstruction}\n\nInput Text:\n${text}`;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    // Try to extract text from response candidates
    const candidate = (result as any)?.response?.candidates?.[0];
    const outputText = candidate?.content?.parts?.[0]?.text || candidate?.content?.parts?.[0]?.inlineData?.data || '';

    if (!outputText) {
      return NextResponse.json({ flights: [] });
    }

    // Ensure we only parse JSON
    const jsonStart = outputText.indexOf('{');
    const jsonEnd = outputText.lastIndexOf('}');
    const jsonSlice = jsonStart >= 0 && jsonEnd >= jsonStart ? outputText.slice(jsonStart, jsonEnd + 1) : outputText;

    let parsed: any = {};
    try {
      parsed = JSON.parse(jsonSlice);
    } catch (e) {
      // Try to recover by stripping code fences or extra text
      const cleaned = jsonSlice.replace(/^```json\n|```$/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    const flights = Array.isArray(parsed?.flights) ? parsed.flights : [];

    // Normalize records to expected shape
    const normalized = flights
      .filter((f: any) => typeof f === 'object' && f)
      .map((f: any) => ({
        icao24: String(f.icao24 || '').trim(),
        flightNumber: f.flightNumber ? String(f.flightNumber).trim() : undefined,
        aircraftType: f.aircraftType ? String(f.aircraftType).trim() : undefined,
        status: f.status ? String(f.status).trim() : 'Needs Maintenance',
        maintenanceType: f.maintenanceType ? String(f.maintenanceType).trim() : 'A-Check',
      }))
      .filter((f: any) => f.icao24);

    return NextResponse.json({ flights: normalized });
  } catch (error) {
    console.error('Vertex AI structuring error:', error);
    return NextResponse.json({ flights: [] });
  }
}