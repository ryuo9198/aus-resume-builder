import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const prompt = `
You are an expert Australian recruitment consultant.
Convert the user's background into:
1. An Australian-standard Resume (CV) in JSON.
2. A professional Cover Letter tailored for the target job.

Target Job: ${data.targetJob || 'General Staff'}
Visa: ${data.visaType || 'Working Holiday (Subclass 417)'} (${data.availability || 'Full-time'})
Raw Experience: ${data.rawExperience || 'Customer service'}
Certifications: ${data.certifications?.join(', ') || 'None'}
Personal Info: Name: ${data.name}, Phone: ${data.phone}, Email: ${data.email}, Location: ${data.location}

Rules:
- Strictly NO photos, date of birth, age, gender, marital status, or nationality.
- Return ONLY valid JSON format:
{
  "personalInfo": {
    "name": "${data.name || 'Applicant'}",
    "email": "${data.email || ''}",
    "phone": "${data.phone || ''}",
    "location": "${data.location || 'Australia'}",
    "visa": "${data.visaType || 'Working Holiday'}"
  },
  "summary": "Professional summary tailored to Australia job market",
  "skills": ["Customer Service", "Communication", "Teamwork"],
  "experiences": [
    {
      "role": "Staff Member",
      "company": "Previous Company",
      "duration": "2023 - 2024",
      "bullets": [
        "Provided outstanding service to customers",
        "Collaborated with team to maintain daily operations"
      ]
    }
  ],
  "certifications": ${JSON.stringify(data.certifications || [])},
  "coverLetter": "Dear Hiring Manager,\\n\\nI am writing to express my enthusiastic interest in the ${data.targetJob || 'position'} role...\\n\\nSincerely,\\n${data.name || 'Applicant'}"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanText);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}