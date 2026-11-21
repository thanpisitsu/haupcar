CREATE TABLE IF NOT EXISTS cars (
  id TEXT PRIMARY KEY,
  regisNumber TEXT NOT NULL,
  province TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT NOT NULL,
  seats INTEGER NOT NULL,
  fuelType TEXT NOT NULL CHECK(fuelType IN ('Gasoline', 'Diesel', 'Hybrid', 'Electric')),
  status TEXT NOT NULL CHECK(status IN ('AVAILABLE', 'IN_USE', 'UNAVAILABLE')),
  notes TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Unique index ensuring no duplicate registration number in the same province
CREATE UNIQUE INDEX IF NOT EXISTS uq_cars_regis_province ON cars(regisNumber, province);

-- Indexes for search and filter performance
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);

-- Initial seed data (Mr. Somchai's fleet)
INSERT OR IGNORE INTO cars (id, regisNumber, province, brand, model, year, color, seats, fuelType, status, notes, createdAt, updatedAt)
VALUES
  ('car-001', '1กข 1234', 'กรุงเทพมหานคร', 'Toyota', 'Yaris Ativ', 2023, 'White', 5, 'Gasoline', 'AVAILABLE', 'Mr. Somchai notebook entry #1 - Main office pool car', '2026-01-10T08:30:00.000Z', '2026-01-10T08:30:00.000Z'),
  ('car-002', '2ขค 5678', 'กรุงเทพมหานคร', 'Honda', 'Civic RS', 2022, 'Crystal Black', 5, 'Gasoline', 'IN_USE', 'Assigned to Marketing Team for client visits', '2026-01-12T09:15:00.000Z', '2026-01-15T14:20:00.000Z'),
  ('car-003', '3งจ 9012', 'กรุงเทพมหานคร', 'BYD', 'Atto 3', 2023, 'Sky Blue', 5, 'Electric', 'AVAILABLE', '100% Electric - Haup station RFID charging card in glovebox', '2026-02-01T11:00:00.000Z', '2026-02-01T11:00:00.000Z'),
  ('car-004', '4ฉช 3456', 'นนทบุรี', 'Isuzu', 'D-Max Hi-Lander', 2021, 'Silver', 4, 'Diesel', 'UNAVAILABLE', 'Scheduled for 50,000 km brake pad & suspension inspection', '2026-02-05T10:45:00.000Z', '2026-02-18T16:30:00.000Z'),
  ('car-005', '5ซฌ 7890', 'ชลบุรี', 'MG', 'EP Plus', 2022, 'Arctic White', 5, 'Electric', 'AVAILABLE', 'Stationed at Haupcar Chonburi branch station', '2026-02-10T13:20:00.000Z', '2026-02-10T13:20:00.000Z'),
  ('car-006', '6ญฎ 4567', 'กรุงเทพมหานคร', 'Tesla', 'Model Y', 2024, 'Midnight Silver', 5, 'Electric', 'IN_USE', 'Executive vehicle for management meetings', '2026-02-14T09:00:00.000Z', '2026-02-14T09:00:00.000Z');
