FROM node:18-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install --ignore-scripts=false --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
