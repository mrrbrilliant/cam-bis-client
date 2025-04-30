#!/bin/bash

docker compose down
docker compose up --build -d
docker compose logs frontend
docker compose logs backend