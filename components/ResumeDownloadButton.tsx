'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePDF } from './ResumePDF';

export type ResumeData = {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    visa: string;
  };
  summary: string;
  skills: string[];
  experiences: {
    role: string;
    company: string;
    duration: string;
    bullets: string[];
  }[];
  certifications: string[];
};

export default function ResumeDownloadButton({ data }: { data: ResumeData }) {
  return (
    <PDFDownloadLink
      document={<ResumePDF data={data} />}
      fileName="Resume.pdf"
      className="inline-flex h-12 items-center justify-center rounded-full bg-teal-800 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
    >
      {({ loading }) =>
        loading ? 'PDF を準備しています…' : 'Resume.pdf をダウンロード'
      }
    </PDFDownloadLink>
  );
}
