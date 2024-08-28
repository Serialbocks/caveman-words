FROM debian

ENV SOURCEDIR=/caveman-words
COPY ./ $SOURCEDIR/
WORKDIR /caveman-words

RUN apt update
RUN apt upgrade -y
RUN apt install npm -y
RUN npm i
RUN npm run build
RUN cp -r ./build ./server/public