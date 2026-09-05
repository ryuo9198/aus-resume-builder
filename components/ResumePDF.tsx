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

  // テンプレート別のアクセントカラー
  const primaryColor =
    template === 'modern' ? '#1e40af' : template === 'clean' ? '#0f766e' : '#111827';
  const headerBorder =
    template === 'modern' ? '#3b82f6' : template === 'clean' ? '#14b8a6' : '#d1d5db';

  const styles = StyleSheet.create({
    page: {
      paddingTop: 36,
      paddingBottom: 36,
      paddingHorizontal: 40,
      fontFamily: chosenFont,
      fontSize: 10,
      color: '#1f2937',
      lineHeight: 1.4,
    },
    header: {
      marginBottom: 16,
      borderBottomWidth: template === 'clean' ? 0 : 1.5,
      borderBottomColor: headerBorder,
      paddingBottom: 10,
    },
    name: {
      fontSize: 22,
      fontFamily: chosenBold,
      color: primaryColor,
      letterSpacing: 0.5,
      marginBottom: 3,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      fontSize: 9,
      color: '#4b5563',
      marginBottom: 3,
    },
    visaText: {
      fontSize: 9,
      fontFamily: chosenBold,
      color: primaryColor,
      marginTop: 2,
    },
    section: {
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 11,
      fontFamily: chosenBold,
      color: primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 5,
      borderBottomWidth: template === 'modern' ? 1 : 0.5,
      borderBottomColor: '#e5e7eb',
      paddingBottom: 2,
    },
    summaryText: {
      fontSize: 9.5,
      color: '#374151',
      lineHeight: 1.45,
    },
    skillsText: {
      fontSize: 9.5,
      color: '#374151',
      lineHeight: 1.4,
    },
    experienceBlock: {
      marginBottom: 10,
    },
    expHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 3,
    },
    expRole: {
      fontSize: 10.5,
      fontFamily: chosenBold,
      color: '#111827',
    },
    expCompany: {
      fontSize: 10,
      color: '#4b5563',
    },
    expDuration: {
      fontSize: 9,
      color: '#6b7280',
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: 3,
      paddingLeft: 4,
    },
    bulletDot: {
      width: 10,
      fontSize: 10,
      color: primaryColor,
    },
    bulletContent: {
      flex: 1,
      fontSize: 9.2,
      color: '#374151',
      lineHeight: 1.4,
    },
    certText: {
      fontSize: 9.5,
      color: '#374151',
    },
  });

  const contactItems = [
    data.personalInfo.location,
    data.personalInfo.phone,
    data.personalInfo.email,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.name}</Text>
          <Text style={styles.contactRow}>{contactItems.join('  |  ')}</Text>
          <Text style={styles.visaText}>Visa: {data.personalInfo.visa}</Text>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Skills</Text>
          <Text style={styles.skillsText}>{data.skills.join('   •   ')}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {data.experiences.map((exp, idx) => (
            <View key={idx} style={styles.experienceBlock}>
              <View style={styles.expHeader}>
                <Text style={styles.expRole}>
                  {exp.role} <Text style={styles.expCompany}>- {exp.company}</Text>
                </Text>
                {exp.duration ? <Text style={styles.expDuration}>{exp.duration}</Text> : null}
              </View>
              {exp.bullets.map((b, bIdx) => (
                <View key={bIdx} style={styles.bulletItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletContent}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Licences / Certifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Licences & Certifications</Text>
          <Text style={styles.certText}>{data.certifications.join('   •   ')}</Text>
        </View>
      </Page>
    </Document>
  );
};