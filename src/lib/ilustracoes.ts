/* ============================================================
   ilustracoes.ts — cenas vetoriais para cada etapa/setor.
   Servem como arte definitiva e como fallback das fotos em cache
   (ver scripts/baixar-imagens.mjs). Nunca quebram, nunca dependem
   de rede e ficam nítidas em qualquer densidade de tela.
   ============================================================ */

const P = {
  ceu: ['#dfe9ff', '#f3f6ff'],
  piso: '#c9d4e8',
  tinta: '#2b3550',
  linha: '#8b98b5',
  azul: '#0071e3',
  azul2: '#5aa9ff',
  verde: '#1d9c4b',
  ambar: '#f5a623',
  roxo: '#6f4bff',
  claro: '#ffffff',
  aco: '#aeb9d0',
  vermelho: '#d92c20'
};

const abre = (id: string) =>
  `<svg viewBox="0 0 800 450" role="img" aria-labelledby="t-${id}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
    <defs><linearGradient id="g-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${P.ceu[0]}"/><stop offset="1" stop-color="${P.ceu[1]}"/></linearGradient></defs>
    <rect width="800" height="450" fill="url(#g-${id})"/>`;

const fecha = '</svg>';
const tit = (id: string, t: string) => `<title id="t-${id}">${t}</title>`;
const piso = (y = 360) =>
  `<rect x="0" y="${y}" width="800" height="${450 - y}" fill="${P.piso}" opacity=".55"/>
   <line x1="0" y1="${y}" x2="800" y2="${y}" stroke="${P.linha}" stroke-width="2" opacity=".6"/>`;

const caixa = (x: number, y: number, w: number, h: number, cor = P.ambar) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${cor}" opacity=".9"/>
   <line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="${P.claro}" stroke-width="2" opacity=".45"/>`;

const pessoa = (x: number, y: number, s = 1, cor = P.azul) =>
  `<g transform="translate(${x},${y}) scale(${s})">
     <circle cx="0" cy="-52" r="16" fill="${P.tinta}" opacity=".85"/>
     <path d="M-19 0 q0 -36 19 -36 q19 0 19 36 z" fill="${cor}"/>
     <rect x="-15" y="0" width="12" height="34" rx="5" fill="${P.tinta}" opacity=".75"/>
     <rect x="3" y="0" width="12" height="34" rx="5" fill="${P.tinta}" opacity=".75"/>
   </g>`;

const prancheta = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})">
     <rect x="0" y="0" width="86" height="112" rx="8" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
     <rect x="30" y="-8" width="26" height="14" rx="4" fill="${P.linha}"/>
     <path d="M14 34 l9 9 l17 -20" fill="none" stroke="${P.verde}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
     <rect x="46" y="32" width="28" height="6" rx="3" fill="${P.linha}" opacity=".5"/>
     <path d="M14 62 l9 9 l17 -20" fill="none" stroke="${P.verde}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
     <rect x="46" y="60" width="28" height="6" rx="3" fill="${P.linha}" opacity=".5"/>
     <rect x="14" y="88" width="20" height="6" rx="3" fill="${P.linha}" opacity=".35"/>
     <rect x="46" y="88" width="28" height="6" rx="3" fill="${P.linha}" opacity=".35"/>
   </g>`;

type Cena = (id: string) => string;

