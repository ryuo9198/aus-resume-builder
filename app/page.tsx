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

const translations = {
  ja: {
    title: '🇦🇺 Aus Resume & Cover Letter AI',
    subtitle: 'オーストラリアのローカルジョブ獲得に特化した英文レジュメ＆カバーレターを瞬時に作成',
    paidBadge: '🎉 プレミアム購入済み（アンロック中）',
    step1: '1. 情報を入力',
    name: 'お名前 (英語表記)',
    namePh: '例: Taro Yamada',
    email: 'メールアドレス',
    phone: '電話番号 (豪) ※任意・渡航前は空欄でOK',
    phonePh: '未取得なら空欄でOK (例: 0412 345 678)',
    location: '滞在都市 / 渡航予定先',
    targetJob: '希望職種 (選択してください)',
    visaType: 'ビザの種類',
    availability: '就労可能状況',
    certs: '保有資格・ライセンス',
    experience: '過去の経験・アピールポイント (母国語でOK)',
    experiencePh: '例: カフェで2年間アルバイト。接客、ドリンク作成、レジを担当。繁忙時もチームでスムーズに対応できます。',
    generateBtn: '✨ 無料プレビューを生成',
    generatingBtn: 'AIが生成中（約5秒）...',
    tabResume: '📄 Resume プレビュー',
    tabCover: '✉️ Cover Letter (添え状)',
    emptyPreview: '左のフォームを入力して生成ボタンを押すと、\nここに書類一式が表示されます。',
    copyUnlocked: 'メールや応募フォームに貼る用',
    copyLocked: '🔒 アンロックすると全文コピー可能になります',
    btnCopy: '📋 全文コピー',
    btnCopied: '✅ コピー完了！',
    btnLocked: '🔒 ロック中',
    btnDownloadPdf: '📄 高画質 PDF をダウンロード',
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
    phone: 'Phone Number (AU) - Optional',
    phonePh: 'Leave blank if not yet in AU',
    location: 'Current / Planned City',
    targetJob: 'Target Role (Select from list)',
    visaType: 'Visa Type',
    availability: 'Availability',
    certs: 'Australian Licences & Certifications',
    experience: 'Past Experience & Strengths (Native language OK)',
    experiencePh: 'e.g. 2 years experience as a barista in a busy cafe. Skilled in customer service and espresso making.',
    generateBtn: '✨ Generate Free Preview',
    generatingBtn: 'Generating (approx. 5s)...',
    tabResume: '📄 Resume Preview',
    tabCover: '✉️ Cover Letter',
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
    phone: '호주 전화번호 (선택사항 / 미개통시 빈칸)',
    phonePh: '아직 없으면 비워두세요',
    location: '거주/입국 예정 도시',
    targetJob: '희망 직종 (선택)',
    visaType: '비자 종류',
    availability: '근무 가능 시간',
    certs: '보유 자격증 / 라이센스',
    experience: '경력 및 강점 (한국어로 입력 가능)',
    experiencePh: '예: 프랜차이즈 카페 2년 근무. 고객 응대, 에스프레소 추출, 마감 업무 담당.',
    generateBtn: '✨ 무료 미리보기 생성',
    generatingBtn: '생성 중 (약 5초)...',
    tabResume: '📄 레주메 미리보기',
    tabCover: '✉️ 커버레터',
    emptyPreview: '왼쪽 폼을 작성하고 생성 버튼을 누르면\n이곳에 영문 서류가 완성됩니다.',
    copyUnlocked: '구직 지원용 이메일 복사 가능',
    copyLocked: '🔒 결제 후 전체 복사가 가능합니다',
    btnCopy: '📋 전체 복사',
    btnCopied: '✅ 복사 완료!',
    btnLocked: '🔒 잠김',
    btnDownloadPdf: '📄 고화질 PDF 다운로드',
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
    phone: '澳洲電話 (選填，未入境可留空)',
    phonePh: '尚未申辦電話可留空',
    location: '所在 / 預計前往城市',
    targetJob: '應徵職位 (請選擇)',
    visaType: '簽證類型',
    availability: '可工作時間',
    certs: '澳洲相關證照',
    experience: '過去經歷與優勢 (可用中文輸入)',
    experiencePh: '例: 連鎖咖啡廳2年經驗，擅長客戶服務、咖啡沖煮與收銀。',
    generateBtn: '✨ 免費生成預覽',
    generatingBtn: '生成中（約5秒）...',
    tabResume: '📄 履歷預覽',
    tabCover: '✉️ 求職信 (Cover Letter)',
    emptyPreview: '填寫左側表單並點擊生成，\n即可在此預覽標準澳洲格式英文文件。',
    copyUnlocked: '可用於應徵郵件複製',
    copyLocked: '🔒 解鎖後可複製全文',
    btnCopy: '📋 複製全文',
    btnCopied: '✅ 已複製！',
    btnLocked: '🔒 未解鎖',
    btnDownloadPdf: '📄 下載高畫質 PDF',
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
    phone: 'Teléfono (AU) - Opcional',
    phonePh: 'Dejar en blanco si aún no tienes',
    location: 'Ciudad actual o de destino',
    targetJob: 'Puesto Deseado (Selecciona)',
    visaType: 'Tipo de Visa',
    availability: 'Disponibilidad',
    certs: 'Certificados y Licencias en Australia',
    experience: 'Experiencia previa y habilidades (puedes escribir en español)',
    experiencePh: 'ej: 2 años de experiencia como barista y camarero.',
    generateBtn: '✨ Generar Vista Previa Gratis',
    generatingBtn: 'Generando (aprox. 5s)...',
    tabResume: '📄 Vista Previa de CV',
    tabCover: '✉️ Cover Letter',
    emptyPreview: 'Completa el formulario de la izquierda para ver tus documentos generados aquí.',
    copyUnlocked: 'Listo para copiar en correos de solicitud',
    copyLocked: '🔒 Desbloquea para copiar la carta completa',
    btnCopy: '📋 Copiar Texto Completo',
    btnCopied: '✅ ¡Copiado!',
    btnLocked: '🔒 Bloqueado',
    btnDownloadPdf: '📄 Descargar PDF en Alta Calidad',
    btnUnlock: '🔓 Desbloquear PDF y Carta ($4.99 AUD)',
    redirecting: 'Redirigiendo al pago...',
  },
};

