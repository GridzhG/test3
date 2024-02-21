server {
        listen 80;
        listen [::]:80;

        root /var/www/backend;
        index index.html index.htm index.nginx-debian.html;

        server_name api.test-casecc.ru;

        location / {
               proxy_pass http://127.0.0.1:3000;
               proxy_http_version 1.1;
               proxy_set_header Upgrade $http_upgrade;
               proxy_set_header Connection 'upgrade';
               proxy_set_header Host $host;
               proxy_cache_bypass $http_upgrade;
               # try_files $uri $uri/ =404;
        }
}