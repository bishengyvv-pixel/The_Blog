export interface Poem {
  lines: string[]
  author: string
  lang: 'zh' | 'en'
  /** 英文诗专用字体：'brush'(Nanum Brush Script) | 'script'(La Belle Aurore)，默认 'brush' */
  font?: 'brush' | 'script'
}

export const POEMS: Poem[] = [
  // ── 中文古诗 ──────────────────────────────────────────
  {
    lang: 'zh',
    lines: ['白日依山尽，', '黄河入海流。', '欲穷千里目，', '更上一层楼。'],
    author: '—— 王之涣《登鹳雀楼》',
  },
  {
    lang: 'zh',
    lines: ['春眠不觉晓，', '处处闻啼鸟。', '夜来风雨声，', '花落知多少。'],
    author: '—— 孟浩然《春晓》',
  },
  {
    lang: 'zh',
    lines: ['床前明月光，', '疑是地上霜。', '举头望明月，', '低头思故乡。'],
    author: '—— 李白《静夜思》',
  },
  {
    lang: 'zh',
    lines: ['千山鸟飞绝，', '万径人踪灭。', '孤舟蓑笠翁，', '独钓寒江雪。'],
    author: '—— 柳宗元《江雪》',
  },
  {
    lang: 'zh',
    lines: ['锄禾日当午，', '汗滴禾下土。', '谁知盘中餐，', '粒粒皆辛苦。'],
    author: '—— 李绅《悯农》',
  },
  {
    lang: 'zh',
    lines: ['独在异乡为异客，', '每逢佳节倍思亲。', '遥知兄弟登高处，', '遍插茱萸少一人。'],
    author: '—— 王维《九月九日忆山东兄弟》',
  },
  {
    lang: 'zh',
    lines: ['故人西辞黄鹤楼，', '烟花三月下扬州。', '孤帆远影碧空尽，', '唯见长江天际流。'],
    author: '—— 李白《黄鹤楼送孟浩然之广陵》',
  },
  {
    lang: 'zh',
    lines: ['好雨知时节，', '当春乃发生。', '随风潜入夜，', '润物细无声。'],
    author: '—— 杜甫《春夜喜雨》',
  },
  // ── 英文诗 ────────────────────────────────────────────
  {
    lang: 'en',
    font: 'brush',
    lines: [
      'Two roads diverged in a yellow wood,',
      'And sorry I could not travel both—',
      'I took the one less traveled by,',
      'And that has made all the difference.',
    ],
    author: '— Robert Frost, The Road Not Taken',
  },
  {
    lang: 'en',
    font: 'brush',
    lines: [
      'Do not go gentle into that good night,',
      'Old age should burn and rave at close of day;',
      'Rage, rage against the dying of the light.',
    ],
    author: '— Dylan Thomas',
  },
  {
    lang: 'en',
    font: 'script',
    lines: [
      'I have not failed.',
      "I've just found",
      "10,000 ways that won't work.",
    ],
    author: '— Thomas Edison',
  },
  {
    lang: 'en',
    font: 'script',
    lines: [
      'The only way to do great work',
      'is to love what you do.',
    ],
    author: '— Steve Jobs',
  },
  {
    lang: 'en',
    font: 'script',
    lines: [
      'First, solve the problem.',
      'Then, write the code.',
    ],
    author: '— John Johnson',
  },
  {
    lang: 'en',
    font: 'script',
    lines: [
      'Any fool can write code',
      'that a computer can understand.',
      'Good programmers write code',
      'that humans can understand.',
    ],
    author: '— Martin Fowler',
  },
]

export function pickRandomPoem(): Poem {
  return POEMS[Math.floor(Math.random() * POEMS.length)]
}
