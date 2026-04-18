import { Test, TestingModule } from '@nestjs/testing';
import { ApontamentosService } from './apontamentos.service';
import { ApontamentosModule } from './apontamentos.module';

describe('ApontamentosService', () => {
  let service: ApontamentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApontamentosModule],
    })
    .compile();

    service = module.get<ApontamentosService>(ApontamentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
