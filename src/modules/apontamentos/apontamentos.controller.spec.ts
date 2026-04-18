import { Test, TestingModule } from '@nestjs/testing';
import { ApontamentosController } from './apontamentos.controller';
import { ApontamentosService } from './apontamentos.service';

describe('ApontamentosController', () => {
  let controller: ApontamentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApontamentosController],
      providers: [ApontamentosService],
    }).compile();

    controller = module.get<ApontamentosController>(ApontamentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
