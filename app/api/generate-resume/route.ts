import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const name = data.name?.trim() || 'Applicant';
    const email = data.email?.trim() || 'applicant@example.com';
    const phone = data.phone?.trim() || '0400 000 000';
    const location = data.location?.trim() || 'Australia';
    const visa = `${data.visaType || 'Working Holiday (Subclass 417)'} (${data.availability || 'Full-time'})`;
    const targetJob = data.targetJob?.trim() || 'Hospitality / General Staff';
    const certifications = data.certifications || [];
    const experienceText = data.rawExperience?.trim() || 'Experienced team member with strong communication and customer service skills.';

    const resumeData = {
      personalInfo: {
        name,
        email,
        phone,
        location,
        visa,
      },
      summary: `Enthusiastic and reliable ${targetJob} professional based in ${location}. Proven background in ${experienceText.slice(0, 60)} with a strong commitment to delivering exceptional customer service, maintaining high operational standards, and working efficiently in fast-paced Australian work environments. Available for immediate start on ${visa}.`,
      skills: [
        'Customer Service & Communication',
        'Time Management & Multitasking',
        'Team Collaboration & POS Systems',
        'Workplace Health & Safety (WHS)',
        'Cash Handling & Reliability',
      ],
      experiences: [
        {
          role: targetJob,
          company: 'Hospitality & Retail Services',
          duration: '2023 - Present',
          bullets: [
            `Demonstrated high reliability and communication skills: "${experienceText.slice(0, 80)}"`,
            'Maintained clean, safe, and efficient operations adhering strictly to Australian workplace standards.',
            'Collaborated closely with multicultural team members to ensure smooth service and exceptional customer satisfaction.',
          ],
        },
      ],
      certifications: certifications.length > 0 ? certifications : ['Valid Australian Work Rights'],
      coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the ${targetJob} position currently available in ${location}. With my dedication to excellent service and strong work ethic, I am confident in my ability to make an immediate positive contribution to your team.

My background includes: ${experienceText}
${certifications.length > 0 ? `I currently hold relevant qualifications including: ${certifications.join(', ')}.` : ''}

I hold a valid ${visa} with full working rights and flexible availability across weekdays, weekends, and public holidays. I am proactive, quick to learn local workflows, and committed to high standards of reliability.

Thank you for considering my application. I welcome the opportunity to discuss my suitability in an interview and am available for immediate start.

Sincerely,
${name}
${phone} | ${email}`,
    };

    return NextResponse.json(resumeData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}