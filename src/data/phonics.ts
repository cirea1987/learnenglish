export interface Phonic {
  id: string
  family: string
  word: string
  letters: { char: string; sound: string; audio: string }[]
  wordAudio: string
  image: string
  cn: string
}

const sounds: Record<string, string> = {
  a: '/æ/', e: '/e/', i: '/ɪ/', o: '/ɒ/', u: '/ʌ/',
  b: '/b/', c: '/k/', d: '/d/', f: '/f/', g: '/g/',
  h: '/h/', j: '/dʒ/', k: '/k/', l: '/l/', m: '/m/',
  n: '/n/', p: '/p/', q: '/kw/', r: '/r/', s: '/s/',
  t: '/t/', v: '/v/', w: '/w/', x: '/ks/', y: '/j/', z: '/z/',
}

const cnMap: Record<string, string> = {
  cat: '猫', bat: '蝙蝠', hat: '帽子', mat: '垫子', rat: '老鼠', sat: '坐（过去式）',
  fan: '风扇', man: '男人', pan: '平底锅', van: '面包车', can: '能/罐头',
  cap: '帽子', map: '地图', tap: '水龙头', nap: '小睡', lap: '大腿',
  bed: '床', red: '红色', led: '带领', wed: '结婚', fed: '喂（过去式）',
  pen: '钢笔', hen: '母鸡', ten: '十', men: '男人（复数）', den: '窝',
  pet: '宠物', net: '网', wet: '湿的', vet: '兽医', jet: '喷气式飞机',
  pig: '猪', big: '大的', dig: '挖', wig: '假发', fig: '无花果',
  pin: '别针', bin: '箱子', fin: '鱼鳍', win: '赢', tin: '锡',
  sit: '坐', hit: '打', kit: '工具包', bit: '一点', lit: '点亮',
  dog: '狗', log: '木头', fog: '雾', hog: '猪', jog: '慢跑',
  pot: '锅', dot: '点', hot: '热的', cot: '小床', got: '得到（过去式）',
  hop: '跳', mop: '拖把', top: '顶部', pop: '砰', cop: '警察',
  bug: '虫子', rug: '小地毯', mug: '马克杯', hug: '拥抱', jug: '水壶',
  bun: '小圆面包', sun: '太阳', run: '跑', fun: '乐趣', nun: '修女',
  cut: '切', hut: '小屋', nut: '坚果', mud: '泥', cup: '杯子',
}

const emojiMap: Record<string, string> = {
  cat: '🐱', bat: '🦇', hat: '🎩', mat: '🧘', rat: '🐀', sat: '🪑',
  fan: '🪭', man: '👨', pan: '🍳', van: '🚐', can: '🥫',
  cap: '🧢', map: '🗺️', tap: '🚰', nap: '😴', lap: '🦵',
  bed: '🛏️', red: '🔴', led: '💡', wed: '💍', fed: '🍼',
  pen: '🖊️', hen: '🐔', ten: '🔟', men: '👬', den: '🦁',
  pet: '🐶', net: '🕸️', wet: '💧', vet: '👩‍⚕️', jet: '✈️',
  pig: '🐷', big: '🐘', dig: '⛏️', wig: '👩‍🦱', fig: '🌿',
  pin: '🧷', bin: '🗑️', fin: '🐠', win: '🏆', tin: '🥫',
  sit: '🪑', hit: '👊', kit: '🧰', bit: '🍫', lit: '🕯️',
  dog: '🐶', log: '🪵', fog: '🌫️', hog: '🐷', jog: '🏃',
  pot: '🍲', dot: '🔴', hot: '🥵', cot: '🛏️', got: '✅',
  hop: '🐰', mop: '🧹', top: '🔝', pop: '🎈', cop: '👮',
  bug: '🐛', rug: '🧶', mug: '☕', hug: '🤗', jug: '🍶',
  bun: '🥯', sun: '☀️', run: '🏃', fun: '🎉', nun: '✝️',
  cut: '✂️', hut: '🛖', nut: '🥜', mud: '💩', cup: '☕',
}

function makePhonic(id: string, word: string): Phonic {
  const chars = word.split('')
  const family = '-' + chars.slice(1).join('')
  return {
    id,
    family,
    word,
    letters: chars.map((char) => ({ char, sound: sounds[char] ?? '', audio: `/audio/phonics/${char}.mp3` })),
    wordAudio: `/audio/words/${word}.mp3`,
    image: `/images/words/${word}.png`,
    cn: cnMap[word] ?? word,
  }
}

