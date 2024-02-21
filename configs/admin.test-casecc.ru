server {
    listen      80;
    server_name admin.test-casecc.ru;
    charset utf-8;
    root    /var/www/admin/dist;
    index   index.html index.htm;
    # Always serve index.html for any request
    location / {
        root /var/www/admin/dist;
        try_files $uri /index.html;
    }
    error_log  /var/log/nginx/vue-admin-error.log;
    access_log /var/log/nginx/vue-adminfront-access.log;
}