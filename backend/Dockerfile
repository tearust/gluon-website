FROM mhart/alpine-node:14.12

# RUN node -v
# RUN npm -v

WORKDIR /app

COPY . /app

RUN npm i
RUN npm run build

WORKDIR /app/dist

