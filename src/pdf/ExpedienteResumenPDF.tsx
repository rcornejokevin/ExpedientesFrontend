import React from 'react';
import { Document, Page, StyleSheet, Text, View, Image } from '@react-pdf/renderer';

interface DetalleRow {
  etapa: string;
  subEtapa: string;
  fechaEtapa: string;
  cargaImagen: boolean;
  estatus: string;
}

interface ExpedienteResumenPDFProps {
  expediente: {
    codigo: string;
    nombre: string;
    fechaIngreso: string;
    flujo: string;
    estatus: string;
    asesor: string;
  };
  detalles: DetalleRow[];
  logoSrc?: string;
}

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10, color: '#111', fontFamily: 'Helvetica' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 16, fontWeight: 700, color: '#192854' },
  logo: { height: 36 },
  badge: { backgroundColor: '#CDEB73', paddingHorizontal: 8, paddingVertical: 4, fontWeight: 700, color: '#1E2851', alignSelf: 'flex-start', borderRadius: 2 },
  label: { color: '#2F68FF', fontWeight: 700 },
  value: { color: '#1E2851' },
  row: { flexDirection: 'row', gap: 12, marginTop: 4 },
  table: { borderWidth: 1, borderColor: '#7e8a9a', marginTop: 16 },
  tr: { flexDirection: 'row' },
  th: { borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#7e8a9a', backgroundColor: '#2DA6DC', padding: 6, fontWeight: 700, color: '#FFFFFF' },
  td: { borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#7e8a9a', padding: 6 },
});

export default function ExpedienteResumenPDF({ expediente, detalles, logoSrc = '/logos/marn_azul.png' }: ExpedienteResumenPDFProps) {
  const fechaIngreso = expediente.fechaIngreso ? new Date(expediente.fechaIngreso).toLocaleDateString('es-ES') : '';
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Resumen de Expediente</Text>
          {logoSrc ? <Image style={styles.logo} src={logoSrc} /> : null}
        </View>
        <Text style={styles.badge}>{expediente.codigo}</Text>
        <Text style={{ fontSize: 14, fontWeight: 700, color: '#1E2851', marginTop: 6 }}>{expediente.nombre}</Text>
        <View style={{ marginTop: 8 }}>
          <View style={styles.row}>
            <Text style={styles.label}>FECHA DE INGRESO:</Text>
            <Text style={styles.value}>{fechaIngreso}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>TIPO DE PROCESO:</Text>
            <Text style={styles.value}>{expediente.flujo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ESTATUS ACTUAL:</Text>
            <Text style={styles.value}>{expediente.estatus}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ASESOR ASIGNADO:</Text>
            <Text style={styles.value}>{expediente.asesor}</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tr}>
            <Text style={[styles.th, { width: '22%' }]}>ETAPA</Text>
            <Text style={[styles.th, { width: '22%' }]}>SUB-ETAPA</Text>
            <Text style={[styles.th, { width: '18%' }]}>FECHA DE ETAPA</Text>
            <Text style={[styles.th, { width: '18%' }]}>CARGA DE IMAGEN</Text>
            <Text style={[styles.th, { width: '20%' }]}>ESTATUS</Text>
          </View>
          {detalles.map((d, i) => (
            <View key={i} style={styles.tr}>
              <Text style={[styles.td, { width: '22%' }]}>{d.etapa || ''}</Text>
              <Text style={[styles.td, { width: '22%' }]}>{d.subEtapa || '[SIN SUB-ETAPA]'}</Text>
              <Text style={[styles.td, { width: '18%' }]}>{d.fechaEtapa ? new Date(d.fechaEtapa).toLocaleDateString('es-ES') : ''}</Text>
              <Text style={[styles.td, { width: '18%' }]}>{d.cargaImagen ? 'SI' : ''}</Text>
              <Text style={[styles.td, { width: '20%' }]}>{d.estatus || ''}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

