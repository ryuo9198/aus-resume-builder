import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY が設定されていません' }, { status: 500 });
    }

    const data = await req.json();

    const prompt = `
You are an expert Australian recruitment consultant and professional resume writer.
A candidate wants to work in Australia. Convert their provided details into an Australian-standard Resume (CV) and a tailored Cover Letter.

Candidate Input:
- Name: ${data.name || 'Applicant'}
- Email: ${data.email || ''}
- Phone: ${data.phone || ''}
- Target City: ${data.location || 'Australia'}
- Target Job: ${data.targetJob || 'General Staff'}
- Visa Type: ${data.visaType || 'Working Holiday (Subclass 417)'}
- Availability: ${data.availability || 'Full-time'}
- Australian Licences: ${data.certifications?.join(', ') || 'None'}
- Past Experience & Key Strengths (user input in their native language):
"${data.rawExperience || 'Customer service'}"

Strict Australian Standards:
1. Australian resumes strictly PROHIBIT: photos, age, date of birth, gender, marital status, and nationality.
2. Carefully analyze the candidate's "Past Experience & Key Strengths":
   - Identify their actual previous company, workplace, or industry (e.g., if they mention "スタバ", the company is "Starbucks Coffee").
   - Extract the length of experience (e.g., "3年間" -> "3 Years").
   - Translate their actual daily duties and achievements into strong, action-oriented Australian professional English bullet points (e.g., Handcrafted, Delivered, Managed, Coordinated).
   - DO NOT substitute a generic unrelated job. Reflect their real input faithfully.
3. Return ONLY a valid JSON object matching this exact schema:
{
  "personalInfo": {
    "name": "${data.name || 'Applicant'}",
    "email": "${data.email || ''}",
    "phone": "${data.phone || ''}",
    "location": "${data.location || 'Australia'}",
    "visa": "${data.visaType || 'Working Holiday'}"
  },
  "summary": "2-3 impactful sentences highlighting their target role in Australia, their past experience, and work rights.",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "experiences": [
    {
      "role": "Role Title based on actual input",
      "company": "Company / Workplace based on actual input",
      "duration": "Duration based on actual input (e.g., 2021 - 2024)",
      "bullets": [
        "Strong action-verb achievement 1",
        "Strong action-verb achievement 2",
        "Strong action-verb achievement 3"
      ]
    }
  ],
  "certifications": ${JSON.stringify(data.certifications || [])},
  "coverLetter": "A full, professional Australian cover letter addressed to Hiring Manager tailored to the target role and their real background."
}
`;

    // Google API 直接呼び出し
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
      return NextResponse.json({ error: `AI呼び出しエラー: ${errText}` }, { status: response.status });
    }

    const resJson = await response.json();
    let text = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'AI Generation failed' }, { status: 500 });
  }
}