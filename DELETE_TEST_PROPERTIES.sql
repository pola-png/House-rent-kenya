-- Delete test properties with Wasabi images that have spaces in filenames
-- Run this in Supabase SQL Editor

DELETE FROM properties 
WHERE images::text LIKE '%wasabisys.com%' 
AND images::text LIKE '% %';

-- Verify deletion
SELECT COUNT(*) as remaining_properties FROM properties;
