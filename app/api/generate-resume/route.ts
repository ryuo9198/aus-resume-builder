import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY が設定されていません' }, { status: 500 });
    }

    const data = await req.json();

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
  "summary": "Professional summary tailored to Australian hiring managers",
  "skills": ["Customer Service", "Communication", "Teamwork"],
  "experiences": [
    {
      "role": "Team Member",
      "company": "Previous Workplace",
      "duration": "2023 - 2024",
      "bullets": [
        "Delivered prompt and friendly service in a high-volume setting",
        "Worked efficiently with team members to ensure smooth operations"
      ]
    }
  ],
  "certifications": ${JSON.stringify(data.certifications || [])},
  "coverLetter": "Dear Hiring Manager,\\n\\nI am writing to express my interest in the ${data.targetJob || 'position'} role...\\n\\nSincerely,\\n${data.name || 'Applicant'}"
}
`;

    // 安定して動作する gemini-2.5-flash の v1beta エンドポイント
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      return NextResponse.json({ error: `Gemini API Error (${response.status}): ${errText}` }, { status: response.status });
    }

    const resJson = await response.json();
    let text = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}