import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { DocumentProcessingService } from '../../documents/document-processing.service';
import { config } from '../../config';

/**
 * BullMQ Worker Adapter
 *
 * Encapsula a criação e gerenciamento de um Worker BullMQ, que consome jobs
 * e delega o processamento para o Serviço de Processamento do domínio
 * (ADR-002: infraestrutura isolada atrás de fronteira controlada).
 *
 * Responsabilidade:
 * - Conectar ao Redis
 * - Criar e gerenciar a instância do Worker
 * - Delegar jobs ao serviço de domínio sem lógica de negócio aqui
 */
@Injectable()
export class BullMQWorkerAdapter implements OnModuleInit, OnModuleDestroy {
  private worker: Worker | null = null;

  constructor(private readonly processingService: DocumentProcessingService) {}

  /**
   * Inicializa o worker e começa a consumir jobs.
   */
  async onModuleInit(): Promise<void> {
    const redisConnection = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.worker = new Worker('document-processing', this.processor.bind(this), {
      connection: redisConnection,
      concurrency: config.worker.concurrency,
    });

    this.worker.on('failed', (job, err) => {
      if (job) {
        console.error(`Job ${job.id} failed: ${err.message}`);
      } else {
        console.error(`Job failed: ${err.message}`);
      }
    });

    this.worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed`);
    });

    console.log('BullMQ worker started');
  }

  /**
   * Processor: delega imediatamente ao serviço de domínio.
   * Sem lógica de negócio aqui.
   */
  private async processor(job: Job): Promise<void> {
    const { documentId } = job.data;

    if (!documentId || typeof documentId !== 'string') {
      throw new Error('Invalid job payload: missing documentId');
    }

    // Delega ao serviço de domínio
    await this.processingService.processDocument(documentId);
  }

  /**
   * Graceful shutdown: fecha o worker.
   */
  async onModuleDestroy(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
      console.log('BullMQ worker closed');
    }
  }
}
