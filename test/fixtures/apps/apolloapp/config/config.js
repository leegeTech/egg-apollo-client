'use strict';
const os = require('os');

exports.apollo = {
     config_server_url: 'test-apollo.xiaofangyi.com:8080', // required, 配置中心服务地址
        app_id: 'hnuHDr1SWagYRKik', // required, 需要加载的配置
        init_on_start: true, // optional, 在 app 启动时同时加载配置，加载的配置会在插件加载前被加载
        cluster_name: 'default', // optional, 加载配置的集群名称, default: 'default'
        namespace_name: 'application', // optional, 加载配置的命名空间, default: 'application'
        release_key: '', // optional, 加载配置的版本 key, default: ''
        ip: '', // optional,

        set_env_file: true, // optional, 是否写入到 env 文件, default: false
        env_file_path: `${os.tmpdir()}/.env.apollo`, // optional, 写入的 env 文件路径, default: ${os.tmpdir()}/.env.apollo
        watch: false, // optional, 长轮询查看配置是否更新, default: false
        timeout: 50000, // optional, 长轮询 timeout 设置，默认 50000
}

exports.logger = {
  coreLogger: {
    level: 'INFO',
  },
};

exports.keys = 'keys';
