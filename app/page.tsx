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

// 豪州現地の全主要職種（10種類）
const JOB_DATA = [
  { value: 'Barista / Cafe All-Rounder', labels: { ja: '☕ バリスタ / カフェ店員', en: '☕ Barista / Cafe All-Rounder', ko: '☕ 바리스타 / 카페 직원', zh: '☕ 咖啡師 / 咖啡店員', es: '☕ Barista / Cafetería' } },
  { value: 'Food & Beverage Attendant', labels: { ja: '🍽️ レストラン・居酒屋ホール (接客)', en: '🍽️ Food & Beverage Attendant (Waiter/Waitress)', ko: '🍽️ 레스토랑 / 홀 서빙 (웨이터)', zh: '🍽️ 餐飲服務生 / 外場服務', es: '🍽️ Camarero/a / Servicio de Sala' } },
  { value: 'Kitchen Hand / Dishwasher', labels: { ja: '🍳 キッチンハンド / 調理補助・皿洗い', en: '🍳 Kitchen Hand / Dishwasher', ko: '🍳 키친핸드 / 주방 보조・설거지', zh: '🍳 廚房助手 / 洗碗工', es: '🍳 Ayudante de Cocina / Lavaplatos' } },
  { value: 'Bartender / Pub Staff', labels: { ja: '🍸 バーテンダー / パブスタッフ', en: '🍸 Bartender / Pub Staff', ko: '🍸 바텐더 / 펍 스태프', zh: '🍸 調酒師 / 酒吧工作人員', es: '🍸 Bartender / Personal de Bar' } },
  { value: 'Retail Assistant / Cashier', labels: { ja: '🛍️ 販売スタッフ / レジ・接客', en: '🛍️ Retail Sales Assistant / Cashier', ko: '🛍️ 매장 판매원 / 캐셔', zh: '🛍️ 門市銷售 / 收銀員', es: '🛍️ Dependiente de Tienda / Cajero' } },
  { value: 'General Labourer (Construction)', labels: { ja: '🏗️ 建設現場作業員 (General Labourer)', en: '🏗️ General Labourer (Construction)', ko: '🏗️ 건설 현장 인부 (Labourer)', zh: '🏗️ 工地勞工 (General Labourer)', es: '🏗️ Peón de Construcción (Labourer)' } },
  { value: 'Warehouse Assistant / Forklift', labels: { ja: '📦 倉庫作業員 / ピッキング・フォークリフト', en: '📦 Warehouse Assistant / Picker / Forklift', ko: '📦 물류 창고 직원 / 피킹 / 지게차', zh: '📦 倉庫理貨員 / 揀貨 / 堆高機', es: '📦 Mozo de Almacén / Picking / Montacargas' } },
  { value: 'Housekeeper / Hotel Cleaner', labels: { ja: '🧹 ホテル清掃 / ハウスキーパー', en: '🧹 Housekeeper / Hotel Cleaner', ko: '🧹 호텔 청소 / 하우스키핑', zh: '🧹 飯店房務 / 清潔員', es: '🧹 Personal de Limpieza / Hotel' } },
  { value: 'Farm Hand / Fruit Picker', labels: { ja: '🍎 ファーム作業員 / ピッキング・パッキング', en: '🍎 Farm Hand / Fruit Picker & Packer', ko: '🍎 농장 작업자 / 과일 피킹・패킹', zh: '🍎 農場勞工 / 水果採摘包裝', es: '🍎 Trabajador Agrícola / Recolector de Fruta' } },
  { value: 'Customer Service Representative', labels: { ja: '📞 一般事務 / カスタマーサポート', en: '📞 Customer Service / Office Admin', ko: '📞 일반 사무 / 고객 상담 지원', zh: '📞 客服專員 / 一般辦公行政', es: '📞 Atención al Cliente / Administración' } },
];

