FROM postgres 

ADD ./init-db.sh /docker-entrypoint-initdb.d/init-db.sh
RUN chown postgres:postgres /docker-entrypoint-initdb.d/init-db.sh
CMD ["docker-entrypoint.sh", "postgres"]