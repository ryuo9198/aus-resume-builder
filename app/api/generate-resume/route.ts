import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const prompt = `
You are an expert Australian recruitment consultant.
Convert the user's background into a high-converting, professional Australian-standard Resume (CV).

Target Job: ${data.targetJob}
Visa: ${data.visaType} (${data.availability})
Raw Experience: ${data.rawExperience}
Certifications: ${data.certifications?.join(', ')}
Personal Info: ${data.name}, ${data.phone}, ${data.email}, ${data.location}

Rules:
1. NO photos, age, gender, date of birth, or nationality.
2. Structure format in pure JSON only without markdown or backticks:
{
  "personalInfo": { "name": "", "email": "", "phone": "", "location": "", "visa": "" },
  "summary": "",
  "skills": ["skill1", "skill2"],
  "experiences": [
    { "role": "", "company": "", "duration": "", "bullets": ["bullet1", "bullet2"] }
  ],
  "certifications": ["cert1", "cert2"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const generatedResume = JSON.parse(response.text || '{}');
    return NextResponse.json(generatedResume);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 });
  }
}