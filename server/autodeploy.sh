#!/bin/bash

BRANCH=release-backend

git fetch

if [[ "$(git status -uno | grep ${BRANCH})" == "" ]]; then
	echo "Updates available, pulling and deploying";
	git pull;
	make prod;
else
	echo "No changes, skip deploying";
fi
