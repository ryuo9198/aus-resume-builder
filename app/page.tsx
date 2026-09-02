'use client';
import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { ResumePDF } from '@/components/ResumePDF';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

type Language = 'ja' | 'en' | 'ko' | 'zh' | 'es';

const JOB_DATA = [
  {
    value: 'Barista / Cafe All-Rounder',
    labels: {
      ja: '☕ バリスタ / カフェ店員',
      en: '☕ Barista / Cafe All-Rounder',
      ko: '☕ 바리스타 / 카페 직원',
      zh: '☕ 咖啡師 / 咖啡廳全能店員',
      es: '☕ Barista / Personal de Cafetería',
    },
  },
  {
    value: 'Food & Beverage Attendant (Waiter/Waitress)',
    labels: {
      ja: '🍽️ レストラン・居酒屋ホール (接客/ウェイター)',
      en: '🍽️ Food & Beverage Attendant (Waiter/Waitress)',
      ko: '🍽️ 레스토랑 / 홀 서빙 (웨이터)',
      zh: '🍽️ 餐飲服務生 / 外場服務 (Waiter/Waitress)',
      es: '🍽️ Camarero/a / Servicio de Alimentos',
    },
  },
  {
    value: 'Kitchen Hand / Dishwasher',
    labels: {
      ja: '🍳 キッチンハンド / 皿洗い・調理補助',
      en: '🍳 Kitchen Hand / Dishwasher',
      ko: '🍳 키친핸드 / 설거지 및 조리 보조',
      zh: '🍳 廚房助手 / 洗碗工',
      es: '🍳 Ayudante de Cocina / Fregaplatos',
    },
  },
  {
    value: 'Retail Assistant / Cashier',
    labels: {
      ja: '🛍️ 販売スタッフ / レジ・接客',
      en: '🛍️ Retail Assistant / Cashier',
      ko: '🛍️ 리테일 매장 직원 / 캐셔',
      zh: '🛍️ 零售門市銷售 / 收銀員',
      es: '🛍️ Asistente de Tienda / Cajero',
    },
  },
  {
    value: 'General Labourer (Construction)',
    labels: {
      ja: '🏗️ 建設現場作業員 (General Labourer)',
      en: '🏗️ General Labourer (Construction)',
      ko: '🏗️ 건설 현장 잡부 / 노무직',
      zh: '🏗️ 工地勞工 (General Labourer)',
      es: '🏗️ Obrero de Construcción (Labourer)',
    },
  },
  {
    value: 'Warehouse Assistant / Forklift',
    labels: {
      ja: '📦 倉庫作業員 / ピッキング・フォークリフト',
      en: '📦 Warehouse Assistant / Forklift',
      ko: '📦 물류 창고 작업 / 피킹 / 지게차',
      zh: '📦 倉庫助手 / 揀貨 / 堆高機',
      es: '📦 Operario de Almacén / Montacargas',
    },
  },
  {
    value: 'Housekeeper / Hotel Cleaner',
    labels: {
      ja: '🧹 ホテル清掃 / ハウスキーパー',
      en: '🧹 Housekeeper / Hotel Cleaner',
      ko: '🧹 호텔 청소 / 하우스키핑',
      zh: '🧹 房務清潔 / 飯店 Housekeeper',
      es: '🧹 Mucama / Personal de Limpieza de Hotel',
    },
  },
  {
    value: 'Farm Hand / Fruit Picker',
    labels: {
      ja: '🍎 ファーム作業 / フルーツピッキング',
      en: '🍎 Farm Hand / Fruit Picker',
      ko: '🍎 농장 작업 / 과일 피킹',
      zh: '🍎 農場勞工 / 水果採摘 (Fruit Picker)',
      es: '🍎 Trabajador Agrícola / Recolector de Fruta',
    },
  },
  {
    value: 'Bartender / Pub Staff',
    labels: {
      ja: '🍸 バーテンダー / パブスタッフ',
      en: '🍸 Bartender / Pub Staff',
      ko: '🍸 바텐더 / 펍 스태프',
      zh: '🍸 調酒師 / 酒吧工作人員',
      es: '🍸 Bartender / Personal de Bar',
    },
  },
  {
    value: 'Customer Service Representative',
    labels: {
      ja: '📞 一般事務 / カスタマーサポート',
      en: '📞 Customer Service Representative',
      ko: '📞 일반 사무 / 고객 지원',
      zh: '📞 客服專員 / 一般辦公事務',
      es: '📞 Atención al Cliente / Oficina',
    },
  },
];

