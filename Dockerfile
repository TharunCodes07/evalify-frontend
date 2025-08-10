FROM node:alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm run build

FROM node:alpine
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm pm2

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]