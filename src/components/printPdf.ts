import { pdf } from '@react-pdf/renderer';

// Genera un Blob de un <Document /> y abre el diálogo de impresión en un iframe oculto
export async function printReactPdf(doc: React.ReactElement) {
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    // Limpia el iframe y el blob después de un breve tiempo
    setTimeout(() => {
      document.body.removeChild(iframe);
      URL.revokeObjectURL(url);
    }, 1000000);
  };

  iframe.src = url;
}

