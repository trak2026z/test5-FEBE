// backend/src/data-source.ts
import 'dotenv/config'
import { DataSource } from 'typeorm'

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL ?? undefined,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'test_db',

  // Lepiej wzorce niż bezpośredni import klas (unika problemów z import order)
  entities: [__dirname + '/**/*.entity.{js,ts}'],
  migrations: [__dirname + '/migrations/*.{js,ts}'],

  synchronize: false,
  logging:
    process.env.TYPEORM_LOGGING === 'true' ||
    process.env.NODE_ENV !== 'production',
})
