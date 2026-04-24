import type { Client } from '@elastic/elasticsearch';
import type { BulkResponse } from '@elastic/elasticsearch/lib/api/types';

class ElasticsearchQueue {
  private client: Client;
  private queue: Record<string, any>[] = [];
  private flushing = false;
  private readonly index: string;
  private readonly queueSizeLimit: number;
  private readonly flushInterval: number;

  constructor(client: Client, index: string, queueSizeLimit = 100, flushInterval = 5000) {
    this.client = client;
    this.index = index;
    this.queueSizeLimit = queueSizeLimit;
    this.flushInterval = flushInterval;

    setInterval(() => this.flushQueue(), this.flushInterval);
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
  }

  public save(document: Record<string, any>) {
    this.queue.push({ create: { _index: this.index } }, document);
    if (this.queue.length >= this.queueSizeLimit) {
      this.flushQueue();
    }
  }

  private async flushQueue() {
    if (this.flushing || this.queue.length === 0) return;

    this.flushing = true;
    const currentQueue = this.queue;
    this.queue = [];

    try {
      const response: BulkResponse = await this.client.bulk({ operations: currentQueue });
      if (response.errors) {
        console.error('Bulk operation encountered errors:', JSON.stringify(response.items));
      }
    } catch (error) {
      console.error('Error during bulk operation:', error);
    } finally {
      this.flushing = false;
    }
  }

  private async shutdown() {
    console.log('Application is shutting down. Flushing queue...');
    await this.flushQueue();
    console.log('Queue flushed. Exiting...');
    process.exit(0);
  }
}

export default ElasticsearchQueue;
