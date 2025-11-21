# Database Directory

This directory contains database-related files for the StatsGames application.

## Structure

```
database/
└── seeds/
    └── games.sql     # SQL script to seed initial games data
```

## Seeds

The `seeds/` directory contains SQL scripts to populate the database with initial data

### games.sql

This file contains INSERT statements to add the following games to the `games` table:
- Rocket League
- Fortnite
- Clash Royale

To run this seed file:

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Navigate to SQL Editor
3. Copy and paste the contents of `seeds/games.sql`
4. Click "Run" to execute

The SQL uses `ON CONFLICT (slug) DO NOTHING` to ensure idempotency - you can run the script multiple times without creating duplicates.

## Adding More Seeds

To add more seed data:

1. Create a new SQL file in the `seeds/` directory (e.g., `users.sql`)
2. Add your INSERT statements
3. Use `ON CONFLICT` clauses to make the scripts idempotent
4. Document the file in this README

## Notes

- All SQL files should be PostgreSQL-compatible (Supabase uses PostgreSQL)
- Use the `public` schema for all application tables
- Follow the naming convention: `table_name.sql`
- Always include comments explaining what the seed data does
