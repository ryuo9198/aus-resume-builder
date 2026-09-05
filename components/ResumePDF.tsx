import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location: string;
    visa: string;
  };
  summary: string;
  skills: string[];
  experiences: Array<{
    role: string;
    company: string;
    duration?: string;
    bullets: string[];
  }>;
  certifications: string[];
  coverLetter?: string;
}

interface ResumePDFProps {
  data: ResumeData;
  template?: 'classic' | 'modern' | 'clean';
  fontFamily?: 'sans' | 'serif';
}

export const ResumePDF: React.FC<ResumePDFProps> = ({
  data,
  template = 'classic',
  fontFamily = 'sans',
}) => {
  const chosenFont = fontFamily === 'serif' ? 'Times-Roman' : 'Helvetica';
  const chosenBold = fontFamily === 'serif' ? 'Times-Bold' : 'Helvetica-Bold';

  // -------------------------------------------------------------
  // Template 1: Classic (ATS Traditional Single Column)
  // -------------------------------------------------------------
  const classicStyles = StyleSheet.create({
    page: {
      padding: 36,
      fontFamily: chosenFont,
      fontSize: 9.5,
      color: '#111827',
      lineHeight: 1.4,
    },
    header: {
      textAlign: 'center',
      borderBottomWidth: 1.5,
      borderBottomColor: '#111827',
      paddingBottom: 10,
      marginBottom: 14,
    },
    name: {
      fontSize: 22,
      fontFamily: chosenBold,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 4,
    },
    contact: {
      fontSize: 9,
      color: '#374151',
      marginBottom: 2,
    },
    visa: {
      fontSize: 9,
      fontFamily: chosenBold,
      color: '#111827',
    },
    sectionTitle: {
      fontSize: 10.5,
      fontFamily: chosenBold,
      textTransform: 'uppercase',
      letterSpacing: 1,
      borderBottomWidth: 0.8,
      borderBottomColor: '#9ca3af',
      paddingBottom: 2,
      marginBottom: 6,
      marginTop: 10,
    },
    bullet: {
      flexDirection: 'row',
      marginBottom: 3,
      paddingLeft: 4,
    },
    bulletDot: { width: 10, fontSize: 10 },
    bulletText: { flex: 1, fontSize: 9.2, color: '#374151' },
  });

  // -------------------------------------------------------------
  // Template 2: Modern 2-Column (Left Sidebar Layout)
  // -------------------------------------------------------------
  const modernStyles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      fontFamily: chosenFont,
      fontSize: 9.2,
      color: '#1f2937',
      lineHeight: 1.35,
    },
    sidebar: {
      width: '32%',
      backgroundColor: '#1e293b',
      color: '#f8fafc',
      padding: 24,
      paddingTop: 32,
    },
    sidebarName: {
      fontSize: 18,
      fontFamily: chosenBold,
      color: '#ffffff',
      marginBottom: 14,
      lineHeight: 1.2,
    },
    sidebarSection: {
      marginBottom: 16,
    },
    sidebarTitle: {
      fontSize: 9,
      fontFamily: chosenBold,
      color: '#38bdf8',
      textTransform: 'uppercase',
      letterSpacing: 1,
      borderBottomWidth: 0.5,
      borderBottomColor: '#475569',
      paddingBottom: 2,
      marginBottom: 6,
    },
    sidebarText: {
      fontSize: 8.5,
      color: '#cbd5e1',
      marginBottom: 3,
    },
    main: {
      width: '68%',
      padding: 28,
      paddingTop: 32,
    },
    mainSectionTitle: {
      fontSize: 10.5,
      fontFamily: chosenBold,
      color: '#0f172a',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      borderBottomWidth: 1.5,
      borderBottomColor: '#0284c7',
      paddingBottom: 3,
      marginBottom: 8,
      marginTop: 6,
    },
  });

  // -------------------------------------------------------------
  // Template 3: Clean Minimal (Spacious Left-Aligned)
  // -------------------------------------------------------------
  const cleanStyles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: chosenFont,
      fontSize: 9.5,
      color: '#27272a',
      lineHeight: 1.45,
    },
    header: {
      marginBottom: 16,
    },
    name: {
      fontSize: 26,
      fontFamily: chosenBold,
      color: '#09090b',
      letterSpacing: -0.5,
      marginBottom: 4,
    },
    tagline: {
      fontSize: 9.5,
      color: '#0d9488',
      fontFamily: chosenBold,
      marginBottom: 4,
    },
    contact: {
      fontSize: 8.8,
      color: '#71717a',
    },
    sectionTitle: {
      fontSize: 10,
      fontFamily: chosenBold,
      color: '#0d9488',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: 6,
      marginTop: 12,
    },
  });

  const contactItems = [
    data.personalInfo.location,
    data.personalInfo.phone,
    data.personalInfo.email,
  ].filter(Boolean);

  // レンダリング：Modern (2カラム)
  if (template === 'modern') {
    return (
      <Document>
        <Page size="A4" style={modernStyles.page}>
          {/* 左サイドバー */}
          <View style={modernStyles.sidebar}>
            <Text style={modernStyles.sidebarName}>{data.personalInfo.name}</Text>
            
            <View style={modernStyles.sidebarSection}>
              <Text style={modernStyles.sidebarTitle}>Contact</Text>
              <Text style={modernStyles.sidebarText}>{data.personalInfo.location}</Text>
              {data.personalInfo.phone ? <Text style={modernStyles.sidebarText}>{data.personalInfo.phone}</Text> : null}
              <Text style={modernStyles.sidebarText}>{data.personalInfo.email}</Text>
            </View>

            <View style={modernStyles.sidebarSection}>
              <Text style={modernStyles.sidebarTitle}>Visa Status</Text>
              <Text style={modernStyles.sidebarText}>{data.personalInfo.visa}</Text>
            </View>

            <View style={modernStyles.sidebarSection}>
              <Text style={modernStyles.sidebarTitle}>Skills</Text>
              {data.skills.map((s, i) => (
                <Text key={i} style={modernStyles.sidebarText}>• {s}</Text>
              ))}
            </View>

            <View style={modernStyles.sidebarSection}>
              <Text style={modernStyles.sidebarTitle}>Certifications</Text>
              {data.certifications.map((c, i) => (
                <Text key={i} style={modernStyles.sidebarText}>• {c}</Text>
              ))}
            </View>
          </View>

          {/* 右メイン */}
          <View style={modernStyles.main}>
            <View>
              <Text style={modernStyles.mainSectionTitle}>Professional Summary</Text>
              <Text style={{ fontSize: 9, color: '#334155', lineHeight: 1.4 }}>{data.summary}</Text>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={modernStyles.mainSectionTitle}>Experience</Text>
              {data.experiences.map((exp, idx) => (
                <View key={idx} style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                    <Text style={{ fontSize: 10, fontFamily: chosenBold, color: '#0f172a' }}>{exp.role}</Text>
                    {exp.duration ? <Text style={{ fontSize: 8.5, color: '#64748b' }}>{exp.duration}</Text> : null}
                  </View>
                  <Text style={{ fontSize: 9, color: '#475569', marginBottom: 4 }}>{exp.company}</Text>
                  {exp.bullets.map((b, bIdx) => (
                    <View key={bIdx} style={{ flexDirection: 'row', marginBottom: 2.5 }}>
                      <Text style={{ width: 8, fontSize: 8, color: '#0284c7' }}>▸</Text>
                      <Text style={{ flex: 1, fontSize: 8.8, color: '#334155', lineHeight: 1.35 }}>{b}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    );
  }

  // レンダリング：Clean Minimal
  if (template === 'clean') {
    return (
      <Document>
        <Page size="A4" style={cleanStyles.page}>
          <View style={cleanStyles.header}>
            <Text style={cleanStyles.name}>{data.personalInfo.name}</Text>
            <Text style={cleanStyles.tagline}>Visa: {data.personalInfo.visa}</Text>
            <Text style={cleanStyles.contact}>{contactItems.join('  •  ')}</Text>
          </View>

          <View>
            <Text style={cleanStyles.sectionTitle}>Summary</Text>
            <Text style={{ fontSize: 9.3, color: '#3f3f46' }}>{data.summary}</Text>
          </View>

          <View>
            <Text style={cleanStyles.sectionTitle}>Core Competencies</Text>
            <Text style={{ fontSize: 9.3, color: '#3f3f46' }}>{data.skills.join('   /   ')}</Text>
          </View>

          <View>
            <Text style={cleanStyles.sectionTitle}>Experience</Text>
            {data.experiences.map((exp, idx) => (
              <View key={idx} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Text style={{ fontSize: 10, fontFamily: chosenBold, color: '#18181b' }}>
                    {exp.role} <Text style={{ fontFamily: chosenFont, color: '#71717a' }}>— {exp.company}</Text>
                  </Text>
                  {exp.duration ? <Text style={{ fontSize: 9, color: '#71717a' }}>{exp.duration}</Text> : null}
                </View>
                {exp.bullets.map((b, bIdx) => (
                  <View key={bIdx} style={{ flexDirection: 'row', marginBottom: 2.5, paddingLeft: 4 }}>
                    <Text style={{ width: 10, color: '#0d9488' }}>—</Text>
                    <Text style={{ flex: 1, fontSize: 9, color: '#3f3f46' }}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          <View>
            <Text style={cleanStyles.sectionTitle}>Licences & Certifications</Text>
            <Text style={{ fontSize: 9.3, color: '#3f3f46' }}>{data.certifications.join('   •   ')}</Text>
          </View>
        </Page>
      </Document>
    );
  }

  // デフォルト：Classic
  return (
    <Document>
      <Page size="A4" style={classicStyles.page}>
        <View style={classicStyles.header}>
          <Text style={classicStyles.name}>{data.personalInfo.name}</Text>
          <Text style={classicStyles.contact}>{contactItems.join('  |  ')}</Text>
          <Text style={classicStyles.visa}>Visa: {data.personalInfo.visa}</Text>
        </View>

        <View>
          <Text style={classicStyles.sectionTitle}>Professional Summary</Text>
          <Text style={{ fontSize: 9.2, color: '#374151' }}>{data.summary}</Text>
        </View>

        <View>
          <Text style={classicStyles.sectionTitle}>Key Skills</Text>
          <Text style={{ fontSize: 9.2, color: '#374151' }}>{data.skills.join('   •   ')}</Text>
        </View>

        <View>
          <Text style={classicStyles.sectionTitle}>Work Experience</Text>
          {data.experiences.map((exp, idx) => (
            <View key={idx} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                <Text style={{ fontSize: 10, fontFamily: chosenBold }}>
                  {exp.role} <Text style={{ color: '#4b5563' }}>- {exp.company}</Text>
                </Text>
                {exp.duration ? <Text style={{ fontSize: 8.8, color: '#6b7280' }}>{exp.duration}</Text> : null}
              </View>
              {exp.bullets.map((b, bIdx) => (
                <View key={bIdx} style={classicStyles.bullet}>
                  <Text style={classicStyles.bulletDot}>•</Text>
                  <Text style={classicStyles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View>
          <Text style={classicStyles.sectionTitle}>Licences & Certifications</Text>
          <Text style={{ fontSize: 9.2, color: '#374151' }}>{data.certifications.join('   •   ')}</Text>
        </View>
      </Page>
    </Document>
  );
};