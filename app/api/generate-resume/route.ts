import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const name = data.name?.trim() || 'Applicant';
    const email = data.email?.trim() || 'applicant@example.com';
    const phone = data.phone?.trim() || '0400 000 000';
    const location = data.location?.trim() || 'Perth, WA';
    const visa = `${data.visaType || 'Working Holiday (Subclass 417)'} (${data.availability || 'Full-time'})`;
    const targetJob = data.targetJob?.trim() || 'Hospitality / All-Rounder';
    const certifications = data.certifications || [];
    const expInput = (data.rawExperience || '').toLowerCase();

    // 職種や入力キーワードに応じたオーストラリア標準の英文弾幕プリセット
    let roleTitle = targetJob;
    let summaryEnglish = '';
    let skillsEnglish: string[] = [];
    let bulletPoints: string[] = [];

    if (expInput.includes('カフェ') || expInput.includes('コーヒー') || expInput.includes('バリスタ') || expInput.includes('barista') || expInput.includes('cafe')) {
      roleTitle = 'Barista / Cafe All-Rounder';
      summaryEnglish = `Dedicated and energetic Barista & All-Rounder with extensive experience in fast-paced cafe environments. Skilled in espresso extraction, milk texturing, high-volume order processing, and exceptional customer service. Fully eligible to work in Australia on a ${visa}.`;
      skillsEnglish = [
        'Espresso Extraction & Latte Art',
        'High-Volume Food & Beverage Service',
        'POS Operation & Cash Management',
        'Workplace Hygiene & Food Safety',
        'Effective Team Communication',
      ];
      bulletPoints = [
        'Delivered consistent, high-standard specialty coffee and beverages during peak morning rush periods.',
        'Operated commercial espresso machines, grinders, and POS systems with speed, accuracy, and friendly hospitality.',
        'Maintained strict Australian food safety and hygiene regulations throughout opening and closing duties.',
        'Proactively supported front-of-house customer service and table turnover in a multi-cultural team environment.',
      ];
    } else if (expInput.includes('接客') || expInput.includes('居酒屋') || expInput.includes('レストラン') || expInput.includes('飲食') || expInput.includes('wait') || expInput.includes('server')) {
      roleTitle = 'Food & Beverage Attendant / Floor Staff';
      summaryEnglish = `Customer-focused and hardworking Hospitality Attendant with proven hands-on experience in high-turnover dining venues. Adept at table service, order taking, and conflict resolution with a vibrant, welcoming attitude. Available immediately on ${visa}.`;
      skillsEnglish = [
        'Exceptional Customer Care & Table Service',
        'Order Taking & Sequence of Service',
        'Responsible Service of Alcohol (RSA)',
        'Time Management & Multitasking',
        'Cleanliness & Sanitation Procedures',
      ];
      bulletPoints = [
        'Greeted patrons warmly, explained menu items clearly, and processed orders accurately under high-pressure shifts.',
        'Collaborated with kitchen and bar teams to guarantee fast, seamless service delivery and high guest satisfaction.',
        'Executed end-of-shift cash reconciliations and thorough venue sanitation following Australian WHS guidelines.',
      ];
    } else if (expInput.includes('工事') || expInput.includes('現場') || expInput.includes('建築') || expInput.includes('倉庫') || expInput.includes('ピッキング') || expInput.includes('construction') || expInput.includes('warehouse')) {
      roleTitle = 'General Labourer / Warehouse Assistant';
      summaryEnglish = `Physically fit, safety-conscious, and dependable Labourer with strong experience in site preparation, manual handling, and team logistics. Ready to commit full-time with a strong work ethic on ${visa}.`;
      skillsEnglish = [
        'Manual Handling & Physical Stamina',
        'Workplace Health & Safety (WHS)',
        'Tool & Machinery Operation Basics',
        'Inventory Check & Loading/Unloading',
        'Reliable Punctuality & Teamwork',
      ];
      bulletPoints = [
        'Executed manual handling tasks, site cleanup, and materials loading while strictly adhering to safety standards.',
        'Assisted tradespeople and supervisors efficiently to ensure daily project milestones were completed on schedule.',
        'Demonstrated 100% punctuality, physical endurance, and active adherence to PPE and onsite hazards protocols.',
      ];
    } else {
      // 汎用サービス・販売・オールラウンダー
      roleTitle = targetJob || 'Customer Service All-Rounder';
      summaryEnglish = `Versatile, adaptable, and customer-oriented professional with a strong background in service operations and team coordination. Quick learner who thrives in dynamic Australian business environments. Holds valid work rights on ${visa}.`;
      skillsEnglish = [
        'Customer Service & Relationship Building',
        'Fast Problem Solving & Active Listening',
        'Stock Organisation & Merchandising',
        'Point of Sale (POS) Systems & Cash Balancing',
        'Collaborative Team Spirit',
      ];
      bulletPoints = [
        'Provided friendly, prompt, and professional assistance to customers, consistently receiving positive feedback.',
        'Adapted rapidly to fast-paced operational workflows, supporting colleagues to maintain smooth daily business.',
        'Maintained an organised, clean, and appealing floor presentation while accurately tracking incoming inventory.',
      ];
    }

    const resumeData = {
      personalInfo: {
        name,
        email,
        phone,
        location,
        visa,
      },
      summary: summaryEnglish,
      skills: skillsEnglish,
      experiences: [
        {
          role: roleTitle,
          company: 'Hospitality & Retail Services',
          duration: '2023 - Present',
          bullets: bulletPoints,
        },
      ],
      certifications: certifications.length > 0 ? certifications : ['Valid Australian Work Rights'],
      coverLetter: `Dear Hiring Manager,

I am writing to express my strong enthusiasm for the ${targetJob || roleTitle} position currently available in ${location}. With my solid background in customer service and hands-on team operations, I am confident in my ability to hit the ground running and make an immediate positive contribution to your business.

Throughout my previous experience, I have developed strong interpersonal communication skills, an eye for detail, and the ability to thrive under high-pressure, fast-paced environments. I take genuine pride in delivering exceptional customer experiences and maintaining seamless cooperation with my team members.
${certifications.length > 0 ? `\nI currently hold verified Australian qualifications, including: ${certifications.join(', ')}.` : ''}

I hold a valid ${visa} with full working rights and total flexibility to work weekdays, weekends, early mornings, and public holidays as required. I am eager to contribute to your company's ongoing success and am available for an immediate start.

Thank you for your time and consideration. I look forward to the opportunity to discuss my qualifications with you in an interview.

Sincerely,
${name}
${phone} | ${email}`,
    };

    return NextResponse.json(resumeData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}