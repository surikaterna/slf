import os from 'os';
import { Client } from '@elastic/elasticsearch';
import type { Event } from 'slf';
import ElasticsearchQueue from './ElasticsearchQueue';
import { createLogMessage } from './createLogMessage';

export interface CreateSlfEsLoggerOptions {
  bulk?: boolean;
  levels?: Array<string>;
  project?: string;
  shouldIgnore?: (event: Event) => boolean;
}

export interface ConnectionOptions {
  cloudId: string;
  username: string;
  password: string;
  agentVersion?: string;
  env: string;
}

const staticHostMetadata = {
  ipAddresses: Object.values(os.networkInterfaces())
    .flat()
    .filter((iFace) => !!iFace?.address && iFace?.family === 'IPv4' && iFace.address !== '127.0.0.1')
    .map((iFace) => iFace?.address),
  hostname: os.hostname(),
  platform: os.platform(),
  arch: os.arch(),
  cpus: os.cpus().length
};

export default function createElasticsearchDriver(connectionOptions: ConnectionOptions, loggingOptions: CreateSlfEsLoggerOptions = {}) {
  const { levels = ['debug', 'info', 'error'], project = 'lx3', shouldIgnore, bulk = true } = loggingOptions;
  const { cloudId, password, username, env = 'fat', agentVersion = '8.6.0' } = connectionOptions;
  const index = `logging-${env}-${agentVersion}`;
  const client = new Client({ cloud: { id: cloudId }, auth: { username, password } });

  let elasticsearchQueue: ElasticsearchQueue | undefined;
  if (bulk) {
    elasticsearchQueue = new ElasticsearchQueue(client, index);
  }

  return (event: Event) => {
    if (shouldIgnore && shouldIgnore(event)) {
      return;
    }
    if (!levels.includes(event.level)) {
      return;
    }
    const hostMetadata = {
      uptime: os.uptime(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem()
    };
    const { params, ...rest } = event;
    const document = {
      ...rest,
      project,
      hostMetadata: { ...staticHostMetadata, ...hostMetadata },
      message: `[${event.level.toUpperCase()}]: ${createLogMessage(event.params)}`,
      '@timestamp': event.timeStamp
    };
    if (elasticsearchQueue) {
      elasticsearchQueue.save(document);
    } else {
      client.index({ index, document });
    }
  };
}
