/**
 * 文案池与随机逻辑（主进程可复用部分）
 */

const TITLE = 'Cyber-Sanity Auditor v1.0';
const SUBTITLE = '今日份的人类多样性观察日志';
const TAP_LABEL = '忍了 (Endure)';
const RESET_LABEL = '记忆抹除 (Lobotomy)';

function pick(list) {
  if (!list || list.length === 0) return '';
  return list[Math.floor(Math.random() * list.length)];
}

function pickMaybe(list, chance = 0.65) {
  if (!list?.length || Math.random() > chance) return null;
  return pick(list);
}

const TIERS = [
  {
    max: 0,
    rank: '佛系生命体',
    vibes: [
      '甚至还能再写 500 行代码。',
      '暂无傻逼入侵，世界保持虚假的和平。',
      '系统待机中，理智余额充足。',
      '此时的空气里，竟然只有咖啡的香气。',
      '甚至想给隔壁工位的绿植浇个水。'
    ],
  },
  {
    max: 10,
    rank: '职场受精卵',
    vibes: [
      '笑容还没消失，只是转移到了老板脸上。',
      '刚才是错觉吧？再忍忍，为了五险一金。',
      '收到，在做了（新建文件夹）。',
      '正在将“你没事吧”翻译为“好的收到”。',
      '初级防御系统启动：假装盯着显示器深思。',
      '尚未意识到问题的严重性。'
    ],
  },
  {
    max: 20,
    rank: '中度脑干缺失',
    vibes: [
      '现在的我，是一台只读不回的垃圾邮件过滤器。',
      '外部输入增加，微笑输出稳定。',
      '这个需求很有灵性，建议让它随风而去。',
      '正在练习如何不带感情地打出“哈哈”。',
      '刚才那声“老师”，听得我直接少活了半小时。',
      '逻辑层开始出现坏道，建议输入咖啡因。'
    ],
  },
  {
    max: 40,
    rank: '赛博雅库扎',
    vibes: [
      '建议开启「静音模式」，物理意义上的那种。',
      '正在练习钉钉已读后，假装自己已物理消失。',
      '工作流多次重置，灵魂小幅离家出走。',
      '现在的忍让，都是为了将来买得起最贵的墓地。',
      '正在构建反向屏蔽防火墙：听不见就不存在。',
      '理智正在蒸发，留下的全是反社会人格。'
    ],
  },
  {
    max: 60,
    rank: '心律齐整的尸体',
    vibes: [
      '我真傻，真的，我单知道这活儿不好干……',
      '血压已经跟上了 GPT 的生成速度。',
      '非计划沟通偏多，耐心库存告警。',
      '现在的我，是一块移动的办公桌填充物。',
      '刚才那个人说话的方式，让我想起了某种远古节肢动物。',
      '正在检索“如何优雅地在会议中假装信号不好”。'
    ],
  },
  {
    max: 80,
    rank: '灵魂出窍',
    vibes: [
      '肉体在工位，灵魂已经在北欧钓鱼了。',
      '输入源较多，边界感正在蒸发。',
      '打断频率高于预期，建议减少额外接入。',
      '我的眼睛还睁着，但我已经死了四十分钟了。',
      '正在通过观察窗外的一只麻雀，寻找生命的意义。',
      '谁再拍我肩膀，谁就是我这辈子的宿敌。'
    ],
  },
  {
    max: 99,
    rank: '功德大满贯',
    vibes: [
      '别点我，再点我就要触发办公桌自动弹射装置了。',
      '毁灭吧，累了。建议直接拨打精神卫生中心。',
      '响应成本正在上升，虚伪笑容即将欠费。',
      '由于过于愤怒，我已经达到了内心的极端宁静。',
      '甚至想在此时开一罐鲱鱼罐头，与所有人同归于尽。',
      '正在加载“赛博自爆”协议...'
    ],
  },
  {
    max: Infinity,
    rank: '众生平等',
    vibes: [
      '已进化为「赛博佛祖」，看谁都像一串 0 和 1。',
      '恭喜你，你已经圆寂了。当前状态：赛博舍利子。',
      '众生平等，今日打扰已升格为业力结算。',
      '我已经看不懂人类的语言了，请发送二进制。',
      '所有的沟通，最终都会在熵增中归于寂静。',
      '你赢了，你把一个活生生的人点成了一个计次器。'
    ],
  },
];


const HEAT_START = '#8BC48B';
const HEAT_END = '#A8A8A8';
const HEAT_MAX_COUNT = 100;

function getTier(count) {
  const n = Math.max(0, count);
  for (let i = 0; i < TIERS.length; i += 1) {
    if (n <= TIERS[i].max) {
      return {
        rank: TIERS[i].rank,
        vibe: pick(TIERS[i].vibes),
      };
    }
  }
  const last = TIERS[TIERS.length - 1];
  return { rank: last.rank, vibe: pick(last.vibes) };
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((v) => Math.round(v).toString(16).padStart(2, '0'))
    .join('')}`;
}

function lerpColor(a, b, t) {
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);
  const k = Math.max(0, Math.min(1, t));
  return rgbToHex(
    c1.r + (c2.r - c1.r) * k,
    c1.g + (c2.g - c1.g) * k,
    c1.b + (c2.b - c1.b) * k
  );
}

function getHeatLevel(count) {
  return Math.min(Math.max(0, count) / HEAT_MAX_COUNT, 1);
}

function getCardHeatColor(count) {
  return lerpColor(HEAT_START, HEAT_END, getHeatLevel(count));
}

function getCountStyle(count) {
  const heat = getHeatLevel(count);
  return { color: lerpColor('#3D7A3A', '#8A8A8A', heat), heat };
}

function getMood(count) {
  if (count <= 0) return 'calm';
  if (count <= 10) return 'hint';
  if (count <= 40) return 'busy';
  return 'tired';
}

function isLateNightHour(date = new Date()) {
  return date.getHours() === 2;
}

module.exports = {
  TITLE,
  SUBTITLE,
  TAP_LABEL,
  RESET_LABEL,
  pick,
  getTier,
  getCountStyle,
  getCardHeatColor,
  getHeatLevel,
  getMood,
  isLateNightHour,
};
