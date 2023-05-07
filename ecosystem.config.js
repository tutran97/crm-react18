// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'vhcrm',
      script: 'npm',
      args: 'run start:prod',
      instances: 1,
      exec_mode: 'cluster',
      error_file: './logs/dev_err.log',
      out_file: './logs/dev_out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env: {
        ENV: 'development',
        CONSUMER_KEY: 'ck_0e8489c2f65ca3f60a7ce875ab6f2f3c8f5a111f',
        CONSUMER_SECRET: 'cs_aa37fffa8ea4f9cfb54c86ac233eb9061f8fc45d'
      }
    }
  ]
};