export const phonics: Phonic[] = [
  // -at 词族
  makePhonic('cvc-at-1', 'cat'),
  makePhonic('cvc-at-2', 'bat'),
  makePhonic('cvc-at-3', 'hat'),
  makePhonic('cvc-at-4', 'mat'),
  makePhonic('cvc-at-5', 'rat'),
  // -an 词族
  makePhonic('cvc-an-1', 'fan'),
  makePhonic('cvc-an-2', 'man'),
  makePhonic('cvc-an-3', 'pan'),
  makePhonic('cvc-an-4', 'van'),
  makePhonic('cvc-an-5', 'can'),
  // -ap 词族
  makePhonic('cvc-ap-1', 'cap'),
  makePhonic('cvc-ap-2', 'map'),
  makePhonic('cvc-ap-3', 'tap'),
  makePhonic('cvc-ap-4', 'nap'),
  makePhonic('cvc-ap-5', 'lap'),
  // -ed 词族
  makePhonic('cvc-ed-1', 'bed'),
  makePhonic('cvc-ed-2', 'red'),
  makePhonic('cvc-ed-3', 'led'),
  makePhonic('cvc-ed-4', 'wed'),
  makePhonic('cvc-ed-5', 'fed'),
  // -en 词族
  makePhonic('cvc-en-1', 'pen'),
  makePhonic('cvc-en-2', 'hen'),
  makePhonic('cvc-en-3', 'ten'),
  makePhonic('cvc-en-4', 'men'),
  makePhonic('cvc-en-5', 'den'),
  // -et 词族
  makePhonic('cvc-et-1', 'pet'),
  makePhonic('cvc-et-2', 'net'),
  makePhonic('cvc-et-3', 'wet'),
  makePhonic('cvc-et-4', 'vet'),
  makePhonic('cvc-et-5', 'jet'),
  // -ig 词族
  makePhonic('cvc-ig-1', 'pig'),
  makePhonic('cvc-ig-2', 'big'),
  makePhonic('cvc-ig-3', 'dig'),
  makePhonic('cvc-ig-4', 'wig'),
  makePhonic('cvc-ig-5', 'fig'),
  // -in 词族
  makePhonic('cvc-in-1', 'pin'),
  makePhonic('cvc-in-2', 'bin'),
  makePhonic('cvc-in-3', 'fin'),
  makePhonic('cvc-in-4', 'win'),
  makePhonic('cvc-in-5', 'tin'),
  // -it 词族
  makePhonic('cvc-it-1', 'sit'),
  makePhonic('cvc-it-2', 'hit'),
  makePhonic('cvc-it-3', 'kit'),
  makePhonic('cvc-it-4', 'bit'),
  makePhonic('cvc-it-5', 'lit'),
  // -og 词族
  makePhonic('cvc-og-1', 'dog'),
  makePhonic('cvc-og-2', 'log'),
  makePhonic('cvc-og-3', 'fog'),
  makePhonic('cvc-og-4', 'hog'),
  makePhonic('cvc-og-5', 'jog'),
  // -ot 词族
  makePhonic('cvc-ot-1', 'pot'),
  makePhonic('cvc-ot-2', 'dot'),
  makePhonic('cvc-ot-3', 'hot'),
  makePhonic('cvc-ot-4', 'cot'),
  makePhonic('cvc-ot-5', 'got'),
  // -op 词族
  makePhonic('cvc-op-1', 'hop'),
  makePhonic('cvc-op-2', 'mop'),
  makePhonic('cvc-op-3', 'top'),
  makePhonic('cvc-op-4', 'pop'),
  makePhonic('cvc-op-5', 'cop'),
  // -ug 词族
  makePhonic('cvc-ug-1', 'bug'),
  makePhonic('cvc-ug-2', 'rug'),
  makePhonic('cvc-ug-3', 'mug'),
  makePhonic('cvc-ug-4', 'hug'),
  makePhonic('cvc-ug-5', 'jug'),
  // -un 词族
  makePhonic('cvc-un-1', 'bun'),
  makePhonic('cvc-un-2', 'sun'),
  makePhonic('cvc-un-3', 'run'),
  makePhonic('cvc-un-4', 'fun'),
  makePhonic('cvc-un-5', 'nun'),
  // -ut 词族
  makePhonic('cvc-ut-1', 'cut'),
  makePhonic('cvc-ut-2', 'hut'),
  makePhonic('cvc-ut-3', 'nut'),
  makePhonic('cvc-ut-4', 'mud'),
  makePhonic('cvc-ut-5', 'cup'),
]

export function getPhonicEmoji(word: string): string {
  return emojiMap[word] ?? '📖'
}
