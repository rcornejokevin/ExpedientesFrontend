import React from 'react';

const handlePrint = () => {
  // 1) Tu HTML específico para imprimir
  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Documento a imprimir</title>
  <style>
    @page { size: A4; margin: 12mm; } /* tamaño y márgenes */
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #111; }
    h1 { margin: 0 0 8px; font-size: 20px; }
    .doc {
      width: 100%;
    }
    .header { display: flex; justify-content: space-between; margin-bottom: 12px; }
    .meta { font-size: 12px; color: #555; }
    .section-title { margin: 16px 0 8px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
    .total { text-align: right; font-weight: bold; }
    /* Estilos solo para impresión */
    @media print {
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="doc">
    <div class="header">
      <div>
        <h1>Factura #INV-0001</h1>
        <div class="meta">Fecha: 04/09/2025</div>
      </div>
      <div class="meta">
        <div>Que Pelado Guate</div>
        <div>NIT 123456-7</div>
      </div>
    </div>

    <div class="section-title">Cliente</div>
    <div>Nombre: Kenny Cornejo</div>
    <div>Correo: kenny@example.com</div>

    <div class="section-title">Detalle</div>
    <table>
      <thead>
        <tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr>
      </thead>
      <tbody>
        <tr><td>Bolsa artesanal</td><td>2</td><td>Q150.00</td><td>Q300.00</td></tr>
        <tr><td>Kimono teñido</td><td>1</td><td>Q420.00</td><td>Q420.00</td></tr>
      </tbody>
      <tfoot>
        <tr><td colspan="3" class="total">Total</td><td>Q720.00</td></tr>
      </tfoot>
    </table>
  </div>
  <script>
    // Espera a que el documento esté listo, imprime y cierra
    window.onload = function() {
      window.print();
      window.onafterprint = function() { window.close(); };
    };
  </script>
</body>
</html>
    `.trim();

  // 2) Abrir una ventana/iframe temporal con el HTML y lanzar print()
  const printWindow = window.open(
    '',
    '',
    'noopener,noreferrer,width=800,height=900',
  );
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.body.innerHTML = html;
  printWindow.document.close();
};

export default handlePrint;
