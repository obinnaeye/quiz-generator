#!/bin/sh

echo "Running database restoreDataSeed script inside the container..."

cd /server || exit

python -m app.restoreDataSeed

echo "Database seeding process completed!"
