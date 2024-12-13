import { Test, TestingModule } from '@nestjs/testing';
import { BicyclesService } from './bicycles.service';

describe('BicyclesService', () => {
  let service: BicyclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BicyclesService],
    }).compile();

    service = module.get<BicyclesService>(BicyclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
