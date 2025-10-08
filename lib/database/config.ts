export interface DatabaseConfig {
  // SQL Database (Supabase/PostgreSQL)
  sql: {
    url: string
    serviceKey: string
    anonKey: string
  }

  // Document Database (MongoDB)
  mongodb: {
    uri: string
    database: string
  }

  // Cache Database (Redis)
  redis: {
    url: string
    token?: string
  }
}

export const dbConfig: DatabaseConfig = {
  sql: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },
  mongodb: {
    uri: process.env.MONGODB_URI || "",
    database: process.env.MONGODB_DATABASE || "dentaledu",
  },
  redis: {
    url: process.env.REDIS_URL || "",
    token: process.env.REDIS_TOKEN,
  },
}
