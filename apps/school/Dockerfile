###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:alpine As development

WORKDIR /usr/src/app
COPY --chown=node:node pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN npm install -g @nestjs/cli

RUN pnpm fetch --prod

COPY --chown=node:node . .
RUN pnpm install


###################
# BUILD FOR PRODUCTION
###################

FROM node:alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN npm install -g @nestjs/cli

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN RUN pnpm run build school

ENV NODE_ENV production

RUN pnpm install --prod


###################
# PRODUCTION
###################

FROM node:alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/apps/school/main" ]
