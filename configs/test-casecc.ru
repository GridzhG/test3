server {
    listen      80;
    server_name test-casecc.ru;
    charset utf-8;
    root    /var/www/frontend/dist;
    index   index.html index.htm;
    # Always serve index.html for any request
    location / {
        root /var/www/frontend/dist;
        try_files $uri /index.html;
    }
    error_log  /var/log/nginx/vue-front-error.log;
    access_log /var/log/nginx/vue-front-access.log;
}