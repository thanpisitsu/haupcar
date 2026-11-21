import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { CarsController } from '../dist/cars/cars.controller.js';
import { CarsService } from '../dist/cars/cars.service.js';

describe('CarsController', () => {
  let controller: CarsController;
  let service: CarsService;

  beforeEach(() => {
    service = new CarsService(':memory:');
    controller = new CarsController(service);
  });

  it('should return empty list initially in memory db', () => {
    const result = controller.findAll();
    assert.equal(result.total, 0);
    assert.deepEqual(result.data, []);
  });

  it('should create and retrieve a car via controller', () => {
    const created = controller.create({
      regisNumber: '9ฮฮ 1234',
      province: 'กรุงเทพมหานคร',
      brand: 'Toyota',
      model: 'Corolla',
    });

    assert.ok(created.id);
    assert.equal(created.regisNumber, '9ฮฮ 1234');

    const found = controller.findOne(created.id);
    assert.equal(found.id, created.id);
    assert.equal(found.brand, 'Toyota');
  });

  it('should update a car via controller (PUT and PATCH)', () => {
    const created = controller.create({
      regisNumber: '1กข 0001',
      province: 'กทม',
      brand: 'Toyota',
      model: 'Yaris',
    });

    const updatedPut = controller.updatePut(created.id, { color: 'Blue' });
    assert.equal(updatedPut.color, 'Blue');

    const updatedPatch = controller.updatePatch(created.id, { notes: 'Updated note' });
    assert.equal(updatedPatch.notes, 'Updated note');
  });

  it('should remove a car via controller', () => {
    const created = controller.create({
      regisNumber: '1กข 0001',
      province: 'กทม',
      brand: 'Toyota',
      model: 'Yaris',
    });

    const result = controller.remove(created.id);
    assert.equal(result.success, true);
    assert.equal(result.deletedCar.id, created.id);
  });
});
