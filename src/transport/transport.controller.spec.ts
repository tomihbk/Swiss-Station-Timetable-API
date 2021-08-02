import { Test, TestingModule } from '@nestjs/testing';
import { TransportController } from './transport.controller';

describe('TransportController', () => {
  let controller: TransportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportController],
    }).compile();

    controller = module.get<TransportController>(TransportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
