import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

// Registra os elementos necessários para o gráfico de pizza
ChartJS.register(ArcElement, Tooltip, Legend);

function AdminPanel() {
  const { usuario, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados para controle de dados e interface
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenarPor, setOrdenarPor] = useState('nome');
  const [ordemAsc, setOrdemAsc] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({ nome: '', tipo: '' });

  // Redireciona usuários não-admin e carrega usuários ao montar o componente
  useEffect(() => {
    if (usuario?.tipo !== 'admin') {
      navigate('/dashboard');
    } else {
      carregarUsuarios();
    }
  }, [usuario, token, navigate]);

  // Busca todos os usuários do backend
  const carregarUsuarios = () => {
    axios.get('http://localhost:3001/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsuarios(res.data))
    .catch(err => console.error('Erro ao buscar usuários:', err));
  };

  // Exclui um usuário após confirmação
  const handleExcluir = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      axios.delete(`http://localhost:3001/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => carregarUsuarios())
      .catch(err => console.error('Erro ao excluir usuário:', err));
    }
  };

  // Inicia modo de edição para um usuário
  const iniciarEdicao = (usuario) => {
    setEditandoId(usuario.id);
    setEditData({ nome: usuario.nome, tipo: usuario.tipo });
  };

  // Salva os dados editados de um usuário
  const salvarEdicao = (id) => {
    axios.put(`http://localhost:3001/usuarios/${id}`, editData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setEditandoId(null);
      carregarUsuarios();
    })
    .catch(err => console.error('Erro ao editar usuário:', err));
  };

  // Exporta os dados filtrados para CSV
  const exportarCSV = () => {
    const csv = Papa.unparse(usuariosFiltrados);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'usuarios.csv');
  };

  // Aplica filtro e ordenação nos usuários
  const usuariosFiltrados = usuarios
    .filter(u =>
      u.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      u.email.toLowerCase().includes(filtro.toLowerCase())
    )
    .sort((a, b) => {
      const campoA = a[ordenarPor].toLowerCase();
      const campoB = b[ordenarPor].toLowerCase();
      if (campoA < campoB) return ordemAsc ? -1 : 1;
      if (campoA > campoB) return ordemAsc ? 1 : -1;
      return 0;
    });

  // Paginação: 5 usuários por página
  const totalPaginas = Math.ceil(usuariosFiltrados.length / 5);
  const usuariosPaginados = usuariosFiltrados.slice((paginaAtual - 1) * 5, paginaAtual * 5);

  // Dados para o gráfico de pizza
  const total = usuarios.length;
  const admins = usuarios.filter(u => u.tipo === 'admin').length;
  const comuns = total - admins;

  const data = {
    labels: ['Admin', 'Comum'],
    datasets: [
      {
        data: [admins, comuns],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>Painel Administrativo</h2>
      <p>Bem-vindo, {usuario?.email}</p>

      {/* Total de usuários */}
      <div style={{ margin: '20px 0', padding: '10px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Total de Usuários: {total}</h3>
      </div>

      {/* Gráfico de pizza */}
      <div style={{ width: '300px', margin: '0 auto' }}>
        <Pie data={data} />
      </div>

      {/* Filtro e exportação */}
      <div style={{ marginTop: '30px' }}>
        <input
          type="text"
          placeholder="Filtrar por nome ou email"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{ padding: '8px', width: '300px', marginBottom: '10px' }}
        />
        <button onClick={exportarCSV} style={{ marginLeft: '10px', padding: '8px 12px' }}>
          Exportar CSV
        </button>
      </div>

      {/* Tabela de usuários */}
      <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '90%' }}>
        <thead>
          <tr style={{ background: '#ddd' }}>
            {['nome', 'email', 'tipo'].map(coluna => (
              <th
                key={coluna}
                style={{ padding: '8px', cursor: 'pointer' }}
                onClick={() => {
                  setOrdenarPor(coluna);
                  setOrdemAsc(ordenarPor === coluna ? !ordemAsc : true);
                }}
              >
                {coluna.charAt(0).toUpperCase() + coluna.slice(1)}
              </th>
            ))}
            <th style={{ padding: '8px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuariosPaginados.map(u => (
            <tr key={u.id}>
              <td style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>
                {editandoId === u.id ? (
                  <input
                    value={editData.nome}
                    onChange={e => setEditData({ ...editData, nome: e.target.value })}
                  />
                ) : (
                  u.nome
                )}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>{u.email}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>
                {editandoId === u.id ? (
                  <select
                    value={editData.tipo}
                    onChange={e => setEditData({ ...editData, tipo: e.target.value })}
                  >
                    <option value="admin">admin</option>
                    <option value="comum">comum</option>
                  </select>
                ) : (
                  u.tipo
                )}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>
                {editandoId === u.id ? (
                  <button onClick={() => salvarEdicao(u.id)}>Salvar</button>
                ) : (
                  <>
                    <button onClick={() => iniciarEdicao(u)} style={{ marginRight: '8px' }}>Editar</button>
                    <button onClick={() => handleExcluir(u.id)}>Excluir</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))}
          disabled={paginaAtual === 1}
          style={{ marginRight: '10px' }}
        >
          Anterior
        </button>
        <span>Página {paginaAtual} de {totalPaginas}</span>
        <button
          onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas))}
          disabled={paginaAtual === totalPaginas}
          style={{ marginLeft: '10px' }}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
