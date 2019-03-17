#!/usr/bin/env sh

echo "部署dist"

NGINX_HOME='/usr/share/nginx/html'
RPO_NAME='sso-front'

tar -cvf dist.tar ./dist
rm -rf $NGINX_HOME/$RPO_NAME && mkdir $NGINX_HOME/$RPO_NAME
cp ./dist.tar $NGINX_HOME/$RPO_NAME
tar -xvf $NGINX_HOME/$RPO_NAME/dist.tar -C $NGINX_HOME/$RPO_NAME