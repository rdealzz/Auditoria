/* ============================================================
   ilustracoes.ts — cenas vetoriais para cada etapa e setor.

   Tela de 1200×630 com zona segura definida: o app recorta em
   21/9 (herói da etapa) e em 4/3 (cartão do setor), então todo
   elemento essencial vive dentro de x 280–920 e y 70–560. O que
   fica fora é atmosfera e pode ser cortado sem perda.

   Servem como arte definitiva e como reserva das fotos em cache
   (ver scripts/baixar-imagens.mjs). Não dependem de rede.
   ============================================================ */

/* A paleta vive em variáveis CSS (ver globals.css): o SVG é inline no DOM,
   então acompanha o tema claro/escuro na hora, sem flash e sem JavaScript. */
const C = {
  ceuA: 'var(--il-ceu-a)', ceuB: 'var(--il-ceu-b)',
  paredeB: 'var(--il-parede)',
  pisoA: 'var(--il-piso-a)', pisoB: 'var(--il-piso-b)',
  tinta: 'var(--il-tinta)',
  linha: 'var(--il-linha)',
  aco: 'var(--il-aco)', acoClaro: 'var(--il-aco-claro)',
  azul: 'var(--il-azul)', azulClaro: 'var(--il-azul-claro)',
  verde: 'var(--il-verde)', verdeClaro: 'var(--il-verde-claro)',
  ambar: 'var(--il-ambar)',
  roxo: 'var(--il-roxo)',
  vermelho: 'var(--il-vermelho)',
  claro: 'var(--il-claro)',
  vidro: 'var(--il-vidro)',
  papelA: 'var(--il-papel-a)', papelB: 'var(--il-papel-b)',
  telaA: 'var(--il-tela-a)', telaB: 'var(--il-tela-b)',
  calcaA: 'var(--il-calca-a)', calcaB: 'var(--il-calca-b)',
  pele: 'var(--il-pele)', peleEscura: 'var(--il-pele-escura)',
  madeira: 'var(--il-madeira)',
  realce: 'var(--il-realce)', sombreado: 'var(--il-sombreado)'
};

const L = { chao: 472, topo: 70, base: 560 };

/* ─────────────────────── primitivas ─────────────────────── */

const defs = (id: string) => `<defs>
  <linearGradient id="ceu${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.ceuA}"/><stop offset="1" stop-color="${C.ceuB}"/></linearGradient>
  <linearGradient id="piso${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.pisoA}"/><stop offset="1" stop-color="${C.pisoB}"/></linearGradient>
  <linearGradient id="metal${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.acoClaro}"/><stop offset="1" stop-color="${C.aco}"/></linearGradient>
  <linearGradient id="papel${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.papelA}"/><stop offset="1" stop-color="${C.papelB}"/></linearGradient>
  <linearGradient id="tela${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.telaA}"/><stop offset="1" stop-color="${C.telaB}"/></linearGradient>
  <radialGradient id="sombra${id}" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${C.tinta}" stop-opacity=".26"/>
    <stop offset="0.65" stop-color="${C.tinta}" stop-opacity=".10"/>
    <stop offset="1" stop-color="${C.tinta}" stop-opacity="0"/></radialGradient>
  <radialGradient id="luz${id}" cx="0.5" cy="0.1" r="0.75">
    <stop offset="0" stop-color="${C.realce}" stop-opacity=".5"/>
    <stop offset="1" stop-color="${C.realce}" stop-opacity="0"/></radialGradient>
</defs>`;

/** Sombra macia no chão, sob um objeto. */
const sombra = (id: string, cx: number, cy: number, rx: number, ry = rx * 0.22) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#sombra${id})"/>`;

/** Parede de fundo com janelas industriais — dá profundidade sem roubar atenção. */
const parede = (id: string, y = L.chao) => {
  const janela = (x: number) =>
    `<g><rect x="${x}" y="120" width="118" height="150" rx="7" fill="${C.vidro}" opacity=".65"/>
       <rect x="${x}" y="120" width="118" height="150" rx="7" fill="none" stroke="${C.claro}" stroke-width="4" opacity=".7"/>
       <line x1="${x + 59}" y1="120" x2="${x + 59}" y2="270" stroke="${C.claro}" stroke-width="4" opacity=".7"/>
       <line x1="${x}" y1="195" x2="${x + 118}" y2="195" stroke="${C.claro}" stroke-width="4" opacity=".7"/></g>`;
  return `<rect x="0" y="0" width="1200" height="${y}" fill="url(#ceu${id})"/>
    <rect x="0" y="86" width="1200" height="${y - 86}" fill="${C.paredeB}" opacity=".55"/>
    ${janela(60)}${janela(238)}${janela(844)}${janela(1022)}
    <rect x="0" y="0" width="1200" height="${y}" fill="url(#luz${id})"/>`;
};

/** Chão com rodapé e faixa de circulação. */
const chao = (id: string, y = L.chao, faixa = true) =>
  `<rect x="0" y="${y}" width="1200" height="${630 - y}" fill="url(#piso${id})"/>
   <rect x="0" y="${y - 8}" width="1200" height="8" fill="${C.aco}" opacity=".55"/>
   ${faixa ? `<rect x="0" y="${y + 74}" width="1200" height="9" fill="${C.ambar}" opacity=".35"/>` : ''}`;

