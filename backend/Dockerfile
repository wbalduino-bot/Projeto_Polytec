# Usamos a imagem oficial do Node.js versão 18
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copiamos apenas os arquivos de dependência primeiro (para aproveitar cache)
COPY package*.json ./

# Instalamos as dependências do projeto
RUN npm install

# Copiamos o restante do código para dentro do container
COPY . .

# Expondo a porta que o backend usa (3000)
EXPOSE 3000

# Comando que inicia o servidor (ajuste se seu package.json usa outro script)
CMD ["npm", "start"]
