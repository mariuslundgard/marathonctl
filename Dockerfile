FROM node:8.6.0

MAINTAINER Marius Lundgård <studio@mariuslundgard.com>

RUN npm i marathonctl -g

ENTRYPOINT ["marathonctl"]
