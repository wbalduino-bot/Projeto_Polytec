import React from 'react';

// Componente responsável por exportar os dados filtrados em formato CSV
const BotaoExportarCSV = ({ dados }) => {
  // Função que gera e baixa o arquivo CSV
  const exportarCSV = () => {
    // Define o cabeçalho e mapeia os dados para linhas
    const csv = [
      ['Data', 'Cliente', 'Tipo', 'Descrição', 'Valor'], // Cabeçalho
      ...dados.map(item => [
        item.data,
        item.cliente,
        item.tipo,
        item.descricao,
        item.valor // Valor bruto, pode formatar como `R$ ${item.valor.toFixed(2)}`
      ])
    ]
      .map(row => row.join(';')) // Junta os campos com ponto e vírgula
      .join('\n'); // Junta as linhas com quebra de linha

    // Cria um blob com o conteúdo CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Gera uma URL temporária para download
    const url = URL.createObjectURL(blob);

    // Cria um link e simula o clique para baixar o arquivo
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorio.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Botão visível no dashboard
  return (
    <div className="mt-4 text-right">
      <button onClick={exportarCSV} className="btn bg-green-600 hover:bg-green-700 text-white">
        Exportar CSV
      </button>
    </div>
  );
};

export default BotaoExportarCSV;