/** Caixa com volume: face frontal, topo iluminado e lateral sombreada. */
const caixa = (x: number, y: number, w: number, h: number, cor = C.ambar, d = 16) => {
  const topo = `${x},${y} ${x + d},${y - d} ${x + w + d},${y - d} ${x + w},${y}`;
  const lado = `${x + w},${y} ${x + w + d},${y - d} ${x + w + d},${y + h - d} ${x + w},${y + h}`;
  return `<g>
    <polygon points="${topo}" fill="${cor}"/><polygon points="${topo}" fill="${C.realce}" opacity=".30"/>
    <polygon points="${lado}" fill="${cor}"/><polygon points="${lado}" fill="${C.sombreado}" opacity=".16"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${cor}"/>
    <rect x="${x}" y="${y + h * 0.42}" width="${w}" height="${Math.max(4, h * 0.1)}" fill="${C.realce}" opacity=".38"/>
  </g>`;
};

/** Palete de madeira sob a carga. */
const palete = (x: number, y: number, w: number) =>
  `<g fill="${C.madeira}"><rect x="${x}" y="${y}" width="${w}" height="9" rx="2"/>
     <rect x="${x + 4}" y="${y + 9}" width="14" height="12" rx="2"/>
     <rect x="${x + w / 2 - 7}" y="${y + 9}" width="14" height="12" rx="2"/>
     <rect x="${x + w - 18}" y="${y + 9}" width="14" height="12" rx="2"/></g>`;

type OpcoesPessoa = { capacete?: boolean; cabelo?: string; bracoErguido?: boolean; espelhado?: boolean };

/**
 * Figura humana com ombros, braços e pernas — desenhada a partir dos pés (0,0).
 * Altura aproximada de 190 unidades em escala 1.
 */
const pessoa = (
  id: string, x: number, baseY: number, s = 1, cor = C.azul, o: OpcoesPessoa = {}
) => {
  const { capacete = false, cabelo = 'var(--il-cabelo)', bracoErguido = false, espelhado = false } = o;
  const bracoFrente = bracoErguido
    ? `<g transform="rotate(-58 -26 -128)"><rect x="-34" y="-134" width="15" height="62" rx="7.5" fill="${cor}"/>
         <circle cx="-26.5" cy="-76" r="8.5" fill="${C.pele}"/></g>`
    : `<rect x="-36" y="-134" width="15" height="60" rx="7.5" fill="${cor}"/>
       <circle cx="-28.5" cy="-76" r="8.5" fill="${C.pele}"/>`;
  return `<g transform="translate(${x},${baseY}) scale(${espelhado ? -s : s},${s})">
    ${sombra(id, 0, 2, 44 / (s || 1) * (s || 1))}
    <rect x="-20" y="-66" width="16" height="66" rx="8" fill="${C.calcaA}"/>
    <rect x="4" y="-66" width="16" height="66" rx="8" fill="${C.calcaB}"/>
    <path d="M-28 -62 q-6 -80 28 -80 q34 0 28 80 z" fill="${cor}"/>
    <path d="M-28 -62 q-6 -80 28 -80 q34 0 28 80 z" fill="${C.sombreado}" opacity=".08"/>
    <path d="M-28 -62 q-6 -80 28 -80 l0 160 z" fill="${C.realce}" opacity=".14"/>
    ${bracoFrente}
    <rect x="21" y="-134" width="15" height="60" rx="7.5" fill="${cor}"/>
    <circle cx="28.5" cy="-76" r="8.5" fill="${C.pele}"/>
    <rect x="-7" y="-158" width="14" height="20" rx="6" fill="${C.peleEscura}"/>
    <circle cx="0" cy="-176" r="24" fill="${C.pele}"/>
    ${capacete
      ? `<path d="M-27 -180 q0 -32 27 -32 q27 0 27 32 z" fill="${C.ambar}"/>
         <rect x="-33" y="-183" width="66" height="10" rx="5" fill="${C.ambar}"/>
         <rect x="-33" y="-183" width="66" height="4" rx="2" fill="${C.realce}" opacity=".35"/>`
      : `<path d="M-24 -184 q4 -22 24 -22 q20 0 24 22 q-10 -10 -24 -10 q-14 0 -24 10 z" fill="${cabelo}"/>`}
  </g>`;
};

