## Update submodules

This repo has submodules.  

**To clone including submodules:**
- git clone --recursive git@github.com:KarlComSe/SvenskaElsparkcyklarAB.git

**To update submodules:**
- git submodule update --remote

# Hello World Docker Test

This repository will be connected to a main vteam repo. This repository only contains the initial Dockerfile test for setting up the development environment.

## Contents
- Basic Dockerfile that prints "hello world"
- Docker-compose file for container setup
- Test file to delete and pull the image created by the Dockerfile

## Docker Hub
Image available at: owsu23/vteam02:v0

# Initiate the repository

Create a folder for the repo and initiate the git repository with the following commands:

```bash
git clone git@github.com:KarlComSe/SvenskaElsparkcyklarAB.git
cd SvenskaElsparkcyklarAB
```

## Fetching a remote branch and working on the same locally

```bash
# list remote branches
git branch -r

# local branch name same as remote
git checkout --track origin/<remote-branch-name>

# local branch name different than remote
git checkout -b <local-branch-name> origin/<remote-branch-name>

```
