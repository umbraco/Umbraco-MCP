import { z } from 'zod';

const envSchema = z.object({
    UMBRACO_CLIENT_ID: z.string(),
    UMBRACO_CLIENT_SECRET: z.string(),
    UMBRACO_BASE_URL: z.string().url(),
    UMBRACO_EXCLUDE_TOOLS: z.string().optional()
        .transform((val) => val?.split(',').map(tool => tool.trim()))
        .pipe(z.array(z.string()).optional()),
    UMBRACO_INCLUDE_TOOLS: z.string().optional()
        .transform((val) => val?.split(',').map(tool => tool.trim()).filter(Boolean))
        .pipe(z.array(z.string()).optional()),
    
    // Collection-level filtering
    UMBRACO_INCLUDE_TOOL_COLLECTIONS: z.string().optional()
        .transform((val) => val?.split(',').map(collection => collection.trim()).filter(Boolean))
        .pipe(z.array(z.string()).optional()),
    UMBRACO_EXCLUDE_TOOL_COLLECTIONS: z.string().optional()
        .transform((val) => val?.split(',').map(collection => collection.trim()).filter(Boolean))
        .pipe(z.array(z.string()).optional()),
});

export default envSchema.parse(process.env);
