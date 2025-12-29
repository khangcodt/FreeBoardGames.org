#!/bin/bash

# Set GIT_REV from the file created during build
if [ -f /tmp/git_rev ]; then
  export GIT_REV=$(cat /tmp/git_rev)
fi

if [ "$SERVER_TYPE" = "BGIO" ]; then
  yarn run start:bgio
elif [ "$SERVER_TYPE" = "WEB" ]; then
  NODE_ENV=production yarn run start:server
fi
