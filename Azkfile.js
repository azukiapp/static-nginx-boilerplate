systems({
  // **************************
  // static-server nginx site
  // **************************
  'static-server': {
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
  // static-server with HTTP Authentication Enabled
  'static-server-secure': {
    extends: 'static-server',
    mounts: {
      '/azk/scripts': sync('./scripts'),
      // see DEFAULT_USER & DEFAULT_PASSWORD on `.env`
      '/etc/nginx/conf.d': sync('./nginx-basic-auth'),
      '/azk/public': path('./public'),
    },
    command: ['/azk/scripts/nginx/nginx-secure-entrypoint.sh'],
  },

  // *****************************
  // azukiapp/deploy-digitalocean
  // *****************************
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
      AZK_RESTART_COMMAND: 'azk restart -Rvv static-server',
    }
  },

  // *****************************
  // sync local and remote assets
  // *****************************
  // sync only local files
  sync: {
    image: { dockerfile: './Docker' },
    mounts: {
      // rsync scripts
      '/azk/scripts': path('./scripts'),
      // site sources
      '/azk/sites': sync('./sites'),
      // public dist static site files
      '/azk/public': path('./public'),
      // host ssh keys imported to container
      '/root/.ssh': path('#{env.HOME}/.ssh'),
      // FIXME: should get remote IP
      '/azk/deploy/.config': persistent('deploy-config'),
    },
    workdir: '/azk',
    shell: '/bin/sh',
    provision: [
      'sh /azk/scripts/rsync/local.sh'
    ],
    command: ['echo', 'SYNC OK'],
    scalable: { default: 0, limit: 1 }
  },
  // sync local files and then deploy to remote server
  'sync-deploy': {
    extends: 'sync',
    provision: [
      'sh /azk/scripts/rsync/local.sh',
      'sh /azk/scripts/rsync/deploy.sh',
    ],
  },
  // sync and watch local files
  'watch': {
    extends: 'sync',
    provision: [
      'sh /azk/scripts/rsync/watch/local-watch.sh'
    ],
  },
  // sync and watch local files and then deploy to remote server
  'watch': {
    extends: 'sync',
    provision: [
      'sh /azk/scripts/rsync/watch/deploy-watch.sh'
    ],
  },
});
