#!/bin/bash

docker login
docker build -t brilliantphal/bisinvoice-client:latest .
docker push brilliantphal/bisinvoice-client:latest