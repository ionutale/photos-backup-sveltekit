FROM node:18.13.0-alpine3.16
ENV NODE_ENV=production
ENV MONGO_URI=mongodb+srv://tesst:test@photoscluster0.ewcpuvc.mongodb.net/test
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host"]
