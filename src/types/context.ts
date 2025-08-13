import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import Redis from 'ioredis';
import { RedisCache } from '../lib/redis';

export interface Context {
  prisma: PrismaClient;
  redis: Redis;
  redisCache: RedisCache;
  req: Request;
  res: Response;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
