# Static Nginx Boilerplate

> version: 0.1.2

One of the problems of deploying with `azk` on low memory hosts is that `azk` sometimes get compiling errors. e.g. `npm install` just exits with strange errors related to memory issues.

This boilerplate is a way to deploy static sites with `NGINX`, `rsync` and  `azk` in really small machines. It is just a `nginx` server that serves static files. All static files are transfered with `rsync`. This is cheap.

### Start locally

```sh
./scripts/build.sh        # build static site
azk start static-server   # static nginx server
```

- open http://static-server.dev.azk.io

> If you want to use HTTP basic authentication you can start system bellow
> `azk start static-server-secure`

---------------

### Deploy to Digital Ocean

```sh
# build check-users-commands site
./scripts/build.sh

# deploy this project to server
# You must set these envs before continue: DEPLOY_API_TOKEN, DEPLOY_REMOTE_IP, DEPLOY_REMOTE_PROJECT_PATH in `.env` file
azk deploy

# build check-users-commands site
azk start sync-deploy -Rvv
```
