# Static Nginx Boilerplate

### ALPHA version

One of the problems of deploying with `azk` on low memory hosts is that `azk` cannot compile files.

> The `npm install` or `bundle install` just exit with strange errors.

This is a way to deploy static sites with `nginx` and `azk` in really small machines. It is just a `nginx` server that serves static files. This is cheap.

### TODO:

- [x] Add Apache 2.0 licence
- [x] Add CHANGELOG licence
- [ ] Add rsync system to deploy files on remote server

### Start

```sh
# start nginx
azk start cdn-server
# OR: start nginx with basic authentication
azk start cdn-server-secure

# build all to public folder
./scripts/build.sh
```

- open http://cdn-server.dev.azk.io

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
