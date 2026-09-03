import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const name = data.name?.trim() || 'Applicant';
    const email = data.email?.trim() || '';
    const phone = data.phone?.trim() || '';
    const location = data.location?.trim() || 'Australia';
    const visa = data.visaType || 'Working Holiday';
    const availability = data.availability || 'Full-time';
    const targetJob = data.targetJob || 'Hospitality Staff';
    const certifications = data.certifications || [];
    const rawExp = data.rawExperience?.trim() || '';
    const lang = data.lang || 'ja';

    const lower = rawExp.toLowerCase();

    // 1. 店舗・企業名の判定（入力された事実ベース）
    let companyName = 'Local Venue / Store';
    let companyLang: Record<string, string> = {
      ja: '勤務先店舗',
      en: 'Store / Workplace',
      ko: '근무 매장',
      zh: '工作門市',
      es: 'Lugar de Trabajo',
    };

    if (lower.includes('スタバ') || lower.includes('スターバックス') || lower.includes('starbucks')) {
      companyName = 'Starbucks Coffee';
      companyLang = { ja: 'スターバックスコーヒー', en: 'Starbucks Coffee', ko: '스타벅스', zh: '星巴克 (Starbucks)', es: 'Starbucks Coffee' };
    } else if (lower.includes('マック') || lower.includes('マクドナルド') || lower.includes('mcdonald')) {
      companyName = "McDonald's";
      companyLang = { ja: 'マクドナルド', en: "McDonald's", ko: '맥도날드', zh: '麥當勞', es: "McDonald's" };
    } else if (lower.includes('ユニクロ') || lower.includes('uniqlo')) {
      companyName = 'UNIQLO';
      companyLang = { ja: 'ユニクロ', en: 'UNIQLO', ko: '유니클로', zh: '優衣庫 (UNIQLO)', es: 'UNIQLO' };
    } else if (lower.includes('カフェ') || lower.includes('cafe') || lower.includes('coffee')) {
      companyName = 'Specialty Cafe & Coffee Bar';
      companyLang = { ja: 'カフェ・喫茶店', en: 'Specialty Cafe', ko: '카페', zh: '咖啡廳', es: 'Cafetería de Especialidad' };
    } else if (lower.includes('居酒屋') || lower.includes('レストラン') || lower.includes('焼肉') || lower.includes('寿司')) {
      companyName = 'Casual Dining Restaurant';
      companyLang = { ja: '飲食店・レストラン', en: 'Casual Dining', ko: '레스토랑/음식점', zh: '餐廳/餐飲店', es: 'Restaurante' };
    }

    // 2. 年数・期間の抽出（架空の年号は絶対に入れない）
    const yearMatch = rawExp.match(/(\d+)\s*(年|years?|yr|년|歲)/i);
    const yearsNum = yearMatch ? yearMatch[1] : '';

    const durationEn = yearsNum ? `${yearsNum} Years` : '';
    const durationLangMap: Record<string, string> = {
      ja: yearsNum ? `${yearsNum}年間` : '',
      en: yearsNum ? `${yearsNum} Years` : '',
      ko: yearsNum ? `${yearsNum}년` : '',
      zh: yearsNum ? `${yearsNum}年` : '',
      es: yearsNum ? `${yearsNum} Años` : '',
    };
    const durationTranslation = durationLangMap[lang] || durationEn;

    // 3. 箇条書き（事実ベースの英訳＋各言語訳）
    const bulletsData = [
      {
        en: `Delivered attentive customer service and maintained daily floor and counter routines at ${companyName}.`,
        trans: {
          ja: `${companyLang.ja}にて丁寧な接客を行い、フロア・カウンターの日常業務を担当。`,
          en: `Delivered attentive customer service and maintained daily floor and counter routines at ${companyName}.`,
          ko: `${companyLang.ko}에서 친절한 고객 응대와 매장 카운터 및 홀 업무를 담당.`,
          zh: `在${companyLang.zh}提供親切的顧客服務，負責每日外場與櫃檯營運事務。`,
          es: `Brindé una excelente atención al cliente y realicé tareas diarias en piso y mostrador en ${companyName}.`,
        },
      },
      {
        en: `Maintained speed and accuracy in fulfilling orders, ensuring smooth operations during peak hours.`,
        trans: {
          ja: `混雑時やピーク時にもスピードと正確さを保ち、スムーズな商品提供と店舗運営に貢献。`,
          en: `Maintained speed and accuracy in fulfilling orders, ensuring smooth operations during peak hours.`,
          ko: `피크 시간대에도 신속하고 정확하게 주문을 처리하여 원활한 매장 운영에 기여.`,
          zh: `在尖峰時段保持迅速且準確地處理訂單，維持順暢的門市運作。`,
          es: `Mantuve rapidez y precisión en la preparación de pedidos durante las horas de mayor actividad.`,
        },
      },
      {
        en: `Collaborated effectively with team members and upheld high cleanliness and workplace safety standards.`,
        trans: {
          ja: `チームメンバーと円滑に連携し、清潔な職場環境と衛生・安全基準を徹底維持。`,
          en: `Collaborated effectively with team members and upheld high cleanliness and workplace safety standards.`,
          ko: `팀원들과 원활하게 협력하며 철저한 청결 상태와 위생·안전 기준을 준수.`,
          zh: `與團隊成員保持良好溝通合作，嚴格維護門市整潔與衛生安全標準。`,
          es: `Colaboré estrechamente con el equipo y cumplí con altos estándares de higiene y seguridad laboral.`,
        },
      },
    ];

    if (lower.includes('ドリンク') || lower.includes('コーヒー') || lower.includes('作成') || lower.includes('調理') || lower.includes('음료') || lower.includes('飲料')) {
      bulletsData.unshift({
        en: `Prepared quality beverages and customized customer orders accurately following standard recipes.`,
        trans: {
          ja: `規定の手順に沿って高品質なドリンクを作成し、お客様のカスタム注文にも正確に対応。`,
          en: `Prepared quality beverages and customized customer orders accurately following standard recipes.`,
          ko: `표준 레시피에 따라 고품질 음료를 제조하고 고객의 맞춤 주문을 정확히 수행.`,
          zh: `遵循標準流程製作高品質飲品，並準確客製化顧客需求。`,
          es: `Preparé bebidas de calidad y pedidos personalizados siguiendo estrictamente las recetas estándar.`,
        },
      });
    }

    if (lower.includes('レジ') || lower.includes('会計') || lower.includes('pos') || lower.includes('결제') || lower.includes('結帳')) {
      bulletsData.push({
        en: `Operated point-of-sale (POS) systems with precision, handling payments and billing without discrepancies.`,
        trans: {
          ja: `POSレジ操作を正確に行い、ミスのない会計・レジ締め業務を担当。`,
          en: `Operated point-of-sale (POS) systems with precision, handling payments and billing without discrepancies.`,
          ko: `POS 시스템을 정확하게 조작하여 결제 및 정산 업무를 오차 없이 처리.`,
          zh: `熟練操作POS收銀機，精準完成顧客結帳與對帳業務。`,
          es: `Operé sistemas de punto de venta (POS) con alta precisión en cobros y facturación.`,
        },
      });
    }

    // 4. サマリー文
    const expSnippet = durationEn ? ` (${durationEn})` : '';
    const summaryEn = `Dedicated and dependable professional with practical background at ${companyName}${expSnippet}. Proven ability to deliver fast, friendly service and collaborate effectively in busy team environments. Eligible to work in Australia on a ${visa} (${availability}), seeking to contribute immediately in ${location}.`;

    const summaryTransMap: Record<string, string> = {
      ja: `${companyLang.ja}での実務経験${durationTranslation ? `（${durationTranslation}）` : ''}を持つ、責任感あるスタッフです。忙しい現場でも迅速で丁寧な接客とチームワークを発揮できます。${visa}（${availability}）を所持しており、${location}にて即日勤務可能です。`,
      en: summaryEn,
      ko: `${companyLang.ko}에서의 실무 경험${durationTranslation ? `(${durationTranslation})` : ''}을 갖춘 성실한 인재입니다. 바쁜 환경에서도 신속하고 친절한 고객 서비스와 팀워크를 발휘할 수 있습니다. 호주 ${visa}(${availability}) 소지자로, ${location}에서 즉시 근무 가능합니다.`,
      zh: `具備${companyLang.zh}實務工作經驗${durationTranslation ? `（${durationTranslation}）` : ''}，態度積極負責。擅長在忙碌環境中保持熱忱迅速的服務與團隊協作。持${visa}（${availability}），可於${location}立即上工。`,
      es: `Profesional dedicado con experiencia práctica en ${companyName}${durationTranslation ? ` (${durationTranslation})` : ''}. Capacidad comprobada para brindar un servicio rápido y amigable. Cuento con ${visa} (${availability}) y disponibilidad inmediata en ${location}.`,
    };

    // 5. カバーレター
    const contactLine = phone ? `${phone} | ${email}` : email;
    const coverLetterEn = `Dear Hiring Manager,

I am writing to express my strong interest in joining your team in ${location} as a ${targetJob}. Having gained valuable hands-on experience at ${companyName}${expSnippet}, I have established strong customer service fundamentals, work ethic, and adaptability in fast-paced venues.

Key qualifications I offer:
• Direct operational experience at ${companyName} delivering consistent customer care.
• Reliable, punctual, and quick to adopt Australian workplace procedures.
${certifications.length > 0 ? `• Verified Australian qualification: ${certifications.join(', ')}.\n` : ''}
I hold a valid ${visa} with ${availability} availability. I am ready for an interview or trial shift at your convenience.

Sincerely,
${name}
${contactLine}`;

    const coverLetterTransMap: Record<string, string> = {
      ja: `採用担当者様

${location}での${targetJob}職に応募したくご連絡いたしました。${companyLang.ja}での現場経験${durationTranslation ? `（${durationTranslation}）` : ''}を通じ、丁寧な接客と高い適応力を身につけてまいりました。

【私の強み】
• ${companyLang.ja}での現場実務経験
• 時間厳守、素早い業務習得、オーストラリア基準に沿った就労
${certifications.length > 0 ? `• 取得済みライセンス: ${certifications.join(', ')}\n` : ''}
${visa}（就労条件: ${availability}）を所持しており、即日の面接やトライアル勤務が可能です。

${name}
${contactLine}`,
      en: coverLetterEn,
      ko: `채용 담당자님께

${location}의 ${targetJob} 포지션에 지원하고자 합니다. ${companyLang.ko}에서의 실무 경험${durationTranslation ? `(${durationTranslation})` : ''}을 통해 친절한 고객 서비스와 빠른 현장 적응력을 길러왔습니다.

【주요 강점】
• ${companyLang.ko} 실무 경험을 바탕으로 한 고객 응대
• 시간 엄수, 빠른 업무 습득, 호주 현장 기준 준수
${certifications.length > 0 ? `• 보유 자격증: ${certifications.join(', ')}\n` : ''}
${visa}(${availability})를 소지하고 있으며, 즉시 면접 및 트라이얼 근무가 가능합니다.

${name}
${contactLine}`,
      zh: `親愛的招聘主管，

我希望能應徵在${location}的${targetJob}職位。我曾在${companyLang.zh}累積了豐富的實務經驗${durationTranslation ? `（${durationTranslation}）` : ''}，具備良好的顧客服務基礎與適應能力。

【主要優勢】
• 在${companyLang.zh}的第一線實務經驗
• 守時負責、學習迅速、遵守澳洲職場規範
${certifications.length > 0 ? `• 澳洲相關證照: ${certifications.join(', ')}\n` : ''}
持有${visa}（${availability}），可隨時配合面試或試工。

${name}
${contactLine}`,
      es: `Estimado Gerente de Contratación,

Le escribo para postularme al puesto de ${targetJob} en ${location}. A través de mi experiencia en ${companyName}${durationTranslation ? ` (${durationTranslation})` : ''}, he desarrollado una sólida base en servicio al cliente y adaptabilidad.

【Fortalezas】
• Experiencia práctica en ${companyName}
• Puntualidad, rápido aprendizaje y compromiso laboral
${certifications.length > 0 ? `• Certificados: ${certifications.join(', ')}\n` : ''}
Cuento con ${visa} (${availability}) y disponibilidad inmediata para entrevistas o turnos de prueba.

${name}
${contactLine}`,
    };

    const result = {
      personalInfo: {
        name,
        email,
        phone,
        location,
        visa: `${visa} (${availability})`,
      },
      summary: summaryEn,
      summaryTrans: summaryTransMap[lang] || summaryTransMap['ja'],
      skills: [
        'Customer Service & Hospitality',
        'Speed of Service & Accuracy',
        'POS & Cash Handling',
        'Workplace Cleanliness & Hygiene',
        'Team Collaboration',
      ],
      experiences: [
        {
          role: targetJob,
          company: companyName,
          duration: durationEn, // 架空の年号はなく、入力された "3 Years" のみ
          durationTrans: durationTranslation,
          bullets: bulletsData.map((b) => b.en),
          bulletsTrans: bulletsData.map((b) => b.trans[lang] || b.trans['ja']),
        },
      ],
      certifications: certifications.length > 0 ? certifications : ['Valid Australian Work Rights'],
      coverLetter: coverLetterEn,
      coverLetterTrans: coverLetterTransMap[lang] || coverLetterTransMap['ja'],
    };

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Processing failed' }, { status: 500 });
  }
}