// 選択肢の定義
const JOB_OPTIONS = [
  'Barista / Cafe All-Rounder',
  'Food & Beverage Attendant (Waiter/Waitress)',
  'Kitchen Hand / Dishwasher',
  'Retail Assistant / Cashier',
  'General Labourer (Construction)',
  'Warehouse Assistant / Forklift',
  'Housekeeper / Hotel Cleaner',
  'Farm Hand / Fruit Picker',
  'Bartender / Pub Staff',
  'Customer Service Representative',
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

const VISA_OPTIONS = [
  'Working Holiday (Subclass 417)',
  'Work and Holiday (Subclass 462)',
  'Student Visa (Subclass 500)',
  'Temporary Graduate (Subclass 485)',
  'Permanent Resident (PR)',
  'Other / Bridging Visa',
];

const AVAILABILITY_OPTIONS = [
  'Full-time (Immediate Start / Weekdays & Weekends)',
  'Flexible (Up to 48 hours per fortnight - Student)',
  'Part-time / Casual (Immediate Start)',
  'Morning Shifts Preferred (from 6:00 AM)',
  'Evening & Night Shifts Preferred',
];

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
    targetJob: JOB_OPTIONS[0],
    visaType: VISA_OPTIONS[0],
    availability: AVAILABILITY_OPTIONS[0],
    rawExperience: '',
    certifications: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'resume' | 'coverLetter'>('resume');
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (searchParams.get('paid') === 'true') {
      setIsPaid(true);
    }
  }, [searchParams]);

  const certOptions = [
    'RSA (Responsible Service of Alcohol)',
    'White Card (Construction)',
    'Barista Certificate',
    'First Aid & CPR',
    'Australian Driver Licence',
    'RSG (Responsible Service of Gambling)',
  ];

  const handleCheckboxChange = (cert: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }
      setResumeData(data);
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
    if (resumeData?.coverLetter) {
      navigator.clipboard.writeText(resumeData.coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 言語切り替え */}
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

              {/* 滞在都市 & 希望職種 (セレクトボックス) */}
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
                    {JOB_OPTIONS.map((job) => (
                      <option key={job} value={job}>
                        {job}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ビザ種類 & 就労状況 (セレクトボックス) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">{t.visaType}</label>
                  <select
                    value={formData.visaType}
                    onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none cursor-pointer"
                  >
                    {VISA_OPTIONS.map((v) => (
                      <option key={v} value={v}>
                        {v}
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
                    {AVAILABILITY_OPTIONS.map((av) => (
                      <option key={av} value={av}>
                        {av}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">{t.certs}</label>
                <div className="grid grid-cols-1 gap-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {certOptions.map((cert) => (
                    <label key={cert} className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(cert)}
                        onChange={() => handleCheckboxChange(cert)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span>{cert}</span>
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
              <div className="flex border-b border-slate-200 mb-4">
                <button
                  onClick={() => setActiveTab('resume')}
                  className={`py-2 px-4 text-xs font-bold border-b-2 transition ${
                    activeTab === 'resume'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.tabResume}
                </button>
                <button
                  onClick={() => setActiveTab('coverLetter')}
                  className={`py-2 px-4 text-xs font-bold border-b-2 transition ${
                    activeTab === 'coverLetter'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.tabCover} {!isPaid && '🔒'}
                </button>
              </div>

              {!resumeData ? (
                <div className="text-center py-20 text-slate-500 font-medium text-sm whitespace-pre-line">
                  {t.emptyPreview}
                </div>
              ) : activeTab === 'resume' ? (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 text-sm text-slate-800 font-medium">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <p className="font-extrabold text-slate-900 text-base">{resumeData.personalInfo?.name}</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {[resumeData.personalInfo?.location, resumeData.personalInfo?.phone, resumeData.personalInfo?.email].filter(Boolean).join(' | ')}
                    </p>
                    <p className="text-xs text-blue-700 font-bold mt-1">Visa: {resumeData.personalInfo?.visa}</p>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">Summary</h3>
                    <p className="text-xs mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed text-slate-900">{resumeData.summary}</p>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">Skills</h3>
                    <p className="text-xs mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-900 font-semibold">{resumeData.skills?.join(' • ')}</p>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">Experience</h3>
                    {resumeData.experiences?.map((exp: any, i: number) => (
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
                  <div className="relative">
                    <textarea
                      readOnly
                      value={isPaid ? resumeData.coverLetter : resumeData.coverLetter?.slice(0, 150) + '\n\n... (Unlock to view full letter)'}
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