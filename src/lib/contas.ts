'use client';

/**
 * Contas de acesso do modo local.
 *
 * O sistema começa SEM nenhuma conta: a primeira pessoa a abrir o sistema cria
 * a sua com usuário (não e‑mail), senha e confirmação de senha. As credenciais
 * fixas das versões anteriores foram removidas — qualquer resquício delas é
 * apagado na primeira leitura (ver `limparHeranca`).
 *
 * A senha nunca é guardada em texto puro (ver `lib/cripto`). Como o modo local
 * não tem servidor de e‑mail, a redefinição de senha usa a pergunta de
 * segurança escolhida no cadastro.
 */

import type { Usuario } from './tipos';
import { conferirSegredo, guardarSegredo, type SegredoGuardado } from './cripto';

const CHAVE_CONTAS = 'auditoria.contas.v1';
const CHAVE_SESSAO = 'auditoria.sessao.v2';
/** Chaves das versões com login fixo — removidas para não reviver contas antigas. */
const CHAVES_HERDADAS = ['auditoria.sessao.v1', 'auditoria.usuarios.v1'];

export type Conta = {
  id: string;
  usuario: string;
  nome: string;
  perfil: 'administrador';
  criadoEm: string;
  ultimoAcessoEm?: string;
  senha: SegredoGuardado;
  pergunta: string;
  resposta: SegredoGuardado;
};

export type Resultado<T = void> = { ok: true; valor: T } | { ok: false; erro: string };

const bom = <T,>(valor: T): Resultado<T> => ({ ok: true, valor });
const ruim = (erro: string): Resultado<never> => ({ ok: false, erro });

/* ────────────────────────── perguntas de segurança ────────────────────────── */

export const PERGUNTAS = [
  'Qual o nome da sua primeira empresa?',
  'Qual o nome do seu primeiro supervisor?',
  'Em que cidade você nasceu?',
  'Qual o nome do seu primeiro animal de estimação?',
  'Qual o modelo do seu primeiro carro?',
  'Qual o nome da escola onde você estudou o ensino médio?'
] as const;

/* ────────────────────────── persistência ────────────────────────── */

const noNavegador = () => typeof window !== 'undefined';

let herancaLimpa = false;
/** Apaga de uma vez as chaves das versões com usuário embutido no código. */
function limparHeranca() {
  if (herancaLimpa || !noNavegador()) return;
  herancaLimpa = true;
  for (const chave of CHAVES_HERDADAS) {
    try { window.localStorage.removeItem(chave); } catch { /* ignora */ }
  }
}

function lerContas(): Conta[] {
  if (!noNavegador()) return [];
  limparHeranca();
  try {
    const bruto = window.localStorage.getItem(CHAVE_CONTAS);
    const lista = bruto ? (JSON.parse(bruto) as Conta[]) : [];
    return Array.isArray(lista) ? lista.filter((c) => c?.usuario && c?.senha?.hash) : [];
  } catch {
    return [];
  }
}

function gravarContas(contas: Conta[]) {
  if (!noNavegador()) return;
  try {
    window.localStorage.setItem(CHAVE_CONTAS, JSON.stringify(contas));
  } catch (e) {
    console.warn('Não foi possível gravar as contas localmente.', e);
  }
}

