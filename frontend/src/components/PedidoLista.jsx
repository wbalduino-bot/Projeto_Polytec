import React, { useEffect, useState } from 'react';

const PedidoLista = () => {
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setErro('Você precisa estar logado para visualizar os pedidos.');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/pedidos', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.erro || 'Erro ao buscar pedidos');

        setPedidos(data);
      } catch (err) {
        setErro(err.message);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Pedidos</h2>

      {erro && <p className="text-red-600 text-center mb-4">{erro}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">ID</th>
              <th className="text-left px-4 py-2 border-b">Cliente</th>
              <th className="text-left px-4 py-2 border-b">Produto</th>
              <th className="text-left px-4 py-2 border-b">Qtd</th>
              <th className="text-left px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              pedidos.map((pedido) => (
                <tr key={pedido._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{pedido._id}</td>
                  <td className="px-4 py-2 border-b">{pedido.cliente}</td>
                  <td className="px-4 py-2 border-b">{pedido.produto}</td>
                  <td className="px-4 py-2 border-b">{pedido.quantidade}</td>
                  <td className={`px-4 py-2 border-b font-semibold ${
                    pedido.status === 'Finalizado' ? 'text-green-600' :
                    pedido.status === 'Cancelado' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {pedido.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PedidoLista;