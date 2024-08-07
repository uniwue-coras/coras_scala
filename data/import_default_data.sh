#!/bin/sh
dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
docker compose exec -Ti db mariadb -u root --password=abcd --database coras < $dir/default_data.sql
