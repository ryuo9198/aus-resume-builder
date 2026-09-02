import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const name = data.name?.trim() || 'Applicant';
    const email = data.email?.trim() || 'applicant@example.com';
    const phone = data.phone?.trim() || '';
    const location = data.location?.trim() || 'Perth, WA';
    const visa = `${data.visaType || 'Working Holiday (Subclass 417)'} (${data.availability || 'Full-time'})`;
    const targetJob = data.targetJob?.trim() || 'Customer Service All-Rounder';
    const certifications = data.certifications || [];
    const expRaw = data.rawExperience?.trim() || '';

    // ユーザーの入力テキストから年数や期間のニュアンスを抽出
    let yearsMatch = expRaw.match(/(\d+)\s*(年|years?|yr)/i);
    let durationText = yearsMatch ? `${yearsMatch[1]}+ Years Experience` : '1 - 2 Years Relevant Experience';

    // 職種に応じた専門用語・スキル・実績箇条書きの動的辞書
    const jobProfiles: Record<string, {
      title: string;
      skills: string[];
      summaryLead: string;
      duties: string[];
    }> = {
      'Barista / Cafe All-Rounder': {
        title: 'Barista / Cafe All-Rounder',
        skills: ['Dialing in Espresso & Calibration', 'Silky Milk Steaming & Latte Art', 'Point of Sale (Square/Vend/Kounta)', 'Food Safety & Australian Hygiene Standards', 'Fast-Paced Morning Rush Management'],
        summaryLead: 'Energetic and customer-focused Barista with proven hands-on experience handling high-volume coffee orders and daily cafe workflows.',
        duties: [
          'Calibrated commercial espresso machines and grinders daily to maintain optimal extraction, grind size, and shot timing.',
          'Steamed dairy and plant-based milks to silky microfoam textures with consistent latte art standards.',
          'Operated POS registers quickly, handled cash and card payments accurately, and welcomed patrons warmly.',
          'Maintained high food hygiene and sanitisation across the coffee workstation, grinders, and dining floor.',
        ],
      },
      'Food & Beverage Attendant (Waiter/Waitress)': {
        title: 'Food & Beverage Attendant',
        skills: ['Table Service & Section Management', 'Menu Knowledge & Dietary Awareness', 'Order Taking & Sequence of Service', 'RSA Compliance & Cash Handling', 'Multicultural Teamwork'],
        summaryLead: 'Dynamic, attentive Hospitality Attendant experienced in busy floor service, high table turnover, and exceptional guest experiences.',
        duties: [
          'Greeted and seated customers, clearly explained daily specials, and managed full station tables efficiently.',
          'Delivered food and beverages accurately following Australian sequence-of-service and RSA standards.',
          'Maintained excellent communication between front-of-house staff and kitchen crew to guarantee rapid turnaround.',
          'Handled end-of-shift resets, cutlery polishing, floor sanitisation, and register reconciliation.',
        ],
      },
      'Kitchen Hand / Dishwasher': {
        title: 'Kitchen Hand / Dishwasher',
        skills: ['Commercial Dishwasher Operation', 'Basic Food Prep & Knife Skills', 'Australian Food Safety & Hygiene', 'Heavy Lifting & Kitchen Organization', 'High-Paced Stress Tolerance'],
        summaryLead: 'Hardworking, punctual Kitchen Hand experienced in fast-paced commercial kitchens, prep support, and strict sanitisation.',
        duties: [
          'Operated high-capacity industrial dishwashers, ensuring spotless hygiene and rapid turnaround of pans, plates, and utensils.',
          'Assisted head chefs with raw vegetable prep, trimming, portioning, and basic line station setups.',
          'Maintained clean and grease-free workstations, floor drainage, rubbish disposal, and safe chemical handling.',
        ],
      },
      'Retail Assistant / Cashier': {
        title: 'Retail Sales Assistant',
        skills: ['POS Operation & Cash Balancing', 'Merchandising & Stock Replenishment', 'Customer Relationship Building', 'Active Listening & Conflict Resolution', 'Inventory Counting'],
        summaryLead: 'Friendly, proactive Retail Assistant with a strong track record of sales assistance, neat store presentation, and rapid customer service.',
        duties: [
          'Assisted customers with product queries, recommended complementary items, and maintained high store ratings.',
          'Operated POS counters accurately, processed EFTPOS/cash transactions, and handled customer returns.',
          'Organised floor displays, tagged merchandise, received stock deliveries, and performed inventory counts.',
        ],
      },
      'General Labourer (Construction)': {
        title: 'General Construction Labourer',
        skills: ['Workplace Health & Safety (WHS)', 'Power & Hand Tools Handling', 'Site Clearing & Waste Disposal', 'Heavy Lifting (up to 25kg+)', 'White Card Compliance'],
        summaryLead: 'Reliable, physically fit Labourer with strong safety discipline, stamina, and experience supporting trades on active work sites.',
        duties: [
          'Conducted site setup, manual material handling, trenching assistance, and general demolition cleanup.',
          'Adhered strictly to Australian WHS regulations, site hazard assessments, and PPE safety protocols.',
          'Assisted carpenters, concreters, and site managers efficiently to keep job progress on schedule.',
        ],
      },
      'Warehouse Assistant / Forklift': {
        title: 'Warehouse & Logistics Assistant',
        skills: ['Order Picking & Packing (RF Scanner)', 'Pallet Wrapping & Staging', 'Inventory Receiving & Dispatch', 'Workplace Safety & Manual Handling', 'Time Management'],
        summaryLead: 'Detail-oriented and punctual Warehouse Assistant experienced in dispatch logistics, stock accuracy, and heavy cargo safety.',
        duties: [
          'Picked, packed, and scanned bulk customer orders using handheld RF barcode scanners with minimal error rates.',
          'Unloaded containers, verified delivery dockets, and restocked warehouse racking according to FIFO standards.',
          'Maintained tidy aisles, pallet storage areas, and followed standard manual handling guidelines diligently.',
        ],
      },
      'Housekeeper / Hotel Cleaner': {
        title: 'Housekeeping Attendant',
        skills: ['Room Turnover & Bed Making', 'Chemical & Disinfection Standards', 'Attention to Detail & Speed', 'Lost Property & Linen Management', 'Guest Privacy & Discretion'],
        summaryLead: 'Meticulous and energetic Housekeeper with expertise in rapid hotel room turnovers and spotless Australian accommodation standards.',
        duties: [
          'Stripped and made beds to five-star hotel presentation guidelines, thoroughly dusted, vacuumed, and sanitised suites.',
          'Restocked bathroom amenities, linens, and minibar items within allocated time targets per room.',
          'Reported maintenance defects promptly and followed hygiene and infection control standards strictly.',
        ],
      },
      'Farm Hand / Fruit Picker': {
        title: 'Farm Hand / Harvest Worker',
        skills: ['Fruit Picking & Quality Sorting', 'Physical Endurance & Heat Tolerance', 'Pruning & Field Maintenance', 'Equipment Care & Outdoor Operations', 'Team Reliability'],
        summaryLead: 'Resilient and hardworking Harvest Hand experienced in outdoor agricultural routines, careful crop handling, and high-volume quota targets.',
        duties: [
          'Harvested fruits and vegetables at high picking speeds while protecting produce from bruising and damage.',
          'Sorted, graded, and packed produce into field bins in accordance with export-quality specifications.',
          'Operated basic farm equipment, maintained irrigation lines, and performed general field weeding and pruning.',
        ],
      },
      'Bartender / Pub Staff': {
        title: 'Bartender / Beverage Staff',
        skills: ['Cocktail Crafting & Beer Taps', 'Responsible Service of Alcohol (RSA)', 'Speed of Service & Cleanliness', 'POS Balancing & Till Operation', 'Vibrant Customer Engagement'],
        summaryLead: 'Vibrant, fast-moving Bartender adept at handling high-volume bar counters, drafting tap beers, and ensuring strict RSA compliance.',
        duties: [
          'Mixed classic cocktails, poured tap beers with proper head retention, and served patrons with high energy.',
          'Monitored patron sobriety, handled ID checks, and ensured full adherence to Australian liquor licensing laws.',
          'Restocked kegs, cleaned beer lines, washed glassware, and balanced registers at closing time.',
        ],
      },
      'Customer Service Representative': {
        title: 'Customer Service Representative',
        skills: ['Written & Verbal Communication', 'CRM & Ticket Management', 'Problem Solving & Escalations', 'Data Entry & Microsoft Office', 'Patience & Active Listening'],
        summaryLead: 'Professional and solution-driven Customer Service Representative experienced in client inquiries, issue resolution, and accurate documentation.',
        duties: [
          'Managed inbound customer phone calls, emails, and online chats promptly, achieving high first-contact resolution rates.',
          'Documented customer interactions accurately inside CRM systems and collaborated with departments to solve issues.',
          'De-escalated difficult client situations calmly and upheld high standards of company representation.',
        ],
      },
    };

    // 該当する職種プロファイルを取得（なければデフォルト）
    const matchedProfile = jobProfiles[targetJob] || jobProfiles['Retail Assistant / Cashier'];

    // ユーザーの入力テキストを要約文やアピール文に自然にブレンド
    const summaryEnglish = `${matchedProfile.summaryLead} Bringing a proven background (${durationText}) with demonstrated skills in rapid workflow execution, team collaboration, and high reliability. Fully eligible to work in Australia on a ${visa}, seeking to deliver immediate value in ${location}.`;

    const contactLine = phone ? `${phone} | ${email}` : email;

    const resumeData = {
      personalInfo: {
        name,
        email,
        phone,
        location,
        visa,
      },
      summary: summaryEnglish,
      skills: matchedProfile.skills,
      experiences: [
        {
          role: matchedProfile.title,
          company: `${location.split(',')[0]} Industry Services`,
          duration: '2023 - Present',
          bullets: matchedProfile.duties,
        },
      ],
      certifications: certifications.length > 0 ? certifications : ['Valid Australian Work Rights'],
      coverLetter: `Dear Hiring Manager,

I am writing to express my strong enthusiasm for the ${matchedProfile.title} position in ${location}. Having reviewed your requirements, I am confident that my practical background, dedication to service excellence, and strong work ethic make me an ideal candidate for your team.

My background includes hands-on experience in fast-paced service environments (${durationText}). Key strengths I bring to this position include:
• ${matchedProfile.skills[0]}
• ${matchedProfile.skills[1]}
• ${matchedProfile.skills[2]}
${certifications.length > 0 ? `\nIn addition, I hold verified Australian qualifications: ${certifications.join(', ')}.` : ''}

I hold a valid ${visa} with full working rights and complete flexibility across weekday morning/night shifts, weekends, and public holidays. I take pride in being punctual, eager to adapt to your venue's standard operating procedures, and ready to hit the ground running immediately.

Thank you for considering my application. I welcome the opportunity to discuss my qualifications with you in person and am available for an interview or trial shift at your earliest convenience.

Sincerely,
${name}
${contactLine}`,
    };

    return NextResponse.json(resumeData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}