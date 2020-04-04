#!/bin/bash

git fetch

if [[ "$(git status -uno | grep up-to-date)" == "" ]]; then
	echo "Updates available, pulling and deploying";
	git pull;
	make prod;
else
	echo "No changes, skip deploying";
fi