const cenas: Record<string, Cena> = {
  'linha-producao': (id) => abre(id) + tit(id, 'Linha de produção com esteira e operador') + piso() +
    `<rect x="60" y="286" width="660" height="26" rx="13" fill="${P.aco}"/>
     <circle cx="98" cy="299" r="17" fill="${P.tinta}" opacity=".75"/><circle cx="98" cy="299" r="6" fill="${P.claro}"/>
     <circle cx="400" cy="299" r="17" fill="${P.tinta}" opacity=".75"/><circle cx="400" cy="299" r="6" fill="${P.claro}"/>
     <circle cx="700" cy="299" r="17" fill="${P.tinta}" opacity=".75"/><circle cx="700" cy="299" r="6" fill="${P.claro}"/>
     <rect x="86" y="312" width="14" height="48" fill="${P.linha}"/><rect x="694" y="312" width="14" height="48" fill="${P.linha}"/>
     ${caixa(140, 246, 56, 40)}${caixa(260, 246, 56, 40, P.azul2)}${caixa(380, 246, 56, 40)}${caixa(500, 246, 56, 40, P.roxo)}
     <rect x="600" y="150" width="150" height="136" rx="14" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
     <rect x="618" y="170" width="114" height="60" rx="6" fill="${P.azul}" opacity=".18"/>
     <path d="M628 216 l22 -26 l20 16 l24 -34 l24 44" fill="none" stroke="${P.azul}" stroke-width="4" stroke-linecap="round"/>
     <circle cx="640" cy="252" r="10" fill="${P.verde}"/><circle cx="672" cy="252" r="10" fill="${P.ambar}" opacity=".5"/>
     ${pessoa(220, 360, 1.05)}` + fecha,

  documento: (id) => abre(id) + tit(id, 'Documento controlado com revisão e aprovação') +
    `<rect x="230" y="60" width="300" height="330" rx="18" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
     <rect x="266" y="100" width="180" height="14" rx="7" fill="${P.tinta}" opacity=".8"/>
     <rect x="266" y="132" width="228" height="9" rx="4.5" fill="${P.linha}" opacity=".45"/>
     <rect x="266" y="152" width="200" height="9" rx="4.5" fill="${P.linha}" opacity=".45"/>
     <rect x="266" y="172" width="216" height="9" rx="4.5" fill="${P.linha}" opacity=".45"/>
     <rect x="266" y="206" width="228" height="9" rx="4.5" fill="${P.linha}" opacity=".3"/>
     <rect x="266" y="226" width="160" height="9" rx="4.5" fill="${P.linha}" opacity=".3"/>
     <rect x="266" y="262" width="112" height="30" rx="6" fill="${P.azul}" opacity=".14"/>
     <text x="278" y="283" font-family="system-ui" font-size="15" font-weight="600" fill="${P.azul}">Rev. 04</text>
     <g transform="translate(430,300) rotate(-14)">
       <rect x="-72" y="-30" width="144" height="60" rx="10" fill="none" stroke="${P.verde}" stroke-width="5" opacity=".85"/>
       <text x="0" y="8" text-anchor="middle" font-family="system-ui" font-size="21" font-weight="700" fill="${P.verde}" opacity=".9">APROVADO</text></g>
     <g transform="translate(560,110)"><circle r="46" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
       <path d="M-18 2 l12 13 l24 -28" fill="none" stroke="${P.verde}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>
     <g transform="translate(150,300)"><rect x="-46" y="-46" width="92" height="92" rx="12" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
       <path d="M-22 -22 l44 44 M22 -22 l-44 44" stroke="${P.vermelho}" stroke-width="7" stroke-linecap="round"/>
       <text x="0" y="70" text-anchor="middle" font-family="system-ui" font-size="14" fill="${P.tinta}" opacity=".7">obsoleto</text></g>` + fecha,

  armazem: (id) => abre(id) + tit(id, 'Prateleiras de almoxarifado com paletes identificados') + piso(370) +
    `<g stroke="${P.aco}" stroke-width="10" stroke-linecap="round">
       <path d="M90 120 v250 M330 120 v250 M470 120 v250 M710 120 v250"/></g>
     <g fill="${P.aco}"><rect x="80" y="200" width="260" height="10" rx="5"/><rect x="80" y="290" width="260" height="10" rx="5"/>
       <rect x="460" y="200" width="260" height="10" rx="5"/><rect x="460" y="290" width="260" height="10" rx="5"/></g>
     ${caixa(104, 148, 66, 52)}${caixa(184, 148, 66, 52, P.azul2)}${caixa(264, 152, 60, 48, P.roxo)}
     ${caixa(104, 238, 66, 52, P.azul2)}${caixa(184, 240, 66, 50)}${caixa(264, 236, 60, 54, P.verde)}
     ${caixa(484, 148, 66, 52, P.roxo)}${caixa(564, 150, 66, 50)}${caixa(644, 146, 60, 54, P.azul2)}
     ${caixa(484, 240, 66, 50, P.verde)}${caixa(564, 238, 66, 52, P.azul2)}${caixa(644, 240, 60, 50)}
     <g transform="translate(400,250)">
       <rect x="-46" y="-58" width="92" height="116" rx="10" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
       <rect x="-30" y="-40" width="60" height="8" rx="4" fill="${P.tinta}" opacity=".7"/>
       <g fill="${P.tinta}" opacity=".8"><rect x="-30" y="-18" width="5" height="42"/><rect x="-20" y="-18" width="9" height="42"/>
         <rect x="-6" y="-18" width="4" height="42"/><rect x="3" y="-18" width="8" height="42"/><rect x="16" y="-18" width="5" height="42"/>
         <rect x="25" y="-18" width="5" height="42"/></g>
       <rect x="-30" y="32" width="60" height="6" rx="3" fill="${P.linha}" opacity=".45"/></g>` + fecha,

  calibracao: (id) => abre(id) + tit(id, 'Instrumento de medição calibrado com padrão rastreável') + piso(370) +
    `<rect x="150" y="300" width="500" height="70" rx="10" fill="${P.aco}" opacity=".8"/>
     <g transform="translate(300,300)">
       <rect x="-90" y="-40" width="180" height="40" rx="8" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
       <rect x="-70" y="-96" width="140" height="56" rx="8" fill="${P.tinta}" opacity=".9"/>
       <text x="0" y="-58" text-anchor="middle" font-family="ui-monospace,monospace" font-size="27" font-weight="700" fill="${P.verde}">10.000</text>
       <rect x="-58" y="-124" width="116" height="28" rx="6" fill="${P.aco}"/></g>
     <g transform="translate(300,150)">
       <path d="M-34 26 h68 l-10 -30 h-48 z" fill="${P.azul}" opacity=".9"/>
       <path d="M-14 -4 q14 -22 28 0" fill="none" stroke="${P.azul}" stroke-width="6"/></g>
     <g transform="translate(560,236)">
       <rect x="-70" y="-70" width="140" height="140" rx="14" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
       <text x="0" y="-34" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="600" fill="${P.tinta}" opacity=".75">CERTIFICADO</text>
       <rect x="-50" y="-18" width="100" height="7" rx="3.5" fill="${P.linha}" opacity=".4"/>
       <rect x="-50" y="0" width="76" height="7" rx="3.5" fill="${P.linha}" opacity=".4"/>
       <circle cx="0" cy="34" r="22" fill="${P.verde}" opacity=".18"/>
       <path d="M-10 34 l7 8 l14 -17" fill="none" stroke="${P.verde}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>` + fecha,

  laboratorio: (id) => abre(id) + tit(id, 'Bancada de laboratório com ensaios e registro de resultados') + piso(370) +
    `<rect x="90" y="300" width="620" height="70" rx="8" fill="${P.aco}" opacity=".8"/>
     <g transform="translate(190,300)">
       <path d="M-22 -80 h44 v34 l30 46 h-104 l30 -46 z" fill="${P.claro}" stroke="${P.linha}" stroke-width="3"/>
       <path d="M-46 -14 l14 -20 h64 l14 20 z" fill="${P.azul2}" opacity=".8"/></g>
     <g transform="translate(330,300)">
       <rect x="-24" y="-100" width="48" height="100" rx="8" fill="${P.claro}" stroke="${P.linha}" stroke-width="3"/>
       <rect x="-20" y="-46" width="40" height="42" rx="6" fill="${P.verde}" opacity=".7"/>
       <g stroke="${P.linha}" stroke-width="2"><path d="M-24 -80 h12 M-24 -64 h12 M-24 -48 h12 M-24 -32 h12"/></g></g>
     <g transform="translate(470,238)">
       <rect x="-40" y="-30" width="80" height="92" rx="10" fill="${P.tinta}" opacity=".85"/>
       <circle cx="0" cy="-52" r="26" fill="${P.claro}" stroke="${P.linha}" stroke-width="3"/>
       <circle cx="0" cy="-52" r="12" fill="${P.azul}" opacity=".55"/>
       <rect x="-52" y="58" width="104" height="10" rx="5" fill="${P.aco}"/></g>
     ${prancheta(600, 214, 1)}` + fecha,

  manutencao: (id) => abre(id) + tit(id, 'Manutenção preventiva de equipamento') + piso() +
    `<rect x="150" y="170" width="300" height="190" rx="16" fill="${P.aco}"/>
     <rect x="178" y="198" width="120" height="86" rx="8" fill="${P.tinta}" opacity=".85"/>
     <path d="M190 262 l20 -24 l18 16 l22 -30 l20 38" fill="none" stroke="${P.azul2}" stroke-width="4" stroke-linecap="round"/>
     <circle cx="368" cy="240" r="52" fill="none" stroke="${P.claro}" stroke-width="16" opacity=".85"/>
     <g stroke="${P.claro}" stroke-width="12" stroke-linecap="round" opacity=".85">
       <path d="M368 176 v-16 M368 304 v16 M304 240 h-16 M432 240 h16 M323 195 l-11 -11 M413 285 l11 11 M413 195 l11 -11 M323 285 l-11 11"/></g>
     <circle cx="368" cy="240" r="18" fill="${P.azul}"/>
     <rect x="184" y="304" width="60" height="18" rx="9" fill="${P.verde}" opacity=".85"/>
     ${pessoa(540, 360, 1.1, P.ambar)}${prancheta(620, 200, 0.9)}` + fecha,

  expedicao: (id) => abre(id) + tit(id, 'Carregamento na expedição com conferência') + piso() +
    `<rect x="330" y="200" width="330" height="130" rx="12" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
     <path d="M660 240 h64 l40 50 v40 h-104 z" fill="${P.azul}" opacity=".9"/>
     <rect x="676" y="252" width="44" height="34" rx="6" fill="${P.ceu[0]}"/>
     <circle cx="400" cy="336" r="26" fill="${P.tinta}"/><circle cx="400" cy="336" r="10" fill="${P.aco}"/>
     <circle cx="600" cy="336" r="26" fill="${P.tinta}"/><circle cx="600" cy="336" r="10" fill="${P.aco}"/>
     <circle cx="712" cy="336" r="26" fill="${P.tinta}"/><circle cx="712" cy="336" r="10" fill="${P.aco}"/>
     ${caixa(360, 236, 62, 46)}${caixa(436, 236, 62, 46, P.azul2)}${caixa(512, 236, 62, 46, P.roxo)}
     ${caixa(360, 288, 62, 40, P.verde)}${caixa(436, 288, 62, 40)}${caixa(512, 288, 62, 40, P.azul2)}
     ${pessoa(150, 360, 1.05, P.verde)}${prancheta(196, 236, 0.85)}` + fecha,

  treinamento: (id) => abre(id) + tit(id, 'Treinamento e registro de competência') + piso(378) +
    `<rect x="440" y="80" width="290" height="190" rx="14" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
     <rect x="468" y="110" width="150" height="12" rx="6" fill="${P.tinta}" opacity=".75"/>
     <path d="M470 220 l40 -50 l34 30 l44 -66 l50 86" fill="none" stroke="${P.azul}" stroke-width="5" stroke-linecap="round"/>
     <rect x="468" y="236" width="90" height="10" rx="5" fill="${P.linha}" opacity=".4"/>
     ${pessoa(120, 340, 1.15, P.azul)}${pessoa(230, 350, 1.05, P.roxo)}${pessoa(330, 342, 1.1, P.verde)}
     <g transform="translate(660,320)">
       <rect x="-70" y="-48" width="140" height="96" rx="10" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
       <rect x="-50" y="-28" width="100" height="7" rx="3.5" fill="${P.linha}" opacity=".45"/>
       <rect x="-50" y="-10" width="72" height="7" rx="3.5" fill="${P.linha}" opacity=".45"/>
       <circle cx="34" cy="22" r="18" fill="${P.ambar}" opacity=".25"/>
       <path d="M24 22 l7 8 l14 -17" fill="none" stroke="${P.ambar}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>` + fecha,

  fornecedor: (id) => abre(id) + tit(id, 'Avaliação de fornecedor e inspeção de recebimento') + piso(372) +
    `<g transform="translate(200,240)">
       <rect x="-96" y="-110" width="192" height="220" rx="14" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
       <rect x="-70" y="-84" width="120" height="12" rx="6" fill="${P.tinta}" opacity=".75"/>
       <g fill="${P.ambar}"><path d="M-70 -46 l7 15 l16 2 l-12 11 l3 16 l-14 -8 l-14 8 l3 -16 l-12 -11 l16 -2 z"/>
         <g transform="translate(48,0)"><path d="M-70 -46 l7 15 l16 2 l-12 11 l3 16 l-14 -8 l-14 8 l3 -16 l-12 -11 l16 -2 z"/></g>
         <g transform="translate(96,0)"><path d="M-70 -46 l7 15 l16 2 l-12 11 l3 16 l-14 -8 l-14 8 l3 -16 l-12 -11 l16 -2 z"/></g>
         <g opacity=".28" transform="translate(144,0)"><path d="M-70 -46 l7 15 l16 2 l-12 11 l3 16 l-14 -8 l-14 8 l3 -16 l-12 -11 l16 -2 z"/></g></g>
       <rect x="-70" y="10" width="140" height="8" rx="4" fill="${P.linha}" opacity=".4"/>
       <rect x="-70" y="30" width="100" height="8" rx="4" fill="${P.linha}" opacity=".4"/>
       <rect x="-70" y="60" width="86" height="28" rx="6" fill="${P.verde}" opacity=".16"/>
       <text x="-27" y="79" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="600" fill="${P.verde}">Aprovado</text></g>
     <g transform="translate(540,250)">
       <path d="M-90 -40 h180 v100 h-180 z" fill="${P.ambar}" opacity=".9"/>
       <path d="M-90 -40 l40 -46 h180 l-40 46 z" fill="${P.ambar}" opacity=".55"/>
       <path d="M90 -40 l40 -46 v100 l-40 46 z" fill="${P.ambar}" opacity=".7"/>
       <rect x="-30" y="-40" width="60" height="100" fill="${P.claro}" opacity=".35"/></g>
     <g transform="translate(660,150)"><circle r="40" fill="${P.claro}" stroke="${P.linha}" stroke-width="3"/>
       <circle r="24" fill="none" stroke="${P.azul}" stroke-width="5"/>
       <path d="M18 18 l26 26" stroke="${P.azul}" stroke-width="8" stroke-linecap="round"/></g>` + fecha,

  'nao-conformidade': (id) => abre(id) + tit(id, 'Tratamento de não conformidade e ação corretiva') +
    `<g transform="translate(250,200)">
       <path d="M0 -90 L96 76 H-96 Z" fill="${P.ambar}" opacity=".9"/>
       <rect x="-9" y="-46" width="18" height="72" rx="9" fill="${P.claro}"/>
       <circle cx="0" cy="48" r="11" fill="${P.claro}"/></g>
     <g transform="translate(560,230)">
       <circle r="96" fill="none" stroke="${P.azul}" stroke-width="10" stroke-dasharray="24 16" opacity=".35"/>
       <circle r="60" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
       <text x="0" y="-8" text-anchor="middle" font-family="system-ui" font-size="15" font-weight="600" fill="${P.tinta}" opacity=".8">Causa</text>
       <text x="0" y="14" text-anchor="middle" font-family="system-ui" font-size="15" font-weight="600" fill="${P.tinta}" opacity=".8">raiz</text>
       <g fill="${P.azul}"><circle cx="0" cy="-96" r="12"/><circle cx="96" cy="0" r="12"/><circle cx="0" cy="96" r="12"/><circle cx="-96" cy="0" r="12"/></g></g>
     <text x="400" y="400" text-anchor="middle" font-family="system-ui" font-size="15" fill="${P.tinta}" opacity=".65">Detectar → conter → analisar → corrigir → verificar eficácia</text>` + fecha,

  indicadores: (id) => abre(id) + tit(id, 'Painel de indicadores da qualidade') +
    `<rect x="90" y="70" width="620" height="300" rx="20" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
     <rect x="122" y="100" width="150" height="12" rx="6" fill="${P.tinta}" opacity=".75"/>
     <rect x="122" y="250" width="46" height="86" rx="8" fill="${P.azul}" opacity=".85"/>
     <rect x="186" y="216" width="46" height="120" rx="8" fill="${P.azul}" opacity=".7"/>
     <rect x="250" y="180" width="46" height="156" rx="8" fill="${P.azul}" opacity=".85"/>
     <rect x="314" y="146" width="46" height="190" rx="8" fill="${P.verde}" opacity=".85"/>
     <path d="M410 300 q60 -20 90 -70 q30 -50 90 -76" fill="none" stroke="${P.ambar}" stroke-width="5" stroke-linecap="round"/>
     <g fill="${P.ambar}"><circle cx="410" cy="300" r="8"/><circle cx="500" cy="230" r="8"/><circle cx="590" cy="154" r="8"/></g>
     <g transform="translate(620,290)">
       <circle r="46" fill="none" stroke="${P.linha}" stroke-width="12" opacity=".25"/>
       <circle r="46" fill="none" stroke="${P.verde}" stroke-width="12" stroke-linecap="round"
               stroke-dasharray="289" stroke-dashoffset="72" transform="rotate(-90)"/>
       <text x="0" y="7" text-anchor="middle" font-family="system-ui" font-size="19" font-weight="700" fill="${P.tinta}">75%</text></g>` + fecha,

  seguranca: (id) => abre(id) + tit(id, 'Uso de EPI e organização do ambiente de trabalho') + piso() +
    `${pessoa(250, 358, 1.5, P.azul)}
     <g transform="translate(250,278)">
       <path d="M-30 -10 q0 -34 30 -34 q30 0 30 34 z" fill="${P.ambar}"/>
       <rect x="-38" y="-12" width="76" height="10" rx="5" fill="${P.ambar}"/></g>
     <g transform="translate(560,240)">
       <rect x="-90" y="-90" width="180" height="180" rx="20" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
       <circle cx="0" cy="-24" r="40" fill="${P.azul}" opacity=".16"/>
       <path d="M-20 -24 q20 -30 40 0 q-20 26 -40 0" fill="none" stroke="${P.azul}" stroke-width="5"/>
       <circle cx="0" cy="-24" r="9" fill="${P.azul}"/>
       <rect x="-56" y="34" width="112" height="9" rx="4.5" fill="${P.linha}" opacity=".4"/>
       <rect x="-56" y="56" width="76" height="9" rx="4.5" fill="${P.linha}" opacity=".4"/></g>
     <g transform="translate(120,180)">
       <rect x="-40" y="-40" width="80" height="80" rx="10" fill="${P.verde}" opacity=".18"/>
       <path d="M-16 2 l11 12 l22 -26" fill="none" stroke="${P.verde}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>` + fecha,

  rastreabilidade: (id) => abre(id) + tit(id, 'Identificação e rastreabilidade por lote') +
    `<g transform="translate(220,225)">
       <rect x="-110" y="-120" width="220" height="240" rx="16" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
       <rect x="-80" y="-92" width="120" height="12" rx="6" fill="${P.tinta}" opacity=".7"/>
       <g fill="${P.tinta}" opacity=".85" transform="translate(0,-10)">
         <rect x="-80" y="-40" width="6" height="80"/><rect x="-66" y="-40" width="12" height="80"/>
         <rect x="-46" y="-40" width="5" height="80"/><rect x="-34" y="-40" width="10" height="80"/>
         <rect x="-16" y="-40" width="6" height="80"/><rect x="-2" y="-40" width="14" height="80"/>
         <rect x="20" y="-40" width="6" height="80"/><rect x="34" y="-40" width="10" height="80"/>
         <rect x="52" y="-40" width="6" height="80"/><rect x="66" y="-40" width="12" height="80"/></g>
       <text x="0" y="86" text-anchor="middle" font-family="ui-monospace,monospace" font-size="19" font-weight="700" fill="${P.tinta}" opacity=".8">LOTE 2411-A7</text></g>
     <g stroke="${P.azul}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8">
       <path d="M340 225 h70"/><path d="M396 213 l14 12 l-14 12"/>
       <path d="M540 225 h70"/><path d="M596 213 l14 12 l-14 12"/></g>
     ${caixa(430, 185, 100, 80, P.azul2)}
     <g transform="translate(680,225)">
       <rect x="-60" y="-70" width="120" height="140" rx="12" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
       <rect x="-40" y="-46" width="80" height="8" rx="4" fill="${P.linha}" opacity=".45"/>
       <rect x="-40" y="-26" width="60" height="8" rx="4" fill="${P.linha}" opacity=".45"/>
       <rect x="-40" y="-6" width="76" height="8" rx="4" fill="${P.linha}" opacity=".45"/>
       <path d="M-20 34 l12 13 l30 -34" fill="none" stroke="${P.verde}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>` + fecha,

  reuniao: (id) => abre(id) + tit(id, 'Reunião entre auditor e auditado') + piso(374) +
    `<rect x="180" y="286" width="440" height="20" rx="10" fill="${P.aco}"/>
     <rect x="250" y="306" width="16" height="68" fill="${P.linha}"/><rect x="534" y="306" width="16" height="68" fill="${P.linha}"/>
     ${pessoa(280, 286, 1.15, P.azul)}${pessoa(520, 286, 1.15, P.verde)}${prancheta(360, 200, 0.8)}
     <g transform="translate(470,236)">
       <rect x="-40" y="-30" width="80" height="60" rx="8" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
       <rect x="-26" y="-14" width="52" height="7" rx="3.5" fill="${P.linha}" opacity=".45"/>
       <rect x="-26" y="2" width="34" height="7" rx="3.5" fill="${P.linha}" opacity=".45"/></g>
     <g transform="translate(400,110)" text-anchor="middle">
       <rect x="-140" y="-30" width="280" height="56" rx="28" fill="${P.claro}" stroke="${P.linha}" stroke-width="2"/>
       <text y="6" font-family="system-ui" font-size="17" font-weight="600" fill="${P.tinta}" opacity=".8">Escopo, critério e agenda</text></g>` + fecha
};

const apelidos: Record<string, string> = {
  producao: 'linha-producao', processo: 'linha-producao', estoque: 'armazem',
  recebimento: 'fornecedor', compras: 'fornecedor', medicao: 'calibracao',
  ensaio: 'laboratorio', pessoas: 'treinamento', melhoria: 'indicadores',
  epi: 'seguranca', lote: 'rastreabilidade', abertura: 'reuniao', acao: 'nao-conformidade'
};

export function renderIlustracao(nome: string): string {
  const chave = apelidos[nome] ?? nome;
  const cena = cenas[chave] ?? cenas.documento;
  return cena(chave);
}

export const ilustracoesDisponiveis = () => Object.keys(cenas);
