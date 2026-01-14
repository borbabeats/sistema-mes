import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApontamentoDto } from './dto/create-apontamento.dto';
import { UpdateApontamentoDto } from './dto/update-apontamento.dto';

@Injectable()
export class ApontamentosService {
  constructor(private prisma: PrismaService) {}

  async create(createApontamentoDto: CreateApontamentoDto) {
    return this.prisma.apontamento.create({
      data: {
        ...createApontamentoDto,
        dataInicio: createApontamentoDto.dataHoraInicio,
      },
    });
  }

  async findAll() {
    return this.prisma.apontamento.findMany();
  }

  async findOne(id: number) {
    return this.prisma.apontamento.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateApontamentoDto: UpdateApontamentoDto) {
    return this.prisma.apontamento.update({
      where: { id },
      data: updateApontamentoDto,
    });
  }

  async remove(id: number) {
    return this.prisma.apontamento.delete({
      where: { id },
    });
  }
}
