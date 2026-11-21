import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { CarsService } from './cars.service.js';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  findAll() {
    return this.carsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.carsService.create(body);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() body: any) {
    return this.carsService.update(id, body);
  }

  @Patch(':id')
  updatePatch(@Param('id') id: string, @Body() body: any) {
    return this.carsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(id);
  }
}
