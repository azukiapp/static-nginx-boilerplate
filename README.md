# static-nginx-boilerplate [ALPHA version]

# TODO:

- [ ] Add Apache 2.0 licence
- [ ] Add CHANGELOG licence
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

> Attention: for now this boilerplate uses git to store public folder. We are planning to add a rsync system to send files directly to destination folder on digital ocean machine.

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
