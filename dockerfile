FROM node:alpine as build
 
WORKDIR /app
 
COPY package.json ./

RUN npm install --force
 
COPY . ./
 
 
RUN npm run build --prod


FROM nginx:alpine
 
COPY --from=build /app/dist/angular-15-jwt-auth /usr/share/nginx/html
 
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]