import { defineConfig, env } from '@prisma/config'

export default defineConfig({
  // Tells Prisma where your model definitions are
  schema: 'prisma/schema.prisma',
  
  datasource: {
    // This looks for 'DATABASE_URL' inside your .env file
    url: env('DATABASE_URL'),
  },
})