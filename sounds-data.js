// 카테고리 및 실제 자연 녹음(Field Recording) 기반 사운드 데이터
window.SOUND_CATEGORIES = [
  {
    id: 'birds',
    name: '새 소리 (실제 녹음)',
    icon: '🐦',
    desc: '실제 자연에서 녹음된 뻐꾸기, 소쩍새, 참새, 산새들의 생생한 울음소리',
    color: '#34d399'
  },
  {
    id: 'weather',
    name: '날씨 & 물 · 수중(물속)',
    icon: '🌊',
    desc: '실제 빗소리, 시냇물, 파도, 천둥부터 물속에 들어갔을 때 들리는 깊은 수중음까지',
    color: '#38bdf8'
  },
  {
    id: 'places',
    name: '장소 & 일상 공간 (실제 녹음)',
    icon: '🏮',
    desc: '실제 시장 장터의 활기, 공원 아이들 소리, 카페 라운지, 장작불, 산사 풍경 녹음본',
    color: '#fbbf24'
  },
  {
    id: 'wind',
    name: '바람 & 나무 (실제 녹음)',
    icon: '🍃',
    desc: '실제 숲을 스치는 바람과 나뭇잎이 사각거리는 자연 현장음',
    color: '#60a5fa'
  },
  {
    id: 'insects',
    name: '벌레 & 생물 (실제 녹음)',
    icon: '🦗',
    desc: '실제 귀뚜라미, 여름 매미, 풀벌레, 개구리, 꿀벌의 생생한 현장 녹음',
    color: '#a3e635'
  },
  {
    id: 'resonance',
    name: '공명음 & 싱잉볼 · 주파수',
    icon: '🧘',
    desc: '실제 티베트 싱잉볼 타격 녹음본과 432Hz/528Hz/슈만공명 정밀 힐링 주파수',
    color: '#c084fc'
  },
  {
    id: 'noise',
    name: '백색소음 & 자연 질감',
    icon: '📻',
    desc: '공간 소음을 부드럽게 감싸주는 핑크/브라운 노이즈와 아날로그 질감',
    color: '#f472b6'
  }
];