// 豪州全ビザ（6種類）
const VISA_DATA = [
  { value: 'Working Holiday (Subclass 417)', labels: { ja: 'ワーキングホリデービザ (Subclass 417)', en: 'Working Holiday Visa (Subclass 417)', ko: '워킹홀리데이 비자 (Subclass 417)', zh: '打工度假簽證 (Subclass 417)', es: 'Visa Working Holiday (Subclass 417)' } },
  { value: 'Work and Holiday (Subclass 462)', labels: { ja: 'ワーク＆ホリデービザ (Subclass 462)', en: 'Work and Holiday Visa (Subclass 462)', ko: '워크 앤 홀리데이 비자 (Subclass 462)', zh: '打工與度假簽證 (Subclass 462)', es: 'Visa Work and Holiday (Subclass 462)' } },
  { value: 'Student Visa (Subclass 500)', labels: { ja: '学生ビザ (Subclass 500)', en: 'Student Visa (Subclass 500)', ko: '학생 비자 (Subclass 500)', zh: '學生簽證 (Subclass 500)', es: 'Visa de Estudiante (Subclass 500)' } },
  { value: 'Temporary Graduate (Subclass 485)', labels: { ja: '卒業生ビザ (Subclass 485)', en: 'Temporary Graduate Visa (Subclass 485)', ko: '졸업생 비자 (Subclass 485)', zh: '畢業生工作簽證 (Subclass 485)', es: 'Visa de Graduado Temporal (Subclass 485)' } },
  { value: 'Permanent Resident (PR)', labels: { ja: '永住権 (Permanent Resident)', en: 'Permanent Resident (PR)', ko: '영주권 (Permanent Resident)', zh: '永久居留權 (PR)', es: 'Residencia Permanente (PR)' } },
  { value: 'Other / Bridging Visa', labels: { ja: 'その他 / ブリッジングビザ', en: 'Other / Bridging Visa', ko: '기타 / 브릿징 비자', zh: '其他 / 過渡簽證 (Bridging Visa)', es: 'Otra / Bridging Visa' } },
];

// 就労可能状況（5種類）
const AVAILABILITY_DATA = [
  { value: 'Full-time (Immediate Start / Any Days)', labels: { ja: '即日勤務可・フルタイム可能 (平日・土日祝いつでも)', en: 'Full-time / Immediate Start (Weekdays & Weekends)', ko: '즉시 출근 가능 / 풀타임 (평일/주말 언제든 가능)', zh: '可立即上班 / 全職可配合 (平日及週末皆可)', es: 'Disponibilidad Inmediata / Tiempo Completo (Cualquier día)' } },
  { value: 'Flexible (Up to 48 hours per fortnight - Student)', labels: { ja: '学生ビザ規定内 (2週間で最大48時間)', en: 'Student Visa Condition (Up to 48 hrs / fortnight)', ko: '학생 비자 규정 준수 (2주 최대 48시간)', zh: '學生簽證規定 (每兩週最多48小時)', es: 'Condición Visa Estudiante (Hasta 48 hrs quincenales)' } },
  { value: 'Part-time / Casual (Immediate Start)', labels: { ja: 'パートタイム / カジュアル (即日可)', en: 'Part-time / Casual (Immediate Start)', ko: '파트타임 / 캐주얼 (즉시 가능)', zh: '兼職 / 臨時工 (Casual / 可立即上班)', es: 'Media Jornada / Casual (Comienzo Inmediato)' } },
  { value: 'Morning Shifts Preferred (from 6:00 AM)', labels: { ja: '早朝・モーニングシフト希望 (朝6:00〜)', en: 'Morning Shifts Preferred (from 6:00 AM)', ko: '오전/모닝 시프트 선호 (아침 6:00부터 가능)', zh: '偏好早班 (可從早上6:00開始)', es: 'Preferencia Turno Mañana (desde las 6:00 AM)' } },
  { value: 'Evening & Night Shifts Preferred', labels: { ja: '夕方・夜間シフト希望 (ディナータイム中心)', en: 'Evening & Night Shifts Preferred', ko: '야간/디너 시프트 선호 (저녁 위주)', zh: '偏好晚班 (以晚餐/夜間時段為主)', es: 'Preferencia Turno Tarde/Noche' } },
];

