FROM nginx:latest
RUN chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d 
RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid
RUN chmod -R 777 /etc/nginx/conf.d

USER nginx

# Copy certs
COPY ./certs/ /etc/nginx/certs/

RUN rm /etc/nginx/conf.d/default.conf

# Copy config
COPY ./nginx.conf /etc/nginx/nginx.conf


CMD ["nginx","-g","daemon off;"]