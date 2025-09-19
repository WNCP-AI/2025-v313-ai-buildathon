-- Compute and update provider.rating after reviews are inserted/updated

CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
DECLARE
  provider_uuid UUID;
  avg_rating DECIMAL(3,2);
BEGIN
  -- Find provider for the reviewed profile (reviewed_id is profiles.id which maps to providers.user_id)
  SELECT p.id INTO provider_uuid
  FROM providers p
  WHERE p.user_id = NEW.reviewed_id;

  IF provider_uuid IS NOT NULL THEN
    SELECT ROUND(AVG(r.rating)::numeric, 2) INTO avg_rating
    FROM reviews r
    WHERE r.reviewed_id = NEW.reviewed_id;

    UPDATE providers 
    SET rating = COALESCE(avg_rating, 0.00)
    WHERE id = provider_uuid;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_provider_rating_trigger ON reviews;
CREATE TRIGGER update_provider_rating_trigger
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_rating();


