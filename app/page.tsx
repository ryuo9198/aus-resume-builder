'use client';
import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { ResumePDF } from '@/components/ResumePDF';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

function ResumeBuilderContent() {
  const searchParams = useSearchParams();
  const [isPaid, setIsPaid] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    visaType: 'Working Holiday (Subclass 417)',
    availability: 'Full-time',
    targetJob: '',
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
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            🇦🇺 Aus Resume & Cover Letter AI
          </h1>
          <p className="text-sm font-medium text-slate-600">
            オーストラリアのローカルジョブ獲得に特化した英文レジュメ＆カバーレターを瞬時に作成
          </p>
          {isPaid && (
            <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mt-2">
              🎉 プレミアム購入済み（アンロック中）
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 入力フォーム */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-300">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              1. 情報を入力
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800">お名前 (英語表記)</label>
                <input
                  type="text"
                  required
                  placeholder="例: Taro Yamada"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">メールアドレス</label>
                  <input
                    type="email"
                    required
                    placeholder="例: taro@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800">電話番号 (豪)</label>
                  <input
                    type="text"
                    required
                    placeholder="例: 0412 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">滞在都市</label>
                  <input
                    type="text"
                    required
                    placeholder="例: Perth, WA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800">希望職種</label>
                  <input
                    type="text"
                    required
                    placeholder="例: Barista / All-Rounder"
                    value={formData.targetJob}
                    onChange={(e) => setFormData({ ...formData, targetJob: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">ビザ種類</label>
                  <input
                    type="text"
                    value={formData.visaType}
                    onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800">就労可能状況</label>
                  <input
                    type="text"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">保有資格・ライセンス</label>
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
                <label className="block text-xs font-bold text-slate-800">過去の経験・アピールポイント</label>
                <textarea
                  rows={4}
                  required
                  placeholder="例: カフェで2年間アルバイト。接客、ドリンク作成、レジを担当。繁忙時もチームでスムーズに対応できます。"
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
                {loading ? 'AIが生成中（約5秒）...' : '✨ 無料プレビューを生成'}
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
                  📄 Resume プレビュー
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

              {!resumeData ? (
                <div className="text-center py-20 text-slate-500 font-medium text-sm">
                  左のフォームを入力して生成ボタンを押すと、<br />
                  ここに書類一式が表示されます。
                </div>
              ) : activeTab === 'resume' ? (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 text-sm text-slate-800 font-medium">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <p className="font-extrabold text-slate-900 text-base">{resumeData.personalInfo?.name}</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {resumeData.personalInfo?.location} | {resumeData.personalInfo?.phone} | {resumeData.personalInfo?.email}
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
                      {isPaid ? 'メールや応募フォームに貼る用' : '🔒 アンロックすると全文コピー可能になります'}
                    </span>
                    <button
                      onClick={handleCopyCoverLetter}
                      className="text-xs font-bold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300 transition"
                    >
                      {copied ? '✅ コピー完了！' : isPaid ? '📋 全文コピー' : '🔒 ロック中'}
                    </button>
                  </div>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={isPaid ? resumeData.coverLetter : resumeData.coverLetter?.slice(0, 150) + '\n\n... (アンロックして全文を表示)'}
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
                    {({ loading }) => (loading ? 'PDF作成中...' : '📄 高画質 PDF をダウンロード')}
                  </PDFDownloadLink>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={paying}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition text-sm shadow-md flex items-center justify-center space-x-2"
                  >
                    <span>{paying ? '決済画面へ移動中...' : '🔓 PDF & カバーレターをアンロック ($4.99 AUD)'}</span>
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