-- ============================================
-- RIMUOVI STRUTTURE DUPLICATE
-- ============================================
-- Questo script rimuove le strutture duplicate,
-- mantenendo solo la versione più recente di ciascuna
-- ============================================

-- Metodo 1: Rimuovi duplicati per nome, mantenendo solo la più recente
DELETE FROM accommodations
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY name 
        ORDER BY created_at DESC, updated_at DESC
      ) as rn
    FROM accommodations
    WHERE name IN ('Lucas Suite', 'Lucas Rooftop', 'Lucas Cottage')
  ) t
  WHERE t.rn > 1
);

-- Metodo 2: Se ci sono strutture con lo stesso nome ma ID diversi,
-- mantieni solo quelle con is_active = true e la più recente
DELETE FROM accommodations
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY name 
        ORDER BY 
          CASE WHEN is_active = true THEN 0 ELSE 1 END,
          created_at DESC,
          updated_at DESC
      ) as rn
    FROM accommodations
    WHERE name IN ('Lucas Suite', 'Lucas Rooftop', 'Lucas Cottage')
  ) t
  WHERE t.rn > 1
);

-- Metodo 3: Rimuovi tutte le strutture e poi reinseriscile (più pulito)
-- ATTENZIONE: Questo elimina TUTTE le strutture esistenti!
-- Decommentare solo se vuoi un reset completo

-- DELETE FROM accommodations WHERE name IN ('Lucas Suite', 'Lucas Rooftop', 'Lucas Cottage');

-- ============================================
-- VERIFICA RISULTATO
-- ============================================
-- Esegui questa query per vedere quante strutture rimangono:
SELECT 
  name, 
  COUNT(*) as count,
  STRING_AGG(id::text, ', ') as ids
FROM accommodations 
WHERE name IN ('Lucas Suite', 'Lucas Rooftop', 'Lucas Cottage')
GROUP BY name
HAVING COUNT(*) > 1;

-- Se questa query non restituisce risultati, non ci sono più duplicati!
-- Altrimenti, dovresti vedere solo 1 riga per struttura con count = 1

-- Query per vedere tutte le strutture finali:
SELECT id, name, subtitle, is_active, created_at, updated_at 
FROM accommodations 
WHERE name IN ('Lucas Suite', 'Lucas Rooftop', 'Lucas Cottage')
ORDER BY name, created_at DESC;

