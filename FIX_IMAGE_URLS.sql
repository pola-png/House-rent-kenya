-- Fix image URLs by replacing spaces with %20
-- Run this in Supabase SQL Editor

UPDATE properties
SET images = ARRAY(
  SELECT regexp_replace(unnest(images), ' ', '%20', 'g')
)
WHERE images::text LIKE '%wasabisys.com%' 
AND images::text LIKE '% %';

-- Verify the fix
SELECT id, title, images FROM properties WHERE images::text LIKE '%wasabisys.com%' LIMIT 5;