/** Folha de papel/documento com linhas de texto. */
const documento = (
  id: string, x: number, y: number, w: number, h: number, linhas = 5, titulo?: string
) => {
  // As linhas ocupam só a metade superior do corpo, deixando o rodapé livre
  // para selos e carimbos sem sobreposição.
  const passo = 26;
  const texto = Array.from({ length: linhas }, (_, i) =>
    `<rect x="${x + 20}" y="${y + 46 + i * passo}" width="${(w - 40) * (i % 3 === 2 ? 0.62 : 0.92)}" height="7" rx="3.5" fill="${C.linha}" opacity=".42"/>`
  ).join('');
  const cabecalho = titulo
    ? `<text x="${x + w / 2}" y="${y + 30}" text-anchor="middle" font-family="system-ui,-apple-system" font-size="15" font-weight="700" fill="${C.tinta}" opacity=".75" letter-spacing="1">${titulo}</text>`
    : `<rect x="${x + 20}" y="${y + 18}" width="${w * 0.45}" height="10" rx="5" fill="${C.tinta}" opacity=".72"/>`;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="url(#papel${id})" stroke="${C.linha}" stroke-width="2" stroke-opacity=".45"/>
    ${cabecalho}
    ${texto}</g>`;
};

/** Prancheta com itens marcados. */
const prancheta = (id: string, x: number, y: number, s = 1) =>
  `<g transform="translate(${x},${y}) scale(${s})">
     <rect x="0" y="0" width="112" height="146" rx="11" fill="url(#papel${id})" stroke="${C.linha}" stroke-width="2" stroke-opacity=".5"/>
     <rect x="38" y="-10" width="36" height="18" rx="6" fill="${C.aco}"/>
     <rect x="44" y="-16" width="24" height="10" rx="5" fill="${C.linha}"/>
     ${[0, 1, 2].map((i) => `
       <path d="M18 ${42 + i * 34} l10 10 l19 -22" fill="none" stroke="${C.verde}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
       <rect x="56" y="${39 + i * 34}" width="38" height="7" rx="3.5" fill="${C.linha}" opacity=".45"/>`).join('')}
   </g>`;

/** Selo circular de aprovação. */
const selo = (cx: number, cy: number, r: number, cor = C.verde) =>
  `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="${cor}" opacity=".14"/>
     <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${cor}" stroke-width="3" stroke-opacity=".5"/>
     <path d="M${cx - r * 0.42} ${cy + r * 0.04} l${r * 0.28} ${r * 0.3} l${r * 0.56} -${r * 0.6}"
           fill="none" stroke="${cor}" stroke-width="${r * 0.2}" stroke-linecap="round" stroke-linejoin="round"/></g>`;

/* ─────────────────────── moldura ─────────────────────── */

const svg = (id: string, titulo: string, corpo: string) =>
  `<svg viewBox="0 0 1200 630" role="img" aria-labelledby="t${id}" preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
     <title id="t${id}">${titulo}</title>
     ${defs(id)}
     ${corpo}
   </svg>`;

type Cena = (id: string) => string;

/* ─────────────────────── cenas ─────────────────────── */

const cenas: Record<string, Cena> = {

  'linha-producao': (id) => svg(id, 'Linha de produção com esteira e operador acompanhando os parâmetros',
    `${parede(id)}${chao(id)}
     <!-- máquina ao fundo -->
     <g><rect x="700" y="196" width="300" height="276" rx="18" fill="url(#metal${id})"/>
        <rect x="726" y="222" width="150" height="106" rx="10" fill="url(#tela${id})"/>
        <path d="M742 302 l26 -34 l24 20 l30 -44 l30 58" fill="none" stroke="${C.azulClaro}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="742" y="344" width="118" height="9" rx="4.5" fill="${C.claro}" opacity=".5"/>
        <circle cx="754" cy="392" r="13" fill="${C.verde}"/><circle cx="792" cy="392" r="13" fill="${C.ambar}" opacity=".45"/>
        <rect x="900" y="222" width="76" height="200" rx="10" fill="${C.claro}" opacity=".5"/></g>
     <!-- esteira -->
     ${sombra(id, 600, 472, 380, 26)}
     <g><rect x="200" y="366" width="800" height="30" rx="15" fill="url(#metal${id})"/>
        <rect x="200" y="366" width="800" height="10" rx="5" fill="${C.realce}" opacity=".45"/>
        ${[248, 500, 752, 952].map((cx) => `<circle cx="${cx}" cy="381" r="19" fill="${C.tinta}" opacity=".7"/><circle cx="${cx}" cy="381" r="6" fill="${C.claro}"/>`).join('')}
        <rect x="234" y="396" width="16" height="76" fill="${C.aco}"/><rect x="946" y="396" width="16" height="76" fill="${C.aco}"/></g>
     ${caixa(276, 306, 74, 60, C.ambar)}${caixa(414, 306, 74, 60, C.azulClaro)}
     ${caixa(552, 306, 74, 60, C.ambar)}${caixa(690, 306, 74, 60, C.roxo)}
     ${pessoa(id, 360, 472, 1.02, C.azul, { capacete: true, bracoErguido: true })}`),

  documento: (id) => svg(id, 'Documento controlado: revisão vigente, aprovação e cópia obsoleta identificada',
    `${parede(id)}${chao(id, 520, false)}
     <!-- documento principal -->
     ${sombra(id, 600, 522, 210, 22)}
     <g transform="rotate(-2 600 300)">${documento(id, 458, 120, 288, 380, 6)}
       <rect x="478" y="316" width="122" height="36" rx="8" fill="${C.azul}" opacity=".14"/>
       <text x="539" y="341" text-anchor="middle" font-family="system-ui,-apple-system" font-size="19" font-weight="700" fill="${C.azul}">Rev. 05</text>
       <g transform="rotate(-9 602 424)">
         <rect x="504" y="394" width="196" height="60" rx="12" fill="none" stroke="${C.verde}" stroke-width="5" opacity=".85"/>
         <text x="602" y="434" text-anchor="middle" font-family="system-ui,-apple-system" font-size="24" font-weight="800" fill="${C.verde}" opacity=".92">APROVADO</text>
       </g>
     </g>
     ${selo(838, 202, 62)}
     <!-- cópia obsoleta -->
     <g transform="rotate(6 340 330)">
       <rect x="256" y="228" width="170" height="216" rx="10" fill="url(#papel${id})" stroke="${C.linha}" stroke-width="2" stroke-opacity=".4" opacity=".9"/>
       <g opacity=".45">${[0, 1, 2, 3].map((i) => `<rect x="278" y="${262 + i * 26}" width="${i === 3 ? 78 : 126}" height="7" rx="3.5" fill="${C.linha}"/>`).join('')}</g>
       <path d="M300 306 l82 68 M382 306 l-82 68" stroke="${C.vermelho}" stroke-width="9" stroke-linecap="round" opacity=".8"/>
       <rect x="272" y="396" width="138" height="32" rx="8" fill="${C.vermelho}" opacity=".16"/>
       <text x="341" y="419" text-anchor="middle" font-family="system-ui,-apple-system" font-size="17" font-weight="700" fill="${C.vermelho}">OBSOLETO</text>
     </g>`),

  armazem: (id) => svg(id, 'Prateleiras de almoxarifado com paletes identificados e etiqueta de lote',
    `${parede(id)}${chao(id, 500)}
     <!-- estruturas porta-palete -->
     ${[86, 700].map((bx) => `
       <g>${sombra(id, bx + 210, 500, 230, 18)}
         <rect x="${bx}" y="110" width="16" height="390" fill="url(#metal${id})"/>
         <rect x="${bx + 404}" y="110" width="16" height="390" fill="url(#metal${id})"/>
         <rect x="${bx - 6}" y="248" width="432" height="14" rx="4" fill="${C.aco}"/>
         <rect x="${bx - 6}" y="380" width="432" height="14" rx="4" fill="${C.aco}"/>
         <rect x="${bx - 6}" y="104" width="432" height="12" rx="4" fill="${C.aco}"/></g>`).join('')}
     ${palete(100, 236, 130)}${caixa(106, 168, 118, 68, C.ambar)}
     ${palete(258, 236, 130)}${caixa(264, 172, 118, 64, C.azulClaro)}
     ${palete(100, 368, 130)}${caixa(106, 300, 118, 68, C.roxo)}
     ${palete(258, 368, 130)}${caixa(264, 304, 118, 64, C.verde)}
     ${palete(714, 236, 130)}${caixa(720, 170, 118, 66, C.azulClaro)}
     ${palete(872, 236, 130)}${caixa(878, 168, 118, 68, C.ambar)}
     ${palete(714, 368, 130)}${caixa(720, 302, 118, 66, C.ambar)}
     ${palete(872, 368, 130)}${caixa(878, 300, 118, 68, C.roxo)}
     <!-- etiqueta de lote em destaque -->
     <g>${sombra(id, 600, 500, 96, 16)}
       <rect x="512" y="238" width="176" height="222" rx="14" fill="url(#papel${id})" stroke="${C.linha}" stroke-width="2" stroke-opacity=".5"/>
       <rect x="538" y="264" width="102" height="11" rx="5.5" fill="${C.tinta}" opacity=".7"/>
       <g fill="${C.tinta}" opacity=".85">
         ${[0, 12, 26, 38, 54, 68, 84, 98, 112].map((o, i) => `<rect x="${540 + o}" y="298" width="${i % 3 === 0 ? 10 : 5}" height="88"/>`).join('')}</g>
       <text x="600" y="418" text-anchor="middle" font-family="ui-monospace,monospace" font-size="19" font-weight="700" fill="${C.tinta}" opacity=".85">LOTE 2411-A7</text>
       <rect x="538" y="432" width="124" height="8" rx="4" fill="${C.linha}" opacity=".4"/></g>`),

  calibracao: (id) => svg(id, 'Instrumento de medição calibrado, com padrão rastreável e certificado',
    `${parede(id)}${chao(id, 500)}
     <!-- bancada -->
     ${sombra(id, 600, 500, 400, 20)}
     <g><rect x="180" y="404" width="840" height="26" rx="8" fill="url(#metal${id})"/>
        <rect x="180" y="404" width="840" height="9" rx="4" fill="${C.realce}" opacity=".5"/>
        <rect x="222" y="430" width="20" height="70" fill="${C.aco}"/><rect x="958" y="430" width="20" height="70" fill="${C.aco}"/></g>
     <!-- balança de precisão -->
     <g><rect x="380" y="330" width="230" height="74" rx="12" fill="url(#metal${id})"/>
        <rect x="404" y="240" width="182" height="90" rx="12" fill="url(#tela${id})"/>
        <text x="495" y="300" text-anchor="middle" font-family="ui-monospace,monospace" font-size="38" font-weight="700" fill="${C.verdeClaro}">10.000</text>
        <rect x="424" y="212" width="142" height="30" rx="7" fill="${C.aco}"/>
        <rect x="424" y="212" width="142" height="10" rx="5" fill="${C.realce}" opacity=".4"/>
        <!-- massa padrão -->
        <g><path d="M462 212 h66 l-11 -34 h-44 z" fill="${C.azul}"/>
           <path d="M462 212 h20 l-6 -34 h-11 z" fill="${C.realce}" opacity=".25"/>
           <path d="M481 178 q14 -22 28 0" fill="none" stroke="${C.azul}" stroke-width="7" stroke-linecap="round"/></g></g>
     <!-- certificado com rastreabilidade -->
     <g>${documento(id, 682, 208, 226, 196, 3, 'CERTIFICADO')}
        ${selo(795, 356, 36)}</g>
     <!-- etiqueta de calibração vigente -->
     <g transform="translate(252,286)">
       ${sombra(id, 8, 122, 74, 12)}
       <rect x="-62" y="-46" width="150" height="150" rx="14" fill="url(#papel${id})" stroke="${C.linha}" stroke-width="2" stroke-opacity=".45"/>
       <text x="13" y="-18" text-anchor="middle" font-family="system-ui,-apple-system" font-size="13" font-weight="700" fill="${C.tinta}" opacity=".7" letter-spacing=".5">CALIBRADO</text>
       <circle cx="13" cy="34" r="34" fill="none" stroke="${C.verde}" stroke-width="6" opacity=".85"/>
       <path d="M-3 34 l11 12 l21 -25" fill="none" stroke="${C.verde}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
       <text x="13" y="92" text-anchor="middle" font-family="ui-monospace,monospace" font-size="15" font-weight="700" fill="${C.tinta}" opacity=".7">val. 08/27</text>
       <rect x="6" y="104" width="14" height="30" fill="${C.aco}"/></g>`),

  laboratorio: (id) => svg(id, 'Bancada de laboratório com ensaios, microscópio e registro dos resultados',
    `${parede(id)}${chao(id, 500)}
     ${sombra(id, 600, 500, 400, 20)}
     <g><rect x="160" y="404" width="880" height="26" rx="8" fill="url(#metal${id})"/>
        <rect x="160" y="404" width="880" height="9" rx="4" fill="${C.realce}" opacity=".5"/>
        <rect x="200" y="430" width="20" height="70" fill="${C.aco}"/><rect x="980" y="430" width="20" height="70" fill="${C.aco}"/></g>
     <!-- erlenmeyer -->
     <g transform="translate(268,404)">
       <path d="M-26 -132 h52 v46 l40 86 h-132 l40 -86 z" fill="${C.claro}" stroke="${C.linha}" stroke-width="4" stroke-opacity=".55"/>
       <path d="M-56 -22 l16 -26 h80 l16 26 z" fill="${C.azulClaro}" opacity=".75"/>
       <rect x="-26" y="-140" width="52" height="12" rx="5" fill="${C.aco}"/></g>
     <!-- proveta -->
     <g transform="translate(400,404)">
       <rect x="-28" y="-136" width="56" height="136" rx="10" fill="${C.claro}" stroke="${C.linha}" stroke-width="4" stroke-opacity=".55"/>
       <rect x="-23" y="-62" width="46" height="58" rx="7" fill="${C.verdeClaro}" opacity=".8"/>
       <g stroke="${C.linha}" stroke-width="3" opacity=".6">${[-112, -92, -72, -52, -32].map((y) => `<path d="M-28 ${y} h15"/>`).join('')}</g></g>
     <!-- microscópio -->
     <g transform="translate(596,404)">
       <rect x="-64" y="-16" width="128" height="16" rx="6" fill="${C.tinta}" opacity=".85"/>
       <path d="M-30 -16 q-6 -66 26 -78 l12 20 q-20 12 -14 58 z" fill="${C.tinta}" opacity=".8"/>
       <rect x="-8" y="-118" width="34" height="52" rx="10" fill="${C.tinta}" opacity=".9"/>
       <circle cx="9" cy="-136" r="26" fill="${C.claro}" stroke="${C.linha}" stroke-width="4" stroke-opacity=".6"/>
       <circle cx="9" cy="-136" r="12" fill="${C.azul}" opacity=".55"/>
       <rect x="-40" y="-50" width="66" height="9" rx="4" fill="${C.aco}"/></g>
     <!-- registro -->
     ${pessoa(id, 884, 556, 1.16, C.verde, { cabelo: 'var(--il-cabelo)' })}
     ${prancheta(id, 726, 250, 1.05)}`),

  manutencao: (id) => svg(id, 'Manutenção preventiva de equipamento, com plano e registro do serviço',
    `${parede(id)}${chao(id)}
     ${sombra(id, 470, 472, 250, 20)}
     <!-- equipamento -->
     <g><rect x="240" y="186" width="460" height="286" rx="20" fill="url(#metal${id})"/>
        <rect x="240" y="186" width="460" height="12" rx="6" fill="${C.realce}" opacity=".45"/>
        <rect x="274" y="222" width="176" height="128" rx="12" fill="url(#tela${id})"/>
        <path d="M292 322 l30 -40 l26 22 l32 -46 l32 64" fill="none" stroke="${C.azulClaro}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="274" y="374" width="86" height="24" rx="12" fill="${C.verde}" opacity=".85"/>
        <rect x="374" y="374" width="52" height="24" rx="12" fill="${C.claro}" opacity=".55"/>
        <!-- engrenagem -->
        <g transform="translate(580,308)">
          <circle r="72" fill="none" stroke="${C.claro}" stroke-width="22" opacity=".9"/>
          <g stroke="${C.claro}" stroke-width="17" stroke-linecap="round" opacity=".9">
            <path d="M0 -88 v-22 M0 88 v22 M-88 0 h-22 M88 0 h22
                     M-62 -62 l-16 -16 M62 62 l16 16 M62 -62 l16 -16 M-62 62 l-16 16"/></g>
          <circle r="26" fill="${C.azul}"/><circle r="26" fill="${C.realce}" opacity=".2"/></g></g>
     <!-- técnico com chave -->
     ${pessoa(id, 800, 472, 1.05, C.ambar, { capacete: true, bracoErguido: true })}
     ${prancheta(id, 900, 244, 1)}`),

  expedicao: (id) => svg(id, 'Carregamento na expedição com conferência da carga contra o pedido',
    `${parede(id)}${chao(id)}
     ${sombra(id, 700, 472, 330, 22)}
     <!-- caminhão -->
     <g><rect x="420" y="212" width="400" height="196" rx="14" fill="url(#papel${id})" stroke="${C.linha}" stroke-width="2" stroke-opacity=".4"/>
        <rect x="420" y="212" width="400" height="14" rx="7" fill="${C.aco}" opacity=".6"/>
        <path d="M820 250 h76 l52 62 v96 h-128 z" fill="${C.azul}"/>
        <path d="M820 250 h76 l52 62 h-128 z" fill="${C.realce}" opacity=".16"/>
        <rect x="842" y="266" width="52" height="42" rx="7" fill="${C.vidro}"/>
        <rect x="420" y="396" width="528" height="16" rx="6" fill="${C.tinta}" opacity=".28"/>
        ${[496, 736, 890].map((cx) => `<circle cx="${cx}" cy="432" r="32" fill="${C.tinta}"/><circle cx="${cx}" cy="432" r="13" fill="${C.aco}"/>`).join('')}</g>
     <!-- carga -->
     ${caixa(452, 250, 84, 62, C.ambar)}${caixa(556, 250, 84, 62, C.azulClaro)}${caixa(660, 250, 84, 62, C.roxo)}
     ${caixa(452, 322, 84, 60, C.verde)}${caixa(556, 322, 84, 60, C.ambar)}${caixa(660, 322, 84, 60, C.azulClaro)}
     <!-- conferente -->
     ${pessoa(id, 258, 472, 1.06, C.verde, { capacete: true })}
     ${prancheta(id, 300, 250, 0.96)}`),

  treinamento: (id) => svg(id, 'Treinamento da equipe e registro da avaliação de eficácia',
    `${parede(id)}${chao(id, 500, false)}
     <!-- tela de apresentação -->
     <g>${sombra(id, 812, 500, 190, 16)}
        <rect x="620" y="112" width="384" height="252" rx="16" fill="url(#papel${id})" stroke="${C.linha}" stroke-width="2" stroke-opacity=".45"/>
        <rect x="654" y="146" width="188" height="14" rx="7" fill="${C.tinta}" opacity=".72"/>
        <path d="M656 306 l52 -66 l44 40 l58 -88 l66 114" fill="none" stroke="${C.azul}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="654" y="326" width="118" height="11" rx="5.5" fill="${C.linha}" opacity=".42"/>
        <rect x="806" y="364" width="12" height="136" fill="${C.aco}"/>
        <rect x="742" y="496" width="140" height="10" rx="5" fill="${C.aco}"/></g>
     <!-- participantes -->
     ${pessoa(id, 210, 500, 1.0, C.azul, { cabelo: 'var(--il-cabelo)' })}
     ${pessoa(id, 340, 500, 0.94, C.roxo, { cabelo: 'var(--il-cabelo)' })}
     ${pessoa(id, 466, 500, 1.02, C.verde, { cabelo: 'var(--il-cabelo)', espelhado: true })}
     <!-- certificado de eficácia -->
     <g>${documento(id, 236, 158, 200, 150, 3)}
        <g transform="translate(398,282)"><circle r="30" fill="${C.ambar}" opacity=".2"/>
          <path d="M-13 2 l9 10 l18 -21" fill="none" stroke="${C.ambar}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g></g>`),

  fornecedor: (id) => svg(id, 'Avaliação do fornecedor e inspeção do material recebido',
    `${parede(id)}${chao(id, 500)}
     <!-- ficha de avaliação -->
     <g>${sombra(id, 330, 500, 150, 16)}
        <rect x="184" y="128" width="292" height="336" rx="16" fill="url(#papel${id})" stroke="${C.linha}" stroke-width="2" stroke-opacity=".45"/>
        <rect x="214" y="160" width="170" height="13" rx="6.5" fill="${C.tinta}" opacity=".72"/>
        <g fill="${C.ambar}">${[0, 1, 2, 3].map((i) =>
          `<g transform="translate(${222 + i * 62},218)" opacity="${i === 3 ? '.28' : '1'}">
             <path d="M0 -24 l7.4 15 l16.6 2.4 l-12 11.7 l2.8 16.5 l-14.8 -7.8 l-14.8 7.8 l2.8 -16.5 l-12 -11.7 l16.6 -2.4 z"/></g>`).join('')}</g>
        <g opacity=".42">${[0, 1, 2].map((i) => `<rect x="214" y="${272 + i * 24}" width="${i === 2 ? 130 : 232}" height="8" rx="4" fill="${C.linha}"/>`).join('')}</g>
        <rect x="214" y="376" width="150" height="42" rx="10" fill="${C.verde}" opacity=".16"/>
        <text x="289" y="404" text-anchor="middle" font-family="system-ui,-apple-system" font-size="19" font-weight="700" fill="${C.verde}">Aprovado</text></g>
     <!-- caixa recebida -->
     ${sombra(id, 720, 500, 170, 18)}
     ${palete(618, 452, 210)}
     ${caixa(628, 300, 190, 152, C.ambar, 26)}
     <!-- lupa de inspeção -->
     <g transform="translate(902,238)">
       <circle r="58" fill="${C.claro}" opacity=".55"/>
       <circle r="52" fill="none" stroke="${C.azul}" stroke-width="9"/>
       <circle r="44" fill="${C.azulClaro}" opacity=".16"/>
       <path d="M36 36 l40 40" stroke="${C.azul}" stroke-width="15" stroke-linecap="round"/></g>`),

  'nao-conformidade': (id) => svg(id, 'Tratamento da não conformidade: da detecção à verificação da eficácia',
    `<rect width="1200" height="630" fill="url(#ceu${id})"/>
     <rect width="1200" height="630" fill="url(#luz${id})"/>
     <!-- alerta -->
     <g transform="translate(324,286)">
       ${sombra(id, 0, 132, 130, 20)}
       <path d="M0 -122 L126 100 H-126 Z" fill="${C.ambar}"/>
       <path d="M0 -122 L126 100 H0 Z" fill="${C.sombreado}" opacity=".10"/>
       <rect x="-12" y="-58" width="24" height="94" rx="12" fill="${C.claro}"/>
       <circle cx="0" cy="64" r="14" fill="${C.claro}"/></g>
     <!-- ciclo da causa raiz -->
     <g transform="translate(834,286)">
       <circle r="132" fill="none" stroke="${C.azul}" stroke-width="12" stroke-dasharray="30 20" opacity=".3" stroke-linecap="round"/>
       <circle r="84" fill="url(#papel${id})" stroke="${C.linha}" stroke-width="2" stroke-opacity=".45"/>
       <text y="-8" text-anchor="middle" font-family="system-ui,-apple-system" font-size="21" font-weight="700" fill="${C.tinta}" opacity=".82">Causa</text>
       <text y="22" text-anchor="middle" font-family="system-ui,-apple-system" font-size="21" font-weight="700" fill="${C.tinta}" opacity=".82">raiz</text>
       <g>${[[0, -132, C.vermelho], [132, 0, C.ambar], [0, 132, C.azul], [-132, 0, C.verde]].map(
            ([x, y, cor]) => `<circle cx="${x}" cy="${y}" r="19" fill="${cor}"/><circle cx="${x}" cy="${y}" r="19" fill="${C.realce}" opacity=".2"/>`).join('')}</g></g>
     <!-- fluxo -->
     <g transform="translate(600,528)" text-anchor="middle">
       <rect x="-372" y="-30" width="744" height="60" rx="30" fill="${C.claro}" opacity=".8"/>
       <text y="8" font-family="system-ui,-apple-system" font-size="21" font-weight="600" fill="${C.tinta}" opacity=".78">Detectar → conter → analisar → corrigir → verificar eficácia</text></g>`),

  indicadores: (id) => svg(id, 'Painel de indicadores da qualidade para a análise crítica',
    `<rect width="1200" height="630" fill="url(#ceu${id})"/>
     <rect width="1200" height="630" fill="url(#luz${id})"/>
     ${sombra(id, 600, 566, 400, 24)}
     <g><rect x="150" y="84" width="900" height="468" rx="26" fill="url(#papel${id})" stroke="${C.linha}" stroke-width="2" stroke-opacity=".4"/>
        <rect x="192" y="126" width="212" height="15" rx="7.5" fill="${C.tinta}" opacity=".72"/>
        <rect x="192" y="158" width="132" height="10" rx="5" fill="${C.linha}" opacity=".4"/>
        <!-- barras -->
        <g>${[[192, 372, C.azulClaro], [268, 320, C.azulClaro], [344, 268, C.azul], [420, 210, C.verde]].map(
            ([x, y, cor]) => `<rect x="${x}" y="${y}" width="56" height="${492 - Number(y)}" rx="10" fill="${cor}"/>
                              <rect x="${x}" y="${y}" width="56" height="14" rx="7" fill="${C.realce}" opacity=".3"/>`).join('')}
           <line x1="180" y1="492" x2="516" y2="492" stroke="${C.linha}" stroke-width="3" opacity=".35"/></g>
        <!-- tendência -->
        <g><path d="M596 440 q86 -28 128 -100 q42 -72 128 -108" fill="none" stroke="${C.ambar}" stroke-width="6" stroke-linecap="round"/>
           <g fill="${C.ambar}"><circle cx="596" cy="440" r="11"/><circle cx="724" cy="340" r="11"/><circle cx="852" cy="232" r="11"/></g>
           <g fill="${C.claro}"><circle cx="596" cy="440" r="4.5"/><circle cx="724" cy="340" r="4.5"/><circle cx="852" cy="232" r="4.5"/></g></g>
        <!-- anel -->
        <g transform="translate(898,430)">
          <circle r="64" fill="none" stroke="${C.linha}" stroke-width="17" opacity=".2"/>
          <circle r="64" fill="none" stroke="${C.verde}" stroke-width="17" stroke-linecap="round"
                  stroke-dasharray="402" stroke-dashoffset="100" transform="rotate(-90)"/>
          <text y="10" text-anchor="middle" font-family="system-ui,-apple-system" font-size="28" font-weight="700" fill="${C.tinta}">75%</text></g></g>`),

  seguranca: (id) => svg(id, 'Uso efetivo de EPI e ambiente de trabalho sinalizado',
    `${parede(id)}${chao(id)}
     <!-- placa de sinalização -->
     <g>${sombra(id, 842, 472, 130, 16)}
        <rect x="836" y="300" width="14" height="172" fill="${C.aco}"/>
        <rect x="702" y="150" width="282" height="164" rx="18" fill="${C.azul}"/>
        <rect x="702" y="150" width="282" height="164" rx="18" fill="${C.realce}" opacity=".08"/>
        <g transform="translate(775,232)"><circle r="48" fill="${C.claro}" opacity=".2"/>
          <path d="M0 -40 l32 12 v22 c0 20 -13 33 -32 40 c-19 -7 -32 -20 -32 -40 v-22 z" fill="${C.claro}"/>
          <path d="M-13 4 l9 10 l19 -22" fill="none" stroke="${C.azul}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>
        <g fill="${C.claro}" opacity=".9"><rect x="838" y="204" width="112" height="12" rx="6"/>
          <rect x="838" y="232" width="82" height="12" rx="6" opacity=".7"/>
          <rect x="838" y="260" width="98" height="12" rx="6" opacity=".7"/></g></g>
     <!-- colaborador com EPI completo -->
     ${pessoa(id, 388, 472, 1.28, C.azul, { capacete: true })}
     <g transform="translate(388,308)"><rect x="-31" y="-14" width="62" height="20" rx="10" fill="${C.tinta}" opacity=".55"/></g>
     <!-- extintor sinalizado, com etiqueta de inspeção -->
     <g transform="translate(186,472)">
       ${sombra(id, 0, 2, 52, 12)}
       <g transform="translate(0,-244)">
         <rect x="-42" y="-42" width="84" height="84" rx="12" fill="${C.vermelho}"/>
         <rect x="-42" y="-42" width="84" height="84" rx="12" fill="${C.realce}" opacity=".08"/>
         <path d="M-9 -22 h18 v22 h22 v18 h-22 v22 h-18 v-22 h-22 v-18 h22 z" fill="${C.claro}"/></g>
       <rect x="-34" y="-146" width="68" height="146" rx="18" fill="${C.vermelho}"/>
       <rect x="-34" y="-146" width="24" height="146" rx="12" fill="${C.realce}" opacity=".22"/>
       <rect x="-14" y="-172" width="28" height="28" rx="7" fill="${C.tinta}" opacity=".8"/>
       <path d="M-14 -166 q-26 -6 -30 14" fill="none" stroke="${C.tinta}" stroke-width="7" stroke-linecap="round" opacity=".7"/>
       <rect x="-28" y="-96" width="56" height="34" rx="6" fill="${C.claro}" opacity=".9"/>
       <g transform="translate(0,-79)">
         <path d="M-13 0 l9 10 l19 -22" fill="none" stroke="${C.verde}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g></g>`),

  rastreabilidade: (id) => svg(id, 'Identificação e rastreabilidade do lote ao longo do processo',
    `<rect width="1200" height="630" fill="url(#ceu${id})"/>
     <rect width="1200" height="630" fill="url(#luz${id})"/>
     ${chao(id, 520, false)}
     <!-- etiqueta -->
     <g>${sombra(id, 262, 520, 120, 16)}
        <rect x="140" y="152" width="244" height="286" rx="18" fill="url(#papel${id})" stroke="${C.linha}" stroke-width="2" stroke-opacity=".45"/>
        <rect x="172" y="184" width="132" height="12" rx="6" fill="${C.tinta}" opacity=".72"/>
        <g fill="${C.tinta}" opacity=".88">
          ${[0, 14, 30, 44, 62, 78, 96, 112, 130, 148, 166].map((o, i) =>
            `<rect x="${174 + o}" y="222" width="${i % 3 === 0 ? 11 : 5}" height="130"/>`).join('')}</g>
        <text x="262" y="386" text-anchor="middle" font-family="ui-monospace,monospace" font-size="22" font-weight="700" fill="${C.tinta}" opacity=".85">LOTE 2411-A7</text>
        <rect x="172" y="402" width="180" height="9" rx="4.5" fill="${C.linha}" opacity=".4"/></g>
     <!-- setas -->
     <g stroke="${C.azul}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".85">
       <path d="M420 296 h96"/><path d="M498 278 l20 18 l-20 18"/>
       <path d="M700 296 h96"/><path d="M778 278 l20 18 l-20 18"/></g>
     <!-- produto -->
     ${sombra(id, 608, 520, 110, 16)}
     ${caixa(542, 216, 132, 156, C.azulClaro, 22)}
     <!-- registro -->
     <g>${sombra(id, 938, 520, 106, 16)}
        ${documento(id, 838, 176, 200, 250, 5)}
        ${selo(938, 384, 40)}</g>`),

  reuniao: (id) => svg(id, 'Reunião entre auditor e auditado alinhando escopo, critério e agenda',
    `${parede(id)}${chao(id, 500)}
     <!-- balão de pauta -->
     <g transform="translate(600,132)" text-anchor="middle">
       <rect x="-232" y="-42" width="464" height="80" rx="40" fill="url(#papel${id})" stroke="${C.linha}" stroke-width="2" stroke-opacity=".45"/>
       <path d="M-18 36 l18 26 l18 -26 z" fill="${C.claro}" stroke="${C.linha}" stroke-width="2" stroke-opacity=".3"/>
       <text y="8" font-family="system-ui,-apple-system" font-size="25" font-weight="600" fill="${C.tinta}" opacity=".82">Escopo, critério e agenda</text></g>
     <!-- pessoas atrás da mesa -->
     ${pessoa(id, 386, 452, 1.16, C.azul, { cabelo: 'var(--il-cabelo)' })}
     ${pessoa(id, 814, 452, 1.16, C.verde, { cabelo: 'var(--il-cabelo)', espelhado: true })}
     <!-- mesa -->
     ${sombra(id, 600, 500, 320, 18)}
     <g><rect x="288" y="384" width="624" height="28" rx="10" fill="url(#metal${id})"/>
        <rect x="288" y="384" width="624" height="10" rx="5" fill="${C.realce}" opacity=".5"/>
        <rect x="336" y="412" width="20" height="88" fill="${C.aco}"/><rect x="844" y="412" width="20" height="88" fill="${C.aco}"/></g>
     <!-- documentos sobre a mesa -->
     ${prancheta(id, 500, 268, 0.78)}
     <g transform="rotate(-4 660 350)">${documento(id, 610, 296, 140, 88, 2)}</g>`)
};

/* Setores e etapas reaproveitam as mesmas cenas por apelido. */
const apelidos: Record<string, string> = {
  producao: 'linha-producao', processo: 'linha-producao', estoque: 'armazem',
  recebimento: 'fornecedor', compras: 'fornecedor', medicao: 'calibracao',
  ensaio: 'laboratorio', pessoas: 'treinamento', melhoria: 'indicadores',
  epi: 'seguranca', lote: 'rastreabilidade', abertura: 'reuniao', acao: 'nao-conformidade'
};

export function renderIlustracao(nome: string): string {
  const chave = apelidos[nome] ?? nome;
  const cena = cenas[chave] ?? cenas.documento;
  // O sufixo do id evita colisão entre os gradientes de duas cenas na mesma página.
  return cena(chave.replace(/[^a-z]/g, ''));
}

export const ilustracoesDisponiveis = () => Object.keys(cenas);
