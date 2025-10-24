import React from 'react';
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

export interface CaratulaProps {
  codigo: string;
  nombreExpediente: string;
  fechaIngreso: string;
  tipoProceso: string;
  identificadorExpediente?: string;
  numeroExpedienteUAI?: string;
  asunto?: string;
  remitente?: string;
  asesorAsignado?: string;
  destinatario?: string;
  tramite?: string;
  logoSrc?: string;
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

let openSansRegistered = false;
let openSansAvailable = false;

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
};

const ensureOpenSansSemiCondensed = () => {
  if (openSansRegistered) return;
  openSansRegistered = true;
  if (typeof fetch !== 'function') {
    return;
  }
  const load = async () => {
    try {
      const loadFont = async (path: string) => {
        const res = await fetch(path);
        if (!res.ok) {
          throw new Error(`Respuesta inválida para ${path}`);
        }
        const buffer = await res.arrayBuffer();
        if (buffer.byteLength === 0) {
          throw new Error(`Archivo vacío: ${path}`);
        }
        const base64 = arrayBufferToBase64(buffer);
        return `data:font/ttf;base64,${base64}`;
      };

      const regular = await loadFont(
        '/fonts/OpenSans-SemiCondensed-Regular.ttf',
      );
      let bold: string | undefined;
      try {
        bold = await loadFont('/fonts/OpenSans-SemiCondensed-Bold.ttf');
      } catch (error) {
        console.warn(
          'No se encontró la versión bold de OpenSans Semi Condensed. Se utilizará solo la regular.',
          error,
        );
      }

      const fonts: Array<{ src: string; fontWeight: 'normal' | 'bold' }> = [
        { src: regular, fontWeight: 'normal' },
      ];
      if (bold) {
        fonts.push({ src: bold, fontWeight: 'bold' });
      }
      Font.register({
        family: 'OpenSansSemiCondensed',
        fonts,
      });
      openSansAvailable = true;
    } catch (error) {
      console.warn(
        'No se pudo cargar la fuente OpenSans Semi Condensed desde /fonts. Asegúrate de copiar los archivos TTF válidos a public/fonts.',
        error,
      );
      openSansAvailable = false;
    }
  };
  void load();
};
ensureOpenSansSemiCondensed();

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 11,
    color: '#191F2E',
    fontFamily: openSansAvailable ? 'OpenSansSemiCondensed' : 'Helvetica',
    lineHeight: 1.35,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logo: { width: 180, height: 80, objectFit: 'contain' },
  identificadorBlock: {
    backgroundColor: '#D9D9D9',
    minWidth: 140,
    marginTop: 20,
    paddingVertical: 3,
  },
  identificadorLabel: {
    color: '#1E2851',
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginTop: 30,
  },
  identificadorValue: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 700,
  },
  institutionBlock: { marginTop: 12 },
  institutionLine: { color: '#1E2851', fontSize: 12, fontWeight: 700 },
  titleBlock: { alignItems: 'center', marginTop: 5, marginBottom: 18 },
  titleMain: { color: '#1E2851', fontSize: 14, fontWeight: 700 },
  titleSub: { color: '#1E2851', fontSize: 12, fontWeight: 700, marginTop: 4 },
  label: {
    color: '#1E2851',
    fontWeight: 700,
    fontSize: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  labelSimple: {
    color: '#1E2851',
    fontWeight: 700,
    fontSize: 10,
    marginBottom: 4,
  },
  valueBox: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 3,
    paddingHorizontal: 3,
    borderRadius: 3,
    fontWeight: 700,
    color: '#000000',
  },
  textValue: {
    color: '#000000',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 12,
  },
  col: {
    flex: 1,
  },
  paragraphBox: {
    backgroundColor: '#D9D9D9',
    padding: 3,
    minHeight: 40,
  },
  paragraphText: {
    fontSize: 11,
    color: '#000000',
  },
  instructionsLabel: {
    color: '#1E2851',
    fontWeight: 700,
    marginTop: 14,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  instructionsValue: {
    color: '#000000',
    fontSize: 11,
    lineHeight: 1.5,
  },
  signatureLabel: {
    color: '#1E2851',
    fontWeight: 700,
    marginTop: 14,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  signatureBox: {
    borderColor: '#1E2851',
    borderWidth: 1.2,
    minHeight: 90,
    marginTop: 10,
  },
});

