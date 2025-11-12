-- Add admin policies for structures table
-- This allows admins to view, update, and delete ALL structures

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Admins can view all structures" ON public.structures;
DROP POLICY IF EXISTS "Admins can update all structures" ON public.structures;
DROP POLICY IF EXISTS "Admins can delete all structures" ON public.structures;

-- Policy: Admins can view ALL structures (pending, approved, rejected)
CREATE POLICY "Admins can view all structures"
    ON public.structures
    FOR SELECT
    USING (
        auth.jwt() ->> 'email' = 'lucacorrao96@gmail.com'
    );

-- Policy: Admins can update ALL structures (for approval/rejection)
CREATE POLICY "Admins can update all structures"
    ON public.structures
    FOR UPDATE
    USING (
        auth.jwt() ->> 'email' = 'lucacorrao96@gmail.com'
    )
    WITH CHECK (
        auth.jwt() ->> 'email' = 'lucacorrao96@gmail.com'
    );

-- Policy: Admins can delete ALL structures
CREATE POLICY "Admins can delete all structures"
    ON public.structures
    FOR DELETE
    USING (
        auth.jwt() ->> 'email' = 'lucacorrao96@gmail.com'
    );

