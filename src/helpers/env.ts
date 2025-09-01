import { z } from 'zod';

const envSchema = z.object({
    UMBRACO_CLIENT_ID: z.string(),
    UMBRACO_CLIENT_SECRET: z.string(),
    UMBRACO_BASE_URL: z.string().url(),
    EXCLUDE_MANAGEMENT_TOOLS: z.string().optional()
        .transform((val) => val?.split(',').map(tool => tool.trim()))
        .pipe(z.array(z.string()).optional()),
    INCLUDE_MANAGEMENT_TOOLS: z.string().optional()
        .transform((val) => val?.split(',').map(tool => tool.trim()).filter(Boolean))
        .pipe(z.array(z.string()).optional()),
});

export default envSchema.parse(process.env);
