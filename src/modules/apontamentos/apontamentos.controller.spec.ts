import { Test, TestingModule } from '@nestjs/testing';
import { ApontamentosController } from './apontamentos.controller';
import { ApontamentosModule } from './apontamentos.module';

describe('ApontamentosController', () => {
  let controller: ApontamentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApontamentosModule],
    })
    .compile();

    controller = module.get<ApontamentosController>(ApontamentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
