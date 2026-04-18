import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import {
  IUsuariosRepository,
  CreateUsuarioData,
} from '../../domain/repositories/usuarios.repository.interface';
import { CreateUsuarioDto } from '../../presentation/dto/usuarios/create-usuario.dto';
import { UpdateUsuarioDto } from '../../presentation/dto/usuarios/update-usuario.dto';
import { UsuarioResponseDto } from '../../presentation/dto/usuarios/usuario-response.dto';
import { Usuario, Cargo } from '../../domain/entities/usuario.entity';
import { USUARIOS_REPOSITORY_TOKEN } from './constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USUARIOS_REPOSITORY_TOKEN)
    private readonly userRepository: IUsuariosRepository,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  private toUsuarioResponseDto(usuario: Usuario): UsuarioResponseDto {
    const { senha, ...usuarioSemSenha } = usuario;
    const response = usuarioSemSenha as UsuarioResponseDto;

    // Adicionar nomeSetor se existir no objeto usuário
    if ((usuario as any).nomeSetor) {
      response.nomeSetor = (usuario as any).nomeSetor;
    }

    return response;
  }

  async create(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<UsuarioResponseDto> {
    const hashedPassword = await this.hashPassword(createUsuarioDto.senha);

    const userData: CreateUsuarioData = {
      nome: createUsuarioDto.nome,
      email: createUsuarioDto.email,
      telefone: createUsuarioDto.telefone,
      senha: hashedPassword,
      photoProfile: createUsuarioDto.photoProfile,
      setorId: createUsuarioDto.setorId,
    };

    if (createUsuarioDto.cargo) {
      userData.cargo = createUsuarioDto.cargo as Cargo;
    }

    const usuario = await this.userRepository.create(userData);
    return this.toUsuarioResponseDto(usuario);
  }

  async findAll(): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.userRepository.findAll();
    return usuarios.map((usuario) => this.toUsuarioResponseDto(usuario));
  }

  async findOne(id: number): Promise<UsuarioResponseDto> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return this.toUsuarioResponseDto(user);
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    await this.findOne(id);

    const { cargo, senha, ...rest } = updateUsuarioDto;

    const data: Partial<Usuario> = {
      ...rest,
    };

    if (senha) {
      data.senha = await this.hashPassword(senha);
    }

    if (cargo) {
      data.cargo = cargo as Cargo;
    }

    return this.userRepository.update(id, data);
  }

  async remove(id: number): Promise<Usuario> {
    await this.findOne(id);

    return this.userRepository.remove(id);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.userRepository.findByEmail(email);
  }
}
