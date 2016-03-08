# Static Nginx Boilerplate

### (0.2.1) BETA version

One of the problems of deploying with `azk` on low memory hosts is that `azk` sometimes get errors compiling: `npm install` just exit with strange errors related to memory issues.

This is a way to deploy static sites with `nginx` and `azk` in really small machines. It is just a `nginx` server that serves static files. This is cheap.

### Start

```sh
# start nginx
azk start static-server        # public server

# build all
./scripts/build.sh

# sync public files
azk start sync -Rv
```

- open http://static-server.dev.azk.io

> If you want to use HTTP basic authentication you can start system bellow
> `azk start static-server-secure`


---------------

### Deploy

> Attention: for now this boilerplate uses `git` to store public folder. We are planning to add a `rsync` system to send files directly to destination folder on `digital ocean` machine.

```sh
# build check-users-commands site
./scripts/build.sh

# commit with git
git add . -A
git commit -m"[Site] Update public"

# start nginx
azk deploy
```

------------

### Run node site in dev mode

```sh
azk start hexo-blog-dev
```

- open http://hexo-blog.dev.azk.io
