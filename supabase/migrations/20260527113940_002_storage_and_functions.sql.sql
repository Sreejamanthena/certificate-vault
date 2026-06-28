/*
  # Add increment_share_count function and storage bucket

  1. Create increment_share_count function for atomic updates
  2. Create certificates storage bucket (public access for share links)
*/

-- Create increment function for share count
CREATE OR REPLACE FUNCTION increment_share_count(row_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE certificates
  SET share_count = share_count + 1
  WHERE id = row_id
  RETURNING share_count INTO new_count;
  
  RETURN new_count;
END;
$$;

-- Create storage bucket for certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload
CREATE POLICY "Users can upload certificates"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy to allow users to delete their own uploads
CREATE POLICY "Users can delete own certificates"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy to allow public access (for shared certificates)
CREATE POLICY "Public can view certificates"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'certificates');