const idNovo = () =>
  globalThis.crypto?.randomUUID?.() ?? `u-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/* ────────────────────────── normalização e validação ────────────────────────── */

/** Usuário é sempre minúsculo, sem acento e sem espaço — `Ana Lima` vira `ana.lima`. */
export function normalizarUsuario(entrada: string) {
  return entrada
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9._-]/g, '');
}

const normalizarResposta = (entrada: string) =>
  entrada.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase().replace(/\s+/g, ' ');

export function validarUsuario(entrada: string): Resultado<string> {
  const usuario = normalizarUsuario(entrada);
  if (usuario.length < 3) return ruim('O usuário precisa de pelo menos 3 caracteres.');
  if (usuario.length > 24) return ruim('O usuário pode ter no máximo 24 caracteres.');
  if (!/^[a-z]/.test(usuario)) return ruim('O usuário precisa começar com uma letra.');
  return bom(usuario);
}

export type ForcaSenha = { pontos: number; rotulo: 'fraca' | 'média' | 'forte'; requisitos: { texto: string; ok: boolean }[] };

/** Requisitos mostrados ao vivo enquanto a pessoa digita. */
export function avaliarSenha(senha: string): ForcaSenha {
  const requisitos = [
    { texto: 'Pelo menos 8 caracteres', ok: senha.length >= 8 },
    { texto: 'Uma letra', ok: /[a-zA-Z]/.test(senha) },
    { texto: 'Um número', ok: /\d/.test(senha) }
  ];
  const atendidos = requisitos.filter((r) => r.ok).length;
  const extras = (senha.length >= 12 ? 1 : 0) + (/[^a-zA-Z0-9]/.test(senha) ? 1 : 0);
  const pontos = Math.min(100, Math.round(((atendidos + extras) / 5) * 100));
  return { pontos, rotulo: pontos >= 80 ? 'forte' : pontos >= 55 ? 'média' : 'fraca', requisitos };
}

export function validarSenha(senha: string, confirmacao: string): Resultado<string> {
  const { requisitos } = avaliarSenha(senha);
  const faltando = requisitos.find((r) => !r.ok);
  if (faltando) return ruim(`A senha não atende ao requisito: ${faltando.texto.toLowerCase()}.`);
  if (senha !== confirmacao) return ruim('A confirmação não confere com a senha digitada.');
  return bom(senha);
}

/* ────────────────────────── consultas ────────────────────────── */

const publica = (c: Conta): Usuario => ({
  id: c.id, usuario: c.usuario, nome: c.nome, perfil: c.perfil, criadoEm: c.criadoEm
});

export const listarUsuarios = (): Usuario[] =>
  lerContas().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')).map(publica);

export const existeAlgumaConta = () => lerContas().length > 0;

export const usuarioDisponivel = (entrada: string) => {
  const usuario = normalizarUsuario(entrada);
  return !lerContas().some((c) => c.usuario === usuario);
};

/** Pergunta de segurança de um usuário — passo 1 da redefinição de senha. */
export const perguntaDe = (entrada: string): string | null =>
  lerContas().find((c) => c.usuario === normalizarUsuario(entrada))?.pergunta ?? null;

/* ────────────────────────── criação ────────────────────────── */

export type DadosNovaConta = {
  usuario: string;
  nome: string;
  senha: string;
  confirmacao: string;
  pergunta: string;
  resposta: string;
};

export async function criarConta(dados: DadosNovaConta): Promise<Resultado<Usuario>> {
  const nome = dados.nome.trim();
  if (nome.length < 2) return ruim('Informe o nome de quem vai usar a conta.');

  const login = validarUsuario(dados.usuario);
  if (!login.ok) return login;

  const senha = validarSenha(dados.senha, dados.confirmacao);
  if (!senha.ok) return senha;

  if (!dados.pergunta.trim()) return ruim('Escolha uma pergunta de segurança.');
  const resposta = normalizarResposta(dados.resposta);
  if (resposta.length < 2) return ruim('Responda à pergunta de segurança — ela recupera o acesso se você esquecer a senha.');

  const contas = lerContas();
  if (contas.some((c) => c.usuario === login.valor)) return ruim('Já existe uma conta com esse usuário.');

  const conta: Conta = {
    id: idNovo(),
    usuario: login.valor,
    nome,
    perfil: 'administrador',
    criadoEm: new Date().toISOString(),
    senha: await guardarSegredo(senha.valor),
    pergunta: dados.pergunta.trim(),
    resposta: await guardarSegredo(resposta)
  };

  gravarContas([...contas, conta]);
  return bom(publica(conta));
}

/* ────────────────────────── sessão ────────────────────────── */

export async function autenticar(entrada: string, senha: string): Promise<Resultado<Usuario>> {
  const usuario = normalizarUsuario(entrada);
  const contas = lerContas();
  const conta = contas.find((c) => c.usuario === usuario);

  // Mensagem única para não revelar quais usuários existem.
  if (!conta || !(await conferirSegredo(senha, conta.senha))) return ruim('Usuário ou senha incorretos.');

  conta.ultimoAcessoEm = new Date().toISOString();
  gravarContas(contas);
  abrirSessao(conta);
  return bom(publica(conta));
}

function abrirSessao(conta: Conta) {
  if (!noNavegador()) return;
  try {
    window.localStorage.setItem(CHAVE_SESSAO, JSON.stringify(publica(conta)));
  } catch (e) {
    console.warn('Não foi possível guardar a sessão.', e);
  }
}

export function sessaoAtual(): Usuario | null {
  if (!noNavegador()) return null;
  limparHeranca();
  try {
    const bruto = window.localStorage.getItem(CHAVE_SESSAO);
    if (!bruto) return null;
    const salvo = JSON.parse(bruto) as Usuario;
    // A sessão só vale enquanto a conta existir.
    const conta = lerContas().find((c) => c.id === salvo.id);
    if (!conta) { encerrarSessao(); return null; }
    return publica(conta);
  } catch {
    return null;
  }
}

export function encerrarSessao() {
  if (!noNavegador()) return;
  try { window.localStorage.removeItem(CHAVE_SESSAO); } catch { /* ignora */ }
}

/* ────────────────────────── redefinição de senha ────────────────────────── */

/** Passo 2: confere a resposta da pergunta de segurança. */
export async function conferirResposta(entrada: string, resposta: string): Promise<boolean> {
  const conta = lerContas().find((c) => c.usuario === normalizarUsuario(entrada));
  if (!conta) return false;
  return conferirSegredo(normalizarResposta(resposta), conta.resposta);
}

/** Passo 3: grava a nova senha depois de conferir de novo a resposta. */
export async function redefinirSenha(
  entrada: string, resposta: string, novaSenha: string, confirmacao: string
): Promise<Resultado<Usuario>> {
  const senha = validarSenha(novaSenha, confirmacao);
  if (!senha.ok) return senha;

  const contas = lerContas();
  const conta = contas.find((c) => c.usuario === normalizarUsuario(entrada));
  if (!conta) return ruim('Usuário não encontrado.');
  if (!(await conferirSegredo(normalizarResposta(resposta), conta.resposta)))
    return ruim('A resposta de segurança não confere.');
  if (await conferirSegredo(senha.valor, conta.senha))
    return ruim('A nova senha precisa ser diferente da senha atual.');

  conta.senha = await guardarSegredo(senha.valor);
  gravarContas(contas);
  encerrarSessao(); // a pessoa entra de novo com a senha nova
  return bom(publica(conta));
}

/** Troca de senha de quem já está dentro do sistema. */
export async function alterarSenha(
  entrada: string, senhaAtual: string, novaSenha: string, confirmacao: string
): Promise<Resultado<Usuario>> {
  const senha = validarSenha(novaSenha, confirmacao);
  if (!senha.ok) return senha;

  const contas = lerContas();
  const conta = contas.find((c) => c.usuario === normalizarUsuario(entrada));
  if (!conta || !(await conferirSegredo(senhaAtual, conta.senha))) return ruim('A senha atual não confere.');

  conta.senha = await guardarSegredo(senha.valor);
  gravarContas(contas);
  return bom(publica(conta));
}
