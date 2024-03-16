import { Test, TestingModule } from '@nestjs/testing';
import { Command2Service } from './command2.service';

describe('Command2Service', () => {
  let service: Command2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Command2Service],
    }).compile();

    service = module.get<Command2Service>(Command2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