// 保有資格・ライセンス（6種類）
const CERT_DATA = [
  { value: 'RSA (Responsible Service of Alcohol)', labels: { ja: 'RSA (飲食店・バーでお酒を扱う必須資格)', en: 'RSA (Responsible Service of Alcohol)', ko: 'RSA (주류 취급 필수 자격증)', zh: 'RSA (酒類服務責任證書 - 餐飲必備)', es: 'RSA (Servicio Responsable de Alcohol)' } },
  { value: 'White Card (Construction)', labels: { ja: 'ホワイトカード (建設現場・倉庫の安全講習証)', en: 'White Card (General Construction Induction)', ko: '화이트카드 (건설/현장 필수 안전교육증)', zh: '白卡 White Card (建築工地安全證)', es: 'White Card (Seguridad para Construcción)' } },
  { value: 'Barista Certificate', labels: { ja: 'バリスタ認定証 / スクール修了証', en: 'Barista Certificate / Coffee Training', ko: '바리스타 수료증 / 커피 전문 자격증', zh: '咖啡師培訓結業證書', es: 'Certificado de Barista' } },
  { value: 'First Aid & CPR', labels: { ja: 'ファーストエイド ＆ CPR (救急救命ライセンス)', en: 'First Aid & CPR (HLTAID011)', ko: '응급처치 & CPR 자격증', zh: '急救與心肺復甦術證照 (First Aid & CPR)', es: 'Primeros Auxilios y RCP' } },
  { value: 'Australian Driver Licence', labels: { ja: 'オーストラリア運転免許証 (または国際免許証)', en: 'Australian Driver Licence / International Permit', ko: '호주 운전면허증 (또는 유효한 국제면허증)', zh: '澳洲駕照 / 國際駕照', es: 'Licencia de Conducir Australiana / Internacional' } },
  { value: 'RSG (Responsible Service of Gambling)', labels: { ja: 'RSG (カジノ・ゲーミングパブ関連の資格)', en: 'RSG (Responsible Service of Gambling)', ko: 'RSG (도박장 / 게임 관련 필수 자격증)', zh: 'RSG (博弈服務責任證書)', es: 'RSG (Servicio Responsable de Apuestas)' } },
];

// 豪州全主要都市（10都市）
const CITY_OPTIONS = [
  'Perth, WA',
  'Sydney, NSW',
  'Melbourne, VIC',
  'Brisbane, QLD',
  'Adelaide, SA',
  'Gold Coast, QLD',
  'Cairns, QLD',
  'Darwin, NT',
  'Hobart, TAS',
  'Canberra, ACT',
];

