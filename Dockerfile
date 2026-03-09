FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --include=dev

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
# Bundle seed script to plain JS so tsx isn't needed at runtime
RUN npx esbuild prisma/seed.ts --bundle --platform=node --outfile=prisma/seed.js --external:@prisma/client --external:bcryptjs
# Remove duplicate engine binaries from prisma CLI to save space
RUN rm -f node_modules/prisma/libquery_engine-* node_modules/prisma/libquery_engine-* 2>/dev/null; \
    rm -f node_modules/@prisma/engines/*.node 2>/dev/null; \
    true

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
# Copy only the runtime dependencies we need
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs

COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh && \
    mkdir -p /home/nextjs/.npm && chown -R nextjs:nodejs /home/nextjs

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["sh", "./docker-entrypoint.sh"]
