-- Fix admin policies using correct Supabase auth functions

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can view all structures" ON public.structures;
DROP POLICY IF EXISTS "Admins can update all structures" ON public.structures;
DROP POLICY IF EXISTS "Admins can delete all structures" ON public.structures;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'lucacorrao96@gmail.com'
  ) IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy: Admins can view ALL structures
CREATE POLICY "Admins can view all structures"
    ON public.structures
    FOR SELECT
    USING (is_admin());

-- Policy: Admins can update ALL structures
CREATE POLICY "Admins can update all structures"
    ON public.structures
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- Policy: Admins can delete ALL structures
CREATE POLICY "Admins can delete all structures"
    ON public.structures
    FOR DELETE
    USING (is_admin());

