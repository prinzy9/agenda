# 1. Usa l'immagine di Node.js
FROM node:alpine

# 2. Imposta la directory di lavoro
WORKDIR /usr/src/app

# 3. Copia il contenuto attuale della directory
COPY . /usr/src/app

# 4. Installa le dipendenze
#RUN npm install --omit=dev

RUN npm install -g @angular/cli

RUN npm install 

# 6. Costruisci il progetto
RUN npm run build --prod

# 6. Costruisci il progetto
# RUN npx json-server dipendenti.json

# 7. Espone la porta su cui l'app sarà eseguita
EXPOSE 4200

CMD ["npm", "run", "play"]
# 8. Comando per avviare l'app
# CMD ["npm", "start"]