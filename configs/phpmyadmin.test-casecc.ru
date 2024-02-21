server {
listen       80;
server_name  phpmyadmin.test-casecc.ru;

root /usr/share/phpmyadmin;
index index.php;

location ~ \.php$ {
    fastcgi_split_path_info ^(.+\.php)(/.*)$;
    fastcgi_pass unix:/run/php/php8.2-fpm.sock;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
}

}