import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';
import * as path from 'path';
import * as fs from 'fs';

export type CarStatus = 'AVAILABLE' | 'IN_USE' | 'UNAVAILABLE';
export type FuelType = 'Gasoline' | 'Diesel' | 'Hybrid' | 'Electric';

export interface Car {
  id: string;
  regisNumber: string;
  province: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  seats: number;
  fuelType: FuelType;
  status: CarStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class CarsService {
  private db: DatabaseSync;

  constructor(customDbPath?: string) {
    if (customDbPath) {
      this.db = new DatabaseSync(customDbPath);
      this.initTable();
      return;
    }

    const candidates = [
      path.resolve(process.cwd(), 'database', 'car.db'),
      path.resolve(process.cwd(), '..', 'database', 'car.db'),
    ];
    let dbPath = candidates.find((p) => fs.existsSync(p));

    if (!dbPath) {
      dbPath = candidates[1]; // default to ../database/car.db
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new DatabaseSync(dbPath);
    this.initTable();
  }

  private initTable() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS cars (
        id TEXT PRIMARY KEY,
        regisNumber TEXT NOT NULL,
        province TEXT NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        color TEXT NOT NULL,
        seats INTEGER NOT NULL,
        fuelType TEXT NOT NULL,
        status TEXT NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
      CREATE UNIQUE INDEX IF NOT EXISTS uq_cars_regis_prov ON cars(regisNumber, province);
      CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
      CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
    `);
  }

  findAll(search?: string, brand?: string, status?: string) {
    let query = 'SELECT * FROM cars WHERE 1=1 ORDER BY createdAt DESC';
    const stmt = this.db.prepare(query);
    const cars = stmt.all() as unknown as Car[];

    return {
      data: cars,
      total: cars.length,
    };
  }

  findOne(id: string): Car {
    const stmt = this.db.prepare('SELECT * FROM cars WHERE id = ?');
    const car = stmt.get(id) as unknown as Car | undefined;
    if (!car) throw new NotFoundException(`Car with ID "${id}" was not found.`);
    return car;
  }

  create(body: any): Car {
    const regisNumber = (body.regisNumber || body.registrationNumber || '').trim();
    if (!regisNumber) throw new BadRequestException('ทะเบียนรถยนต์ (Registration Number) is required.');
    if (!body.brand?.trim()) throw new BadRequestException('ยี่ห้อรถ (Brand) is required.');
    if (!body.model?.trim()) throw new BadRequestException('รุ่นรถ (Model) is required.');

    const province = (body.province || 'กรุงเทพมหานคร').trim();

    // Check duplicate plate within the same province
    const checkStmt = this.db.prepare('SELECT id FROM cars WHERE LOWER(regisNumber) = ? AND province = ?');
    const existing = checkStmt.get(regisNumber.toLowerCase(), province);
    if (existing) {
      throw new ConflictException(`ทะเบียนรถ "${regisNumber}" (${province}) มีอยู่ในระบบแล้ว`);
    }

    const now = new Date().toISOString();
    const newCar: Car = {
      id: body.id || `car-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      regisNumber,
      province,
      brand: body.brand.trim(),
      model: body.model.trim(),
      year: Number(body.year) || new Date().getFullYear(),
      color: body.color?.trim() || 'White',
      seats: Number(body.seats) || 5,
      fuelType: body.fuelType || 'Gasoline',
      status: body.status || 'AVAILABLE',
      notes: body.notes?.trim() || '',
      createdAt: now,
      updatedAt: now,
    };

    const insertStmt = this.db.prepare(`
      INSERT INTO cars (id, regisNumber, province, brand, model, year, color, seats, fuelType, status, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      newCar.id,
      newCar.regisNumber,
      newCar.province,
      newCar.brand,
      newCar.model,
      newCar.year,
      newCar.color,
      newCar.seats,
      newCar.fuelType,
      newCar.status,
      newCar.notes,
      newCar.createdAt,
      newCar.updatedAt,
    );

    return newCar;
  }

  update(id: string, body: any): Car {
    const car = this.findOne(id);
    const newReg = (body.regisNumber || body.registrationNumber || '').trim();
    const newProv = body.province !== undefined ? body.province.trim() : car.province;

    if (newReg && (newReg !== car.regisNumber || newProv !== car.province)) {
      const checkStmt = this.db.prepare('SELECT id FROM cars WHERE id != ? AND LOWER(regisNumber) = ? AND province = ?');
      const duplicate = checkStmt.get(id, newReg.toLowerCase(), newProv);
      if (duplicate) {
        throw new ConflictException(`ทะเบียนรถ "${newReg}" (${newProv}) มีอยู่ในระบบแล้ว`);
      }
      car.regisNumber = newReg;
    }

    if (body.province !== undefined) car.province = body.province.trim();
    if (body.brand !== undefined) car.brand = body.brand.trim();
    if (body.model !== undefined) car.model = body.model.trim();
    if (body.year !== undefined) car.year = Number(body.year);
    if (body.color !== undefined) car.color = body.color.trim();
    if (body.seats !== undefined) car.seats = Number(body.seats);
    if (body.fuelType !== undefined) car.fuelType = body.fuelType;
    if (body.status !== undefined) car.status = body.status;
    if (body.notes !== undefined) car.notes = body.notes.trim();
    car.updatedAt = new Date().toISOString();

    const updateStmt = this.db.prepare(`
      UPDATE cars
      SET regisNumber = ?, province = ?, brand = ?, model = ?, year = ?, color = ?, seats = ?, fuelType = ?, status = ?, notes = ?, updatedAt = ?
      WHERE id = ?
    `);

    updateStmt.run(
      car.regisNumber,
      car.province,
      car.brand,
      car.model,
      car.year,
      car.color,
      car.seats,
      car.fuelType,
      car.status,
      car.notes,
      car.updatedAt,
      id,
    );

    return car;
  }

  remove(id: string) {
    const car = this.findOne(id);
    const deleteStmt = this.db.prepare('DELETE FROM cars WHERE id = ?');
    deleteStmt.run(id);

    return {
      success: true,
      message: `Car "${car.brand} ${car.model}" (${car.regisNumber}) deleted successfully.`,
      deletedCar: car,
    };
  }

  getStats() {
    const stmt = this.db.prepare(`
      SELECT
        COUNT(*) AS total,
        COUNT(CASE WHEN status = 'AVAILABLE' THEN 1 END) AS available,
        COUNT(CASE WHEN status = 'IN_USE' THEN 1 END) AS inUse,
        COUNT(CASE WHEN status = 'UNAVAILABLE' THEN 1 END) AS unavailable
      FROM cars
    `);

    const result = stmt.get() as any;
    return {
      total: Number(result?.total || 0),
      available: Number(result?.available || 0),
      inUse: Number(result?.inUse || 0),
      unavailable: Number(result?.unavailable || 0),
    };
  }
}
