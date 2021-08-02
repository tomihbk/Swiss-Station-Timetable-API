import { Test, TestingModule } from '@nestjs/testing';
import { Transport } from './transport';

describe('Transport', () => {
  let provider: Transport;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Transport],
    }).compile();

    provider = module.get<Transport>(Transport);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
