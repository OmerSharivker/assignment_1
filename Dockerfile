#development stage
FROM node:18-alpine as development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "dev"]

#production stage
FROM node:18-alpine as production


WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY --from=development /app/dist ./dist
COPY --from=development /app/public ./public

CMD ["node", "dist/server.js"]

