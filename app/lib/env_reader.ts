import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@gaoding/apollo-client/dist/lib/logger';

export interface EnvReaderOptions {
    env_file_type: string;
    env_file_path: string;
    logger: Logger
}

export class EnvReader {
    private _logger: Logger;
    private _env_file_type: string = 'properties';
    private _env_file_path: string = '';

    constructor(options: EnvReaderOptions) {
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

    loadManifest() {
        const envPath = path.resolve(this.env_file_path, 'manifest.json');
        if (fs.existsSync(envPath)) {
            const contnet = fs.readFileSync(envPath, 'utf-8');
            try {
                return JSON.parse(contnet);
            } catch (e) {
                console.log(e)
                return null;
            }
        } else {
            return null;
        }
    }

    readEnvFromFile(envPath: string, ns: string) {

        const lastIndex = envPath.lastIndexOf('.');
        const env_file_type = lastIndex > -1 ? envPath.substring(lastIndex + 1) : this.env_file_type;
        switch (env_file_type) {
            case 'properties':
                return this._readFromProperties(envPath);
            case 'json':
                return this._readFromJSON(envPath, ns);
            default:
                return {};
        }
    }

    private _readFromProperties(envPath: string) {
        try {
            const data = fs.readFileSync(envPath, 'utf-8');
            const configs = data.split('\n');
            const result: {
                [x: string]: {
                    [y: string]: string
                }
            } = {}
            let lastKey;
            for (const config of configs) {
                if (config.trim()) {
                    const splitIndex = config.indexOf('=');
                    let key = config.substr(0, splitIndex);
                    const value = config.substr(splitIndex + 1);

                    if (splitIndex > 0) {
                        lastKey = config.trim();
                    } else {
                        key = lastKey;
                    }
                    // const [ key, value ] = config.split('=');

                    if (key.trim() === 'release_key') {
                        continue;
                    }

                    const [namespace, configKey] = key.split('.');
                    const namespaceKey = namespace.trim();
                    if (!result[namespaceKey]) {
                        result[namespaceKey] = {};
                    }
                    if (splitIndex <= 0) {
                        result[namespaceKey][configKey.trim()] = [result[namespaceKey][configKey.trim()], value.trim()].join('\n');
                    } else {
                        result[namespaceKey][configKey.trim()] = value.trim();
                    }
                }
            }

            return result;
        } catch (err) {
            this.logger.warn(`[egg-apollo-client] read env_file: ${envPath} error when apollo start`);
        }
    }

    private _readFromJSON(envPath: string, ns: string) {
        try {
            const data = fs.readFileSync(envPath, 'utf-8');
            const configs = JSON.parse(data);
            const result: {
                [x: string]: {
                    [y: string]: string
                }
            } = {}
            for (const key in configs) {
                const value = configs[key];
                if (key.trim() === 'release_key') {
                    continue;
                }
                if (!result[ns]) {
                    result[ns] = {};
                }
                result[ns][key.trim()] = value.trim();
            }
            return result;
        } catch (err) {
            this.logger.warn(`[egg-apollo-client] read env_file: ${envPath} error when apollo start`);
        }
    }
}
