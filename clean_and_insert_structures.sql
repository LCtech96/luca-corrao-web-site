-- ============================================
-- PULIZIA E INSERIMENTO STRUTTURE
-- ============================================
-- Questo script:
-- 1. Elimina tutte le strutture duplicate
-- 2. Reinserisce le tre strutture con ID fissi
-- ============================================

-- STEP 1: Elimina tutte le strutture esistenti con questi nomi
DELETE FROM accommodations 
WHERE name IN ('Lucas Suite', 'Lucas Rooftop', 'Lucas Cottage');

-- STEP 2: Inserisci Lucas Suite
INSERT INTO accommodations (
  id,
  name,
  subtitle,
  description,
  address,
  distance,
  capacity,
  features,
  highlight,
  main_image,
  images,
  image_descriptions,
  price,
  cleaning_fee,
  pets_allowed,
  owner,
  rating,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Lucas Suite',
  'Modernità e Comfort nel Cuore di Terrasini',
  'Lucas Suite è un gioiello nel centro di Terrasini, dove la storia si fonde con il comfort moderno. A soli 30 metri da Piazza Duomo e 350 metri dal mare, questa suite elegante è caratterizzata da splendidi affreschi storici sui soffitti che raccontano la storia siciliana, abbinati a comfort contemporanei per un''esperienza indimenticabile.',
  'Terrasini, Palermo, Sicilia',
  '30m da Piazza Duomo • 350m dal mare',
  '2 persone',
  ARRAY['Affreschi storici', 'Design moderno', 'Centro storico', 'Romantica', 'WiFi gratuito', 'Climatizzatore', 'Macchina del caffè', 'Acqua calda garantita'],
  'Affreschi storici unici',
  '/images/bedroom-historic-1.jpg',
  ARRAY[
    '/images/bedroom-historic-1.jpg',
    '/images/bedroom-historic-2.jpg',
    '/images/ceiling-fresco-1.jpg',
    '/images/bathroom-modern.jpg'
  ],
  ARRAY[
    'Camera da letto con affreschi storici',
    'Vista panoramica dalla camera',
    'Affreschi originali del XVIII secolo',
    'Bagno moderno e funzionale'
  ],
  '€95/notte',
  25.00,
  false,
  'Luca Corrao',
  5.0,
  true
);

-- STEP 3: Inserisci Lucas Rooftop
INSERT INTO accommodations (
  id,
  name,
  subtitle,
  description,
  address,
  distance,
  capacity,
  features,
  highlight,
  main_image,
  images,
  image_descriptions,
  price,
  cleaning_fee,
  pets_allowed,
  pet_supplement,
  owner,
  rating,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'Lucas Rooftop',
  'Intimità con Vista a Terrasini',
  'Lucas Rooftop è un rifugio moderno nel cuore di Terrasini, perfetto per chi cerca l''equilibrio tra comfort urbano e relax mediterraneo. A soli 50 metri da Piazza Duomo e 300 metri dal mare, questa struttura offre un''esperienza unica con la sua splendida terrazza panoramica che si affaccia sul centro storico e il mare.',
  'Terrasini, Palermo, Sicilia',
  '50m da Piazza Duomo • 300m dal mare',
  '4+1 persone',
  ARRAY['Terrazza panoramica', 'Lavatrice inclusa', 'Spazio ampio', 'Vista mare', 'Pet-friendly', 'WiFi gratuito', 'Climatizzatore', 'Macchinetta del caffè', 'Acqua calda'],
  'Terrazza panoramica mozzafiato',
  '/images/lucas-rooftop-terrace.jpg',
  ARRAY[
    '/images/lucas-rooftop-terrace.jpg',
    '/images/lucas-rooftop-bedroom-1.jpg',
    '/images/lucas-rooftop-bedroom-2.jpg',
    '/images/lucas-rooftop-kitchen.jpg',
    '/images/lucas-rooftop-bathroom.jpg',
    '/images/lucas-rooftop-terrace-raw.jpg'
  ],
  ARRAY[
    'Terrazza panoramica con vista mare',
    'Camera da letto principale',
    'Seconda camera con letto matrimoniale e singolo',
    'Cucina completamente attrezzata',
    'Bagno moderno e spazioso',
    'Vista panoramica dalla terrazza'
  ],
  '€120/notte',
  25.00,
  true,
  20.00,
  'Luca Corrao',
  5.0,
  true
);

-- STEP 4: Inserisci Lucas Cottage
INSERT INTO accommodations (
  id,
  name,
  subtitle,
  description,
  address,
  distance,
  capacity,
  features,
  highlight,
  main_image,
  images,
  image_descriptions,
  price,
  cleaning_fee,
  pets_allowed,
  owner,
  rating,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000003'::uuid,
  'Lucas Cottage',
  'Tranquillità e Natura a Trappeto',
  'Lucas Cottage è un paradiso di tranquillità immerso nella campagna siciliana, a soli 5 minuti dal mare e 25 minuti dall''aeroporto di Palermo. Perfetto per chi cerca privacy e relax, questo cottage rustico-chic vanta una piscina privata con vista panoramica sulla natura incontaminata. Ideale come base per esplorare Castellammare del Golfo, Scopello e la magnifica Riserva dello Zingaro.',
  'Trappeto, Palermo, Sicilia',
  '25 min dall''aeroporto • 5 min dal mare',
  '4 persone',
  ARRAY['Piscina privata', 'Self check-in', 'Aria condizionata', 'WiFi gratuito', 'Parcheggio gratuito', 'Vista panoramica', 'Giardino privato', 'Area BBQ esterna'],
  'Piscina privata e vista panoramica',
  '/images/lucas-cottage-exterior-1.jpg',
  ARRAY[
    '/images/lucas-cottage-exterior-1.jpg',
    '/images/lucas-cottage-interior-1.jpg',
    '/images/lucas-cottage-interior-2.jpg',
    '/images/lucas-cottage-pool-1.jpg',
    '/images/lucas-cottage-pool-2.jpg',
    '/images/lucas-cottage-exterior-2.jpg',
    '/images/lucas-cottage-pool-front.jpg'
  ],
  ARRAY[
    'Vista esterna del cottage',
    'Interno rustico-chic',
    'Camera da letto con 2 letti matrimoniali',
    'Piscina privata con vista panoramica',
    'Area relax intorno alla piscina',
    'Giardino e area esterna',
    'Vista frontale della piscina'
  ],
  '€140/notte',
  30.00,
  false,
  'Luca Corrao',
  5.0,
  true
);

-- ============================================
-- VERIFICA FINALE
-- ============================================
-- Esegui questa query per verificare che ci siano esattamente 3 strutture:
SELECT 
  id, 
  name, 
  subtitle, 
  is_active, 
  created_at 
FROM accommodations 
WHERE name IN ('Lucas Suite', 'Lucas Rooftop', 'Lucas Cottage')
ORDER BY name;

-- Dovresti vedere esattamente 3 righe, una per struttura!

