import { Container } from '@/components/common/container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" style={{ backgroundColor: '#192854' }}>
      <Container>
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 py-5">
          <div className="flex order-2 md:order-1  gap-2 font-normal text-sm text-muted-foreground">
            Sistema de Expedientes Jurídicos - Version 1.0
          </div>
          <div className="flex order-1 md:order-2 gap-4 font-normal text-sm text-muted-foreground">
            Unidad de Asesoría Jurídica, Ministerio de Ambiente y Recursos
            Naturales - {currentYear}
          </div>
        </div>
      </Container>
    </footer>
  );
}
