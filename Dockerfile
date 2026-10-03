FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# Run the application as the non-root Node.js user
USER 1000

EXPOSE 3000

CMD ["node", "app.js"]
