----------------------------------------------------------------------------------------------------------------
-- Body shapes.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for body_shapes
DROP SEQUENCE IF EXISTS body_shapes_id_seq CASCADE;
DROP TABLE IF EXISTS body_shapes;

-- This table contains the body shapes.
CREATE TABLE body_shapes (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

-- Insert body shapes data.
INSERT INTO body_shapes (id, name) VALUES
  (1, 'Inverted Triangle'),
  (2, 'Rectangle'),
  (3, 'Apple'),
  (4, 'Pear'),
  (5, 'Hourglass');

SELECT setval(pg_get_serial_sequence('body_shapes', 'id'), (SELECT MAX(id) FROM body_shapes));

----------------------------------------------------------------------------------------------------------------
-- Colour types.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for colour_types
DROP SEQUENCE IF EXISTS colour_types_id_seq CASCADE;
DROP TABLE IF EXISTS colour_types;

-- This table contains the colour types.
CREATE TABLE colour_types (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

-- Insert body shapes data.
INSERT INTO colour_types (id, name) VALUES
  (1, 'Black'),
  (2, 'White'),
  (3, 'Accent'),
  (4, 'Dark'),
  (5, 'Light'),
  (6, 'Navy Blue'),
  (7, 'Denim'),
  (8, 'Gold'),
  (9, 'Nude');

SELECT setval(pg_get_serial_sequence('colour_types', 'id'), (SELECT MAX(id) FROM colour_types));

----------------------------------------------------------------------------------------------------------------
-- Pattern types.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for pattern types
DROP SEQUENCE IF EXISTS pattern_types_id_seq CASCADE;
DROP TABLE IF EXISTS pattern_types;

-- This table contains the pattern types.
CREATE TABLE pattern_types (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

-- Insert body shapes data.
INSERT INTO pattern_types (id, name) VALUES
  (1, 'Plain'),
  (2, 'Print');

SELECT setval(pg_get_serial_sequence('pattern_types', 'id'), (SELECT MAX(id) FROM pattern_types));

----------------------------------------------------------------------------------------------------------------
-- Clothing categories.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for categories
DROP SEQUENCE IF EXISTS categories_id_seq CASCADE;
DROP TABLE IF EXISTS categories;

-- This table contains the clothing categories.
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

-- Insert clothing categories data.
INSERT INTO categories (id, name) VALUES
  (1, 'Tops'),
  (2, 'Bottoms'),
  (3, 'Dresses'),
  (4, 'Layers'),
  (5, 'Bags'),
  (6, 'Shoes');

SELECT setval(pg_get_serial_sequence('categories', 'id'), (SELECT MAX(id) FROM categories));

----------------------------------------------------------------------------------------------------------------
-- Clothing subcategories.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for subcategories
DROP SEQUENCE IF EXISTS subcategories_id_seq CASCADE;
DROP TABLE IF EXISTS subcategories;

-- This table contains the clothing sub-categories.
CREATE TABLE subcategories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL,
  "name" VARCHAR(50) NOT NULL
);

-- Insert clothing categories data.
INSERT INTO subcategories (id, category_id, name) VALUES
  -- Top subcategories.
  (1001, 1, 'Basics'),
  (1002, 1, 'Blouse'),
  -- Bottoms subcategories.
  (2001, 2, 'Tailored Pants'),
  (2002, 2, 'Casual Pants'),
  (2003, 2, 'Denim Jeans'),
  (2004, 2, 'Tailored Skirt'),
  (2005, 2, 'Casual Skirt'),
  (2006, 2, 'Casual Shorts'),
  -- Dresses subcategories.
  (3001, 3, 'Little Dress'),
  (3002, 3, 'Casual Dress'),
  -- Layers subcategories.
  (4001, 4, 'Blazer'),
  (4002, 4, 'Cardigan'),
  (4003, 4, 'Casual Jacket'),
  -- Bags subcategories.
  (5001, 5, 'Clutch'),
  (5002, 5, 'Tote'),
  -- Shoes subcategories.
  (6001, 6, 'Ballet Flats'),
  (6002, 6, 'Pumps'),
  (6003, 6, 'Strappy Heels'),
  (6004, 6, 'Gold Strappy Sandals'),
  (6005, 6, 'Wedges');

SELECT setval(pg_get_serial_sequence('subcategories', 'id'), (SELECT MAX(id) FROM subcategories));

----------------------------------------------------------------------------------------------------------------
-- Necklines.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for necklines.
DROP TABLE IF EXISTS necklines;

-- This table contains the necklines.
CREATE TABLE necklines (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

-- Insert necklines data.
INSERT INTO necklines (id, name) VALUES
  (1, 'V / Wrap / Surplice'),
  (2, 'Deep V'),
  (3, 'Scoop'),
  (4, 'Sweetheart'),
  (5, 'Cowl'),
  (6, 'Asymmetrical / One-Shoulder'),
  (7, 'Asymmetrical');

SELECT setval(pg_get_serial_sequence('necklines', 'id'), (SELECT MAX(id) FROM necklines));

----------------------------------------------------------------------------------------------------------------
-- Top sleeve types.
----------------------------------------------------------------------------------------------------------------

-- Drop tab for top sleeve types
DROP TABLE IF EXISTS top_sleeve_types;

-- This table contains the top sleeve types.
CREATE TABLE top_sleeve_types (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

-- Insert top sleeve types data.
INSERT INTO top_sleeve_types (id, name) VALUES
  (1, 'Sleeveless'),
  (2, 'Normal'),
  (3, 'Elbow'),
  (4, 'Three-quarter'),
  (5, 'Full');

SELECT setval(pg_get_serial_sequence('top_sleeve_types', 'id'), (SELECT MAX(id) FROM top_sleeve_types));

----------------------------------------------------------------------------------------------------------------
-- Blouse sleeve types.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for blouse sleeve types
DROP TABLE IF EXISTS blouse_sleeve_types;

-- This table contains the blouse sleeve types.
CREATE TABLE blouse_sleeve_types (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

-- Insert blouse sleeve types data.
INSERT INTO blouse_sleeve_types (id, name) VALUES
  (1, 'Sleeveless'),
  (2, 'Cap'),
  (3, 'Half Sleeve'),
  (4, 'Full');

SELECT setval(pg_get_serial_sequence('blouse_sleeve_types', 'id'), (SELECT MAX(id) FROM blouse_sleeve_types));

----------------------------------------------------------------------------------------------------------------
-- Bottom cuts.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for bottom cuts.
DROP TABLE IF EXISTS bottom_cuts;

-- This table contains the bottom cuts.
CREATE TABLE bottom_cuts (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

-- Insert bottom cuts data.
INSERT INTO bottom_cuts (id, name) VALUES
  (1, 'Wide-leg'),
  (2, 'Bootcut / Flared');

SELECT setval(pg_get_serial_sequence('bottom_cuts', 'id'), (SELECT MAX(id) FROM bottom_cuts));

----------------------------------------------------------------------------------------------------------------
-- Dress cuts.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for dress cuts.
DROP TABLE IF EXISTS dress_cuts;

-- This table contains the dress cuts.
CREATE TABLE dress_cuts (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

-- Insert dress cuts data.
INSERT INTO dress_cuts (id, name) VALUES
  (1, 'Fit-and-flare'),
  (2, 'Mermaid');

SELECT setval(pg_get_serial_sequence('dress_cuts', 'id'), (SELECT MAX(id) FROM dress_cuts));

----------------------------------------------------------------------------------------------------------------
-- Short cuts.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for short cuts.
DROP TABLE IF EXISTS short_cuts;

-- This table contains the short cuts.
CREATE TABLE short_cuts (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

-- Insert short cuts data.
INSERT INTO short_cuts (id, name) VALUES
  (1, 'Short'),
  (2, 'Bermuda');

SELECT setval(pg_get_serial_sequence('short_cuts', 'id'), (SELECT MAX(id) FROM short_cuts));

----------------------------------------------------------------------------------------------------------------
-- Skirt cuts.
----------------------------------------------------------------------------------------------------------------

-- Drop table for skirt cuts.
DROP TABLE IF EXISTS skirt_cuts;

-- This table contains the skirt cuts.
CREATE TABLE skirt_cuts (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

-- Insert skirt cuts data.
INSERT INTO skirt_cuts (id, name) VALUES
  (1, 'A-line'),
  (2, 'Mermaid'),
  (3, 'Pleated');

SELECT setval(pg_get_serial_sequence('skirt_cuts', 'id'), (SELECT MAX(id) FROM skirt_cuts));

----------------------------------------------------------------------------------------------------------------
-- Clothing items.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for clothing items.
DROP TABLE IF EXISTS clothing_items;

-- This table contains the clothing items.
CREATE TABLE clothing_items (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  subcategory_id INTEGER NOT NULL,
  colour_type_id INTEGER,
  pattern_type_id INTEGER
);

-- Insert clothing items data.
INSERT INTO clothing_items (id, name, subcategory_id, colour_type_id, pattern_type_id) VALUES
  (1, 'T-shirt', 1001, 1, 1),
  (2, 'T-shirt', 1001, 1, 1),
  (3, 'T-shirt', 1001, 1, 1),
  (4, 'T-shirt', 1001, 1, 1),
  (5, 'T-shirt', 1001, 1, 1),
  (6, 'T-shirt', 1001, 1, 1),
  (7, 'T-shirt', 1001, 1, 1),
  (8, 'T-shirt', 1001, 1, 1);

SELECT setval(pg_get_serial_sequence('clothing_items', 'id'), (SELECT MAX(id) FROM clothing_items));

----------------------------------------------------------------------------------------------------------------
-- Clothing variants.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for clothing variants.
DROP TABLE IF EXISTS clothing_variants;

-- This table contains the clothing variants.
CREATE TABLE clothing_variants (
  id SERIAL PRIMARY KEY,
  clothing_item_id INTEGER NOT NULL,
  top_sleeve_type_id INTEGER,
  blouse_sleeve_type_id INTEGER,
  neckline_id INTEGER,
  dress_cut_id INTEGER,
  bottom_cut_id INTEGER,
  short_cut_id INTEGER,
  skirt_cut_id INTEGER,
  image_file_name VARCHAR(255) NOT NULL
);

SELECT setval(pg_get_serial_sequence('clothing_variants', 'id'), (SELECT MAX(id) FROM clothing_variants));

----------------------------------------------------------------------------------------------------------------
-- Users.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for users.
DROP TABLE IF EXISTS users;

-- This table contains the users.
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(255) NULL,
	username VARCHAR(255) NULL,
	body_shape_id INTEGER NULL,
	"name" VARCHAR NULL,
	clerk_id VARCHAR NULL,
	onboarded BOOLEAN DEFAULT FALSE NULL
);

SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));

----------------------------------------------------------------------------------------------------------------
-- User clothing variants.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for user clothing variants.
DROP TABLE IF EXISTS user_clothing_variants;

-- This table contains the users.
CREATE TABLE user_clothing_variants (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	clothing_variant_id INTEGER NOT NULL
);

SELECT setval(pg_get_serial_sequence('user_clothing_variants', 'id'), (SELECT MAX(id) FROM user_clothing_variants));

----------------------------------------------------------------------------------------------------------------
-- User outfits.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for user outfits.
DROP TABLE IF EXISTS user_outfits;

-- This table contains the users.
CREATE TABLE user_outfits (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	grouptype_id INTEGER NOT NULL
);

SELECT setval(pg_get_serial_sequence('user_outfits', 'id'), (SELECT MAX(id) FROM user_outfits));

----------------------------------------------------------------------------------------------------------------
-- User outfit items.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for user outfit items.
DROP TABLE IF EXISTS user_outfit_items;

-- This table contains the outfit items.
CREATE TABLE user_outfit_items (
	outfit_id INTEGER NOT NULL,
	clothing_variant_id INTEGER NOT NULL,
	PRIMARY KEY (outfit_id, clothing_variant_id)
);

----------------------------------------------------------------------------------------------------------------
-- Default clothing variants.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for default clothing variants.
DROP TABLE IF EXISTS default_clothing_variants;

-- This table contains the default clothing variants.
CREATE TABLE default_clothing_variants (
  body_shape_id INTEGER NOT NULL,
	clothing_variant_id INTEGER NOT NULL,
  PRIMARY KEY (body_shape_id, clothing_variant_id)
);

INSERT INTO default_clothing_variants (body_shape_id, clothing_variant_id) VALUES
  (1, 4),
  (1, 59),
  (1, 74),
  (1, 95),
  (1, 119),
  (1, 124),
  (1, 149),
  (1, 155),
  (1, 158),
  (1, 160),
  (1, 161),
  (1, 163),
  (1, 165),
  (1, 168),
  (1, 172),
  (1, 176),
  (1, 180),
  (1, 181),
  (1, 182),
  (1, 183),
  (1, 184),
  (1, 185),
  (1, 186),
  (1, 187),
  (1, 188),
  (1, 190),
  (1, 191);

----------------------------------------------------------------------------------------------------------------
-- User saved outfits.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for user saved outfits.
DROP TABLE IF EXISTS user_saved_outfits;

-- This table contains the user saved outfits.
CREATE TABLE user_saved_outfits (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
  top_variant_id INTEGER,
  bottom_variant_id INTEGER,
  dress_variant_id INTEGER,
  layer_variant_id INTEGER,
  bag_variant_id INTEGER,
  shoe_variant_id INTEGER,
  outfit_key VARCHAR(100) NOT NULL);

CREATE INDEX ON user_saved_outfits (user_id, outfit_key);

