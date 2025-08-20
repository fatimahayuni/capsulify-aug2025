-- Create table for saved uploaded outfits
CREATE TABLE IF NOT EXISTS user_saved_uploaded_outfits (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    outfit_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, outfit_key)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_saved_uploaded_outfits_user_id ON user_saved_uploaded_outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_uploaded_outfits_outfit_key ON user_saved_uploaded_outfits(outfit_key);
