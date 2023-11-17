FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN npm install -g @nestjs/cli
RUN pnpm install

COPY . .

RUN pnpm run build organization

FROM node:alpine As production

ARG NODE-ENV=production
ENV NODE-ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/apps/organization/main"]
