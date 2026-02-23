/*
  # Add Video Sections Table

  1. New Tables
    - `video_sections`
      - `id` (uuid, primary key)
      - `video_url` (text) - URL or path to video file
      - `poster_url` (text) - Thumbnail/poster image
      - `title` (text) - Overlay title text
      - `subtitle` (text) - Overlay subtitle text
      - `autoplay` (boolean) - Auto-play setting
      - `loop` (boolean) - Loop setting
      - `muted` (boolean) - Muted setting
      - `is_active` (boolean) - Whether section is active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `video_sections` table
    - Add policy for public read access
    - Add policy for admin write access
*/

CREATE TABLE IF NOT EXISTS video_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url text NOT NULL,
  poster_url text,
  title text,
  subtitle text,
  autoplay boolean DEFAULT true,
  loop boolean DEFAULT true,
  muted boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE video_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active video sections"
  ON video_sections FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can insert video sections"
  ON video_sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update video sections"
  ON video_sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete video sections"
  ON video_sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Insert default video section
INSERT INTO video_sections (video_url, poster_url, title, subtitle)
VALUES (
  'https://assets.mixkit.co/videos/preview/mixkit-clothing-store-interior-27611-large.mp4',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop',
  'EOMC',
  'EYES OPEN MOUTHS CLOSED'
)
ON CONFLICT DO NOTHING;