import React from 'react';
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

export interface ReporteListadoRow {
  numero: string;
  titulo: string;
  ingreso: string;
  proceso: string;
  estatus: string;
  etapa: string;
  modificacion: string;
}

export interface ReporteListadoDetalleMovimiento {
  id: number;
  fecha?: string;
  etapa?: string;
  subEtapa?: string | null;
  estatus?: string;
  asesorNuevo?: string;
  nombreArchivo?: string | null;
}

export interface ReporteListadoDetalleExpediente {
  id: number;
  codigo: string;
  nombre: string;
  asunto?: string;
  estatus?: string;
  fechaIngreso?: string;
  fechaActualizacion?: string;
  etapa?: string;
  subEtapa?: string | null;
  asesor?: string;
  detalles?: ReporteListadoDetalleMovimiento[];
}

export interface ReporteListadoDetalleRelacionado {
  expediente: ReporteListadoDetalleExpediente;
  detalles?: ReporteListadoDetalleMovimiento[];
}

export interface ReporteListadoDetalleData {
  expediente: ReporteListadoDetalleExpediente;
  relacionados?: ReporteListadoDetalleRelacionado[];
}

export interface ReporteListadoPDFProps {
  titulo?: string;
  rows?: ReporteListadoRow[];
  count?: number;
  logoSrc?: string;
  detalleData?: ReporteListadoDetalleData;
}

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    color: '#111',
    fontFamily: 'Helvetica',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
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
  section: {
    marginTop: 16,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1E2851',
    textTransform: 'uppercase',
  },
  badge: {
    backgroundColor: '#CDEB73',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontWeight: 700,
    color: '#1E2851',
    alignSelf: 'flex-start',
    borderRadius: 2,
    marginTop: 4,
  },
  expedienteNombre: {
    fontSize: 13,
    fontWeight: 700,
    color: '#1E2851',
    marginTop: 6,
  },
  infoRows: {
    marginTop: 6,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  infoLabel: {
    color: '#2F68FF',
    fontWeight: 700,
    marginRight: 6,
  },
  infoValue: {
    color: '#1E2851',
    marginRight: 40,
  },
  emptyMessage: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#4A4A4A',
  },
  detailsTable: {
    borderWidth: 1,
    borderColor: '#7e8a9a',
    marginTop: 10,
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

const detailColWidths = {
  fecha: '18%',
  etapa: '22%',
  subEtapa: '22%',
  asesor: '18%',
  estatus: '20%',
};

const formatDateTime = (value?: string) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDate = (value?: string) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-ES');
};

const buildSectionsFromDetalle = (
  detalleData?: ReporteListadoDetalleData,
): Array<{
  heading: string;
  codigo: string;
  nombre: string;
  asunto?: string;
  fechaIngreso?: string;
  estatus?: string;
  etapa?: string;
  subEtapa?: string | null;
  asesor?: string;
  detalles: ReporteListadoDetalleMovimiento[];
}> => {
  if (!detalleData?.expediente) return [];
  const sections: Array<{
    heading: string;
    codigo: string;
    nombre: string;
    asunto?: string;
    fechaIngreso?: string;
    estatus?: string;
    etapa?: string;
    subEtapa?: string | null;
    asesor?: string;
    detalles: ReporteListadoDetalleMovimiento[];
  }> = [];
  const principal = detalleData.expediente;
  sections.push({
    heading: 'Expediente principal',
    codigo: principal.codigo,
    nombre: principal.nombre,
    asunto: principal.asunto,
    fechaIngreso: principal.fechaIngreso,
    estatus: principal.estatus,
    etapa: principal.etapa,
    subEtapa: principal.subEtapa,
    asesor: principal.asesor,
    detalles: principal.detalles ?? [],
  });
  for (const relacionado of detalleData.relacionados ?? []) {
    const info = relacionado.expediente;
    sections.push({
      heading:
        info?.codigo && info.codigo.trim().length > 0
          ? `Relacionado: ${info.codigo}`
          : 'Relacionado',
      codigo: info?.codigo ?? 'N/D',
      nombre: info?.nombre ?? '',
      asunto: info?.asunto,
      fechaIngreso: info?.fechaIngreso,
      estatus: info?.estatus,
      etapa: info?.etapa,
      subEtapa: info?.subEtapa,
      asesor: info?.asesor,
      detalles: relacionado.detalles ?? [],
    });
  }
  return sections;
};

