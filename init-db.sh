#!/bin/bash
set -e

# Create the database and user dynamically
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE pms;
    CREATE USER pms WITH PASSWORD 'pms';
    ALTER ROLE pms SET client_encoding TO 'utf8';
    ALTER ROLE pms SET default_transaction_isolation TO 'read committed';
    ALTER ROLE pms SET timezone TO 'UTC';
    GRANT ALL PRIVILEGES ON DATABASE pms TO pms;
EOSQL

# Optionally, create tables or run additional SQL scripts here if needed
