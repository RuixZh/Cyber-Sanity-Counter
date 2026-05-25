(function () {
  const TITLE = 'Cyber-Sanity Auditor v1.0';
  const SUBTITLE = '今日份的人类多样性观察日志';
  const TAP_LABEL = '忍了 (Endure)';
  const RESET_LABEL = '记忆抹除 (Lobotomy)';

  function pick(list) {
    if (!list || list.length === 0) return '';
    return list[Math.floor(Math.random() * list.length)];
  }

  function pickMaybe(list, chance = 0.7) {
    if (!list?.length || Math.random() > chance) return null;
    return pick(list);
  }

  const TIERS = [
    {
      max: 0,
      rank: '出厂设置',
      vibes: [
        '甚至还能再写 500 行代码。',
        '暂无傻逼入侵，世界保持虚假的和平。',
        '系统待机中，理智余额充足。',
      ],
    },
    {
      max: 10,
      rank: '温顺工具人',
      vibes: [
        '笑容还没消失，只是转移到了老板脸上。',
        '刚才是错觉吧？再忍忍，为了五险一金。',
        '收到，在做了（新建文件夹）。',
      ],
    },
    {
      max: 20,
      rank: '职业微笑脸',
      vibes: [
        '现在的我，是一台只读不回的垃圾邮件过滤器。',
        '外部输入增加，微笑输出稳定。',
        '这个需求很有灵性，建议让它随风而去。',
      ],
    },
    {
      max: 40,
      rank: '薪水小偷',
      vibes: [
        '建议开启「静音模式」，物理意义上的那种。',
        '正在练习钉钉已读后，假装自己已物理消失。',
        '工作流多次重置，灵魂小幅离家出走。',
      ],
    },
    {
      max: 60,
      rank: '赛博祥林嫂',
      vibes: [
        '我真傻，真的，我单知道这活儿不好干……',
        '血压已经跟上了 GPT 的生成速度。',
        '非计划沟通偏多，耐心库存告警。',
      ],
    },
    {
      max: 80,
      rank: '灵魂脱壳',
      vibes: [
        '肉体在工位，灵魂已经在北欧钓鱼了。',
        '输入源较多，边界感正在蒸发。',
        '打断频率高于预期，建议减少额外接入。',
      ],
    },
    {
      max: 99,
      rank: '人间大炮',
      vibes: [
        '别点我，再点我就要触发办公桌自动弹射装置了。',
        '毁灭吧，累了。建议直接拨打精神卫生中心。',
        '响应成本正在上升，虚伪笑容即将欠费。',
      ],
    },
    {
      max: Infinity,
      rank: '无欲无求',
      vibes: [
        '已进化为「赛博佛祖」，看谁都像一串 0 和 1。',
        '恭喜你，你已经圆寂了。当前状态：赛博舍利子。',
        '众生平等，今日打扰已升格为业力结算。',
      ],
    },
  ];

  const BUBBLE_WORK = [
    '收到，在做了（新建文件夹）',
    '这个逻辑，产品经理听了都得报警。',
    '刚才说话的那个人，他有脑子吗？',
    '正在将愤怒转化为脂肪...',
    '您有一条新的「五年高考三年模拟」式需求。',
    '又一位野生甲方路过，请深呼吸。',
    '这活儿要是能成，我当场把键盘吃了。',
    '需求文档比红楼梦还厚，结论比微博还短。',
    '对方说「很简单」，我听到了警报声。',
    '会议结束了吗？没有。那继续忍。',
  ];

  const BUBBLE_HYPNOSIS = [
    '莫生气，气死没人理。',
    '我在修禅，我在修禅，我在修禅。',
    '只要我不尴尬，尴尬的就是老板。',
    '为了下个月的房租，我忍。',
    '深呼吸，把脏话咽回去，咽回去……',
    '微笑是职业妆，不是心情。',
    '忍一时风平浪静，忍一世乳腺增生（划掉）。',
    '今日目标：活着下班。',
  ];

  const BUBBLE_CYBER = [
    '+1 功德，-1 阳寿。',
    '叮！您的职业倦怠值已到账。',
    '正在连接名为「辞职」的幻想服务器...',
    '业力 +1，KPI 不变。',
    '赛博木鱼敲了一下，老板听不见。',
    '这一下记进云端，删不掉的那种。',
    '功德簿已更新，孟婆表示排队很长。',
  ];

  const BUBBLE_EXTRA = [
    '好的呢（内心：不好）',
    '明白，这就去改第十版。',
    '感谢指点，指得我血压升高。',
    '已读，装死中，勿扰。',
    '这个点找我？你是懂节奏的。',
    '又忍了一次，优秀打工人认证。',
  ];

  const LUNCH_BUBBLES = [
    '干饭魂升起！别记了，饭菜凉了是对厨师最大的不尊重。',
    '12 点了，先吃饭，傻逼下午再对付。',
    '干饭不积极，思想有问题（但下午继续忍）。',
  ];

  const OFFWORK_BUBBLES = [
    '这个点还加次数？那是另外的价钱！',
    '检测到紧急加塞需求，建议执行「尿遁」策略。',
    '下班铃没响，但灵魂已经打卡走了。',
    '17:30 后的打扰，按加班费率计费了吗？',
  ];

  const LATE_NIGHT_BUBBLES = [
    '你还没走？公司是你家，工资没多少，骨灰没处撒。',
    '计数器提醒您：当前的每一次点击，都是在给老板换明年的法拉利。',
    '此时的点击双倍计入功德。原因：老板还没死，你也没睡。',
    '深夜加班，连计数器都想给你放产假。',
  ];

  const MONDAY_BUBBLES = [
    '今天是周一，计数器建议你直接从 10 开始起步。',
    '周一早安，昨晚的怨气已自动续费。',
    '新的一周，旧的折磨，熟悉的配方。',
  ];

  const RESET_CONFIRM_LINES = [
    '你确定要原谅这群把PDF当成视频播放器的人吗？',
    '确定要清空吗？抹掉数字容易，抹掉心里的老茧难。',
    '恭喜，您已成功触发「自欺欺人」技能，是否重置苦难计数？',
    '数字可以归零，创伤记忆正在后台同步。',
    '要假装今天什么都没发生过吗？很有勇气。',
    '一键原谅，明日再战（明日未必更好）。',
  ];

  const RESET_CONFIRM_SUBS = [
    '点击确定，你将重新获得一张虚伪的笑脸。',
    '取消=继续记仇；确定=短暂失忆。',
    '友情提示：傻逼不会因为你清零而消失。',
  ];

  const RESET_SUCCESS_LINES = [
    '历史被重写了，你又是那个单纯的少年（个屁）。',
    '记忆删除成功，欢迎回到第一关，菜鸟。',
    '账单已清，下一次崩溃预计在 5 分钟后。',
    '虚伪的笑脸已重新加载。',
    '清零完成，怨气缓存已释放 3%。',
    '今日重启为出厂设置，祝你好运（不会有的）。',
  ];

  const REBIRTH_TEMPLATES = [
    (x) => `昨天的你被折磨了 ${x} 次。新的一天，祝你遇到的人都有逻辑。`,
    (x) => `系统已自动回收昨天的怨气（${x} 次）。今日运势：宜摸鱼，忌认真。`,
    (x) => `西西弗斯又把石头推到了山脚。昨日 ${x} 次，请开始你今天的表演。`,
    () => '00:00。旧的业障已消除，新的苦难正在加载，早上好，打工人。',
    () => '系统已自动回收昨天的怨气。今日运势：宜摸鱼，忌认真。',
    () => '新的一天，新的折磨，熟悉的工位。',
    () => '西西弗斯又把石头推到了山脚。请开始你今天的表演。',
  ];

  const EGG_FISH_POLICE = [
    '你已经两小时没被打扰了，你是被公司优化了吗？',
    '两小时无记录，要么在摸鱼，要么在开会（也是摸鱼）。',
    '安静得可怕，建议确认自己还在组织架构里。',
  ];

  const EGG_SPAM_CLICK = [
    '别点了！CPU都快烧成舍利子了！去喝口水吧，这题没解。',
    '手别点了，再点就要触发「桌面弹射」彩蛋了。',
    '计数器求饶：我知道你很气，但键盘是无辜的。',
    '连点模式已熔断，建议去楼下买杯奶茶续命。',
  ];

  const EGG_DOUBLE_MERIT = [
    '此时的点击双倍计入功德。原因：老板还没死，你也没睡。',
    '凌晨 2 点，每一次打扰都算双倍业障。',
  ];

  const EGG_404 = [
    '理智已丢失，建议重启人生。',
    '404：理智 Not Found，请检查人生路由配置。',
  ];

  /** 职场真心话大冒险 — 计次器中部跑马灯 */
  const TRUTH_MARQUEE = [
    '关于那个方案，我有个不成熟的建议（我想让你重做）。',
    '我们在齐心协力地浪费彼此的时间。',
    '只要我不努力，老板就没法过上他想要的生活。',
    '刚才开会的那个小时，我的大脑皮层正在打呼噜。',
    '所谓协同，就是一群人围在一起讨论谁去填坑。',
    '我现在的理智值，比我的余额还要低。',
    '这个需求的优先级是 P0，意味着它明天就会被 P1 取代。',
    '你拍了拍我的肩膀，顺便拍散了我所有的灵感。',
    '表面在对齐，实际在甩锅，大家都懂。',
    '进度条卡在 99%，就像我的人生。',
  ];

  function getRandomTruthMarquee(exclude) {
    const pool = TRUTH_MARQUEE.filter((line) => line !== exclude);
    return pick(pool.length ? pool : TRUTH_MARQUEE);
  }

  const LIFE_START = '#8BC48B';
  const LIFE_END = '#A8A8A8';
  const HEAT_MAX_COUNT = 100;

  function getTier(count) {
    const n = Math.max(0, count);
    for (let i = 0; i < TIERS.length; i += 1) {
      if (n <= TIERS[i].max) {
        return { rank: TIERS[i].rank, vibe: pick(TIERS[i].vibes) };
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
    return lerpColor(LIFE_START, LIFE_END, getHeatLevel(count));
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

  function isLunchTime(date = new Date()) {
    const h = date.getHours();
    return h >= 12 && h < 13;
  }

  function isOffWorkTime(date = new Date()) {
    const h = date.getHours();
    const m = date.getMinutes();
    if (h === 17 && m >= 30) return true;
    if (h === 18 && m < 30) return true;
    return false;
  }

  function isLateNightClick(date = new Date()) {
    return date.getHours() >= 22;
  }

  function isMonday(date = new Date()) {
    return date.getDay() === 1;
  }

  function isLateNightHour(date = new Date()) {
    return date.getHours() === 2;
  }

  function getContextualBubble(date = new Date()) {
    if (isLunchTime(date)) return pick(LUNCH_BUBBLES);
    if (isOffWorkTime(date)) return pick(OFFWORK_BUBBLES);
    if (isLateNightClick(date)) return pick(LATE_NIGHT_BUBBLES);
    if (isMonday(date)) return pick(MONDAY_BUBBLES);
    return null;
  }

  function getClickBubble(date = new Date()) {
    const contextual = getContextualBubble(date);
    if (contextual) return contextual;
    const pool = [
      ...BUBBLE_WORK,
      ...BUBBLE_HYPNOSIS,
      ...BUBBLE_CYBER,
      ...BUBBLE_EXTRA,
    ];
    return pick(pool);
  }

  function getRandomResetConfirm() {
    return pick(RESET_CONFIRM_LINES);
  }

  function getRandomResetConfirmSub() {
    return pick(RESET_CONFIRM_SUBS);
  }

  function getRandomResetSuccess() {
    return pick(RESET_SUCCESS_LINES);
  }

  function getRandomRebirth(previousCount) {
    const tpl = pick(REBIRTH_TEMPLATES);
    return tpl(typeof previousCount === 'number' ? previousCount : 0);
  }

  function getRandomFishPolice() {
    return pick(EGG_FISH_POLICE);
  }

  function getRandomSpamClick() {
    return pick(EGG_SPAM_CLICK);
  }

  function getRandom404() {
    return pick(EGG_404);
  }

  function getRandomDoubleMerit() {
    return pick(EGG_DOUBLE_MERIT);
  }

  function getShakeProfile(count) {
    const n = Math.max(0, count);
    return {
      shakes: Math.min(4 + Math.floor(n / 8), 16),
      amplitude: Math.min(Math.round(2 + n * 0.1), 10),
      intervalMs: Math.max(14, 32 - Math.floor(n / 6)),
    };
  }

  window.copyModule = {
    TITLE,
    SUBTITLE,
    TAP_LABEL,
    RESET_LABEL,
    getTier,
    getCountStyle,
    getCardHeatColor,
    getHeatLevel,
    getMood,
    getClickBubble,
    getRandomResetConfirm,
    getRandomResetConfirmSub,
    getRandomResetSuccess,
    getRandomRebirth,
    getRandomFishPolice,
    getRandomSpamClick,
    getRandom404,
    getRandomDoubleMerit,
    getRandomTruthMarquee,
    getShakeProfile,
    isLateNightHour,
  };
})();
