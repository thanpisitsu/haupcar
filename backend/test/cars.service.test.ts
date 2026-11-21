import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { CarsService } from '../dist/cars/cars.service.js';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('CarsService (Unit Tests)', () => {
  let service: CarsService;

  beforeEach(() => {
    // Uses an isolated in-memory SQLite database for each test
    service = new CarsService(':memory:');
  });

  describe('create()', () => {
    it('should create a car successfully with valid input', () => {
      const car = service.create({
        regisNumber: '1กข 1234',
        province: 'กรุงเทพมหานคร',
        brand: 'Toyota',
        model: 'Yaris Ativ',
        year: 2023,
        color: 'White',
        seats: 5,
        fuelType: 'Gasoline',
        status: 'AVAILABLE',
        notes: 'Company pool car',
      });

      assert.ok(car.id);
      assert.equal(car.regisNumber, '1กข 1234');
      assert.equal(car.province, 'กรุงเทพมหานคร');
      assert.equal(car.brand, 'Toyota');
      assert.equal(car.model, 'Yaris Ativ');
      assert.equal(car.status, 'AVAILABLE');
      assert.ok(car.createdAt);
      assert.ok(car.updatedAt);
    });

    it('should throw BadRequestException if regisNumber is empty or missing', () => {
      assert.throws(
        () => {
          service.create({
            regisNumber: '',
            brand: 'Toyota',
            model: 'Yaris',
          });
        },
        (err: any) => err instanceof BadRequestException,
      );
    });

    it('should throw BadRequestException if brand is missing', () => {
      assert.throws(
        () => {
          service.create({
            regisNumber: '2ขค 5678',
            brand: '',
            model: 'Yaris',
          });
        },
        (err: any) => err instanceof BadRequestException,
      );
    });

    it('should throw BadRequestException if model is missing', () => {
      assert.throws(
        () => {
          service.create({
            regisNumber: '2ขค 5678',
            brand: 'Toyota',
            model: '',
          });
        },
        (err: any) => err instanceof BadRequestException,
      );
    });

    it('should throw ConflictException when creating a duplicate plate in the same province', () => {
      service.create({
        regisNumber: '1กข 1234',
        province: 'กรุงเทพมหานคร',
        brand: 'Toyota',
        model: 'Yaris Ativ',
      });

      assert.throws(
        () => {
          service.create({
            regisNumber: '1กข 1234',
            province: 'กรุงเทพมหานคร',
            brand: 'Honda',
            model: 'City',
          });
        },
        (err: any) => err instanceof ConflictException,
      );
    });

    it('should allow the same plate in a different province', () => {
      const car1 = service.create({
        regisNumber: '1กข 1234',
        province: 'กรุงเทพมหานคร',
        brand: 'Toyota',
        model: 'Yaris Ativ',
      });

      const car2 = service.create({
        regisNumber: '1กข 1234',
        province: 'เชียงใหม่',
        brand: 'Toyota',
        model: 'Yaris Ativ',
      });

      assert.notEqual(car1.id, car2.id);
      assert.equal(car1.province, 'กรุงเทพมหานคร');
      assert.equal(car2.province, 'เชียงใหม่');
    });
  });

  describe('findAll()', () => {
    beforeEach(() => {
      service.create({
        regisNumber: '1กข 1234',
        province: 'กรุงเทพมหานคร',
        brand: 'Toyota',
        model: 'Yaris Ativ',
        status: 'AVAILABLE',
      });
      service.create({
        regisNumber: '2ขค 5678',
        province: 'กรุงเทพมหานคร',
        brand: 'Honda',
        model: 'Civic RS',
        status: 'IN_USE',
      });
      service.create({
        regisNumber: '3งจ 9012',
        province: 'ชลบุรี',
        brand: 'BYD',
        model: 'Atto 3',
        status: 'UNAVAILABLE',
      });
    });

    it('should return all cars', () => {
      const result = service.findAll();
      assert.equal(result.total, 3);
      assert.equal(result.data.length, 3);
    });
  });

  describe('findOne()', () => {
    it('should return the car when ID exists', () => {
      const created = service.create({
        regisNumber: '9ฮฮ 9999',
        province: 'กรุงเทพมหานคร',
        brand: 'Tesla',
        model: 'Model 3',
      });

      const found = service.findOne(created.id);
      assert.equal(found.id, created.id);
      assert.equal(found.brand, 'Tesla');
    });

    it('should throw NotFoundException when ID does not exist', () => {
      assert.throws(
        () => {
          service.findOne('non-existent-id');
        },
        (err: any) => err instanceof NotFoundException,
      );
    });
  });

  describe('update()', () => {
    it('should update car details successfully', () => {
      const created = service.create({
        regisNumber: '1กข 1234',
        province: 'กรุงเทพมหานคร',
        brand: 'Toyota',
        model: 'Yaris Ativ',
        color: 'White',
      });

      const updated = service.update(created.id, {
        color: 'Black',
        notes: 'Repainted to Black',
      });

      assert.equal(updated.color, 'Black');
      assert.equal(updated.notes, 'Repainted to Black');
      assert.ok(updated.updatedAt);
    });

    it('should throw ConflictException if updating to another existing plate', () => {
      service.create({
        regisNumber: '1กข 1111',
        province: 'กรุงเทพมหานคร',
        brand: 'Toyota',
        model: 'Yaris',
      });
      const car2 = service.create({
        regisNumber: '2ขค 2222',
        province: 'กรุงเทพมหานคร',
        brand: 'Honda',
        model: 'City',
      });

      assert.throws(
        () => {
          service.update(car2.id, {
            regisNumber: '1กข 1111',
            province: 'กรุงเทพมหานคร',
          });
        },
        (err: any) => err instanceof ConflictException,
      );
    });
  });

  describe('remove()', () => {
    it('should delete car successfully', () => {
      const created = service.create({
        regisNumber: '1กข 1234',
        province: 'กรุงเทพมหานคร',
        brand: 'Toyota',
        model: 'Yaris',
      });

      const result = service.remove(created.id);
      assert.equal(result.success, true);
      assert.equal(result.deletedCar.id, created.id);

      assert.throws(
        () => service.findOne(created.id),
        (err: any) => err instanceof NotFoundException,
      );
    });

    it('should throw NotFoundException when deleting non-existent ID', () => {
      assert.throws(
        () => service.remove('invalid-id'),
        (err: any) => err instanceof NotFoundException,
      );
    });
  });

  describe('getStats()', () => {
    it('should return aggregated fleet statistics', () => {
      service.create({ regisNumber: '1กข 0001', province: 'กทม', brand: 'Toyota', model: 'A', status: 'AVAILABLE' });
      service.create({ regisNumber: '1กข 0002', province: 'กทม', brand: 'Toyota', model: 'B', status: 'AVAILABLE' });
      service.create({ regisNumber: '1กข 0003', province: 'กทม', brand: 'Honda', model: 'C', status: 'IN_USE' });
      service.create({ regisNumber: '1กข 0004', province: 'กทม', brand: 'BYD', model: 'D', status: 'UNAVAILABLE' });

      const stats = service.getStats();
      assert.equal(stats.total, 4);
      assert.equal(stats.available, 2);
      assert.equal(stats.inUse, 1);
      assert.equal(stats.unavailable, 1);
    });
  });
});
