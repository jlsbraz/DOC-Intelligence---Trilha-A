import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { config } from '../../config';

/**
 * BullMQ Queue Adapter
 *
 * Encapsula a criação e gerenciamento de uma fila BullMQ, expondo apenas
 * os métodos necessários ao Serviço de Ingestão (ADR-002: Infraestrutura
 * deve ficar atrás de uma fronteira que o domínio controla).
 *
 * Responsabilidade: enfileirar jobs de processamento de documentos.
 * Não contém lógica de negócio.
 */
@Injectable()
export class BullMQQueueAdapter {
  private readonly queue: Queue;

  constructor() {
    const redisConnection = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.queue = new Queue('document-processing', {
      connection: redisConnection,
    });
  }

  /**
   * Enfileira um job genérico (compatível com interface de porta do domínio).
   * Adaptador para o padrão hexagonal: expõe interface genérica.
   */
  async add(
    jobName: string,
    payload: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<{ id: string }> {
    const job = await this.queue.add(jobName, payload, {
      attempts: (options?.attempts as number) ?? 1,
      delay: (options?.delay as number) ?? 0,
      removeOnComplete: true,
      removeOnFail: false,
    });

    return { id: job.id ?? '' };
  }

  /**
   * Fecha a conexão com Redis (para graceful shutdown).
   */
  async close(): Promise<void> {
    await this.queue.close();
  }
}
