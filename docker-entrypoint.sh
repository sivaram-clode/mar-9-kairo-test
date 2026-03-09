#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

if [ "$SEED_DB" = "true" ]; then
  echo "Seeding database..."
  npx tsx prisma/seed.ts
fi

echo "Starting application..."
node server.js
