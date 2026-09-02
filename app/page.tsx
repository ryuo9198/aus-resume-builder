'use client';

import React, { useState } from 'react';

// 職種と自己PRテンプレート
const TARGET_ROLES = [
  {
    role: 'Barista / All-Rounder (Cafe)',
    label: '☕ バリスタ・カフェ全般',
    summary: 'Passionate and customer-focused Barista/All-Rounder with solid experience in fast-paced cafe environments. Skilled in espresso calibration, latte art, and point-of-sale operations. Holds a valid Australian RSA.',
  },
  {
    role: 'Food & Beverage Attendant / Waitstaff',
    label: '🍽️ ホール・ウェイター',
    summary: 'Energetic and reliable F&B Attendant with strong communication skills and a friendly approach to guest hospitality. Fast learner, proficient with POS systems, and eager to deliver exceptional table service. Holds valid RSA.',
  },
  {
    role: 'Kitchen Hand / Dishwasher',
    label: '🍳 キッチンハンド・皿洗い',
    summary: 'Hardworking and efficient Kitchen Hand with experience in fast-paced commercial kitchens. Thorough understanding of food safety, prep support, and maintaining high hygiene standards under pressure.',
  },
  {
    role: 'Retail Assistant / Cashier',
    label: '🛍️ ショップ店員・レジ',
    summary: 'Organised and proactive Retail Assistant with strong interpersonal skills and cashier experience. Proven ability to assist customers, maintain visual merchandising standards, and manage stock inventory.',
  },
  {
    role: 'Housekeeping / Cleaner',
    label: '🧹 ハウスキーピング・清掃',
    summary: 'Meticulous and detail-oriented cleaner with experience in hotel room turnover and commercial cleaning. High physical stamina, trustworthy, and committed to hygiene and quality standards.',
  },
  {
    role: 'Warehouse / Farm Labourer',
    label: '🚜 ファーム・倉庫作業',
    summary: 'Physically fit and dependable worker with a strong work ethic. Experienced in manual handling, packing, and sorting. Adaptable, safety-conscious, and ready for early starts and physical shifts.',
  },
];

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: 'Taro Yamada',
    email: 'taro.yamada@example.com',
    phone: '', // 任意
    location: 'Perth, WA',
    visa: 'Working Holiday Visa (Subclass 417)',
    availability: 'Immediate Start - Full Availability (Mon-Sun, Any Shift)',
    targetRole: 'Barista / All-Rounder (Cafe)',
    summary:
      'Passionate and customer-focused Barista/All-Rounder with solid experience in fast-paced cafe environments. Skilled in espresso calibration, latte art, and point-of-sale operations. Holds a valid Australian RSA.',
    rsa: true,
    experience:
      'Barista & Floor Staff | ABC Cafe (Tokyo, Japan)\n2022 - 2024\n- Prepared high-volume specialty coffee and beverages\n- Delivered warm customer service and operated POS system\n- Maintained strict cleanliness and food safety regulations',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleSelect = (roleObj: (typeof TARGET_ROLES)[0]) => {
    setFormData((prev) => ({
      ...prev,
      targetRole: roleObj.role,
      summary: roleObj.summary,
    }));
  };

  // プレビュー用：電話番号が空でも崩れずにドットで繋ぐ処理
  const contactItems = [
    formData.email,
    formData.phone ? formData.phone : null,
    formData.location,
    formData.visa,
    formData.availability,
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 左側：入力フォーム */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              Australian Resume Generator
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">オーストラリア現地仕様 レジュメ作成</h1>
            <p className="text-sm text-gray-500 mt-1">
              現地基準（写真・生年月日不要）に沿って作成されます。
            </p>
          </div>

          {/* 希望職種選択（ワンタップ） */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              希望する職種 <span className="text-xs font-normal text-amber-600">（タップで自己PRが自動入力されます）</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TARGET_ROLES.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleRoleSelect(item)}
                  className={`text-xs p-2.5 rounded-xl border text-left transition font-medium ${
                    formData.targetRole === item.role
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 基本情報 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                氏名（アルファベット） <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Taro Yamada"
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="taro.yamada@example.com"
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* 電話番号（任意化） */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-semibold text-gray-700">現地電話番号</label>
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">任意 / 渡航前は空欄でOK</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0412 345 678"
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">滞在都市 / 州</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Perth, WA"
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* ビザ（プルダウン） */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ビザの種類 <span className="text-red-500">*</span>
                </label>
                <select
                  name="visa"
                  value={formData.visa}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Working Holiday Visa (Subclass 417)">Working Holiday (Subclass 417)</option>
                  <option value="Work & Holiday Visa (Subclass 462)">Work & Holiday (Subclass 462)</option>
                  <option value="Student Visa (Subclass 500 - 48h/fortnight)">Student Visa (Subclass 500)</option>
                  <option value="Temporary Graduate Visa (Subclass 485)">Graduate Visa (Subclass 485)</option>
                  <option value="Australian Citizen / Permanent Resident">PR / Citizen (永住・市民権)</option>
                  <option value="Valid Australian Work Rights">その他（就労可能ビザ）</option>
                </select>
              </div>
            </div>

            {/* 就労可能シフト（プルダウン） */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                就労可能状況 (Availability) <span className="text-red-500">*</span>
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="Immediate Start - Full Availability (Mon-Sun, Any Shift)">即日勤務可能・全シフト対応可（月〜日）</option>
                <option value="Immediate Start - Weekdays & Weekends (Flexible)">即日勤務可能・平日土日いつでも調整可能</option>
                <option value="Immediate Start - Part-time (Student Visa Compliant)">即日勤務可能・学生ビザ上限対応（48h/2週）</option>
                <option value="Morning & Day Shifts Available">朝〜昼シフト対応可能</option>
                <option value="Night & Closing Shifts Available">夜〜ラスト（締め）シフト対応可能</option>
              </select>
            </div>

            {/* RSA チェック */}
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <input
                type="checkbox"
                id="rsa"
                name="rsa"
                checked={formData.rsa}
                onChange={handleChange}
                className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
              />
              <label htmlFor="rsa" className="text-sm font-medium text-amber-900 cursor-pointer">
                オーストラリアのRSA（酒類取扱資格）を取得済み、または取得予定
              </label>
            </div>

            {/* Professional Summary */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Professional Summary（自己PR）
              </label>
              <textarea
                name="summary"
                rows={3}
                value={formData.summary}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none leading-relaxed"
              />
            </div>

            {/* 職歴 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Work Experience（職歴）
              </label>
              <textarea
                name="experience"
                rows={4}
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg text-sm font-mono text-xs focus:ring-2 focus:ring-amber-500 outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 右側：リアルタイムプレビュー */}
        <div className="lg:sticky lg:top-8 self-start space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              A4 Live Preview (現地仕様レイアウト)
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded">
              ATS Optimized
            </span>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 min-h-[500px] text-gray-900 font-sans text-xs sm:text-sm">
            {/* ヘッダー */}
            <div className="border-b-2 border-gray-800 pb-3 mb-4">
              <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-900">
                {formData.fullName || 'YOUR NAME'}
              </h1>
              <p className="text-amber-700 font-semibold mt-0.5 text-xs sm:text-sm">{formData.targetRole}</p>
              
              {/* 連絡先・ビザ情報（電話がなくても綺麗に bullet で整列） */}
              <div className="text-[11px] sm:text-xs text-gray-600 mt-2 flex flex-wrap gap-x-2 gap-y-0.5 items-center">
                {contactItems.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-gray-300">•</span>}
                    <span className={idx >= 3 ? 'font-medium text-gray-800' : ''}>{item}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b pb-1 mb-1.5">
                Professional Summary
              </h2>
              <p className="text-gray-700 text-xs leading-relaxed">{formData.summary}</p>
            </div>

            {/* Licenses / Certifications */}
            {formData.rsa && (
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b pb-1 mb-1.5">
                  Licenses & Certifications
                </h2>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                  <li>Valid Australian RSA (Responsible Service of Alcohol) Certificate</li>
                </ul>
              </div>
            )}

            {/* Work Experience */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b pb-1 mb-1.5">
                Work Experience
              </h2>
              <pre className="whitespace-pre-wrap font-sans text-xs text-gray-700 leading-relaxed">
                {formData.experience}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}