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
type TemplateType = 'classic' | 'modern' | 'clean';
type FontType = 'sans' | 'serif';

const JOB_DATA = [
  { value: 'Barista / Cafe All-Rounder', labels: { ja: '☕ バリスタ / カフェ店員', en: '☕ Barista / Cafe All-Rounder', ko: '☕ 바리스타 / 카페', zh: '☕ 咖啡師 / 店員', es: '☕ Barista' } },
  { value: 'Food & Beverage Attendant', labels: { ja: '🍽️ レストラン・居酒屋ホール (接客)', en: '🍽️ Food & Beverage Attendant', ko: '🍽️ 홀 서빙', zh: '🍽️ 餐飲服務生', es: '🍽️ Camarero/a' } },
  { value: 'Kitchen Hand / Dishwasher', labels: { ja: '🍳 キッチンハンド / 調理補助', en: '🍳 Kitchen Hand / Dishwasher', ko: '🍳 주방 보조', zh: '🍳 廚房助手', es: '🍳 Ayudante de Cocina' } },
  { value: 'Retail Assistant / Cashier', labels: { ja: '🛍️ 販売スタッフ / レジ', en: '🛍️ Retail Assistant / Cashier', ko: '🛍️ 매장 직원', zh: '🛍️ 門市收銀', es: '🛍️ Asistente de Tienda' } },
  { value: 'General Labourer (Construction)', labels: { ja: '🏗️ 建設現場作業員 (Labourer)', en: '🏗️ General Labourer', ko: '🏗️ 건설 현장', zh: '🏗️ 工地勞工', es: '🏗️ Construcción' } },
  { value: 'Warehouse Assistant', labels: { ja: '📦 倉庫作業員 / ピッキング', en: '📦 Warehouse Assistant', ko: '📦 물류 창고', zh: '📦 倉庫助手', es: '📦 Almacén' } },
  { value: 'Housekeeper / Hotel Cleaner', labels: { ja: '🧹 ホテル清掃 / ハウスキーパー', en: '🧹 Housekeeper', ko: '🧹 호텔 청소', zh: '🧹 房務清潔', es: '🧹 Limpieza' } },
];

const VISA_DATA = [
  { value: 'Working Holiday (Subclass 417)', labels: { ja: 'ワーキングホリデービザ (417)', en: 'Working Holiday Visa (417)', ko: '워킹홀리데이 (417)', zh: '打工度假 (417)', es: 'Working Holiday (417)' } },
  { value: 'Work and Holiday (Subclass 462)', labels: { ja: 'ワーク＆ホリデービザ (462)', en: 'Work and Holiday Visa (462)', ko: '워크 앤 홀리데이 (462)', zh: '打工與度假 (462)', es: 'Work and Holiday (462)' } },
  { value: 'Student Visa (Subclass 500)', labels: { ja: '学生ビザ (500)', en: 'Student Visa (500)', ko: '학생 비자 (500)', zh: '學生簽證 (500)', es: 'Visa de Estudiante (500)' } },
];

const AVAILABILITY_DATA = [
  { value: 'Full-time (Immediate Start)', labels: { ja: '即日勤務可・フルタイム (平日・土日祝OK)', en: 'Full-time / Immediate Start', ko: '즉시 출근 / 풀타임', zh: '可立即上班 / 全職', es: 'Tiempo Completo / Inmediato' } },
  { value: 'Student Visa Condition (Up to 48h/fn)', labels: { ja: '学生ビザ規定内 (2週間48時間)', en: 'Student Visa Condition (48h/fn)', ko: '학생 비자 규정 내', zh: '學生簽證時數限制', es: 'Condición de Estudiante' } },
  { value: 'Part-time / Casual', labels: { ja: 'パートタイム / カジュアル', en: 'Part-time / Casual', ko: '파트타임 / 캐주얼', zh: '兼職 / 臨時工', es: 'Medio Tiempo / Casual' } },
];

const CERT_DATA = [
  { value: 'RSA (Responsible Service of Alcohol)', labels: { ja: 'RSA (飲食店の酒類提供資格)', en: 'RSA (Alcohol Service)', ko: 'RSA (주류 취급)', zh: 'RSA (酒類證照)', es: 'RSA' } },
  { value: 'White Card (Construction)', labels: { ja: 'ホワイトカード (現場の安全講習証)', en: 'White Card (Construction)', ko: '화이트카드 (건설)', zh: '白卡 (工地)', es: 'White Card' } },
  { value: 'Australian Driver Licence', labels: { ja: 'オーストラリア免許 / 国際免許', en: 'Driver Licence / Permit', ko: '호주 운전면허 / 국제면허', zh: '澳洲駕照 / 國際駕照', es: 'Licencia de Conducir' } },
];

