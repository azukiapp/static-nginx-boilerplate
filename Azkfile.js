systems({
  // **************************
  // cdn-server nginx site
  // **************************
  'cdn-server': {
    image: {'docker': 'nginx'},
    workdir: '/azk/public',
    shell: '/bin/bash',
    scalable: { default: 1, limit: 1 },
    mounts: {
      '/azk/scripts': sync('./scripts'),
      '/etc/nginx/conf.d': sync('./nginx'),
      '/azk/public': path('./public'),
    },
    http: {
      domains: [
        '#{env.HOST_DOMAIN}',                   // used if deployed
        '#{env.HOST_IP}',                       // used if deployed
        '#{system.name}.#{azk.default_domain}'
      ]
    },
    ports: {
      http: '80/tcp'
    },
    scalable: { default: 0, limit: 1 },
    wait: 20,
  },
  'cdn-server-secure': {
    extends: 'cdn-server',
    mounts: {
      '/azk/scripts': sync('./scripts'),
      '/etc/nginx/conf.d': sync('./nginx-basic-auth'),
      '/azk/public': path('./public'),
    },
    command: ['/azk/scripts/configure-start-nginx.sh'],
  },
  // ********************
  // hexo-blog
  // ********************
  'hexo-blog-build': {
    image: {'docker': 'azukiapp/node'},
    depends: [],
    provision: [
      'npm install',
      'hexo generate',
    ],
    workdir: '/azk/sites/hexo-blog',
    command: ['echo', 'build `#{system.name}` ok'],
    mounts: {

      // sync: fast copy all files to inside
      '/azk/sites/hexo-blog': sync('./sites/hexo-blog'),
      '/azk/sites/hexo-blog/node_modules': persistent('hexo-blog_node_modules'),

      // path: to get `public` files back from inside container
      '/azk/sites/hexo-blog/public': path('./sites/hexo-blog/public')
    },
    shell: '/bin/bash',
    envs: {
      NODE_ENV: 'dev',
      PATH: 'node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
    },
    scalable: { default: 0, limit: 1 },
    http: null,
    ports: null,
    wait: undefined,
  },
  'hexo-blog-dev': {
    extends: 'hexo-blog-build',
    provision: [
      'npm install',
    ],
    command: ['hexo', 'server'],
    http: {
      domains: [
        'hexo-blog.#{azk.default_domain}'
      ]
    },
    ports: {
      http: '4000/tcp'
    },
    wait: 20,
    envs: {
      PORT: '4000',
      NODE_ENV: 'dev',
      PATH: 'node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
    }
  },

  // ********************
  // deploy
  // ********************
  deploy: {
    // List with all available deployment settings:
    // https://github.com/azukiapp/docker-deploy-digitalocean/blob/master/README.md
    image: { docker: 'azukiapp/deploy-digitalocean' },
    mounts: {
      '/azk/deploy/src':     path('.'),
      '/azk/deploy/.ssh':    path('#{env.HOME}/.ssh'), // Required to connect with the remote server
      '/azk/deploy/.config': persistent('deploy-config')
    },
    scalable: { default: 0, limit: 0 },
    envs: {
      GIT_REF: 'master',
      BOX_SIZE: '512mb',
      AZK_RESTART_COMMAND: 'azk restart -Rvv cdn-server',
    }
  },
});