window.DEFAULT_SOUNDS = [
  // ================= 1. 새 소리 (100% 실제 현장 녹음) =================
  {
    id: 'bird_cuckoo',
    category: 'birds',
    name: '뻐꾸기 (실제 숲 녹음)',
    subtitle: '실제 숲속에서 녹음된 자연 그대로의 뻐꾸기 울음소리',
    icon: '🐦',
    audioUrl: 'audio/bird_cuckoo.mp3',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '불규칙 간격'],
    defaultDensity: 0.65
  },
  {
    id: 'bird_scops_owl',
    category: 'birds',
    name: '소쩍새 (실제 야간 녹음)',
    subtitle: '밤 숲에서 실제로 녹음된 맑고 아련한 소쩍새 소리',
    icon: '🦉',
    audioUrl: 'audio/bird_scops_owl.mp3',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '뻐꾸기와 궁합'],
    defaultDensity: 0.6
  },
  {
    id: 'bird_chorus',
    category: 'birds',
    name: '숲속 새들의 아침 합창 (실제 녹음)',
    subtitle: '새벽 숲에서 다양한 산새들이 일제히 지저귀는 생생한 현장음',
    icon: '🌲',
    audioUrl: 'audio/bird_chorus.ogg',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 현장녹음', '매장 인기 1위'],
    defaultDensity: 0.75
  },
  {
    id: 'bird_sparrows',
    category: 'birds',
    name: '참새 떼 지저귐 (실제 녹음)',
    subtitle: '나뭇가지에 모여 경쾌하게 재잘거리는 실제 참새 소리',
    icon: '🐤',
    audioUrl: 'audio/bird_sparrows.mp3',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '생기있는 아침'],
    defaultDensity: 0.7
  },
  {
    id: 'bird_nightingale',
    category: 'birds',
    name: '밤꾀꼬리 고운 노래 (실제 녹음)',
    subtitle: '풍성하고 아름다운 선율로 지저귀는 실제 꾀꼬리 녹음본',
    icon: '🎵',
    audioUrl: 'audio/bird_nightingale.mp3',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '아름다운 선율'],
    defaultDensity: 0.65
  },
  {
    id: 'bird_skylark',
    category: 'birds',
    name: '종달새 지저귐 (실제 녹음)',
    subtitle: '들판 위 하늘에서 맑게 울려 퍼지는 실제 종달새 소리',
    icon: '🎶',
    audioUrl: 'audio/bird_skylark.mp3',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '청아한 음색'],
    defaultDensity: 0.6
  },
  {
    id: 'bird_woodpecker',
    category: 'birds',
    name: '딱따구리 소리 (실제 녹음)',
    subtitle: '숲속 나무에서 울리는 실제 오색딱따구리 현장 녹음',
    icon: '🪵',
    audioUrl: 'audio/bird_woodpecker.mp3',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '숲속 포인트'],
    defaultDensity: 0.5
  },
  {
    id: 'bird_seagull',
    category: 'birds',
    name: '바닷가 갈매기 (실제 녹음)',
    subtitle: '실제 해안가에서 녹음된 생생한 갈매기 울음소리',
    icon: '🕊️',
    audioUrl: 'audio/bird_seagull.mp3',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '파도와 궁합'],
    defaultDensity: 0.55
  },

  // ================= 2. 날씨 & 물 · 수중(물속) 소리 (100% 실제 녹음) =================
  {
    id: 'water_underwater_deep',
    category: 'weather',
    name: '깊은 물속(수중) 잠수 소리',
    subtitle: '물속에 깊이 잠수했을 때 들리는 먹먹하고 평온한 실제 수중 파동음',
    icon: '🤿',
    audioUrl: 'audio/underwater_river.mp3',
    playStyle: 'continuous',
    baseRate: 0.85,
    tags: ['실제 수중녹음', '물속 고요함', '집중/이완'],
    defaultDensity: 0.7
  },
  {
    id: 'water_underwater_bubbles',
    category: 'weather',
    name: '물속 보글거리는 공기방울 & 물결',
    subtitle: '물속에서 공기방울이 보글보글 피어오르며 물결이 감싸는 소리',
    icon: '🫧',
    audioUrl: 'audio/underwater_bubbles.ogg',
    playStyle: 'continuous',
    baseRate: 0.92,
    tags: ['실제 수중녹음', '물방울 기포'],
    defaultDensity: 0.65
  },
  {
    id: 'water_underwater_abyss',
    category: 'weather',
    name: '심해(깊은 바다 속) 공명 사운드',
    subtitle: '아주 깊은 바닷속에 들어와 있는 듯 묵직하게 감싸는 초저역 수중음',
    icon: '🐋',
    audioUrl: 'audio/underwater_river.mp3',
    secondaryAudioUrl: 'audio/underwater_bubbles.ogg',
    playStyle: 'continuous',
    baseRate: 0.55,
    tags: ['실제 수중녹음', '심해 공명'],
    defaultDensity: 0.6
  },
  {
    id: 'weather_brook',
    category: 'weather',
    name: '시냇물 졸졸졸 (실제 계곡 녹음)',
    subtitle: '맑은 숲속 시냇물이 바위 사이로 흐르는 실제 고음질 녹음본',
    icon: '🏞️',
    audioUrl: 'audio/weather_brook.wav',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '청량한 물소리'],
    defaultDensity: 0.7
  },
  {
    id: 'weather_rain',
    category: 'weather',
    name: '차분하게 내리는 비 (실제 녹음)',
    subtitle: '실제 비 내리는 현장에서 녹음된 자연스럽고 포근한 빗소리',
    icon: '🌧️',
    audioUrl: 'audio/weather_rain.ogg',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '매장 배경 최적'],
    defaultDensity: 0.7
  },
  {
    id: 'weather_thunder',
    category: 'weather',
    name: '숲속 소나기와 먼 천둥 (실제 녹음)',
    subtitle: '여름 숲에 내리는 빗줄기와 멀리서 울리는 실제 천둥소리',
    icon: '🌩️',
    audioUrl: 'audio/weather_thunder.ogg',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '웅장한 현장감'],
    defaultDensity: 0.6
  },
  {
    id: 'weather_ocean',
    category: 'weather',
    name: '해변 파도 소리 (실제 녹음)',
    subtitle: '실제 바닷가 모래사장으로 밀려오고 빠져나가는 자연 파도 소리',
    icon: '🌊',
    audioUrl: 'audio/weather_ocean.wav',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '해변 휴양지'],
    defaultDensity: 0.65
  },
  {
    id: 'weather_waterfall',
    category: 'weather',
    name: '계곡 폭포수 물줄기 (실제 녹음)',
    subtitle: '시원하게 쏟아져 내리는 실제 폭포수 현장 녹음',
    icon: '💦',
    audioUrl: 'audio/weather_waterfall.ogg',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '시원한 마스킹'],
    defaultDensity: 0.65
  },
  {
    id: 'weather_cave_drops',
    category: 'weather',
    name: '떨어지는 물방울 소리 (실제 녹음)',
    subtitle: '조용한 공간에서 똑, 똑 떨어지는 실제 물방울 녹음본',
    icon: '💧',
    audioUrl: 'audio/weather_drops.ogg',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '물방울 포인트'],
    defaultDensity: 0.55
  },

  // ================= 3. 장소 & 일상 공간 (100% 실제 현장 녹음) =================
  {
    id: 'place_market',
    category: 'places',
    name: '전통 시장 장터 활기 (실제 현장 녹음)',
    subtitle: '실제 시장 거리의 자연스러운 발걸음과 상인·손님들의 활기찬 현장음',
    icon: '🏮',
    audioUrl: 'audio/place_market2.ogg',
    secondaryAudioUrl: 'audio/place_market.ogg',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 시장녹음', '생기있는 매장'],
    defaultDensity: 0.7
  },
  {
    id: 'place_market_night',
    category: 'places',
    name: '야시장 골목 웅성거림 (실제 녹음)',
    subtitle: '저녁 야시장의 정겹고 따뜻한 군중 백색소음 실제 녹음본',
    icon: '🌙',
    audioUrl: 'audio/place_market.ogg',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 야시장녹음', '따뜻한 온기'],
    defaultDensity: 0.65
  },
  {
    id: 'place_children',
    category: 'places',
    name: '공원 아이들 뛰어노는 소리 (실제 녹음)',
    subtitle: '실제 야외 공원에서 아이들이 밝게 웃고 뛰어노는 평화로운 현장음',
    icon: '🎈',
    audioUrl: 'audio/place_children.oga',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 공원녹음', '밝은 활기'],
    defaultDensity: 0.6
  },
  {
    id: 'place_children_beach',
    category: 'places',
    name: '해변/물가에서 노는 아이들 (실제 녹음)',
    subtitle: '물가에서 신나게 놀고 웃는 아이들의 생생한 야외 현장 녹음',
    icon: '🏖️',
    audioUrl: 'audio/place_children2.mp3',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 현장녹음', '생동감'],
    defaultDensity: 0.6
  },
  {
    id: 'place_cafe',
    category: 'places',
    name: '카페 & 레스토랑 라운지 (실제 녹음)',
    subtitle: '실제 카페·식당 안의 자연스러운 대화 소리와 달그락거리는 식기 소음',
    icon: '☕',
    audioUrl: 'audio/place_cafe.ogg',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 매장녹음', '카페 백색소음'],
    defaultDensity: 0.65
  },
  {
    id: 'place_campfire',
    category: 'places',
    name: '장작 타는 모닥불 (실제 녹음)',
    subtitle: '실제 캠프파이어 장작이 타닥타닥 타오르는 따뜻한 현장 녹음',
    icon: '🔥',
    audioUrl: 'audio/place_campfire.ogg',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 모닥불녹음', '아늑한 온기'],
    defaultDensity: 0.7
  },
  {
    id: 'place_windchime',
    category: 'places',
    name: '코시(Koshi) 풍경 종소리 (실제 녹음)',
    subtitle: '바람에 흔들리며 영롱하고 맑은 화음을 내는 실제 풍경 녹음본',
    icon: '🎐',
    audioUrl: 'audio/place_windchime.ogg',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 악기녹음', '힐링 풍경'],
    defaultDensity: 0.55
  },
  {
    id: 'place_train',
    category: 'places',
    name: '기차 여행 객실 소리 (실제 녹음)',
    subtitle: '실제 기차가 레일 위를 달릴 때 객실 안에서 들리는 리드미컬한 주행음',
    icon: '🚂',
    audioUrl: 'audio/place_train.ogg',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 기차녹음', '여행 무드'],
    defaultDensity: 0.6
  },

  // ================= 4. 바람 & 나무 (100% 실제 현장 녹음) =================
  {
    id: 'wind_breeze',
    category: 'wind',
    name: '자연 들판과 숲 바람 (실제 녹음)',
    subtitle: '실제 야외 숲과 들판에서 불어오는 자연 그대로의 바람 소리',
    icon: '🍃',
    audioUrl: 'audio/wind_breeze.mp3',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 바람녹음', '자연 호흡'],
    defaultDensity: 0.65
  },
  {
    id: 'wind_leaves',
    category: 'wind',
    name: '나뭇잎 사각거리는 소리 (실제 녹음)',
    subtitle: '바람에 나뭇잎과 수풀이 바스락거리며 흔들리는 실제 녹음본',
    icon: '🍂',
    audioUrl: 'audio/wind_leaves.wav',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '생생한 잎사귀'],
    defaultDensity: 0.65
  },
  {
    id: 'wind_pine',
    category: 'wind',
    name: '깊은 산골짜기 바람 (실제 녹음 저역)',
    subtitle: '실제 바람 녹음의 저역대를 살려 깊고 아늑하게 감싸는 산바람',
    icon: '🏔️',
    audioUrl: 'audio/wind_breeze.mp3',
    playStyle: 'continuous',
    baseRate: 0.72,
    tags: ['실제 바람녹음', '깊은 산림'],
    defaultDensity: 0.6
  },

  // ================= 5. 벌레 & 생물 (100% 실제 현장 녹음) =================
  {
    id: 'insect_crickets',
    category: 'insects',
    name: '가을밤 귀뚜라미 (실제 녹음)',
    subtitle: '실제 들판에서 녹음된 맑고 또렷한 귀뚜라미 울음소리',
    icon: '🦗',
    audioUrl: 'audio/insect_crickets.ogg',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '가을밤 정취'],
    defaultDensity: 0.65
  },
  {
    id: 'insect_grasshoppers',
    category: 'insects',
    name: '풀벌레·여치 울음소리 (실제 녹음)',
    subtitle: '여름과 가을 밤 풀숲에서 울리는 실제 풀벌레 녹음본',
    icon: '🌿',
    audioUrl: 'audio/insect_katydid.ogg',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '풀숲 현장감'],
    defaultDensity: 0.6
  },
  {
    id: 'insect_cicadas',
    category: 'insects',
    name: '한여름 숲 매미 합창 (실제 녹음)',
    subtitle: '실제 나무 위에서 울려 퍼지는 생생한 매미 합창 녹음본',
    icon: '☀️',
    audioUrl: 'audio/insect_cicadas.ogg',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '여름 계절감'],
    defaultDensity: 0.6
  },
  {
    id: 'insect_frogs',
    category: 'insects',
    name: '물가 개구리 울음소리 (실제 녹음)',
    subtitle: '실제 연못과 논두렁에서 정겹게 우는 개구리 현장 녹음',
    icon: '🐸',
    audioUrl: 'audio/insect_frogs.ogg',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '시골 밤 풍경'],
    defaultDensity: 0.6
  },
  {
    id: 'insect_bees',
    category: 'insects',
    name: '꽃밭 꿀벌 날갯짓 (실제 녹음)',
    subtitle: '꽃밭 사이를 날아다니는 실제 꿀벌 떼의 자연스러운 윙윙거림',
    icon: '🐝',
    audioUrl: 'audio/insect_bees.mp3',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '따스한 꽃밭'],
    defaultDensity: 0.55
  },

  // ================= 6. 공명음 & 싱잉볼 · 주파수 =================
  {
    id: 'res_singing_bowl',
    category: 'resonance',
    name: '티베트 싱잉볼 (실제 타격 녹음)',
    subtitle: '실제 티베트 싱잉볼을 타격하여 길게 퍼지는 깊고 맑은 배음 녹음본',
    icon: '🥣',
    audioUrl: 'audio/res_singing_bowl2.wav',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 싱잉볼녹음', '깊은 배음'],
    defaultDensity: 0.6
  },
  {
    id: 'res_crystal_bowl',
    category: 'resonance',
    name: '소형 싱잉볼 맑은 공명 (실제 녹음)',
    subtitle: '청아하고 투명한 여운을 남기는 실제 소형 싱잉볼 녹음본',
    icon: '💎',
    audioUrl: 'audio/res_singing_bowl.ogg',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 싱잉볼녹음', '맑은 정화'],
    defaultDensity: 0.55
  },
  {
    id: 'res_deep_gong_bowl',
    category: 'resonance',
    name: '저음 사찰 종/싱잉볼 공명 (실제 녹음 저역)',
    subtitle: '가슴 깊이 울리는 중후한 저역대 싱잉볼 실제 녹음 파동',
    icon: '🔔',
    audioUrl: 'audio/res_singing_bowl2.wav',
    playStyle: 'episodic',
    baseRate: 0.65,
    tags: ['실제 녹음 저역', '묵직한 여운'],
    defaultDensity: 0.5
  },
  {
    id: 'res_432hz',
    category: 'resonance',
    name: '432Hz 자연 조율 주파수',
    subtitle: '자연의 진동수와 공명하여 심신을 이완시키는 따뜻한 순수 주파수 패드',
    icon: '✨',
    synthType: 'res_432hz',
    tags: ['432Hz 정밀주파수', '명상/이완'],
    defaultDensity: 0.5
  },
  {
    id: 'res_528hz',
    category: 'resonance',
    name: '528Hz 솔페지오 긍정의 파동',
    subtitle: '밝고 따뜻한 에너지를 더해주는 528Hz 순수 배음 공명',
    icon: '🌟',
    synthType: 'res_528hz',
    tags: ['528Hz 정밀주파수', '공간 에너지'],
    defaultDensity: 0.5
  },
  {
    id: 'res_schumann',
    category: 'resonance',
    name: '7.83Hz 슈만 공명 (지구 주파수)',
    subtitle: '지구의 전자기장 공명 주파수를 가청 저음 드론과 결합',
    icon: '🌍',
    synthType: 'res_schumann',
    tags: ['7.83Hz 바이노럴', '어싱(Earthing)'],
    defaultDensity: 0.5
  },
  {
    id: 'res_theta',
    category: 'resonance',
    name: '6Hz 세타파 명상 바이노럴',
    subtitle: '깊은 휴식과 창의적 이완을 유도하는 좌우 주파수 공명',
    icon: '🧘',
    synthType: 'res_theta',
    tags: ['6Hz 뇌파동조', '스테레오 파동'],
    defaultDensity: 0.5
  },

  // ================= 7. 백색소음 & 자연 질감 =================
  {
    id: 'noise_pink',
    category: 'noise',
    name: '핑크 노이즈 (자연형 백색소음)',
    subtitle: '고주파를 부드럽게 깎아내어 귀가 가장 편안한 자연 배경음',
    icon: '🌸',
    synthType: 'noise_pink',
    tags: ['소음 마스킹', '장시간 재생 최적'],
    defaultDensity: 0.5
  },
  {
    id: 'noise_brown',
    category: 'noise',
    name: '브라운 노이즈 (깊은 저음 소음)',
    subtitle: '먼 폭포수나 깊은 동굴처럼 묵직하고 포근한 저역대 소음',
    icon: '🤎',
    synthType: 'noise_brown',
    tags: ['고급스러운 저음', '외부 소음 차단'],
    defaultDensity: 0.5
  },
  {
    id: 'noise_white',
    category: 'noise',
    name: '스무스 화이트 노이즈',
    subtitle: '전 대역을 고르게 채워주며 필터가 서서히 숨쉬는 백색소음',
    icon: '🤍',
    synthType: 'noise_white',
    tags: ['깔끔한 마스킹', '주파수 조절'],
    defaultDensity: 0.5
  },
  {
    id: 'noise_vinyl',
    category: 'noise',
    name: 'LP 바이닐 더스트 & 크래클',
    subtitle: '턴테이블 바늘이 LP판을 지날 때 나는 감성적인 아날로그 질감',
    icon: '💿',
    synthType: 'noise_vinyl',
    tags: ['레트로 매장', '감성 아날로그'],
    defaultDensity: 0.55
  }
];

