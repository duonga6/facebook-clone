FROM node:latest as build-stage
WORKDIR /app
COPY . .
RUN npm install
COPY ./ .
RUN npm run build
RUN mkdir static
RUN cp -r dist/* static/
EXPOSE 3000
CMD ["npx", "http-server", "static", "-p", "3000"]
