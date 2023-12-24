FROM ubuntu:latest

RUN apt-get update
RUN apt-get install --no-install-recommends --assume-yes wine
RUN dpkg --add-architecture i386 
RUN apt-get --assume-yes update
RUN apt-get install --no-install-recommends --assume-yes wine32

WORKDIR /app

COPY dyalogrt.exe reverse.dws input.txt /app

ENTRYPOINT ["/bin/bash"]