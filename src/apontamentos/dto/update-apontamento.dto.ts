import { PartialType } from '@nestjs/swagger';
import { CreateApontamentoDto } from './create-apontamento.dto';

export class UpdateApontamentoDto extends PartialType(CreateApontamentoDto) {}
