# atualizar_modelo.py — Reentreina o modelo e atualiza histórico de treinamentos

import sqlite3
import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import os
import json
from datetime import datetime

CAMINHO_BANCO = "../backend/database.sqlite"

# 🔗 Extrai dados
conn = sqlite3.connect(CAMINHO_BANCO)
query = """
SELECT vendedor_id, mes, valor_meta, valor_realizado
FROM metas
WHERE valor_realizado IS NOT NULL
"""
df = pd.read_sql_query(query, conn)
conn.close()

# 🧼 Limpeza
df.dropna(inplace=True)
df = df[df["valor_realizado"] > 0]
df["mes"] = df["mes"].astype(int)
df["vendedor_id"] = df["vendedor_id"].astype(int)

# 🎯 Features e target
X = df[["mes", "vendedor_id"]]
y = df["valor_realizado"]

# 🤖 Treina modelo
modelo = LinearRegression()
modelo.fit(X, y)

# 💾 Salva modelo
os.makedirs("modelos", exist_ok=True)
joblib.dump(modelo, "modelos/modelo_previsao.pkl")

# 📊 Metadados
info = {
    "nome_modelo": "Oráculo",
    "algoritmo": "Regressão Linear",
    "data_treinamento": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "origem_dados": "SQLite - tabela metas",
    "quantidade_registros": len(df),
    "versao": "1.0.1"
}

with open("modelos/modelo_info.json", "w") as f:
    json.dump(info, f, indent=4)

# 📜 Atualiza histórico de treinamentos
historico_path = "modelos/historico_treinamentos.json"
historico = []

if os.path.exists(historico_path):
    with open(historico_path, "r") as f:
        historico = json.load(f)

historico.append(info)

with open(historico_path, "w") as f:
    json.dump(historico, f, indent=4)

print("✅ Modelo atualizado com", len(df), "registros.")
print("📁 Arquivos salvos em python-service/modelos/")
