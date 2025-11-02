import { neon } from "@neondatabase/serverless";

export function getDb() {
	const url = process.env.DATABASE_URL;
	if (!url) return null;
	return neon(url);
}

export const isDbEnabled = () => Boolean(process.env.DATABASE_URL);

export const schemaSql = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  excerpt text DEFAULT '',
  cover_image text DEFAULT '',
  author text DEFAULT '',
  categories text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  meta_title text DEFAULT NULL,
  meta_description text DEFAULT NULL,
  canonical_url text DEFAULT NULL,
  is_indexed boolean NOT NULL DEFAULT false,
  published_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_published_at_idx ON posts (published_at DESC);
`;