// 사용자가 "+ 추가 / 제외" 모달에서 언제든 추가/제거할 수 있는 확장 사운드 보관함 (실제 녹음 기반)
window.EXPANSION_LIBRARY = [
  // 새 소리 확장 (실제 녹음)
  {
    id: 'exp_bird_turtledove',
    category: 'birds',
    name: '산비둘기 구구 소리 (실제 녹음)',
    subtitle: '차분한 아침 숲에서 낮고 포근하게 울리는 실제 산비둘기 녹음본',
    icon: '🕊️',
    audioUrl: 'audio/bird_turtledove.mp3',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '포근한 아침']
  },
  {
    id: 'exp_bird_kingfisher',
    category: 'birds',
    name: '물총새 맑은 울음 (실제 녹음)',
    subtitle: '물가 위를 스치며 또렷하게 울리는 실제 물총새 녹음본',
    icon: '💎',
    audioUrl: 'audio/bird_kingfisher.mp3',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '시냇물과 궁합']
  },
  {
    id: 'exp_bird_deep_owl',
    category: 'birds',
    name: '깊은 밤 수리부엉이 (실제 녹음)',
    subtitle: '밤 숲에서 낮고 중후하게 울리는 실제 수리부엉이 현장 녹음',
    icon: '🦉',
    audioUrl: 'audio/bird_deep_owl.mp3',
    playStyle: 'episodic',
    baseRate: 1.0,
    tags: ['실제 자연녹음', '심야 무드']
  },
  {
    id: 'exp_bird_distant_cuckoo',
    category: 'birds',
    name: '먼 산 너머 뻐꾸기 (원거리 녹음 톤)',
    subtitle: '기본 뻐꾸기와 함께 켜면 산 너머에서 화답하듯 들리는 두 번째 뻐꾸기',
    icon: '🏞️',
    audioUrl: 'audio/bird_cuckoo.mp3',
    playStyle: 'episodic',
    baseRate: 0.91,
    tags: ['실제 자연녹음', '뻐꾸기 이중창']
  },

  // 날씨 & 물 · 수중 확장 (실제 녹음)
  {
    id: 'exp_underwater_cave',
    category: 'weather',
    name: '수중 동굴 & 잠수 기포 공명 (실제 녹음)',
    subtitle: '물속 동굴 안에서 공기방울이 천천히 울려 퍼지는 신비로운 수중음',
    icon: '🪸',
    audioUrl: 'audio/underwater_bubbles.ogg',
    playStyle: 'continuous',
    baseRate: 0.68,
    tags: ['실제 수중녹음', '수중 동굴']
  },
  {
    id: 'exp_weather_gentle_stream',
    category: 'weather',
    name: '잔잔한 여울물 소리 (실제 녹음)',
    subtitle: '깊고 부드럽게 흐르는 개울물 실제 녹음',
    icon: '🏞️',
    audioUrl: 'audio/weather_brook.wav',
    playStyle: 'continuous',
    baseRate: 0.78,
    tags: ['실제 자연녹음', '부드러운 물결']
  },
  {
    id: 'exp_weather_heavy_wave',
    category: 'weather',
    name: '먼 바다 큰 파도 소리 (실제 녹음)',
    subtitle: '묵직하고 길게 밀려오는 동해 바다 파도 녹음',
    icon: '🌊',
    audioUrl: 'audio/weather_ocean.wav',
    playStyle: 'continuous',
    baseRate: 0.75,
    tags: ['실제 자연녹음', '깊은 바다']
  },

  // 장소 & 공간 확장 (실제 녹음)
  {
    id: 'exp_place_veranda_chime',
    category: 'places',
    name: '일상 처마 밑 풍경과 바람 (실제 녹음)',
    subtitle: '살랑이는 바람에 간헐적으로 흔들리는 실제 처마 풍경 현장음',
    icon: '🎐',
    audioUrl: 'audio/place_windchime2.ogg',
    playStyle: 'continuous',
    baseRate: 1.0,
    tags: ['실제 현장녹음', '고즈넉한 처마']
  },
  {
    id: 'exp_place_bonfire_deep',
    category: 'places',
    name: '대형 화로 굵은 장작불 (실제 녹음)',
    subtitle: '굵은 참나무 장작이 묵직하게 타오르는 저역대 모닥불 녹음',
    icon: '🪵',
    audioUrl: 'audio/place_campfire.ogg',
    playStyle: 'continuous',
    baseRate: 0.78,
    tags: ['실제 모닥불녹음', '묵직한 장작']
  },

  // 바람 & 나무 확장 (실제 녹음)
  {
    id: 'exp_wind_autumn_leaves',
    category: 'wind',
    name: '가을 낙엽 숲 바스락거림 (실제 녹음)',
    subtitle: '마른 낙엽들이 바람에 굴러가는 듯한 가을 숲 실제 녹음',
    icon: '🍁',
    audioUrl: 'audio/wind_leaves.wav',
    playStyle: 'continuous',
    baseRate: 0.82,
    tags: ['실제 자연녹음', '가을 정취']
  },

  // 벌레 & 생물 확장 (실제 녹음)
  {
    id: 'exp_insect_bell_cricket',
    category: 'insects',
    name: '맑은 고음 풀벌레/방울벌레 (실제 녹음)',
    subtitle: '은방울처럼 맑고 높은 음색으로 울리는 실제 풀벌레 소리',
    icon: '🔔',
    audioUrl: 'audio/insect_crickets.ogg',
    playStyle: 'episodic',
    baseRate: 1.22,
    tags: ['실제 자연녹음', '고운 밤소리']
  },
  {
    id: 'exp_insect_bullfrog',
    category: 'insects',
    name: '깊은 연못 큰 개구리 (실제 녹음)',
    subtitle: '연못가에서 낮고 묵직하게 울리는 저음 개구리 실제 녹음',
    icon: '🐸',
    audioUrl: 'audio/insect_frogs.ogg',
    playStyle: 'episodic',
    baseRate: 0.72,
    tags: ['실제 자연녹음', '밤 연못']
  },

  // 공명음 & 주파수 확장
  {
    id: 'exp_res_alpha_10hz',
    category: 'resonance',
    name: '10Hz 알파파 집중/안정 공명',
    subtitle: '차분하면서도 맑은 정신 상태를 돕는 10Hz 알파파',
    icon: '🧠',
    synthType: 'res_theta',
    pitchShift: 1.25,
    tags: ['10Hz 알파파', '업무/독서 매장']
  },
  {
    id: 'exp_res_174hz',
    category: 'resonance',
    name: '174Hz 안정과 평온 솔페지오',
    subtitle: '긴장을 풀어주는 가장 낮은 솔페지오 기초 주파수',
    icon: '🕯️',
    synthType: 'res_432hz',
    pitchShift: 0.402,
    tags: ['174Hz 저음 힐링', '스파/마사지']
  },
  {
    id: 'exp_res_285hz',
    category: 'resonance',
    name: '285Hz 에너지 회복 솔페지오',
    subtitle: '피로감을 덜어내고 포근한 안정감을 주는 285Hz 공명',
    icon: '🌿',
    synthType: 'res_432hz',
    pitchShift: 0.6597,
    tags: ['285Hz 솔페지오', '원기 회복']
  },
  {
    id: 'exp_res_396hz',
    category: 'resonance',
    name: '396Hz 근심 해방 솔페지오',
    subtitle: '무거운 기분을 떨쳐내고 평온함을 유도하는 396Hz 파동',
    icon: '🕊️',
    synthType: 'res_432hz',
    pitchShift: 0.9166,
    tags: ['396Hz 솔페지오', '마음 정화']
  },
  {
    id: 'exp_res_639hz',
    category: 'resonance',
    name: '639Hz 조화와 소통 솔페지오',
    subtitle: '대화하는 공간이나 라운지에 온화한 조화를 더하는 주파수',
    icon: '💛',
    synthType: 'res_528hz',
    pitchShift: 1.2102,
    tags: ['639Hz 솔페지오', '카페/라운지']
  },
  {
    id: 'exp_res_741hz',
    category: 'resonance',
    name: '741Hz 직관과 정화 솔페지오',
    subtitle: '공간 분위기를 맑고 깨끗하게 환기시켜 주는 고역 공명',
    icon: '💠',
    synthType: 'res_528hz',
    pitchShift: 1.4034,
    tags: ['741Hz 솔페지오', '공간 정화']
  },
  {
    id: 'exp_res_852hz',
    category: 'resonance',
    name: '852Hz 영적 각성 솔페지오',
    subtitle: '투명하고 신비로운 고주파 배음 패드',
    icon: '🔮',
    synthType: 'res_528hz',
    pitchShift: 1.6136,
    tags: ['852Hz 솔페지오', '명상/요가']
  }
];

