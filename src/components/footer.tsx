import { Container } from '@/components/common/container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" style={{ backgroundColor: '#192854' }}>
      <Container width="fluid" className="!mx-0 !px-0">
        <div className="flex w-full flex-col gap-3 px-4 py-5 text-sm font-normal text-muted-foreground md:flex-row md:items-center md:justify-between lg:px-6">
          <div className="text-center md:text-left">
            Sistema de Expedientes Jurídicos - Version 1.0
          </div>
          <div className="text-center md:text-right">
            Unidad de Asesoría Jurídica, Ministerio de Ambiente y Recursos
            Naturales - {currentYear}
          </div>
        </div>
      </Container>
    </footer>
  );
}
