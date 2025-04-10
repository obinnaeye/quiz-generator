#!/bin/sh

echo "Running database seed script inside the container..."

cd /server || exit

python -m app.seed

echo "Database seeding process completed!"
