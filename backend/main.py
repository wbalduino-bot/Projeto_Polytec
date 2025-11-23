# main.py — API do serviço de Machine Learning "Oráculo"
# Este servidor FastAPI expõe endpoints para:
#   - Consultar informações do modelo treinado (/modelo-info)
#   - Listar histórico de treinamentos (/historico-treinamentos)
#   - Gerar previsões de vendas (/prever)

from fastapi import FastAPI, HTTPException
import joblib
import json
import os
import numpy as np

# 📌 Inicializa a aplicação FastAPI com metadados
app = FastAPI(
    title="Oráculo ML",
    description="Serviço de Machine Learning para previsões comerciais",
    version="1.0.0"
)

# 📍 Caminhos dos arquivos do modelo e metadados
CAMINHO_MODELO = "modelos/modelo_previsao.pkl"
CAMINHO_INFO = "modelos/modelo_info.json"
CAMINHO_HISTORICO = "modelos/historico_treinamentos.json"

# 🔄 Carrega o modelo treinado na inicialização do servidor
# Se o arquivo não existir, mantém "modelo = None" para evitar erros
modelo = joblib.load(CAMINHO_MODELO) if os.path.exists(CAMINHO_MODELO) else None

# 🟢 Endpoint: informações do modelo atual
@app.get("/modelo-info")
def modelo_info():
    """
    Retorna os metadados do modelo treinado (nome, algoritmo, data, registros, versão).
    Os dados são lidos do arquivo modelo_info.json gerado pelo atualizar_modelo.py.
    """
    if not os.path.exists(CAMINHO_INFO):
        raise HTTPException(status_code=404, detail="Arquivo modelo_info.json não encontrado")
    try:
        with open(CAMINHO_INFO, "r") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao ler modelo_info.json: {str(e)}")

# 🟢 Endpoint: histórico de treinamentos
@app.get("/historico-treinamentos")
def historico_treinamentos():
    """
    Retorna a lista de todos os treinamentos realizados do modelo Oráculo.
    
    🔹 Como funciona:
    - O arquivo historico_treinamentos.json é atualizado toda vez que o script atualizar_modelo.py é executado.
    - Cada execução adiciona um novo registro com informações como:
        • Nome do modelo
        • Algoritmo utilizado
        • Data e hora do treinamento
        • Origem dos dados
        • Quantidade de registros usados
        • Versão do modelo
    - Este endpoint lê esse arquivo e devolve a lista completa em formato JSON.
    
    🔹 Possíveis respostas:
    - 200 OK → retorna a lista de treinamentos
    - 404 Not Found → se o arquivo não existir (nenhum treinamento registrado ainda)
    - 500 Internal Server Error → se houver problema ao ler o arquivo
    """
    if not os.path.exists(CAMINHO_HISTORICO):
        raise HTTPException(status_code=404, detail="Nenhum histórico encontrado")
    try:
        with open(CAMINHO_HISTORICO, "r") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao ler historico_treinamentos.json: {str(e)}")

# 🟢 Endpoint: previsão de vendas
@app.get("/prever")
def prever(vendedor_id: int, mes: int):
    """
    Recebe vendedor_id e mês como parâmetros e retorna a previsão de valor realizado.
    Utiliza o modelo treinado salvo em modelo_previsao.pkl.
    """
    if modelo is None:
        raise HTTPException(status_code=500, detail="Modelo não carregado. Execute atualizar_modelo.py primeiro.")
    try:
        X_novo = np.array([[mes, vendedor_id]])  # Cria array com os dados de entrada
        previsao = modelo.predict(X_novo)[0]     # Gera previsão
        return {"vendedor_id": vendedor_id, "mes": mes, "previsao_valor": float(previsao)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar previsão: {str(e)}")
