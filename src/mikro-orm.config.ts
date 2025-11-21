import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const {
    DB_HOST = 'localhost',
    DB_PORT = '5432',
    DB_USER = 'feature-flags-backend',
    DB_PASSWORD = 'feature-flags-backend',
    DB_NAME = 'feature-flags-backend',
    NODE_ENV = 'development',
} = process.env;

export default defineConfig({
    driver: PostgreSqlDriver,
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    dbName: DB_NAME,

    // Entity discovery
    entities: ['./dist/**/*.entity.js'], // compiled JS
    entitiesTs: ['./src/**/*.entity.ts'], // TS source

    // Dev / debug options
    debug: NODE_ENV !== 'production',
    highlighter: new SqlHighlighter(),

    // CLI extensions for migrations, seeding, etc.
    extensions: [Migrator],

    // Migrations config
    migrations: {
        path: './src/migrations',      // path to migrations folder
        transactional: true,           // wrap migrations in a transaction
        disableForeignKeys: false,     // automatically handle FKs
        allOrNothing: true,            // rollback all if any fail
    },
});