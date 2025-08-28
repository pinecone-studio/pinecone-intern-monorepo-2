#!/bin/bash
 
ENV_FILE="libs/scripts/.env"
 
mkdir -p "$(dirname "$ENV_FILE")"
 
if [ ! -f "$ENV_FILE" ]; then

    touch "$ENV_FILE"

fi
 
echo "base=$NX_BASE" >"$ENV_FILE"

echo "head=$NX_HEAD" >>"$ENV_FILE"
 
cat "$ENV_FILE"
 