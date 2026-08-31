import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const prompt = `
You are an expert Australian recruitment consultant.
Convert the user's background into:
1. An Australian-standard Resume (CV) in JSON.
2. A professional Cover Letter tailored for the target job.

Target Job: ${data.targetJob || 'General Staff'}
Visa: ${data.visaType || 'Working Holiday (Subclass 417)'} (${data.availability || 'Full-time'})
Raw Experience: ${data.rawExperience || 'Customer service and team collaboration'}
Certifications: ${data.certifications?.join(', ') || 'None'}
Personal Info: Name: ${data.name}, Phone: ${data.phone}, Email: ${data.email}, Location: ${data.location}

Rules:
- Strictly NO photos, date of birth, age, gender, marital status, or nationality.
- Use natural, professional Australian business English.
- Return ONLY valid JSON format without markdown code blocks, following this structure:
{
  "personalInfo": {
    "name": "${data.name || 'Applicant'}",
    "email": "${data.email || ''}",
    "phone": "${data.phone || ''}",
    "location": "${data.location || 'Australia'}",
    "visa": "${data.visaType || 'Working Holiday'}"
  },
  "summary": "2-3 concise sentences highlighting key skills and reliability.",
  "skills": ["Customer Service", "Time Management", "Communication"],
  "experiences": [
    {
      "role": "Team Member",
      "company": "Previous Workplace",
      "duration": "2023 - Present",
      "bullets": [
        "Delivered high quality service in a fast-paced environment",
        "Collaborated effectively with team members to achieve daily targets"
      ]
    }
  ],
  "certifications": ${JSON.stringify(data.certifications || [])},
  "coverLetter": "Dear Hiring Manager,\\n\\nI am writing to express my strong interest in the ${data.targetJob || 'open'} position...\\n\\nSincerely,\\n${data.name || 'Applicant'}"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let text = response.text || '{}';
    // バッククォート等のマークダウンを除去
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const generatedResume = JSON.parse(text);
    return NextResponse.json(generatedResume);
  } catch (error: any) {
    console.error('Gemini Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate resume' }, { status: 500 });
  }
}