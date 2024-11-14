FROM nginx:1.23
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY dist/angular-15-jwt-auth/ ./
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80