-- Calendar pricing and iCal sync (admin only)

-- Keep admin helper aligned with app-side admin emails
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email
    FROM auth.users
    WHERE id = auth.uid()
      AND email IN (
        'lucacorrao1996@gmail.com',
        'lucacorrao96@outlook.it',
        'luca@metatech.dev',
        'lucacorrao1996@outlook.com',
        'luca@lucacorrao.com'
      )
  ) IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TABLE IF NOT EXISTS public.price_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_slug TEXT NOT NULL,
  date DATE NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(property_slug, date)
);

CREATE TABLE IF NOT EXISTS public.calendar_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_slug TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'airbnb', 'booking', 'ical_import', 'booking_record')),
  external_uid TEXT,
  summary TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date > start_date)
);

CREATE TABLE IF NOT EXISTS public.calendar_sync_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_slug TEXT NOT NULL,
  source_name TEXT NOT NULL CHECK (source_name IN ('airbnb', 'booking', 'ical_import')),
  ical_url TEXT NOT NULL,
  last_synced_at TIMESTAMPTZ,
  last_status TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(property_slug, source_name)
);

CREATE INDEX IF NOT EXISTS idx_price_overrides_property_date ON public.price_overrides(property_slug, date);
CREATE INDEX IF NOT EXISTS idx_calendar_blocks_property_dates ON public.calendar_blocks(property_slug, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_calendar_blocks_source ON public.calendar_blocks(source);
CREATE INDEX IF NOT EXISTS idx_calendar_sync_sources_property ON public.calendar_sync_sources(property_slug);

ALTER TABLE public.price_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_sync_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage price_overrides" ON public.price_overrides;
DROP POLICY IF EXISTS "Admins manage calendar_blocks" ON public.calendar_blocks;
DROP POLICY IF EXISTS "Admins manage calendar_sync_sources" ON public.calendar_sync_sources;

CREATE POLICY "Admins manage price_overrides"
  ON public.price_overrides
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins manage calendar_blocks"
  ON public.calendar_blocks
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins manage calendar_sync_sources"
  ON public.calendar_sync_sources
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

DROP TRIGGER IF EXISTS trigger_price_overrides_updated_at ON public.price_overrides;
CREATE TRIGGER trigger_price_overrides_updated_at
  BEFORE UPDATE ON public.price_overrides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_calendar_blocks_updated_at ON public.calendar_blocks;
CREATE TRIGGER trigger_calendar_blocks_updated_at
  BEFORE UPDATE ON public.calendar_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_calendar_sync_sources_updated_at ON public.calendar_sync_sources;
CREATE TRIGGER trigger_calendar_sync_sources_updated_at
  BEFORE UPDATE ON public.calendar_sync_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

