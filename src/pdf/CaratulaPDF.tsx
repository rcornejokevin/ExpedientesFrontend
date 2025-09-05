import React from 'react';
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

export interface CaratulaProps {
  codigo: string;
  nombreExpediente: string;
  fechaIngreso: string; // ISO string
  tipoProceso: string;
  logoSrc?: string; // opcional
}

function formatFechaLarga(fechaIso?: string) {
  if (!fechaIso) return '';
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return '';
  const s = d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return s.replace(/\bde\b/g, 'DE').toUpperCase();
}

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, color: '#111', fontFamily: 'Helvetica' },
  brand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  brandLeft: {
    fontSize: 11,
    color: '#192854',
    fontWeight: 700,
    lineHeight: 1.4,
  },
  logo: { height: 50 },
  label: { color: '#192854', fontWeight: 700, marginTop: 6, marginBottom: 4 },
  inlineRow: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    backgroundColor: '#E1E4E7',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 2,
    fontWeight: 800,
  },
  block: {
    backgroundColor: '#E1E4E7',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 2,
    fontWeight: 800,
  },
  big: { fontSize: 16, fontWeight: 800 },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  col: { flex: 1 },
  table: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#7e8a9a',
    borderStyle: 'solid',
  },
  tr: { flexDirection: 'row' },
  th: {
    flexDirection: 'row',
    borderRightWidth: 1,
    borderColor: '#7e8a9a',
    backgroundColor: '#E1E4E7',
    padding: 6,
    fontWeight: 700,
    color: '#192854',
  },
  td: {
    borderRightWidth: 1,
    borderColor: '#7e8a9a',
    padding: 6,
    minHeight: 24,
  },
  lastCell: { borderRightWidth: 0 },
});

export default function CaratulaPDF({
  codigo,
  nombreExpediente,
  fechaIngreso,
  tipoProceso,
  logoSrc = '/logos/marn_azul.png',
}: CaratulaProps) {
  const fecha = formatFechaLarga(fechaIngreso);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.brand}>
          <View style={styles.brandLeft}>
            <Text>UNIDAD DE ASESORÍA JURÍDICA</Text>
            <Text>SISTEMA DE EXPEDIENTES JURÍDICOS -SIDEJU-</Text>
          </View>
          {logoSrc ? <Image style={styles.logo} src={logoSrc} /> : null}
        </View>

        <View style={styles.inlineRow}>
          <Text style={[styles.label, { marginBottom: 0, marginRight: 8 }]}> 
            IDENTIFICADOR DEL EXPEDIENTE:
          </Text>
          <Text style={[styles.badge, { alignSelf: 'center' }]}>{codigo}</Text>
        </View>

        <Text style={[styles.label, { marginTop: 12 }]}>
          NOMBRE DEL EXPEDIENTE:
        </Text>
        <Text style={[styles.block, styles.big]}>{nombreExpediente}</Text>

        <View style={[styles.row, { marginTop: 10 }]}>
          <View style={styles.col}>
            <Text style={styles.label}>FECHA DE INGRESO:</Text>
            <Text style={[styles.block, styles.big]}>{fecha}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>TIPO DE PROCESO:</Text>
            <Text style={[styles.block, styles.big]}>{tipoProceso}</Text>
          </View>
        </View>

        {/* Tabla vacía */}
        <View style={styles.table}>
          <View style={styles.tr}>
            <View style={[styles.th, { width: '18%' }]}>
              <Text>FECHA</Text>
            </View>
            <View style={[styles.th, { flex: 1 }]}>
              <Text>DESCRIPCIÓN DE MOVIMIENTO</Text>
            </View>
            <View style={[styles.th, { width: '20%' }]}>
              <Text>RESPONSABLE</Text>
            </View>
            <View style={[styles.th, styles.lastCell, { width: '18%' }]}>
              <Text>FIRMA Y SELLO</Text>
            </View>
          </View>
          {Array.from({ length: 12 }).map((_, i) => (
            <View
              key={i}
              style={[styles.tr, { borderTopWidth: 1, borderColor: '#7e8a9a' }]}
            >
              <View style={[styles.td, { width: '18%' }]}>
                <Text> </Text>
              </View>
              <View style={[styles.td, { flex: 1 }]}>
                <Text> </Text>
              </View>
              <View style={[styles.td, { width: '20%' }]}>
                <Text> </Text>
              </View>
              <View style={[styles.td, styles.lastCell, { width: '18%' }]}>
                <Text> </Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
