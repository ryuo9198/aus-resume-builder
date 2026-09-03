import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY が設定されていません' }, { status: 500 });
    }

    const data = await req.json();

    const name = data.name?.trim() || 'Applicant';
    const email = data.email?.trim() || '';
    const phone = data.phone?.trim() || '';
    const location = data.location?.trim() || 'Australia';
    const visa = `${data.visaType || 'Working Holiday'} (${data.availability || 'Full-time'})`;
    const targetJob = data.targetJob?.trim() || 'General Staff';
    const certifications = data.certifications || [];
    const rawExp = data.rawExperience?.trim() || '';
    const lang = data.lang || 'ja';

    const langNameMap: Record<string, string> = {
      ja: 'Japanese',
      en: 'English',
      ko: 'Korean',
      zh: 'Traditional Chinese',
      es: 'Spanish',
    };
    const targetLangName = langNameMap[lang] || 'Japanese';

    // AIへの厳格な指示プロンプト
    const prompt = `
You are an expert Australian recruitment consultant and professional resume writer.
A candidate wants to work in Australia. Convert their provided details into an Australian-standard Resume (CV) and a tailored Cover Letter.

Candidate Input:
- Candidate Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Target City in Australia: ${location}
- Target Role: ${targetJob}
- Visa Status: ${visa}
- Verified Licences: ${certifications.join(', ') || 'None'}
- Candidate's Real Experience & Notes (in their language):
"${rawExp}"

CRITICAL RULES FOR ACCURACY & FACTUALITY:
1. STRICT FACTUAL TRUTH: Do NOT hallucinate or invent specific calendar years (e.g., DO NOT output "2023 - 2024" or "2021 - Present" unless the candidate explicitly typed those exact years). If they said "3年間" or "3 years", write duration ONLY as "3 Years". If no duration is provided, leave duration as "".
2. COMPANY & WORKPLACE: Identify their real company/store name from their input (e.g. if they say "スタバ", company is "Starbucks Coffee"). If no specific store is named, infer the general type (e.g., "Cafe & Eatery"). Do NOT invent unrelated companies.
3. BULLETS: Convert their actual duties and tasks into 3 to 4 strong, action-oriented Australian professional English bullet points (verbs like Handcrafted, Delivered, Operated, Coordinated).
4. ACCURATE BILINGUAL TRANSLATION: For each English section (summary, each bullet point, and cover letter), provide an exact, natural matching translation in ${targetLangName} so the candidate can read and understand exactly what is written about them.

Return ONLY a valid JSON object matching this structure:
{
  "personalInfo": {
    "name": "${name}",
    "email": "${email}",
    "phone": "${phone}",
    "location": "${location}",
    "visa": "${visa}"
  },
  "summary": "2-3 impactful English sentences highlighting their target role, real past background, and Australian work rights.",
  "summaryTrans": "The accurate translation of the summary in ${targetLangName}.",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "experiences": [
    {
      "role": "${targetJob}",
      "company": "Real company or store name derived from input",
      "duration": "Duration derived strictly from input (e.g. '3 Years' or ''), NO fake calendar years",
      "durationTrans": "Duration translated into ${targetLangName} (e.g. '3年間' or '')",
      "bullets": [
        "Action-verb English duty 1 reflecting their input",
        "Action-verb English duty 2 reflecting their input",
        "Action-verb English duty 3 reflecting their input"
      ],
      "bulletsTrans": [
        "Translation of duty 1 in ${targetLangName}",
        "Translation of duty 2 in ${targetLangName}",
        "Translation of duty 3 in ${targetLangName}"
      ]
    }
  ],
  "certifications": ${JSON.stringify(certifications.length > 0 ? certifications : ['Valid Australian Work Rights'])},
  "coverLetter": "A full, professional Australian cover letter in English addressed to Hiring Manager, tailored strictly to the role and their real background.",
  "coverLetterTrans": "The full translation of the cover letter in ${targetLangName}."
}
`;

    // 503エラー対策：最新モデルを順に自動リトライして確実にAI出力を得る
    const candidateModels = [
      'gemini-3.6-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.7-flash',
      'gemini-3.8-flash',
    ];

    let generatedJson: any = null;
    let lastError: string = '';

    for (const modelName of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
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

        if (response.ok) {
          const resJson = await response.json();
          let text = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
          text = text.replace(/```json/g, '').replace(/```/g, '').trim();
          if (text) {
            generatedJson = JSON.parse(text);
            break; // 成功したらループ終了
          }
        } else {
          lastError = await response.text();
          console.warn(`Model ${modelName} returned status ${response.status}, trying next model...`);
        }
      } catch (err: any) {
        lastError = err.message;
        console.warn(`Failed with ${modelName}:`, err);
      }
    }

    if (!generatedJson) {
      return NextResponse.json({ error: `AI呼び出しエラー: ${lastError}` }, { status: 500 });
    }

    return NextResponse.json(generatedJson);
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}