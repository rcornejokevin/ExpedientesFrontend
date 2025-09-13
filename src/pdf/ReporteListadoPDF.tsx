import React from 'react';
import { Document, Page, StyleSheet, Text, View, Image } from '@react-pdf/renderer';

export interface ReporteListadoRow {
  numero: string;
  titulo: string;
  ingreso: string;
  proceso: string;
  estatus: string;
  etapa: string;
  modificacion: string;
}

export interface ReporteListadoPDFProps {
  titulo?: string;
  rows: ReporteListadoRow[];
  count?: number;
  logoSrc?: string;
}

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10, color: '#111', fontFamily: 'Helvetica' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  header: { fontSize: 16, fontWeight: 700, color: '#192854' },
  subHeader: { fontSize: 10, color: '#192854' },
  logo: { height: 36 },
  table: { borderWidth: 1, borderColor: '#7e8a9a' },
  tr: { flexDirection: 'row' },
  th: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#7e8a9a',
    backgroundColor: '#E1E4E7',
    padding: 6,
    fontWeight: 700,
    color: '#192854',
  },
  td: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#7e8a9a',
    padding: 6,
  },
});

const colWidths = {
  numero: '12%',
  titulo: '28%',
  ingreso: '12%',
  proceso: '14%',
  estatus: '10%',
  etapa: '12%',
  modificacion: '12%',
};

export default function ReporteListadoPDF({ titulo = 'Listado de Expedientes', rows, count, logoSrc = '/logos/marn_azul.png' }: ReporteListadoPDFProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.header}>{titulo}</Text>
            {typeof count === 'number' ? (
              <Text style={styles.subHeader}>Total de registros: {count}</Text>
            ) : null}
          </View>
          {logoSrc ? <Image style={styles.logo} src={logoSrc} /> : null}
        </View>
        <View style={styles.table}>
          <View style={styles.tr}>
            <Text style={[styles.th, { width: colWidths.numero }]}>NÚMERO</Text>
            <Text style={[styles.th, { width: colWidths.titulo }]}>TÍTULO</Text>
            <Text style={[styles.th, { width: colWidths.ingreso }]}>INGRESO</Text>
            <Text style={[styles.th, { width: colWidths.proceso }]}>PROCESO</Text>
            <Text style={[styles.th, { width: colWidths.estatus }]}>ESTATUS</Text>
            <Text style={[styles.th, { width: colWidths.etapa }]}>ETAPA</Text>
            <Text style={[styles.th, { width: colWidths.modificacion }]}>MODIFICACIÓN</Text>
          </View>
          {rows.map((r, i) => (
            <View key={i} style={styles.tr}>
              <Text style={[styles.td, { width: colWidths.numero }]}>{r.numero || ''}</Text>
              <Text style={[styles.td, { width: colWidths.titulo }]}>{r.titulo || ''}</Text>
              <Text style={[styles.td, { width: colWidths.ingreso }]}>{r.ingreso || ''}</Text>
              <Text style={[styles.td, { width: colWidths.proceso }]}>{r.proceso || ''}</Text>
              <Text style={[styles.td, { width: colWidths.estatus }]}>{r.estatus || ''}</Text>
              <Text style={[styles.td, { width: colWidths.etapa }]}>{r.etapa || ''}</Text>
              <Text style={[styles.td, { width: colWidths.modificacion }]}>{r.modificacion || ''}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