const VISA_DATA = [
  {
    value: 'Working Holiday (Subclass 417)',
    labels: {
      ja: 'ワーキングホリデービザ (Subclass 417)',
      en: 'Working Holiday Visa (Subclass 417)',
      ko: '워킹홀리데이 비자 (Subclass 417)',
      zh: '打工度假簽證 (Subclass 417)',
      es: 'Visa Working Holiday (Subclass 417)',
    },
  },
  {
    value: 'Work and Holiday (Subclass 462)',
    labels: {
      ja: 'ワーク＆ホリデービザ (Subclass 462)',
      en: 'Work and Holiday Visa (Subclass 462)',
      ko: '워크 앤 홀리데이 비자 (Subclass 462)',
      zh: '打工與度假簽證 (Subclass 462)',
      es: 'Visa Work and Holiday (Subclass 462)',
    },
  },
  {
    value: 'Student Visa (Subclass 500)',
    labels: {
      ja: '学生ビザ (Subclass 500)',
      en: 'Student Visa (Subclass 500)',
      ko: '학생 비자 (Subclass 500)',
      zh: '學生簽證 (Subclass 500)',
      es: 'Visa de Estudiante (Subclass 500)',
    },
  },
  {
    value: 'Temporary Graduate (Subclass 485)',
    labels: {
      ja: '卒業生ビザ (Subclass 485)',
      en: 'Temporary Graduate Visa (Subclass 485)',
      ko: '졸업생 비자 (Subclass 485)',
      zh: '畢業生工作簽證 (Subclass 485)',
      es: 'Visa de Graduado Temporal (Subclass 485)',
    },
  },
  {
    value: 'Permanent Resident (PR)',
    labels: {
      ja: '永住権 (Permanent Resident)',
      en: 'Permanent Resident (PR)',
      ko: '영주권 (Permanent Resident)',
      zh: '澳洲永久居留權 (PR)',
      es: 'Residencia Permanente (PR)',
    },
  },
];

const AVAILABILITY_DATA = [
  {
    value: 'Full-time (Immediate Start / Weekdays & Weekends)',
    labels: {
      ja: '即日勤務可・フルタイム可能 (平日・土日祝いつでも)',
      en: 'Full-time / Immediate Start (Any days/hours)',
      ko: '즉시 출근 가능 / 풀타임 (평일/주말 언제든 가능)',
      zh: '可立即上班 / 全職可配合 (平日及週末皆可)',
      es: 'Disponibilidad inmediata a tiempo completo (Fines de semana incluidos)',
    },
  },
  {
    value: 'Flexible (Up to 48 hours per fortnight - Student)',
    labels: {
      ja: '学生ビザ規定内 (2週間で最大48時間)',
      en: 'Student Visa Condition (Up to 48 hrs / fortnight)',
      ko: '학생 비자 규정 준수 (2주 최대 48시간 근무 가능)',
      zh: '學生簽證規定 (每兩週最多48小時)',
      es: 'Condición de Estudiante (Hasta 48 hrs quincenales)',
    },
  },
  {
    value: 'Part-time / Casual (Immediate Start)',
    labels: {
      ja: 'パートタイム / カジュアル (即日可)',
      en: 'Part-time / Casual (Immediate Start)',
      ko: '파트타임 / 캐주얼 (즉시 가능)',
      zh: '兼職 / 臨時工 (Casual / 可立即上班)',
      es: 'Medio Tiempo / Casual (Comienzo Inmediato)',
    },
  },
  {
    value: 'Morning Shifts Preferred (from 6:00 AM)',
    labels: {
      ja: '早朝・モーニングシフト希望 (朝6:00〜)',
      en: 'Morning Shifts Preferred (from 6:00 AM)',
      ko: '오전/모닝 시프트 선호 (아침 6:00부터 가능)',
      zh: '偏好早班 (可從早上6:00開始)',
      es: 'Preferencia Turno Mañana (desde las 6:00 AM)',
    },
  },
  {
    value: 'Evening & Night Shifts Preferred',
    labels: {
      ja: '夕方・夜間シフト希望 (ディナータイム中心)',
      en: 'Evening & Night Shifts Preferred',
      ko: '야간/디너 시프트 선호 (저녁 위주)',
      zh: '偏好晚班 (以晚餐/夜間時段為主)',
      es: 'Preferencia Turno Tarde/Noche',
    },
  },
];