const uiText = {
  ja: {
    title: '🇦🇺 Aus Resume & Cover Letter AI',
    subtitle: 'オーストラリアのローカルジョブ獲得に特化した英文レジュメ＆カバーレターを瞬時に作成',
    paidBadge: '🎉 プレミアム購入済み',
    step1Nav: '情報入力',
    step2Nav: 'デザイン選択',
    step3Nav: '完成・ダウンロード',
    step1Title: 'ステップ 1: 基本情報を入力',
    nameLabel: 'お名前 (英語表記)',
    namePh: '例: Taro Yamada',
    emailLabel: 'メールアドレス',
    emailPh: '例: your.email@gmail.com',
    phoneLabel: '電話番号 (豪) ※任意',
    phonePh: '0423 000 000',
    cityLabel: '滞在都市 / 渡航予定先',
    jobLabel: '希望職種 (選択してください)',
    visaLabel: 'ビザの種類',
    availLabel: '就労可能状況',
    certsLabel: '保有資格・ライセンス (該当するものを選択・任意)',
    expLabel: '過去の経験・アピールポイント (母国語でOK)',
    expPh: '例: スタバで3年間バイト。新作ドリンク作成、レジ、ピーク時の接客を担当。',
    btnToStep2: '次へ：デザイン・フォントを選ぶ ➔',
    btnGenerating: 'AIが生成中（約3秒）...',
    step2Title: 'ステップ 2: デザイン選択',
    btnBackEdit: '⬅️ 情報を再編集する',
    layoutStyle: 'レイアウトスタイル',
    fontStyle: 'フォントスタイル',
    sansLabel: 'Sans-Serif',
    sansDesc: '現代的・カフェ/現場',
    serifLabel: 'Classic Serif',
    serifDesc: '格式高い・事務/営業',
    btnToStep3: 'このデザインで完成へ ➔',
    step3Title: 'ステップ 3: 書類の発行',
    btnDownloadPdf: '📄 PDFをダウンロード',
    btnUnlock: '🔓 PDF & カバーレターをアンロック ($4.99 AUD)',
    unlockNotice: '※ 一度アンロックすると無制限にダウンロード可能です',
    tabResume: '📄 Resume プレビュー (対訳つき)',
    tabCover: '✉️ Cover Letter (添え状)',
    transLabel: '💡 翻訳:',
    coverUnlockedDesc: '英文の応募用テキスト',
    coverLockedDesc: '🔒 アンロックすると全文コピー可能になります',
    btnCopy: '📋 英文をコピー',
    btnCopied: '✅ コピー完了！',
    btnLocked: '🔒 ロック中',
    paymentRedirect: '決済画面へ移動中...',
    templates: {
      classic: { name: 'Classic (王道スタイル)', desc: 'オーストラリアで最もATS選考に強い標準形式' },
      modern: { name: 'Modern (洗練ブルー)', desc: 'ネイビーをアクセントにした清潔感あるデザイン' },
      clean: { name: 'Clean (ミニマルティール)', desc: '余白を広めに取ったモダンで読みやすい形式' },
    }
  },
  en: {
    title: '🇦🇺 Aus Resume & Cover Letter AI',
    subtitle: 'Create ATS-friendly Australian standard Resumes & Cover Letters instantly for local jobs.',
    paidBadge: '🎉 Premium Unlocked',
    step1Nav: 'Details',
    step2Nav: 'Design & Font',
    step3Nav: 'Finish & Download',
    step1Title: 'Step 1: Enter Your Information',
    nameLabel: 'Full Name (English)',
    namePh: 'e.g. Alex Smith',
    emailLabel: 'Email Address',
    emailPh: 'e.g. alex.smith@gmail.com',
    phoneLabel: 'Phone Number (AU) (Optional)',
    phonePh: '0423 000 000',
    cityLabel: 'Current / Planned City',
    jobLabel: 'Target Role (Select from list)',
    visaLabel: 'Visa Type',
    availLabel: 'Availability',
    certsLabel: 'Licences & Certifications (Optional)',
    expLabel: 'Past Experience & Key Strengths',
    expPh: 'e.g. 3 years barista at Starbucks. Handcrafted specialty drinks, POS operation, and customer service during peak rush.',
    btnToStep2: 'Next: Choose Design & Font ➔',
    btnGenerating: 'AI Generating (approx. 3s)...',
    step2Title: 'Step 2: Choose Layout & Font',
    btnBackEdit: '⬅️ Edit Information',
    layoutStyle: 'Layout Style',
    fontStyle: 'Font Family',
    sansLabel: 'Sans-Serif',
    sansDesc: 'Modern / Hospitality & Trades',
    serifLabel: 'Classic Serif',
    serifDesc: 'Formal / Office & Admin',
    btnToStep3: 'Continue with this Design ➔',
    step3Title: 'Step 3: Export Documents',
    btnDownloadPdf: '📄 Download High-Res PDF',
    btnUnlock: '🔓 Unlock PDF & Cover Letter ($4.99 AUD)',
    unlockNotice: '※ Unlimited PDF downloads once unlocked',
    tabResume: '📄 Resume Preview',
    tabCover: '✉️ Cover Letter',
    transLabel: '💡 Note:',
    coverUnlockedDesc: 'Full English cover letter ready to copy',
    coverLockedDesc: '🔒 Unlock to copy full cover letter',
    btnCopy: '📋 Copy Cover Letter',
    btnCopied: '✅ Copied!',
    btnLocked: '🔒 Locked',
    paymentRedirect: 'Redirecting to checkout...',
    templates: {
      classic: { name: 'Classic (ATS Standard)', desc: 'Most widely accepted layout across Australian employers' },
      modern: { name: 'Modern (Refined Navy)', desc: 'Clean layout featuring professional navy accents' },
      clean: { name: 'Clean (Minimal Teal)', desc: 'Modern style with spacious, readable formatting' },
    }
  },
  ko: {
    title: '🇦🇺 호주 영문 이력서 & 커버레터 생성기',
    subtitle: '호주 현지 잡 구직에 최적화된 호주 표준 레주메와 커버레터를 즉시 완성합니다.',
    paidBadge: '🎉 프리미엄 구매 완료',
    step1Nav: '정보 입력',
    step2Nav: '디자인 선택',
    step3Nav: '완성 및 다운로드',
    step1Title: '1단계: 기본 정보 입력',
    nameLabel: '영문 성명',
    namePh: '예: Minwoo Kim',
    emailLabel: '이메일 주소',
    emailPh: '예: minwoo.kim@gmail.com',
    phoneLabel: '호주 전화번호 (선택사항)',
    phonePh: '0423 000 000',
    cityLabel: '거주/입국 예정 도시',
    jobLabel: '희망 직종 (선택)',
    visaLabel: '비자 종류',
    availLabel: '근무 가능 시간',
    certsLabel: '보유 자격증 (선택사항)',
    expLabel: '경력 및 강점 (한국어로 편하게 작성)',
    expPh: '예: 스타벅스에서 3년간 알바. 에스프레소 추출, 음료 제조, 포스 결제, 피크 시간 고객 응대 담당.',
    btnToStep2: '다음: 디자인 및 폰트 선택 ➔',
    btnGenerating: 'AI 생성 중 (약 3초)...',
    step2Title: '2단계: 디자인 선택',
    btnBackEdit: '⬅️ 정보 다시 수정하기',
    layoutStyle: '레이아웃 스타일',
    fontStyle: '폰트 스타일',
    sansLabel: '산세리프 (Sans)',
    sansDesc: '현대적 / 카페 및 현장직',
    serifLabel: '세리프 (Serif)',
    serifDesc: '격식 있는 / 사무 및 영업직',
    btnToStep3: '이 디자인으로 완성하기 ➔',
    step3Title: '3단계: 서류 발급',
    btnDownloadPdf: '📄 PDF 다운로드',
    btnUnlock: '🔓 PDF & 커버레터 언락 ($4.99 AUD)',
    unlockNotice: '※ 1회 결제 시 무제한 다운로드 가능',
    tabResume: '📄 이력서 미리보기 (한국어 번역 포함)',
    tabCover: '✉️ 커버레터',
    transLabel: '🇰🇷 한국어 번역:',
    coverUnlockedDesc: '영문 지원용 텍스트 복사 가능',
    coverLockedDesc: '🔒 결제 후 전체 복사가 가능합니다',
    btnCopy: '📋 영문 복사',
    btnCopied: '✅ 복사 완료!',
    btnLocked: '🔒 잠김',
    paymentRedirect: '결제 페이지로 이동 중...',
    templates: {
      classic: { name: '클래식 (Classic)', desc: '호주 기업 및 ATS 심사 통과율이 가장 높은 표준 형식' },
      modern: { name: '모던 (Modern Navy)', desc: '신뢰감을 주는 네이비 포인트 컬러 디자인' },
      clean: { name: '클린 (Clean Teal)', desc: '여백을 넓게 살려 가독성을 극대화한 미니멀 디자인' },
    }
  },
  zh: {
    title: '🇦🇺 澳洲英文履歷與求職信生成器',
    subtitle: '專為澳洲打工度假與求職打造，秒級生成標準澳式 Resume 與 Cover Letter。',
    paidBadge: '🎉 已解鎖進階版',
    step1Nav: '填寫資料',
    step2Nav: '選擇版型',
    step3Nav: '完成與下載',
    step1Title: '步驟 1: 填寫個人基本資訊',
    nameLabel: '英文姓名',
    namePh: '例: Alex Chen',
    emailLabel: '電子郵件',
    emailPh: '例: alex.chen@gmail.com',
    phoneLabel: '澳洲電話 (選填)',
    phonePh: '0423 000 000',
    cityLabel: '所在 / 預計前往城市',
    jobLabel: '應徵職位 (請選擇)',
    visaLabel: '簽證類型',
    availLabel: '可工作時間',
    certsLabel: '相關證照 (選填)',
    expLabel: '過去經歷與優勢 (可用中文填寫)',
    expPh: '例: 在星巴克打工3年，負責製作飲料、點餐收銀、高峰期顧客接待與環境清潔。',
    btnToStep2: '下一步：選擇版型與字體 ➔',
    btnGenerating: 'AI生成中（約3秒）...',
    step2Title: '步驟 2: 版型與字體選擇',
    btnBackEdit: '⬅️ 返回修改資料',
    layoutStyle: '版型樣式',
    fontStyle: '字體風格',
    sansLabel: '無襯線體 (Sans)',
    sansDesc: '現代俐落 / 餐飲與現場職',
    serifLabel: '襯線體 (Serif)',
    serifDesc: '正式經典 / 文書與辦公職',
    btnToStep3: '使用此版型完成 ➔',
    step3Title: '步驟 3: 匯出文件',
    btnDownloadPdf: '📄 下載高畫質 PDF',
    btnUnlock: '🔓 解鎖 PDF 與求職信 ($4.99 AUD)',
    unlockNotice: '※ 一次解鎖即可享有無限次下載',
    tabResume: '📄 履歷預覽 (附中文對照)',
    tabCover: '✉️ 求職信 (Cover Letter)',
    transLabel: '🇹🇼 中文對照:',
    coverUnlockedDesc: '可用於求職信件的英文全文',
    coverLockedDesc: '🔒 解鎖後可複製全文',
    btnCopy: '📋 複製英文求職信',
    btnCopied: '✅ 已複製！',
    btnLocked: '🔒 未解鎖',
    paymentRedirect: '跳轉至付款頁面...',
    templates: {
      classic: { name: '經典風格 (Classic)', desc: '符合澳洲企業與 ATS 系統規範的標準格式' },
      modern: { name: '現代海軍藍 (Modern)', desc: '沉穩俐落的藍色點綴，呈現專業現代感' },
      clean: { name: '極簡清新 (Clean)', desc: '留白適中、段落清晰好閱讀的極簡設計' },
    }
  },
  es: {
    title: '🇦🇺 Generador de CV y Cover Letter para Australia',
    subtitle: 'Crea al instante tu currículum y carta de presentación en formato australiano estándar.',
    paidBadge: '🎉 Versión Premium Desbloqueada',
    step1Nav: 'Datos',
    step2Nav: 'Diseño y Fuente',
    step3Nav: 'Finalizar y Descargar',
    step1Title: 'Paso 1: Ingresa tus Datos',
    nameLabel: 'Nombre Completo (en inglés)',
    namePh: 'ej: Carlos Gomez',
    emailLabel: 'Correo Electrónico',
    emailPh: 'ej: carlos.gomez@gmail.com',
    phoneLabel: 'Teléfono (AU) (Opcional)',
    phonePh: '0423 000 000',
    cityLabel: 'Ciudad actual o de destino',
    jobLabel: 'Puesto Deseado (Selecciona)',
    visaLabel: 'Tipo de Visa',
    availLabel: 'Disponibilidad',
    certsLabel: 'Certificaciones (Opcional)',
    expLabel: 'Experiencia y fortalezas (en español)',
    expPh: 'ej: 3 años de barista en Starbucks. Elaboración de bebidas, caja y servicio al cliente durante horas pico.',
    btnToStep2: 'Siguiente: Elegir Diseño y Fuente ➔',
    btnGenerating: 'Generando con IA (aprox. 3s)...',
    step2Title: 'Paso 2: Personalizar Diseño',
    btnBackEdit: '⬅️ Volver a Editar Datos',
    layoutStyle: 'Estilo de Diseño',
    fontStyle: 'Familia Tipográfica',
    sansLabel: 'Sans-Serif',
    sansDesc: 'Moderno / Hostelería y Oficios',
    serifLabel: 'Classic Serif',
    serifDesc: 'Formal / Oficina y Gestión',
    btnToStep3: 'Continuar con este Diseño ➔',
    step3Title: 'Paso 3: Exportar Documentos',
    btnDownloadPdf: '📄 Descargar PDF en Alta Calidad',
    btnUnlock: '🔓 Desbloquear PDF y Carta ($4.99 AUD)',
    unlockNotice: '※ Descargas ilimitadas una vez desbloqueado',
    tabResume: '📄 Vista Previa de CV (con traducción)',
    tabCover: '✉️ Cover Letter (Carta)',
    transLabel: '🇪🇸 Traducción:',
    coverUnlockedDesc: 'Texto en inglés listo para postularse',
    coverLockedDesc: '🔒 Desbloquea para copiar la carta completa',
    btnCopy: '📋 Copiar Carta en Inglés',
    btnCopied: '✅ ¡Copiado!',
    btnLocked: '🔒 Bloqueado',
    paymentRedirect: 'Redirigiendo al pago...',
    templates: {
      classic: { name: 'Clásico (ATS Standard)', desc: 'El diseño más recomendado y aceptado en Australia' },
      modern: { name: 'Moderno (Azul Marino)', desc: 'Diseño pulcro con elegantes toques profesionales' },
      clean: { name: 'Minimalista (Teal)', desc: 'Estilo moderno con espaciado amplio y clara lectura' },
    }
  },
};

function ResumeBuilderContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Language>('ja');
  const [isPaid, setIsPaid] = useState(false);
  const t = uiText[lang];

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
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
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResumeData(data);
      setCurrentStep(2);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
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
        alert('Payment redirect failed');
      }
    } catch (err: any) {
      alert('Network error');
    } finally {
      setPaying(false);
    }
  };

  const handleCopyCoverLetter = () => {
    if (!isPaid) {
      alert(t.coverLockedDesc);
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
              className={`text-xs px-2.5 py-1 rounded font-bold border transition ${
                lang === l ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
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
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600">
            {t.subtitle}
          </p>
          {isPaid && (
            <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mt-1">
              {t.paidBadge}
            </div>
          )}
        </div>

        {/* 3ステップ プログレスバー */}
        <div className="max-w-xl mx-auto bg-white p-3 rounded-xl border border-slate-300 shadow-sm flex items-center justify-between text-xs font-bold">
          <div className={`flex items-center space-x-1.5 ${currentStep === 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] ${currentStep >= 1 ? 'bg-blue-600' : 'bg-slate-300'}`}>1</span>
            <span>{t.step1Nav}</span>
          </div>
          <span className="text-slate-300">➔</span>
          <div className={`flex items-center space-x-1.5 ${currentStep === 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] ${currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-300'}`}>2</span>
            <span>{t.step2Nav}</span>
          </div>
          <span className="text-slate-300">➔</span>
          <div className={`flex items-center space-x-1.5 ${currentStep === 3 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] ${currentStep === 3 ? 'bg-emerald-600' : 'bg-slate-300'}`}>3</span>
            <span>{t.step3Nav}</span>
          </div>
        </div>

        {/* Step 1: 情報入力 */}
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow border border-slate-300">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              {t.step1Title}
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800">{t.nameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={t.namePh}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-semibold focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">{t.emailLabel}</label>
                  <input
                    type="email"
                    required
                    placeholder={t.emailPh}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-semibold focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800">{t.phoneLabel}</label>
                  <input
                    type="text"
                    placeholder={t.phonePh}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full p-2.5 bg-white border-2 border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-semibold focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">{t.cityLabel}</label>
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
                  <label className="block text-xs font-bold text-slate-800">{t.jobLabel}</label>
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
                  <label className="block text-xs font-bold text-slate-800">{t.visaLabel}</label>
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
                  <label className="block text-xs font-bold text-slate-800">{t.availLabel}</label>
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
                <label className="block text-xs font-bold text-slate-800 mb-1.5">{t.certsLabel}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
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
                  {t.expLabel}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={t.expPh}
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
                {loading ? t.btnGenerating : t.btnToStep2}
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
                  <span>{t.btnBackEdit}</span>
                </button>
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                  {t.step2Title}
                </h3>
              </div>

              {/* テンプレート選択 */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">{t.layoutStyle}</label>
                <div className="space-y-2">
                  {(['classic', 'modern', 'clean'] as TemplateType[]).map((tplId) => (
                    <div
                      key={tplId}
                      onClick={() => setTemplate(tplId)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                        template === tplId ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-900">{t.templates[tplId].name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.templates[tplId].desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* フォント選択 */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">{t.fontStyle}</label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setFontFamily('sans')}
                    className={`p-2.5 rounded-lg border-2 cursor-pointer text-center transition font-sans ${
                      fontFamily === 'sans' ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-700' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-xs">{t.sansLabel}</span>
                    <p className="text-[10px] text-slate-400 font-normal">{t.sansDesc}</p>
                  </div>
                  <div
                    onClick={() => setFontFamily('serif')}
                    className={`p-2.5 rounded-lg border-2 cursor-pointer text-center transition font-serif ${
                      fontFamily === 'serif' ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-700' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-xs">{t.serifLabel}</span>
                    <p className="text-[10px] text-slate-400 font-normal">{t.serifDesc}</p>
                  </div>
                </div>
              </div>

              {/* Step 3 への遷移 */}
              {currentStep === 2 && (
                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition text-sm shadow flex items-center justify-center space-x-1"
                >
                  <span>{t.btnToStep3}</span>
                </button>
              )}

              {/* Step 3: 発行・アンロック */}
              {currentStep === 3 && isClient && (
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">{t.step3Title}</h4>
                  {isPaid ? (
                    <PDFDownloadLink
                      document={<ResumePDF data={resumeData} template={template} fontFamily={fontFamily} />}
                      fileName={`${resumeData.personalInfo?.name || 'Resume'}_AUS.pdf`}
                      className="block w-full text-center py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition text-sm shadow"
                    >
                      {({ loading }) => (loading ? '...' : t.btnDownloadPdf)}
                    </PDFDownloadLink>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleCheckout}
                        disabled={paying}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition text-sm shadow flex items-center justify-center space-x-1"
                      >
                        <span>{paying ? t.paymentRedirect : t.btnUnlock}</span>
                      </button>
                      <p className="text-[11px] text-center text-slate-500 font-medium">
                        {t.unlockNotice}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 右側：プレビュー表示 */}
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

                {activeTab === 'resume' ? (
                  <div
                    className={`space-y-4 max-h-[550px] overflow-y-auto pr-2 text-xs transition-all ${
                      fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                    }`}
                  >
                    {/* Header */}
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
                          <span className="font-bold">{t.transLabel}</span> {resumeData.summaryTrans}
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
                        {isPaid ? t.coverUnlockedDesc : t.coverLockedDesc}
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
                        value={
                          isPaid
                            ? `【English Original】\n${resumeData.coverLetter}\n\n====================\n【${t.transLabel}】\n${resumeData.coverLetterTrans}`
                            : resumeData.coverLetter?.slice(0, 160) + '\n\n... (Unlock to view full letter)'
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