// 매장용 추천 조합 프리셋 (실제 녹음 기반 + 수중 테마 포함)
window.STORE_PRESETS = [
  {
    id: 'preset_forest_bird',
    name: '🌿 실제 뻐꾸기·소쩍새가 우는 깊은 숲',
    desc: '뻐꾸기(실제녹음) + 소쩍새(실제녹음) + 산새 합창 + 시냇물 + 자연 바람',
    mix: {
      bird_cuckoo: { volume: 0.68, density: 0.65 },
      bird_scops_owl: { volume: 0.58, density: 0.6 },
      bird_chorus: { volume: 0.45, density: 0.7 },
      weather_brook: { volume: 0.50, density: 0.7 },
      wind_breeze: { volume: 0.38, density: 0.6 }
    }
  },
  {
    id: 'preset_underwater_sanctuary',
    name: '🤿 깊은 물속(수중) 고요한 오아시스',
    desc: '깊은 물속 잠수음 + 물속 보글거리는 공기방울 + 심해 공명 + 티베트 싱잉볼',
    mix: {
      water_underwater_deep: { volume: 0.75, density: 0.7 },
      water_underwater_bubbles: { volume: 0.52, density: 0.65 },
      water_underwater_abyss: { volume: 0.48, density: 0.6 },
      res_singing_bowl: { volume: 0.35, density: 0.45 }
    }
  },
  {
    id: 'preset_lively_store',
    name: '🏮 활기찬 전통 시장 & 공원 아이들 소리',
    desc: '전통 시장 장터(실제녹음) + 공원 아이들 소리(실제녹음) + 참새 떼 + 바람',
    mix: {
      place_market: { volume: 0.55, density: 0.7 },
      place_children: { volume: 0.45, density: 0.6 },
      bird_sparrows: { volume: 0.42, density: 0.65 },
      wind_leaves: { volume: 0.35, density: 0.6 }
    }
  },
  {
    id: 'preset_rainy_cafe',
    name: '🌧️ 비 오는 날의 카페 라운지 & 모닥불',
    desc: '차분한 빗소리(실제녹음) + 카페 라운지(실제녹음) + 장작 모닥불 + 먼 천둥',
    mix: {
      weather_rain: { volume: 0.62, density: 0.7 },
      place_cafe: { volume: 0.45, density: 0.65 },
      place_campfire: { volume: 0.55, density: 0.7 },
      weather_thunder: { volume: 0.35, density: 0.5 }
    }
  },
  {
    id: 'preset_night_nature',
    name: '🌙 고요한 밤의 정원 (소쩍새+귀뚜라미+풍경)',
    desc: '소쩍새(실제녹음) + 귀뚜라미(실제녹음) + 풀벌레 + 모닥불 + 코시 풍경',
    mix: {
      bird_scops_owl: { volume: 0.65, density: 0.6 },
      insect_crickets: { volume: 0.55, density: 0.65 },
      insect_grasshoppers: { volume: 0.40, density: 0.6 },
      place_campfire: { volume: 0.48, density: 0.65 },
      place_windchime: { volume: 0.38, density: 0.5 }
    }
  }
];
