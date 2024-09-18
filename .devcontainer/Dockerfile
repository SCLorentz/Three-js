# syntax=docker/dockerfile:1
FROM ubuntu:latest
WORKDIR /app

# install app dependencies
RUN apt-get update && apt-get install -y build-essential
RUN apt-get install -y git
# npm and nodeJS
RUN apt-get install -y npm

# Settings
# create bashrc
RUN touch ~/.bashrc && chmod u+w ~/.bashrc
# customize bashrc
COPY cmd/prompt /
RUN sh -c 'cat /prompt >> ~/.bashrc'
# run.sh

# final configuration
ENV FLASK_APP=chrome-dino-game
EXPOSE 8000
CMD flask run --host 0.0.0.0 --port 8000