export default function ReporteListadoPDF({
  titulo = 'Listado de Expedientes',
  rows = [],
  count,
  logoSrc = '/logos/marn_azul.png',
  detalleData,
}: ReporteListadoPDFProps) {
  const sections = buildSectionsFromDetalle(detalleData);
  const renderDetalle = sections.length > 0;
  return (
    <Document>
      <Page
        size="A4"
        orientation={renderDetalle ? 'portrait' : 'landscape'}
        style={styles.page}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.header}>{titulo}</Text>
            {renderDetalle && detalleData?.expediente?.codigo ? (
              <Text style={styles.subHeader}>
                Expediente base: {detalleData.expediente.codigo}
              </Text>
            ) : typeof count === 'number' ? (
              <Text style={styles.subHeader}>Total de registros: {count}</Text>
            ) : null}
          </View>
          {logoSrc ? <Image style={styles.logo} src={logoSrc} /> : null}
        </View>
        {renderDetalle ? (
          <>
            {sections.map((section, index) => (
              <View key={`${section.codigo}_${index}`} style={styles.section}>
                <Text style={styles.sectionHeading}>{section.heading}</Text>
                <Text style={styles.badge}>{section.codigo}</Text>
                <Text style={styles.expedienteNombre}>{section.nombre}</Text>
                <View style={styles.infoRows}>
                  {section.asunto ? (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Asunto:</Text>
                      <Text style={styles.infoValue}>{section.asunto}</Text>
                    </View>
                  ) : null}
                  {section.fechaIngreso ? (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Fecha de ingreso:</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(section.fechaIngreso)}
                      </Text>
                    </View>
                  ) : null}
                  {section.estatus ? (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Estatus:</Text>
                      <Text style={styles.infoValue}>{section.estatus}</Text>
                    </View>
                  ) : null}
                  {section.etapa ? (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Etapa:</Text>
                      <Text style={styles.infoValue}>{section.etapa}</Text>
                    </View>
                  ) : null}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Sub-etapa:</Text>
                    <Text style={styles.infoValue}>
                      {section.subEtapa && section.subEtapa.trim().length > 0
                        ? section.subEtapa
                        : '[SIN SUB-ETAPA]'}
                    </Text>
                  </View>
                  {section.asesor ? (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Asesor:</Text>
                      <Text style={styles.infoValue}>{section.asesor}</Text>
                    </View>
                  ) : null}
                </View>
                {section.detalles.length > 0 ? (
                  <View style={styles.detailsTable}>
                    <View style={styles.tr}>
                      <Text
                        style={[styles.th, { width: detailColWidths.fecha }]}
                      >
                        FECHA
                      </Text>
                      <Text
                        style={[styles.th, { width: detailColWidths.etapa }]}
                      >
                        ETAPA
                      </Text>
                      <Text
                        style={[styles.th, { width: detailColWidths.subEtapa }]}
                      >
                        SUB-ETAPA
                      </Text>
                      <Text
                        style={[styles.th, { width: detailColWidths.asesor }]}
                      >
                        USUARIO
                      </Text>
                      <Text
                        style={[styles.th, { width: detailColWidths.estatus }]}
                      >
                        ESTATUS
                      </Text>
                    </View>
                    {section.detalles.map((detalle) => (
                      <View key={detalle.id} style={styles.tr}>
                        <Text
                          style={[styles.td, { width: detailColWidths.fecha }]}
                        >
                          {formatDateTime(detalle.fecha)}
                        </Text>
                        <Text
                          style={[styles.td, { width: detailColWidths.etapa }]}
                        >
                          {detalle.etapa ?? ''}
                        </Text>
                        <Text
                          style={[
                            styles.td,
                            { width: detailColWidths.subEtapa },
                          ]}
                        >
                          {detalle.subEtapa &&
                          detalle.subEtapa.trim().length > 0
                            ? detalle.subEtapa
                            : '[SIN SUB-ETAPA]'}
                        </Text>
                        <Text
                          style={[styles.td, { width: detailColWidths.asesor }]}
                        >
                          {detalle.asesorNuevo ?? ''}
                        </Text>
                        <Text
                          style={[
                            styles.td,
                            { width: detailColWidths.estatus },
                          ]}
                        >
                          {detalle.estatus ?? ''}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyMessage}>
                    Sin movimientos registrados.
                  </Text>
                )}
              </View>
            ))}
          </>
        ) : (
          <View style={styles.table}>
            <View style={styles.tr}>
              <Text style={[styles.th, { width: colWidths.numero }]}>
                NÚMERO
              </Text>
              <Text style={[styles.th, { width: colWidths.titulo }]}>
                TÍTULO
              </Text>
              <Text style={[styles.th, { width: colWidths.ingreso }]}>
                INGRESO
              </Text>
              <Text style={[styles.th, { width: colWidths.proceso }]}>
                PROCESO
              </Text>
              <Text style={[styles.th, { width: colWidths.estatus }]}>
                ESTATUS
              </Text>
              <Text style={[styles.th, { width: colWidths.etapa }]}>ETAPA</Text>
              <Text style={[styles.th, { width: colWidths.modificacion }]}>
                MODIFICACIÓN
              </Text>
            </View>
            {rows.map((r, i) => (
              <View key={i} style={styles.tr}>
                <Text style={[styles.td, { width: colWidths.numero }]}>
                  {r.numero || ''}
                </Text>
                <Text style={[styles.td, { width: colWidths.titulo }]}>
                  {r.titulo || ''}
                </Text>
                <Text style={[styles.td, { width: colWidths.ingreso }]}>
                  {r.ingreso || ''}
                </Text>
                <Text style={[styles.td, { width: colWidths.proceso }]}>
                  {r.proceso || ''}
                </Text>
                <Text style={[styles.td, { width: colWidths.estatus }]}>
                  {r.estatus || ''}
                </Text>
                <Text style={[styles.td, { width: colWidths.etapa }]}>
                  {r.etapa || ''}
                </Text>
                <Text style={[styles.td, { width: colWidths.modificacion }]}>
                  {r.modificacion || ''}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
