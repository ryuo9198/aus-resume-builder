'use client';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica', color: '#333' },
  header: { borderBottomWidth: 1, borderBottomColor: '#111', paddingBottom: 8, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase', color: '#111' },
  subHeader: { fontSize: 9, color: '#555', marginTop: 4 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 10, marginBottom: 4, borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingBottom: 2 },
  summaryText: { lineHeight: 1.4, color: '#444' },
  jobBlock: { marginBottom: 8 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', fontWeight: 'bold' },
  bullet: { marginLeft: 10, marginTop: 2, lineHeight: 1.3 },
});

export const ResumePDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo?.name || 'Your Name'}</Text>
        <Text style={styles.subHeader}>
          {data.personalInfo?.location} | {data.personalInfo?.phone} | {data.personalInfo?.email}
        </Text>
        <Text style={styles.subHeader}>Visa: {data.personalInfo?.visa}</Text>
      </View>

      {data.summary && (
        <View>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>
      )}

      {data.skills?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Key Skills</Text>
          <Text style={styles.summaryText}>{data.skills.join(' • ')}</Text>
        </View>
      )}

      {data.experiences?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {data.experiences.map((exp: any, i: number) => (
            <View key={i} style={styles.jobBlock}>
              <View style={styles.jobHeader}>
                <Text style={{ fontWeight: 'bold' }}>{exp.role} - {exp.company}</Text>
                <Text>{exp.duration}</Text>
              </View>
              {exp.bullets?.map((b: string, j: number) => (
                <Text key={j} style={styles.bullet}>• {b}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {data.certifications?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Licenses & Certifications</Text>
          <Text style={styles.summaryText}>{data.certifications.join(' • ')}</Text>
        </View>
      )}
    </Page>
  </Document>
);