const CERT_DATA = [
  {
    value: 'RSA (Responsible Service of Alcohol)',
    labels: {
      ja: 'RSA (お酒を提供する飲食店で必須の資格)',
      en: 'RSA (Responsible Service of Alcohol)',
      ko: 'RSA (주류 취급 필수 자격증)',
      zh: 'RSA (酒類服務責任證書 - 餐飲必備)',
      es: 'RSA (Servicio Responsable de Alcohol)',
    },
  },
  {
    value: 'White Card (Construction)',
    labels: {
      ja: 'ホワイトカード (建設現場・倉庫で必須の安全講習証)',
      en: 'White Card (General Construction Induction)',
      ko: '화이트카드 (건설/현장 필수 안전교육 이수증)',
      zh: '白卡 White Card (建築工地安全卡)',
      es: 'White Card (Seguridad para Construcción)',
    },
  },
  {
    value: 'Barista Certificate',
    labels: {
      ja: 'バリスタ認定証・コーヒースクール修了証',
      en: 'Barista Certificate',
      ko: '바리스타 수료증 / 커피 자격증',
      zh: '咖啡師培訓結業證書',
      es: 'Certificado de Barista',
    },
  },
  {
    value: 'First Aid & CPR',
    labels: {
      ja: 'ファーストエイド ＆ CPR (救急救命ライセンス)',
      en: 'First Aid & CPR (HLTAID011)',
      ko: '응급처치 & CPR 자격증',
      zh: '急救與心肺復甦術證照 (First Aid & CPR)',
      es: 'Primeros Auxilios y RCP',
    },
  },
  {
    value: 'Australian Driver Licence',
    labels: {
      ja: 'オーストラリア運転免許証 (または国際免許証)',
      en: 'Australian Driver Licence / Valid International Permit',
      ko: '호주 운전면허증 (또는 유효한 국제면허증)',
      zh: '澳洲駕照 / 國際駕照',
      es: 'Licencia de Conducir Australiana / Internacional',
    },
  },
  {
    value: 'RSG (Responsible Service of Gambling)',
    labels: {
      ja: 'RSG (カジノ・ゲーミングパブ関連の資格)',
      en: 'RSG (Responsible Service of Gambling)',
      ko: 'RSG (도박장 / 게임 관련 필수 자격증)',
      zh: 'RSG (博弈服務責任證書)',
      es: 'RSG (Servicio Responsable de Apuestas)',
    },
  },
];

const CITY_OPTIONS = [
  'Sydney, NSW',
  'Melbourne, VIC',
  'Brisbane, QLD',
  'Perth, WA',
  'Adelaide, SA',
  'Gold Coast, QLD',
  'Cairns, QLD',
  'Darwin, NT',
  'Hobart, TAS',
  'Canberra, ACT',
];

