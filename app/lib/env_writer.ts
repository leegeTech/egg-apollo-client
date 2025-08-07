import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@gaoding/apollo-client/dist/lib/logger';
import { ApolloReponseConfigData } from './apollo';

export interface EnvWriterOptions {
    env_file_type: string;
    env_file_path: string;
    logger: Logger
}

export class EnvWriter {
    private _logger: Logger;
    private _env_file_type: string = 'properties';
    private _env_file_path: string = '';

    constructor(options: EnvWriterOptions) {
        for (const key in options) {
            this['_' + key] = options[key];
        }
    }

    get logger() {
        return this._logger;
    }

    get env_file_type() {
        return this._env_file_type;
    }

    get env_file_path() {
        return this._env_file_path;
    }

    write(data: ApolloReponseConfigData) {
        const { namespaceName, releaseKey } = data;
        const envPath = path.resolve(this.env_file_path, `.env.apollo.${namespaceName}`);
        const lastIndex = envPath.lastIndexOf('.');
        const env_file_type = lastIndex > -1 ? envPath.substring(lastIndex + 1) : this.env_file_type;

        switch (env_file_type) {
            case 'properties':
                this._writeToProperties(envPath, data);
                break;
            case 'json':
                this._writeToJSON(envPath, data);
                break;
            default:
                this._writeToProperties(envPath, data);
                break;
        }
        // write namespace to manifest.json
        this._writeToManifest(namespaceName, releaseKey);

    }
    private _writeToProperties(envPath: string, data: ApolloReponseConfigData) {
        let fileData = '';
        const { configurations } = data;
        for (const key in configurations) {
            // 根据nameSpaceName进行过滤
            fileData += `${key}=${configurations[key]}\n`;
        }

        if (fs.existsSync(envPath)) {
            // 只有 agent-worker 才能写入 env 文件
            // 避免多个 app-worker 写入的时候文件已被移除，造成错误
            const rename = `${envPath}.${Date.now()}`;
            try {
                fs.renameSync(envPath, rename);
            }
            catch (e) {
                process.env.NODE_ENV !== 'production' && console.error(e);
            }
        }
        // console.log(`[egg-apollo] write env file to ${envPath}`, fileData);
        fs.writeFileSync(envPath, fileData, 'utf-8');
    }
    private _writeToJSON(envPath: string, data: ApolloReponseConfigData) {

        if (fs.existsSync(envPath)) {
            // 只有 agent-worker 才能写入 env 文件
            // 避免多个 app-worker 写入的时候文件已被移除，造成错误
            const rename = `${envPath}.${Date.now()}`;
            try {
                fs.renameSync(envPath, rename);
            }
            catch (e) {
                process.env.NODE_ENV !== 'production' && console.error(e);
            }
        }
        // console.log(`[egg-apollo] write env file to ${envPath}`, fileData);
        fs.writeFileSync(envPath, data.configurations.content, 'utf-8');
    }
    private _writeToManifest(ns: string, releaseKey: string) { 
        const envPath = path.resolve(this.env_file_path, 'manifest.json');
        let contentJson = {};
        if (fs.existsSync(envPath)) {
            const contnet = fs.readFileSync(envPath, 'utf-8');
            try {
                contentJson = JSON.parse(contnet);
            } catch (e) {
                console.log(e)
            }
        }
        contentJson[ns] = releaseKey;

        fs.writeFileSync(envPath, JSON.stringify(contentJson, null, 4));
    }
}