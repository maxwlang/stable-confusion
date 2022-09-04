FROM node:16 AS build
WORKDIR /opt/app
COPY package.json .
RUN yarn
COPY . .
RUN yarn run build

# Second stage: run things.
FROM node:16
WORKDIR /opt/app
COPY package.json .
RUN yarn --production
COPY --from=build /opt/app/dist dist

CMD ["yarn", "run", "start"]