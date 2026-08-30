'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ResumePDF } from '@/components/ResumePDF';

// PDFダウンロードリンクをクライアントサイドのみで読み込む（エラー防止）
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

export default function Home() {
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
  const [resumeData, setResumeData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setResumeData(data);
    } catch (error) {
      alert('レジュメの生成に失敗しました。APIキーや設定を確認してください。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            🇦🇺 Aus Resume Builder AI
          </h1>
          <p className="text-sm text-slate-600">
            オーストラリアのローカルジョブ獲得に最適化された英文レジュメを瞬時に作成
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 入力フォーム */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">
              1. 情報を入力
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">お名前 (英語表記)</label>
                <input
                  type="text"
                  required
                  placeholder="Taro Yamada"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">メールアドレス</label>
                  <input
                    type="email"
                    required
                    placeholder="taro@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">電話番号 (豪)</label>
                  <input
                    type="text"
                    required
                    placeholder="0412 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">滞在都市</label>
                  <input
                    type="text"
                    required
                    placeholder="Sydney, NSW"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">希望職種</label>
                  <input
                    type="text"
                    required
                    placeholder="Barista / All-Rounder"
                    value={formData.targetJob}
                    onChange={(e) => setFormData({ ...formData, targetJob: e.target.value })}
                    className="mt-1 w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">ビザ種類</label>
                  <input
                    type="text"
                    value={formData.visaType}
                    onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                    className="mt-1 w-full p-2 border border-slate-300 rounded text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">就労可能状況</label>
                  <input
                    type="text"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="mt-1 w-full p-2 border border-slate-300 rounded text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">保有資格・ライセンス</label>
                <div className="grid grid-cols-1 gap-1">
                  {certOptions.map((cert) => (
                    <label key={cert} className="flex items-center space-x-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(cert)}
                        onChange={() => handleCheckboxChange(cert)}
                        className="rounded text-blue-600"
                      />
                      <span>{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">過去の経験・アピールポイント</label>
                <textarea
                  rows={4}
                  required
                  placeholder="スターバックスで2年間アルバイト。接客、レジ、ドリンク作成、新人育成を担当。スピード感のある環境でのマルチタスクが得意。"
                  value={formData.rawExperience}
                  onChange={(e) => setFormData({ ...formData, rawExperience: e.target.value })}
                  className="mt-1 w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50 text-sm shadow-md"
              >
                {loading ? 'AIが英文レジュメを最適化中...' : '✨ レジュメを自動生成する'}
              </button>
            </form>
          </div>

          {/* 生成結果＆PDFダウンロード */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">
                2. レビュー＆ダウンロード
              </h2>

              {!resumeData ? (
                <div className="text-center py-20 text-slate-400 text-sm">
                  左のフォームを入力して生成ボタンを押すと、<br />
                  ここに豪州基準のレジュメが表示されます。
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 text-sm text-slate-700">
                  <div className="bg-slate-50 p-3 rounded border">
                    <p className="font-bold text-slate-900">{resumeData.personalInfo?.name}</p>
                    <p className="text-xs text-slate-500">
                      {resumeData.personalInfo?.location} | {resumeData.personalInfo?.phone} | {resumeData.personalInfo?.email}
                    </p>
                    <p className="text-xs text-blue-600 font-semibold mt-1">Visa: {resumeData.personalInfo?.visa}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Summary</h3>
                    <p className="text-xs mt-1 bg-slate-50 p-2 rounded">{resumeData.summary}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Skills</h3>
                    <p className="text-xs mt-1 bg-slate-50 p-2 rounded">{resumeData.skills?.join(' • ')}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Experience</h3>
                    {resumeData.experiences?.map((exp: any, i: number) => (
                      <div key={i} className="mt-2 bg-slate-50 p-2 rounded text-xs">
                        <p className="font-bold">{exp.role} - {exp.company}</p>
                        <p className="text-slate-500 text-[10px] mb-1">{exp.duration}</p>
                        <ul className="list-disc ml-4 space-y-0.5">
                          {exp.bullets?.map((b: string, j: number) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ダウンロードボタン */}
            {resumeData && isClient && (
              <div className="mt-6 pt-4 border-t">
                <PDFDownloadLink
                  document={<ResumePDF data={resumeData} />}
                  fileName={`${resumeData.personalInfo?.name || 'Resume'}_AUS.pdf`}
                  className="block w-full text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition text-sm shadow-md"
                >
                  {({ loading }) => (loading ? 'PDF作成中...' : '📄 PDFをダウンロードする')}
                </PDFDownloadLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}