const translations = {
  ja: {
    title: '🇦🇺 Aus Resume & Cover Letter AI',
    subtitle: 'オーストラリアのローカルジョブ獲得に特化した英文レジュメ＆カバーレターを瞬時に作成',
    paidBadge: '🎉 プレミアム購入済み（アンロック中）',
    step1: '1. 情報を入力',
    name: 'お名前 (英語表記)',
    namePh: '例: Taro Yamada',
    email: 'メールアドレス',
    phone: '電話番号 (豪) ※任意',
    phonePh: '0423 000 000',
    location: '滞在都市 / 渡航予定先',
    targetJob: '希望職種 (選択してください)',
    visaType: 'ビザの種類',
    availability: '就労可能状況',
    certs: '保有資格・ライセンス (該当するものを選択)',
    experience: '過去の経験・アピールポイント (日本語でOK)',
    experiencePh: '例: スターバックスで3年間アルバイト。ドリンク作成、レジ、接客、新人バリスタの育成を担当。',
    generateBtn: '✨ 無料プレビューを生成',
    generatingBtn: 'AIが思考・生成中（約8秒）...',
    tabResume: '📄 Resume プレビュー',
    tabCover: '✉️ Cover Letter (添え状)',
    viewOriginal: '🇺🇸 英語原本',
    viewTranslated: '🌐 日本語訳を見る',
    emptyPreview: '左のフォームを入力して生成ボタンを押すと、\nここに書類一式が表示されます。',
    copyUnlocked: 'メールや応募フォームに貼る用 (英語原本)',
    copyLocked: '🔒 アンロックすると全文コピー可能になります',
    btnCopy: '📋 全文コピー',
    btnCopied: '✅ コピー完了！',
    btnLocked: '🔒 ロック中',
    btnDownloadPdf: '📄 高画質 PDF をダウンロード (英文)',
    btnUnlock: '🔓 PDF & カバーレターをアンロック ($4.99 AUD)',
    redirecting: '決済画面へ移動中...',
  },
  en: {
    title: '🇦🇺 Aus Resume & Cover Letter AI',
    subtitle: 'Create ATS-friendly Australian standard Resumes & Cover Letters instantly for local jobs.',
    paidBadge: '🎉 Premium Unlocked',
    step1: '1. Enter Your Details',
    name: 'Full Name (English)',
    namePh: 'e.g. Alex Smith',
    email: 'Email Address',
    phone: 'Phone Number (AU) (Optional)',
    phonePh: '0423 000 000',
    location: 'Current / Planned City',
    targetJob: 'Target Role (Select from list)',
    visaType: 'Visa Type',
    availability: 'Availability',
    certs: 'Australian Licences & Certifications',
    experience: 'Past Experience & Strengths',
    experiencePh: 'e.g. 3 years at Starbucks. Handcrafted specialty drinks, POS operation, trained junior baristas.',
    generateBtn: '✨ Generate Free Preview',
    generatingBtn: 'AI Generating (approx. 8s)...',
    tabResume: '📄 Resume Preview',
    tabCover: '✉️ Cover Letter',
    viewOriginal: '🇺🇸 English Original',
    viewTranslated: '🌐 Localized View',
    emptyPreview: 'Fill in the form on the left and click Generate to see your full preview here.',
    copyUnlocked: 'Ready to paste into job application emails',
    copyLocked: '🔒 Unlock to copy full cover letter',
    btnCopy: '📋 Copy Full Text',
    btnCopied: '✅ Copied!',
    btnLocked: '🔒 Locked',
    btnDownloadPdf: '📄 Download High-Quality PDF',
    btnUnlock: '🔓 Unlock PDF & Cover Letter ($4.99 AUD)',
    redirecting: 'Redirecting to checkout...',
  },
  ko: {
    title: '🇦🇺 호주 영문 이력서 & 커버레터 생성기',
    subtitle: '호주 현지 잡 구직에 최적화된 호주 표준 레주메와 커버레터를 즉시 완성합니다.',
    paidBadge: '🎉 프리미엄 구매 완료',
    step1: '1. 정보 입력',
    name: '영문 성명',
    namePh: '예: Minwoo Kim',
    email: '이메일 주소',
    phone: '호주 전화번호 (선택사항)',
    phonePh: '0423 000 000',
    location: '거주/입국 예정 도시',
    targetJob: '희망 직종 (선택)',
    visaType: '비자 종류',
    availability: '근무 가능 시간',
    certs: '보유 자격증 / 라이센스 (해당 항목 체크)',
    experience: '경력 및 강점 (한국어로 편하게 작성)',
    experiencePh: '예: 스타벅스 3년 근무. 음료 제조, 포스 결제, 고객 응대, 신입 바리스타 교육 담당.',
    generateBtn: '✨ 무료 미리보기 생성',
    generatingBtn: 'AI 생성 중 (약 8초)...',
    tabResume: '📄 레주메 미리보기',
    tabCover: '✉️ 커버레터',
    viewOriginal: '🇺🇸 영어 원문',
    viewTranslated: '🌐 한국어 번역본 보기',
    emptyPreview: '왼쪽 폼을 작성하고 생성 버튼을 누르면\n이곳에 영문 서류가 완성됩니다.',
    copyUnlocked: '구직 지원용 이메일 복사 가능 (영어 원문)',
    copyLocked: '🔒 결제 후 전체 복사가 가능합니다',
    btnCopy: '📋 전체 복사',
    btnCopied: '✅ 복사 완료!',
    btnLocked: '🔒 잠김',
    btnDownloadPdf: '📄 고화질 PDF 다운로드 (영문)',
    btnUnlock: '🔓 PDF & 커버레터 언락 ($4.99 AUD)',
    redirecting: '결제 페이지로 이동 중...',
  },
  zh: {
    title: '🇦🇺 澳洲英文履歷與求職信生成器',
    subtitle: '專為澳洲打工度假與求職打造，秒級生成標準澳式 Resume 與 Cover Letter。',
    paidBadge: '🎉 已解鎖進階版',
    step1: '1. 填寫個人資訊',
    name: '英文姓名',
    namePh: '例: Alex Chen',
    email: '電子郵件',
    phone: '澳洲電話 (選填)',
    phonePh: '0423 000 000',
    location: '所在 / 預計前往城市',
    targetJob: '應徵職位 (請選擇)',
    visaType: '簽證類型',
    availability: '可工作時間',
    certs: '澳洲相關證照 (勾選符合項目)',
    experience: '過去經歷與優勢 (可用中文填寫)',
    experiencePh: '例: 星巴克3年兼職經驗，負責義式咖啡沖煮、點餐收銀、培訓新進店員。',
    generateBtn: '✨ 免費生成預覽',
    generatingBtn: 'AI 深度生成中（約8秒）...',
    tabResume: '📄 履歷預覽',
    tabCover: '✉️ 求職信 (Cover Letter)',
    viewOriginal: '🇺🇸 英文原文',
    viewTranslated: '🌐 查看中文翻譯對照',
    emptyPreview: '填寫左側表單並點擊生成，\n即可在此預覽標準澳洲格式英文文件。',
    copyUnlocked: '可用於應徵郵件複製 (英文原文)',
    copyLocked: '🔒 解鎖後可複製全文',
    btnCopy: '📋 複製全文',
    btnCopied: '✅ 已複製！',
    btnLocked: '🔒 未解鎖',
    btnDownloadPdf: '📄 下載高畫質 PDF (英文版)',
    btnUnlock: '🔓 解鎖 PDF 與求職信 ($4.99 AUD)',
    redirecting: '跳轉至付款頁面...',
  },
  es: {
    title: '🇦🇺 Generador de CV y Cover Letter para Australia',
    subtitle: 'Crea al instante tu currículum y carta de presentación en formato australiano estándar.',
    paidBadge: '🎉 Versión Premium Desbloqueada',
    step1: '1. Ingresa tus datos',
    name: 'Nombre Completo (en inglés)',
    namePh: 'ej: Carlos Gomez',
    email: 'Correo Electrónico',
    phone: 'Teléfono (AU) (Opcional)',
    phonePh: '0423 000 000',
    location: 'Ciudad actual o de destino',
    targetJob: 'Puesto Deseado (Selecciona)',
    visaType: 'Tipo de Visa',
    availability: 'Disponibilidad',
    certs: 'Certificados y Licencias en Australia',
    experience: 'Experiencia previa y fortalezas (en español)',
    experiencePh: 'ej: 3 años en Starbucks. Preparación de café, cobro en caja y capacitación de nuevo personal.',
    generateBtn: '✨ Generar Vista Previa Gratis',
    generatingBtn: 'Generando con IA (aprox. 8s)...',
    tabResume: '📄 Vista Previa de CV',
    tabCover: '✉️ Cover Letter',
    viewOriginal: '🇺🇸 Original en Inglés',
    viewTranslated: '🌐 Ver Traducción en Español',
    emptyPreview: 'Completa el formulario de la izquierda para ver tus documentos generados aquí.',
    copyUnlocked: 'Listo para copiar en correos de solicitud (Original en inglés)',
    copyLocked: '🔒 Desbloquea para copiar la carta completa',
    btnCopy: '📋 Copiar Texto Completo',
    btnCopied: '✅ ¡Copiado!',
    btnLocked: '🔒 Bloqueado',
    btnDownloadPdf: '📄 Descargar PDF en Alta Calidad (Inglés)',
    btnUnlock: '🔓 Desbloquear PDF y Carta ($4.99 AUD)',
    redirecting: 'Redirigiendo al pago...',
  },
};

function ResumeBuilderContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Language>('ja');
  const t = translations[lang];

  const [isPaid, setIsPaid] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: CITY_OPTIONS[0],
    targetJob: JOB_DATA[0].value,
    visaType: VISA_DATA[0].value,
    availability: AVAILABILITY_DATA[0].value,
    rawExperience: '',
    certifications: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'resume' | 'coverLetter'>('resume');
  const [showTranslated, setShowTranslated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (searchParams.get('paid') === 'true') {
      setIsPaid(true);
    }
  }, [searchParams]);

  const handleCheckboxChange = (certValue: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(certValue)
        ? prev.certifications.filter((c) => c !== certValue)
        : [...prev.certifications, certValue],
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language: lang }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }
      setResumeData(data);
      setShowTranslated(false); // 生成直後は英文原本を表示
    } catch (error: any) {
      alert(`生成エラー: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setPaying(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(`決済エラー: ${data.error || 'URL取得失敗'}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`決済通信エラー: ${err.message}`);
    } finally {
      setPaying(false);
    }
  };

  const handleCopyCoverLetter = () => {
    if (!isPaid) {
      alert('カバーレターのコピーにはアンロック（決済）が必要です。');
      return;
    }
    const textToCopy = resumeData?.coverLetter;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 表示用データの切り替え（英文原本 or 翻訳）
  const displaySummary = showTranslated && resumeData?.translated?.summary ? resumeData.translated.summary : resumeData?.summary;
  const displaySkills = showTranslated && resumeData?.translated?.skills ? resumeData.translated.skills : resumeData?.skills;
  const displayExperiences = showTranslated && resumeData?.translated?.experiences ? resumeData.translated.experiences : resumeData?.experiences;
  const displayCoverLetter = showTranslated && resumeData?.translated?.coverLetter ? resumeData.translated.coverLetter : resumeData?.coverLetter;

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 言語切り替えバー */}
        <div className="flex justify-end items-center space-x-2">
          <span className="text-xs font-bold text-slate-500">Language:</span>
          {(['ja', 'en', 'ko', 'zh', 'es'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`text-xs px-2.5 py-1 rounded font-bold border transition ${
                lang === l
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              {l === 'ja' && '🇯🇵 日本語'}
              {l === 'en' && '🇦🇺 English'}
              {l === 'ko' && '🇰🇷 한국어'}
              {l === 'zh' && '🇹🇼 繁體中文'}
              {l === 'es' && '🇪🇸 Español'}
            </button>
          ))}
        </div>

        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm font-medium text-slate-600">
            {t.subtitle}
          </p>
          {isPaid && (
            <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mt-2">
              {t.paidBadge}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 入力フォーム */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-300">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              {t.step1}
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800">{t.name}</label>
                <input
                  type="text"
                  required
                  placeholder={t.namePh}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">{t.email}</label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800">{t.phone}</label>
                  <input
                    type="text"
                    placeholder={t.phonePh}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* 滞在都市 & 希望職種 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">{t.location}</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none cursor-pointer"
                  >
                    {CITY_OPTIONS.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800">{t.targetJob}</label>
                  <select
                    value={formData.targetJob}
                    onChange={(e) => setFormData({ ...formData, targetJob: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none cursor-pointer"
                  >
                    {JOB_DATA.map((job) => (
                      <option key={job.value} value={job.value}>
                        {job.labels[lang]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ビザ種類 & 就労状況 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">{t.visaType}</label>
                  <select
                    value={formData.visaType}
                    onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none cursor-pointer"
                  >
                    {VISA_DATA.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.labels[lang]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800">{t.availability}</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none cursor-pointer"
                  >
                    {AVAILABILITY_DATA.map((av) => (
                      <option key={av.value} value={av.value}>
                        {av.labels[lang]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 保有資格 */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">{t.certs}</label>
                <div className="grid grid-cols-1 gap-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {CERT_DATA.map((cert) => (
                    <label key={cert.value} className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(cert.value)}
                        onChange={() => handleCheckboxChange(cert.value)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span>{cert.labels[lang]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800">{t.experience}</label>
                <textarea
                  rows={4}
                  required
                  placeholder={t.experiencePh}
                  value={formData.rawExperience}
                  onChange={(e) => setFormData({ ...formData, rawExperience: e.target.value })}
                  className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg transition disabled:opacity-50 text-sm shadow-md"
              >
                {loading ? t.generatingBtn : t.generateBtn}
              </button>
            </form>
          </div>

          {/* 生成結果＆決済・ダウンロードエリア */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-300 flex flex-col justify-between">
            <div>
              {/* タブ ＆ 原本/翻訳切り替えボタン */}
              <div className="flex justify-between items-center border-b border-slate-200 mb-4 pb-1">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('resume')}
                    className={`py-2 px-3 text-xs font-bold border-b-2 transition ${
                      activeTab === 'resume'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.tabResume}
                  </button>
                  <button
                    onClick={() => setActiveTab('coverLetter')}
                    className={`py-2 px-3 text-xs font-bold border-b-2 transition ${
                      activeTab === 'coverLetter'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.tabCover} {!isPaid && '🔒'}
                  </button>
                </div>

                {/* 翻訳切り替えトグル */}
                {resumeData && (
                  <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setShowTranslated(false)}
                      className={`text-[11px] px-2 py-1 rounded font-bold transition ${
                        !showTranslated ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {t.viewOriginal}
                    </button>
                    <button
                      onClick={() => setShowTranslated(true)}
                      className={`text-[11px] px-2 py-1 rounded font-bold transition ${
                        showTranslated ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {t.viewTranslated}
                    </button>
                  </div>
                )}
              </div>

              {!resumeData ? (
                <div className="text-center py-20 text-slate-500 font-medium text-sm whitespace-pre-line">
                  {t.emptyPreview}
                </div>
              ) : activeTab === 'resume' ? (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 text-sm text-slate-800 font-medium">
                  {showTranslated && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] px-3 py-1.5 rounded-lg font-semibold">
                      💡 これは内容確認用の母国語訳です。提出用PDFは自動的に正式な英語でダウンロードされます。
                    </div>
                  )}

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <p className="font-extrabold text-slate-900 text-base">{resumeData.personalInfo?.name}</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {[resumeData.personalInfo?.location, resumeData.personalInfo?.phone, resumeData.personalInfo?.email].filter(Boolean).join(' | ')}
                    </p>
                    <p className="text-xs text-blue-700 font-bold mt-1">Visa: {resumeData.personalInfo?.visa}</p>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">Summary</h3>
                    <p className="text-xs mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed text-slate-900">
                      {displaySummary}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">Skills</h3>
                    <p className="text-xs mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-900 font-semibold">
                      {displaySkills?.join(' • ')}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">Experience</h3>
                    {displayExperiences?.map((exp: any, i: number) => (
                      <div key={i} className="mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                        <p className="font-bold text-slate-900">{exp.role} - {exp.company}</p>
                        <p className="text-slate-500 text-[10px] mb-1">{exp.duration}</p>
                        <ul className="list-disc ml-4 space-y-1 text-slate-800">
                          {exp.bullets?.map((b: string, j: number) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600">
                      {isPaid ? t.copyUnlocked : t.copyLocked}
                    </span>
                    <button
                      onClick={handleCopyCoverLetter}
                      className="text-xs font-bold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300 transition"
                    >
                      {copied ? t.btnCopied : isPaid ? t.btnCopy : t.btnLocked}
                    </button>
                  </div>
                  {showTranslated && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] px-3 py-1.5 rounded-lg font-semibold">
                      💡 カバーレターの母国語訳です（提出時は「🇺🇸 英語原本」をコピーして使います）。
                    </div>
                  )}
                  <div className="relative">
                    <textarea
                      readOnly
                      value={
                        isPaid
                          ? displayCoverLetter
                          : displayCoverLetter?.slice(0, 150) + '\n\n... (Unlock to view full letter)'
                      }
                      rows={14}
                      className={`w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono leading-relaxed text-slate-900 outline-none ${!isPaid ? 'blur-[1px]' : ''}`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ダウンロード / 決済ボタン */}
            {resumeData && isClient && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                {isPaid ? (
                  <PDFDownloadLink
                    document={<ResumePDF data={resumeData} />}
                    fileName={`${resumeData.personalInfo?.name || 'Resume'}_AUS.pdf`}
                    className="block w-full text-center py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition text-sm shadow-md"
                  >
                    {({ loading }) => (loading ? 'Loading...' : t.btnDownloadPdf)}
                  </PDFDownloadLink>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={paying}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition text-sm shadow-md flex items-center justify-center space-x-2"
                  >
                    <span>{paying ? t.redirecting : t.btnUnlock}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <ResumeBuilderContent />
    </Suspense>
  );
}