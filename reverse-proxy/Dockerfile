FROM nginx:latest

# Give non root user basic permissions
RUN chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d 

# Give non root user permissions to process id
RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

# Give non root user permissions to logs
#RUN touch /etc/nginx/logs/nginx-access.log && \
        #chown -R nginx:nginx /etc/nginx/logs/nginx-access.log
#RUN touch /etc/nginx/logs/nginx-ssl-access.log && \
        #chown -R nginx:nginx /etc/nginx/logs/nginx-ssl-access.log

RUN chmod -R 777 /etc/nginx/conf.d

USER nginx

# Copy certs
COPY ./certs/ /etc/nginx/certs/

RUN rm /etc/nginx/conf.d/default.conf

# Copy config
COPY ./nginx.conf /etc/nginx/nginx.conf


CMD ["nginx","-g","daemon off;"]