import { Test, TestingModule } from '@nestjs/testing';
import { BicyclesController } from './bicycles.controller';

describe('BicyclesController', () => {
  let controller: BicyclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BicyclesController],
    }).compile();

    controller = module.get<BicyclesController>(BicyclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
