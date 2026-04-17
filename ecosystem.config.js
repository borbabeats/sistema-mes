module.exports = {
  apps: [
    {
      name: 'sistema-mes-api',
      script: 'docker-compose up',
      cwd: '/apps/sistema-mes',
      interpreter: '/bin/bash',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: '3000'
      },
      error_file: '/tmp/pm2-sistema-mes-error.log',
      out_file: '/tmp/pm2-sistema-mes-out.log',
      log_file: '/tmp/pm2-sistema-mes-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      kill_timeout: 5000
    },
    // Adicione outras aplicações aqui
    // {
    //   name: 'outra-app-1',
    //   script: 'docker-compose -f /apps/outra-app-1/docker-compose.yml up',
    //   cwd: '/apps/outra-app-1',
    //   interpreter: '/bin/bash',
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   max_memory_restart: '1G',
    //   env: {
    //     NODE_ENV: 'production',
    //     PORT: '3001'
    //   }
    // },
    // {
    //   name: 'outra-app-2',
    //   script: 'docker-compose -f /apps/outra-app-2/docker-compose.yml up',
    //   cwd: '/apps/outra-app-2',
    //   interpreter: '/bin/bash',
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   max_memory_restart: '1G',
    //   env: {
    //     NODE_ENV: 'production',
    //     PORT: '3002'
    //   }
    // }
  ]
};