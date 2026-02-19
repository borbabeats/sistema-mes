import { StatusOP } from '../entities/ordem-producao.entity';

export type Transition = {
  to: StatusOP;
  allowedRoles?: string[];
  validate?: (data?: any) => string | null;
};

export const ORDEM_PRODUCAO_STATE_MACHINE: Record<StatusOP, Transition[]> = {
  RASCUNHO: [
    { to: StatusOP.PLANEJADA, allowedRoles: ['ADMIN', 'GERENTE', 'PLANEJAMENTO'] },
    { to: StatusOP.CANCELADA, allowedRoles: ['ADMIN', 'GERENTE'] },
  ],
  PLANEJADA: [
    { to: StatusOP.EM_ANDAMENTO, allowedRoles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
    { to: StatusOP.CANCELADA, allowedRoles: ['ADMIN', 'GERENTE'] },
  ],
  EM_ANDAMENTO: [
    { to: StatusOP.PAUSADA, allowedRoles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
    { to: StatusOP.FINALIZADA, allowedRoles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
    { to: StatusOP.CANCELADA, allowedRoles: ['ADMIN', 'GERENTE'] },
  ],
  PAUSADA: [
    { to: StatusOP.EM_ANDAMENTO, allowedRoles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
    { to: StatusOP.FINALIZADA, allowedRoles: ['ADMIN', 'GERENTE'] },
    { to: StatusOP.CANCELADA, allowedRoles: ['ADMIN', 'GERENTE'] },
  ],
  FINALIZADA: [
    { to: StatusOP.CANCELADA, allowedRoles: ['ADMIN'] },
  ],
  CANCELADA: [],
  ATRASADA: [], // opcional: pode ter transições específicas para ATRASADA
};

export function canTransition(from: StatusOP, to: StatusOP, userRoles: string[] = []): boolean {
  const transitions = ORDEM_PRODUCAO_STATE_MACHINE[from];
  if (!transitions) return false;
  return transitions.some(t => t.to === to && (!t.allowedRoles || t.allowedRoles.some(role => userRoles.includes(role))));
}

export function getAllowedTransitions(from: StatusOP, userRoles: string[] = []): StatusOP[] {
  const transitions = ORDEM_PRODUCAO_STATE_MACHINE[from];
  if (!transitions) return [];
  return transitions
    .filter(t => !t.allowedRoles || t.allowedRoles.some(role => userRoles.includes(role)))
    .map(t => t.to);
}

export function getTransition(from: StatusOP, to: StatusOP): Transition | undefined {
  const transitions = ORDEM_PRODUCAO_STATE_MACHINE[from];
  if (!transitions) return undefined;
  return transitions.find(t => t.to === to);
}
