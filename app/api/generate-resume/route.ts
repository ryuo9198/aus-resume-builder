import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY が設定されていません' }, { status: 500 });
    }

    const data = await req.json();
    const targetLanguage = data.language || 'ja'; // ja, en, ko, zh, es

    const langNames: Record<string, string> = {
      ja: 'Japanese',
      en: 'English',
      ko: 'Korean',
      zh: 'Traditional Chinese',
      es: 'Spanish',
    };
    const userLangName = langNames[targetLanguage] || 'Japanese';

    const prompt = `
You are an expert Australian recruitment consultant and professional resume writer.
A candidate wants to work in Australia. Convert their provided details into an Australian-standard Resume (CV) and a tailored Cover Letter in English.
ALSO, provide a full, accurate, and easy-to-understand translation of the resume and cover letter into ${userLangName} so the applicant can understand every detail written.

Candidate Input:
- Name: ${data.name || 'Applicant'}
- Email: ${data.email || ''}
- Phone: ${data.phone || ''}
- Target City: ${data.location || 'Australia'}
- Target Job: ${data.targetJob || 'General Staff'}
- Visa Type: ${data.visaType || 'Working Holiday (Subclass 417)'}
- Availability: ${data.availability || 'Full-time'}
- Australian Licences: ${data.certifications?.join(', ') || 'None'}
- Past Experience & Key Strengths:
"${data.rawExperience || 'Customer service'}"

Strict Australian Resume Standards:
1. Resumes strictly PROHIBIT: photos, age, date of birth, gender, marital status, nationality.
2. Accurately reflect the candidate's actual workplace, industry, and accomplishments (e.g. Starbucks, cafes, izakaya, retail) using strong, active verbs in English.
3. In "translated", translate the Summary, Skills, Experiences, and Cover Letter faithfully into ${userLangName}.

Return ONLY a valid JSON object matching this schema:
{
  "personalInfo": {
    "name": "${data.name || 'Applicant'}",
    "email": "${data.email || ''}",
    "phone": "${data.phone || ''}",
    "location": "${data.location || 'Australia'}",
    "visa": "${data.visaType || 'Working Holiday'}"
  },
  "summary": "Impactful 2-3 sentence English summary",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "experiences": [
    {
      "role": "Role in English",
      "company": "Company in English",
      "duration": "Duration in English",
      "bullets": [
        "English achievement 1",
        "English achievement 2",
        "English achievement 3"
      ]
    }
  ],
  "certifications": ${JSON.stringify(data.certifications || [])},
  "coverLetter": "Full English cover letter addressed to Hiring Manager",
  "translated": {
    "summary": "Summary translated into ${userLangName}",
    "skills": ["Skills translated into ${userLangName}"],
    "experiences": [
      {
        "role": "Role translated",
        "company": "Company translated",
        "duration": "Duration translated",
        "bullets": ["Bullet 1 translated", "Bullet 2 translated", "Bullet 3 translated"]
      }
    ],
    "coverLetter": "Cover letter translated into ${userLangName}"
  }
}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
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