export default function CaratulaPDF({
  codigo,
  nombreExpediente,
  fechaIngreso,
  tipoProceso,
  identificadorExpediente,
  numeroExpedienteUAI,
  asunto,
  remitente,
  asesorAsignado,
  destinatario = 'Coordinador (a) de la Unidad de Asesoría Jurídica',
  tramite = 'Analizar, diligenciar y elaborar lo que corresponda a efecto de atender oportunamente el presente asunto de conformidad con la normativa y legislación aplicable.',
  logoSrc = '/logos/marn_azul.png',
}: CaratulaProps) {
  const fecha = formatFechaLarga(fechaIngreso);
  const identificador = identificadorExpediente ?? codigo;
  const uai = numeroExpedienteUAI ?? codigo;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          {logoSrc ? <Image style={styles.logo} src={logoSrc} /> : null}
          <Text style={styles.identificadorLabel}>
            IDENTIFICADOR DEL EXPEDIENTE:
          </Text>
          <View style={styles.identificadorBlock}>
            <Text
              style={[
                styles.identificadorValue,
                { alignContent: 'center', textAlign: 'center', width: 140 },
              ]}
            >
              {identificador}
            </Text>
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text style={[styles.titleMain, { marginTop: -20 }]}>
            UNIDAD DE ASESORÍA JURÍDICA
          </Text>
          <Text style={[styles.titleMain, { marginTop: 10 }]}>
            SISTEMA DE EXPEDIENTES JURÍDICOS -SIDEJU-
          </Text>
        </View>

        <View
          style={{
            marginLeft: 40,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <Text style={styles.label}>Identificador del expediente:</Text>
          <Text
            style={[
              styles.valueBox,
              {
                alignContent: 'center',
                width: 140,
                marginLeft: 15,
                textAlign: 'center',
              },
            ]}
          >
            {identificador}
          </Text>
        </View>

        <Text style={[styles.labelSimple, { marginTop: 20, marginLeft: 15 }]}>
          Número de expediente UAJ:
        </Text>

        <View style={[styles.row, { marginLeft: 20 }]}>
          <View style={styles.col}>
            <Text style={styles.label}>Fecha de ingreso</Text>
            <Text style={styles.valueBox}>{fecha}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Tipo de proceso</Text>
            <Text style={styles.valueBox}>
              {tipoProceso?.toUpperCase?.() ?? ''}
            </Text>
          </View>
        </View>

        <Text style={[styles.label, { marginTop: 15 }]}>
          Asunto del expediente
        </Text>
        <View style={styles.paragraphBox}>
          <Text style={styles.paragraphText}>
            {asunto?.toUpperCase?.() ?? ' '}
          </Text>
        </View>

        <View style={[styles.row, { marginTop: 30 }]}>
          <View style={styles.col}>
            <Text style={styles.label}>Remitente:</Text>
            <Text style={styles.textValue}>
              {remitente?.toUpperCase?.() ?? ''}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Asesor asignado:</Text>
            <Text style={styles.textValue}>
              {asesorAsignado?.toUpperCase?.() ?? ''}
            </Text>
          </View>
        </View>

        <Text style={[styles.instructionsLabel, { marginTop: 30 }]}>De:</Text>
        <Text style={styles.instructionsValue}>{destinatario}</Text>

        <Text style={styles.instructionsLabel}>Trámite:</Text>
        <Text style={styles.instructionsValue}>{tramite}</Text>

        <Text style={styles.signatureLabel}>Firma del asesor asignado:</Text>
        <View style={[styles.signatureBox, { marginTop: 30 }]} />
      </Page>
    </Document>
  );
}
