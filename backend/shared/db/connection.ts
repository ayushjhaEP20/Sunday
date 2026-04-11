import { Pool, PoolConfig, QueryResult } from 'pg';

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const missingVariables: string[] = [];
if (!dbHost) missingVariables.push('DB_HOST');
if (!process.env.DB_PORT) missingVariables.push('DB_PORT');
if (!dbUser) missingVariables.push('DB_USER');
if (!dbPassword) missingVariables.push('DB_PASSWORD');
if (!dbName) missingVariables.push('DB_NAME');

if (missingVariables.length > 0) {
  throw new Error(
    `Missing required database environment variables: ${missingVariables.join(', ')}`,
  );
}

const poolConfig: PoolConfig = {
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  max: parseInt(process.env.DB_POOL_MAX || '10', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000', 10),
};

const pool = new Pool(poolConfig);

pool.on('error', (error) => {
  console.error('PostgreSQL idle client error:', error);
});

export async function query<T = any>(text: string, params: unknown[] = []): Promise<QueryResult<T>> {
  try {
    return await pool.query<T>(text, params);
  } catch (error) {
    console.error('PostgreSQL query failed:', {
      text,
      params,
      error,
    });
    throw error;
  }
}

export { pool as dbPool };