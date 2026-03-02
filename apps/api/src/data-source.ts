import { DataSource } from 'typeorm';

/**
 * Standalone DataSource for TypeORM CLI (migrations).
 * Used by: npm run migration:generate / migration:run / migration:revert
 *
 * Laravel equivalent: config/database.php used by `php artisan migrate`
 */
export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'spark',
  password: process.env.DB_PASSWORD || 'spark_secret',
  database: process.env.DB_NAME || 'spark_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
