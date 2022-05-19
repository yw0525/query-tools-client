#!/usr/bin/env sh
set -e
echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  cd release/app
  npm version $VERSION --message "release: $VERSION"

  # commit
  if [[ `git status --porcelain` ]];
  then
    git add -A
    git commit -am "build: compile $VERSION"
  fi

  # publish
  git push origin main
  git tag v$VERSION
  git push origin refs/tags/v$VERSION
fi
