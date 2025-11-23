// ==========================
// 📄 Botão Exportar PDF
// ==========================
import React from 'react';
import { jsPDF } from 'jspdf';

const BotaoExportarPDF = ({ conteudo }) => {
  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.text(conteudo || 'Exportação de teste', 10, 10);
    doc.save('documento.pdf');
  };

  return (
    <button onClick={gerarPDF}>
      Exportar PDF
    </button>
  );
};

export default BotaoExportarPDF;