const CITY_OPTIONS = ['Perth, WA', 'Sydney, NSW', 'Melbourne, VIC', 'Brisbane, QLD', 'Adelaide, SA', 'Gold Coast, QLD'];

function ResumeBuilderContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Language>('ja');
  const [isPaid, setIsPaid] = useState(false);

  // ステップ管理 (1: 入力 -> 2: デザインカスタマイズ -> 3: 完成・決済)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // デザイン選択
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [fontFamily, setFontFamily] = useState<FontType>('sans');

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
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (searchParams.get('paid') === 'true') {
      setIsPaid(true);
      setCurrentStep(3);
    }
  }, [searchParams]);

  const handleCheckboxChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(val)
        ? prev.certifications.filter((c) => c !== val)
        : [...prev.certifications, val],
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '生成に失敗しました');
      setResumeData(data);
      // 生成成功後にデザインカスタマイズ画面（Step 2）へ
      setCurrentStep(2);
    } catch (err: any) {
      alert(`エラー: ${err.message}`);
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
        alert('決済ページの読み込みに失敗しました');
      }
    } catch (err: any) {
      alert('通信エラーが発生しました');
    } finally {
      setPaying(false);
    }
  };

  const handleCopyCoverLetter = () => {
    if (!isPaid) {
      alert('アンロック後にコピー可能になります');
      return;
    }
    if (resumeData?.coverLetter) {
      navigator.clipboard.writeText(resumeData.coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* 言語切り替えバー */}
        <div className="flex justify-end items-center space-x-2">
          {(['ja', 'en', 'ko', 'zh', 'es'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`text-xs px-2 py-1 rounded font-bold border ${
                lang === l ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'
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
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            🇦🇺 Aus Resume & Cover Letter AI
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600">
            オーストラリアのローカルジョブ獲得に特化した英文レジュメ＆カバーレターを瞬時に作成
          </p>
        </div>

        {/* ステップ プログレスバー */}
        <div className="max-w-xl mx-auto bg-white p-3 rounded-xl border border-slate-300 shadow-sm flex items-center justify-between text-xs font-bold">
          <div className={`flex items-center space-x-1.5 ${currentStep === 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] ${currentStep >= 1 ? 'bg-blue-600' : 'bg-slate-300'}`}>1</span>
            <span>情報入力</span>
          </div>
          <span className="text-slate-300">➔</span>
          <div className={`flex items-center space-x-1.5 ${currentStep === 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] ${currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-300'}`}>2</span>
            <span>デザイン・フォント選択</span>
          </div>
          <span className="text-slate-300">➔</span>
          <div className={`flex items-center space-x-1.5 ${currentStep === 3 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] ${currentStep === 3 ? 'bg-emerald-600' : 'bg-slate-300'}`}>3</span>
            <span>完成・ダウンロード</span>
          </div>
        </div>

        {/* Step 1: 情報入力 */}
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow border border-slate-300">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              ステップ 1: 基本情報を入力
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800">お名前 (英語表記)</label>
                <input
                  type="text"
                  required
                  placeholder="例: Alex Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-semibold focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">メールアドレス</label>
                  <input
                    type="email"
                    required
                    placeholder="例: your.name@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-semibold focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800">電話番号 (豪) ※任意</label>
                  <input
                    type="text"
                    placeholder="0423 123 456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-semibold focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">滞在都市 / 渡航予定</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:border-blue-600 outline-none cursor-pointer"
                  >
                    {CITY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800">希望職種</label>
                  <select
                    value={formData.targetJob}
                    onChange={(e) => setFormData({ ...formData, targetJob: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:border-blue-600 outline-none cursor-pointer"
                  >
                    {JOB_DATA.map((j) => (
                      <option key={j.value} value={j.value}>{j.labels[lang]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">ビザの種類</label>
                  <select
                    value={formData.visaType}
                    onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:border-blue-600 outline-none cursor-pointer"
                  >
                    {VISA_DATA.map((v) => (
                      <option key={v.value} value={v.value}>{v.labels[lang]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800">就労可能状況</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:border-blue-600 outline-none cursor-pointer"
                  >
                    {AVAILABILITY_DATA.map((a) => (
                      <option key={a.value} value={a.value}>{a.labels[lang]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">保有資格 (任意)</label>
                <div className="grid grid-cols-1 gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {CERT_DATA.map((c) => (
                    <label key={c.value} className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(c.value)}
                        onChange={() => handleCheckboxChange(c.value)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span>{c.labels[lang]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800">
                  過去の経験・アピールポイント (母国語でOK)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="例: スタバで3年間バイト。新作ドリンク作成、レジ、ピーク時の接客を担当。"
                  value={formData.rawExperience}
                  onChange={(e) => setFormData({ ...formData, rawExperience: e.target.value })}
                  className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:border-blue-600 outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg transition disabled:opacity-50 text-sm shadow-md"
              >
                {loading ? 'AIが生成中（約10秒）...' : '次へ：デザイン・フォントを選ぶ ➔'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2 & Step 3: デザイン選択 & プレビュー */}
        {currentStep >= 2 && resumeData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 左側：デザイン選択コントローラー */}
            <div className="bg-white p-6 rounded-xl shadow border border-slate-300 space-y-6 md:col-span-1">
              <div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1 mb-3"
                >
                  <span>⬅️ 情報を再編集する</span>
                </button>
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                  ステップ 2: デザイン選択
                </h3>
              </div>

              {/* テンプレート選択 */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">レイアウトスタイル</label>
                <div className="space-y-2">
                  {[
                    { id: 'classic', name: 'Classic (王道スタイル)', desc: 'オーストラリアで最もATS選考に強い標準形式' },
                    { id: 'modern', name: 'Modern (洗練ブルー)', desc: 'ネイビーをアクセントにした清潔感あるデザイン' },
                    { id: 'clean', name: 'Clean (ミニマルティール)', desc: '余白を広めに取ったモダンで読みやすい形式' },
                  ].map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => setTemplate(tpl.id as TemplateType)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                        template === tpl.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-900">{tpl.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{tpl.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* フォント選択 */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">フォントスタイル</label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setFontFamily('sans')}
                    className={`p-2.5 rounded-lg border-2 cursor-pointer text-center transition font-sans ${
                      fontFamily === 'sans' ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-700' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-xs">Sans-Serif</span>
                    <p className="text-[10px] text-slate-400 font-normal">現代的・カフェ/現場</p>
                  </div>
                  <div
                    onClick={() => setFontFamily('serif')}
                    className={`p-2.5 rounded-lg border-2 cursor-pointer text-center transition font-serif ${
                      fontFamily === 'serif' ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-700' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-xs">Classic Serif</span>
                    <p className="text-[10px] text-slate-400 font-normal">格式高い・事務/営業</p>
                  </div>
                </div>
              </div>

              {/* Step 3 への誘導ボタン */}
              {currentStep === 2 && (
                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition text-sm shadow flex items-center justify-center space-x-1"
                >
                  <span>このデザインで完成へ ➔</span>
                </button>
              )}

              {/* Step 3: ダウンロード / 決済エリア */}
              {currentStep === 3 && isClient && (
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">ステップ 3: 書類の発行</h4>
                  {isPaid ? (
                    <PDFDownloadLink
                      document={<ResumePDF data={resumeData} template={template} fontFamily={fontFamily} />}
                      fileName={`${resumeData.personalInfo?.name || 'Resume'}_AUS.pdf`}
                      className="block w-full text-center py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition text-sm shadow"
                    >
                      {({ loading }) => (loading ? 'PDF作成中...' : '📄 PDFをダウンロード')}
                    </PDFDownloadLink>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleCheckout}
                        disabled={paying}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition text-sm shadow flex items-center justify-center space-x-1"
                      >
                        <span>{paying ? '決済画面へ移動中...' : '🔓 PDF & カバーレターをアンロック ($4.99 AUD)'}</span>
                      </button>
                      <p className="text-[11px] text-center text-slate-500 font-medium">
                        ※ 一度アンロックすると無制限にPDFダウンロード可能です
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 右側：リアルタイム反映プレビュー */}
            <div className="bg-white p-6 rounded-xl shadow border border-slate-300 md:col-span-2 flex flex-col justify-between">
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
                    📄 Resume プレビュー ({template.toUpperCase()} / {fontFamily})
                  </button>
                  <button
                    onClick={() => setActiveTab('coverLetter')}
                    className={`py-2 px-4 text-xs font-bold border-b-2 transition ${
                      activeTab === 'coverLetter'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    ✉️ Cover Letter (添え状) {!isPaid && '🔒'}
                  </button>
                </div>

                {activeTab === 'resume' ? (
                  <div
                    className={`space-y-4 max-h-[550px] overflow-y-auto pr-2 text-xs transition-all ${
                      fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                    }`}
                  >
                    {/* 基本情報ヘッダー */}
                    <div
                      className={`p-4 rounded-lg transition border ${
                        template === 'modern'
                          ? 'bg-blue-50/40 border-blue-200'
                          : template === 'clean'
                          ? 'bg-teal-50/40 border-teal-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <p
                        className={`text-lg font-extrabold ${
                          template === 'modern'
                            ? 'text-blue-900'
                            : template === 'clean'
                            ? 'text-teal-900'
                            : 'text-slate-900'
                        }`}
                      >
                        {resumeData.personalInfo?.name}
                      </p>
                      <p className="text-slate-600 mt-0.5 text-xs">
                        {[resumeData.personalInfo?.location, resumeData.personalInfo?.phone, resumeData.personalInfo?.email].filter(Boolean).join(' | ')}
                      </p>
                      <p
                        className={`font-bold mt-1 text-xs ${
                          template === 'modern'
                            ? 'text-blue-700'
                            : template === 'clean'
                            ? 'text-teal-700'
                            : 'text-slate-800'
                        }`}
                      >
                        Visa: {resumeData.personalInfo?.visa}
                      </p>
                    </div>

                    {/* Summary */}
                    <div>
                      <h3
                        className={`font-extrabold uppercase tracking-wider text-xs ${
                          template === 'modern' ? 'text-blue-900' : template === 'clean' ? 'text-teal-900' : 'text-slate-700'
                        }`}
                      >
                        Professional Summary
                      </h3>
                      <p className="mt-1 p-2.5 rounded border border-slate-200 bg-slate-50 text-slate-900 leading-relaxed font-medium">
                        {resumeData.summary}
                      </p>
                      {resumeData.summaryTrans && (
                        <div className="mt-1 p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 leading-relaxed text-[11px]">
                          <span className="font-bold">💡 日本語訳:</span> {resumeData.summaryTrans}
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    <div>
                      <h3
                        className={`font-extrabold uppercase tracking-wider text-xs ${
                          template === 'modern' ? 'text-blue-900' : template === 'clean' ? 'text-teal-900' : 'text-slate-700'
                        }`}
                      >
                        Core Skills
                      </h3>
                      <p className="mt-1 p-2.5 rounded border border-slate-200 bg-slate-50 text-slate-900 font-semibold">
                        {resumeData.skills?.join(' • ')}
                      </p>
                    </div>

                    {/* Experience */}
                    <div>
                      <h3
                        className={`font-extrabold uppercase tracking-wider text-xs ${
                          template === 'modern' ? 'text-blue-900' : template === 'clean' ? 'text-teal-900' : 'text-slate-700'
                        }`}
                      >
                        Work Experience
                      </h3>
                      {resumeData.experiences?.map((exp: any, i: number) => (
                        <div key={i} className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                          <div className="flex justify-between items-center font-bold text-slate-900">
                            <span>{exp.role} - {exp.company}</span>
                            {exp.duration && (
                              <span className="text-slate-600 font-medium bg-slate-200 px-2 py-0.5 rounded text-[11px]">
                                {exp.duration} {exp.durationTrans ? `(${exp.durationTrans})` : ''}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            {exp.bullets?.map((b: string, j: number) => (
                              <div
                                key={j}
                                className={`border-l-2 pl-2 ${
                                  template === 'modern'
                                    ? 'border-blue-600'
                                    : template === 'clean'
                                    ? 'border-teal-600'
                                    : 'border-slate-500'
                                }`}
                              >
                                <p className="text-slate-900 font-medium">{b}</p>
                                {exp.bulletsTrans?.[j] && (
                                  <p className="text-[11px] text-amber-800 font-normal mt-0.5">
                                    ↳ {exp.bulletsTrans[j]}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-600">
                        {isPaid ? '英文の応募用テキスト' : '🔒 アンロックすると全文コピー可能になります'}
                      </span>
                      <button
                        onClick={handleCopyCoverLetter}
                        className="text-xs font-bold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300 transition"
                      >
                        {copied ? '✅ コピー完了！' : isPaid ? '📋 英文をコピー' : '🔒 ロック中'}
                      </button>
                    </div>
                    <div className="relative">
                      <textarea
                        readOnly
                        value={
                          isPaid
                            ? `【英文】\n${resumeData.coverLetter}\n\n====================\n【日本語対訳】\n${resumeData.coverLetterTrans}`
                            : resumeData.coverLetter?.slice(0, 160) + '\n\n... (アンロックして全文を表示)'
                        }
                        rows={16}
                        className={`w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono leading-relaxed text-slate-900 outline-none ${!isPaid ? 'blur-[1px]' : ''}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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