#!/usr/bin/env sh
set -e
echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  if [[ `git status --porcelain` ]];
  then
    git add -A
    git commit -am "build: compile $VERSION"
  fi

  # commit
  cd release/app
  npm version $VERSION --message "release: $VERSION"

  # publish
  git push origin main
  git push origin refs/tags/v$VERSION
fi
