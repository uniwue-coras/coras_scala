#!/bin/sh
dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
docker compose exec -Ti db mariadb-dump -n -t -u root --password=abcd --ignore-table=coras.play_evolutions coras > $dir/default_data.sql
