// 메인 UI 및 매장용 사운드 믹서 컨트롤러 (실제 현장 녹음 기반 + 추가/제외 양방향 관리)

document.addEventListener('DOMContentLoaded', () => {
  const engine = new window.NatureAudioEngine();

  // 사용자가 제외한 기본 사운드 ID 목록 로드 (v2: 실제 녹음 버전)
  let excludedDefaultIds = [];
  const savedExcluded = localStorage.getItem('nature_excluded_defaults_v2');
  if (savedExcluded) {
    try {
      excludedDefaultIds = JSON.parse(savedExcluded);
    } catch (e) {}
  }

  // 전체 활성 사운드 목록 구성 (제외되지 않은 기본 사운드 + 추가된 확장/커스텀 사운드)
  let sounds = window.DEFAULT_SOUNDS.filter(s => !excludedDefaultIds.includes(s.id));

  const savedCustomSounds = localStorage.getItem('nature_custom_sounds_v2');
  if (savedCustomSounds) {
    try {
      const parsed = JSON.parse(savedCustomSounds);
      parsed.forEach(cs => {
        if (!sounds.some(s => s.id === cs.id)) {
          sounds.push(cs);
        }
      });
    } catch (e) {}
  }

  // 각 사운드의 현재 상태 (volume: 0~1, density: 0.1~1)
  const soundStates = {};
  function ensureSoundState(s) {
    if (!soundStates[s.id]) {
      soundStates[s.id] = {
        volume: 0,
        lastVolume: 0.60,
        density: s.defaultDensity ?? 0.65
      };
    }
  }
  sounds.forEach(ensureSoundState);

  // 프리셋 목록 (기본 매장 프리셋 + 사용자 저장 프리셋)
  let presets = [...window.STORE_PRESETS];
  const savedUserPresets = localStorage.getItem('nature_user_presets_v2');
  if (savedUserPresets) {
    try {
      presets = [...presets, ...JSON.parse(savedUserPresets)];
    } catch (e) {}
  }

  let currentCategoryFilter = 'all';
  let searchQuery = '';
  let activePresetId = null;
  let modalFilterCat = 'all';

  // DOM 참조
  const presetsListEl = document.getElementById('presetsList');
  const activeMixTagsEl = document.getElementById('activeMixTags');
  const activeCountLabelEl = document.getElementById('activeCountLabel');
  const categoryTabsEl = document.getElementById('categoryTabs');
  const categoriesContainerEl = document.getElementById('categoriesContainer');
  const searchInputEl = document.getElementById('searchInput');

  const masterVolSlider = document.getElementById('masterVolSlider');
  const masterVolText = document.getElementById('masterVolText');
  const driftSlider = document.getElementById('driftSlider');
  const driftValText = document.getElementById('driftValText');
  const btnMuteAll = document.getElementById('btnMuteAll');
  const btnRandomMix = document.getElementById('btnRandomMix');
  const btnResetMix = document.getElementById('btnResetMix');
  const btnSavePreset = document.getElementById('btnSavePreset');
  const btnOpenGlobalAdd = document.getElementById('btnOpenGlobalAdd');

  // 모달 참조
  const addSoundModal = document.getElementById('addSoundModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const expansionListContainer = document.getElementById('expansionListContainer');
  const customFileCategory = document.getElementById('customFileCategory');
  const customSynthCategory = document.getElementById('customSynthCategory');
  const modalCatFilter = document.getElementById('modalCatFilter');
  const chkAutoPlayOnAdd = document.getElementById('chkAutoPlayOnAdd');
  const btnAddAllVisible = document.getElementById('btnAddAllVisible');
  const btnRemoveAllVisible = document.getElementById('btnRemoveAllVisible');
  const btnRestoreDefaults = document.getElementById('btnRestoreDefaults');

  function saveSoundsStateToStorage() {
    localStorage.setItem('nature_excluded_defaults_v2', JSON.stringify(excludedDefaultIds));
    const customList = sounds.filter(
      s => !window.DEFAULT_SOUNDS.some(d => d.id === s.id) && !s.customAudioUrl?.startsWith('blob:')
    );
    localStorage.setItem('nature_custom_sounds_v2', JSON.stringify(customList));
  }

  // 1. 카테고리 탭 렌더링
  function renderCategoryTabs() {
    let html = `
      <button class="cat-tab ${currentCategoryFilter === 'all' ? 'active' : ''}" data-cat="all">
        🌈 전체 카테고리 보기 (${sounds.length})
      </button>
    `;
    window.SOUND_CATEGORIES.forEach(cat => {
      const count = sounds.filter(s => s.category === cat.id).length;
      html += `
        <button class="cat-tab ${currentCategoryFilter === cat.id ? 'active' : ''}" data-cat="${cat.id}">
          ${cat.icon} ${cat.name} (${count})
        </button>
      `;
    });
    categoryTabsEl.innerHTML = html;

    categoryTabsEl.querySelectorAll('.cat-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategoryFilter = btn.dataset.cat;
        renderCategoryTabs();
        renderCategoriesAndSounds();
      });
    });
  }

  // 2. 매장 프리셋 렌더링
  function renderPresets() {
    presetsListEl.innerHTML = presets.map(p => `
      <div class="preset-chip ${activePresetId === p.id ? 'active' : ''}" data-id="${p.id}">
        <div class="p-title">
          <span>${p.name}</span>
          ${p.isUser ? `<span class="del-preset" data-del="${p.id}" title="프리셋 삭제" style="color:#f87171; font-size:0.75rem;">✕</span>` : ''}
        </div>
        <div class="p-desc">${p.desc}</div>
      </div>
    `).join('');

    presetsListEl.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        if (e.target.classList.contains('del-preset')) {
          const delId = e.target.dataset.del;
          presets = presets.filter(pr => pr.id !== delId);
          saveUserPresetsToStorage();
          renderPresets();
          return;
        }
        applyPreset(chip.dataset.id);
      });
    });
  }

  function applyPreset(presetId) {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;
    activePresetId = presetId;

    sounds.forEach(s => {
      ensureSoundState(s);
      const target = preset.mix[s.id];
      const st = soundStates[s.id];
      if (target) {
        st.volume = target.volume;
        st.lastVolume = target.volume;
        if (target.density !== undefined) st.density = target.density;
        engine.setSoundState(s, st.volume, st.density);
      } else {
        st.volume = 0;
        engine.setSoundState(s, 0);
      }
    });

    renderPresets();
    updateAllCardsUI();
    renderActiveMixBar();
    requestWakeLock();
  }

  // 3. 카테고리 및 사운드 카드 렌더링
  function renderCategoriesAndSounds() {
    const catsToShow = window.SOUND_CATEGORIES.filter(cat =>
      currentCategoryFilter === 'all' || cat.id === currentCategoryFilter
    );

    categoriesContainerEl.innerHTML = catsToShow.map(cat => {
      const catSounds = sounds.filter(s => {
        if (s.category !== cat.id) return false;
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return s.name.toLowerCase().includes(q) ||
               (s.subtitle && s.subtitle.toLowerCase().includes(q)) ||
               (s.tags && s.tags.some(t => t.toLowerCase().includes(q)));
      });

      if (searchQuery && catSounds.length === 0) return '';

      return `
        <section class="category-section" data-cat-section="${cat.id}">
          <div class="category-header">
            <div class="cat-title-wrap">
              <div class="cat-icon-badge">${cat.icon}</div>
              <div>
                <h3>${cat.name} <span style="font-size:0.82rem; color:#34d399; font-weight:600;">(${catSounds.length}개)</span></h3>
                <p>${cat.desc}</p>
              </div>
            </div>
            <button class="btn btn-add-cat" data-cat="${cat.id}">
              ➕ ${cat.name} 추가 / 제외 관리
            </button>
          </div>

          <div class="sounds-grid">
            ${catSounds.map(s => renderSoundCardHTML(s)).join('')}

            <div class="add-sound-card" data-add-cat="${cat.id}">
              <div class="plus-circle">＋</div>
              <div style="font-weight:700; font-size:0.88rem;">+ ${cat.name} 추가 / 제외</div>
              <div style="font-size:0.74rem; color:#94a3b8;">보관함 사운드 추가·제거 / 내 음원 파일 추가</div>
            </div>
          </div>
        </section>
      `;
    }).join('');

    bindSoundCardEvents();
  }

  function renderSoundCardHTML(s) {
    ensureSoundState(s);
    const st = soundStates[s.id];
    const isPlaying = st.volume > 0.005;
    const volPct = Math.round(st.volume * 100);
    const denPct = Math.round(st.density * 100);
    const isRealRecording = Boolean(s.audioUrl || s.customAudioUrl);

    return `
      <div class="sound-card ${isPlaying ? 'playing' : ''}" id="card-${s.id}" data-sound-id="${s.id}">
        <div class="card-top">
          <div class="sound-info">
            <div class="sound-emoji">${s.icon || '🎵'}</div>
            <div>
              <div class="sound-name">${s.name}</div>
              <div class="sound-sub">${s.subtitle || ''}</div>
            </div>
          </div>
          <div class="card-actions">
            <button class="power-toggle" data-toggle="${s.id}" title="소리 켜기/끄기">
              ${isPlaying ? 'ON' : 'OFF'}
            </button>
            <button class="card-remove-btn" data-remove="${s.id}" title="이 소리를 목록에서 제외(제거)합니다. 언제든 [+ 추가/제외] 창에서 다시 추가할 수 있습니다.">
              ✕ 제외
            </button>
          </div>
        </div>

        <div class="slider-row">
          <span class="slider-label">🔊 볼륨</span>
          <input type="range" class="vol-slider" data-vol="${s.id}" min="0" max="100" value="${volPct}" />
          <span class="vol-percent" id="vol-txt-${s.id}">${volPct}%</span>
        </div>

        <div class="slider-row" title="새가 우는 간격이나 이중 레이어의 풍성함(밀도)을 조절합니다">
          <span class="slider-label">✨ 빈도/밀도</span>
          <input type="range" class="den-slider" data-den="${s.id}" min="10" max="100" value="${denPct}" />
          <span class="vol-percent" id="den-txt-${s.id}" style="font-weight:500; color:#94a3b8;">${denPct}%</span>
        </div>

        <div class="card-footer">
          <div class="sound-tags">
            ${(s.tags || []).map(t => `<span class="tag-badge">#${t}</span>`).join('')}
          </div>
          ${isRealRecording ? `
            <span class="tag-badge" style="background:rgba(16,185,129,0.16); color:#34d399; border:1px solid rgba(52,211,153,0.35); font-weight:600;">
              🎙️ 실제 현장 녹음
            </span>
          ` : `
            <span class="tag-badge" style="color:#c084fc;">🎛️ 정밀 주파수/노이즈</span>
          `}
        </div>
      </div>
    `;
  }

  function bindSoundCardEvents() {
    categoriesContainerEl.querySelectorAll('.vol-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const id = e.target.dataset.vol;
        const val = parseInt(e.target.value, 10) / 100;
        setSoundVolume(id, val);
      });
    });

    categoriesContainerEl.querySelectorAll('.den-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const id = e.target.dataset.den;
        const val = parseInt(e.target.value, 10) / 100;
        const s = sounds.find(item => item.id === id);
        if (!s) return;
        ensureSoundState(s);
        soundStates[id].density = val;
        const denTxt = document.getElementById(`den-txt-${id}`);
        if (denTxt) denTxt.textContent = `${Math.round(val * 100)}%`;
        if (soundStates[id].volume > 0.005) {
          engine.setSoundState(s, soundStates[id].volume, val);
        }
      });
    });

    categoriesContainerEl.querySelectorAll('.power-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.toggle;
        const st = soundStates[id];
        if (st.volume > 0.005) {
          st.lastVolume = st.volume;
          setSoundVolume(id, 0);
        } else {
          setSoundVolume(id, st.lastVolume || 0.60);
        }
      });
    });

    categoriesContainerEl.querySelectorAll('.card-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.remove;
        removeSoundFromSystem(id);
      });
    });

    categoriesContainerEl.querySelectorAll('.btn-add-cat, .add-sound-card').forEach(el => {
      el.addEventListener('click', () => {
        const catId = el.dataset.cat || el.dataset.addCat;
        openAddSoundModal(catId);
      });
    });
  }

  function setSoundVolume(id, vol) {
    const s = sounds.find(item => item.id === id);
    if (!s) return;
    ensureSoundState(s);
    const st = soundStates[id];
    st.volume = vol;
    if (vol > 0.02) st.lastVolume = vol;

    engine.setSoundState(s, st.volume, st.density);
    activePresetId = null;
    updateSingleCardUI(id);
    renderActiveMixBar();
    requestWakeLock();
  }

  function updateSingleCardUI(id) {
    const card = document.getElementById(`card-${id}`);
    if (!card) return;
    const st = soundStates[id];
    const isPlaying = st && st.volume > 0.005;
    const pct = st ? Math.round(st.volume * 100) : 0;

    card.classList.toggle('playing', isPlaying);
    const slider = card.querySelector('.vol-slider');
    if (slider && parseInt(slider.value, 10) !== pct) {
      slider.value = pct;
    }
    const volTxt = document.getElementById(`vol-txt-${id}`);
    if (volTxt) volTxt.textContent = `${pct}%`;

    const toggleBtn = card.querySelector('.power-toggle');
    if (toggleBtn) toggleBtn.textContent = isPlaying ? 'ON' : 'OFF';
  }

  function updateAllCardsUI() {
    sounds.forEach(s => updateSingleCardUI(s.id));
  }

  // 4. 상단 현재 재생 중인 사운드 바 업데이트
  function renderActiveMixBar() {
    const activeList = sounds.filter(s => soundStates[s.id] && soundStates[s.id].volume > 0.005);
    activeCountLabelEl.textContent = `현재 조합 재생 중: ${activeList.length}개`;

    if (activeList.length === 0) {
      activeMixTagsEl.innerHTML = `
        <span style="font-size:0.83rem; color:#94a3b8;">
          💡 아래 카테고리에서 원하는 실제 녹음 소리의 <strong>볼륨 슬라이더</strong>를 올리면 즉시 조합됩니다. (예: 실제 뻐꾸기 + 소쩍새 + 깊은 물속 소리 + 전통 시장)
        </span>
      `;
      return;
    }

    activeMixTagsEl.innerHTML = activeList.map(s => {
      const pct = Math.round(soundStates[s.id].volume * 100);
      return `
        <div class="active-sound-pill">
          <span>${s.icon} ${s.name}</span>
          <span class="pill-vol">${pct}%</span>
          <button data-stop-pill="${s.id}" title="이 소리 끄기">✕</button>
        </div>
      `;
    }).join('');

    activeMixTagsEl.querySelectorAll('button[data-stop-pill]').forEach(btn => {
      btn.addEventListener('click', () => {
        setSoundVolume(btn.dataset.stopPill, 0);
      });
    });
  }

  // 5. 마스터 컨트롤 이벤트
  masterVolSlider.addEventListener('input', (e) => {
    const v = parseInt(e.target.value, 10);
    masterVolText.textContent = `${v}%`;
    engine.setMasterVolume(v / 100);
  });

  driftSlider.addEventListener('input', (e) => {
    const v = parseInt(e.target.value, 10);
    driftValText.textContent = `${v}%`;
    engine.setOrganicDrift(v / 100);
  });

  btnMuteAll.addEventListener('click', () => {
    engine.setMute(!engine.isMuted);
    btnMuteAll.textContent = engine.isMuted ? '🔇 음소거 해제' : '🔈 음소거';
    btnMuteAll.classList.toggle('btn-danger', engine.isMuted);
  });

  btnResetMix.addEventListener('click', () => {
    activePresetId = null;
    sounds.forEach(s => {
      if (soundStates[s.id]) soundStates[s.id].volume = 0;
    });
    engine.stopAll();
    renderPresets();
    updateAllCardsUI();
    renderActiveMixBar();
  });

  btnRandomMix.addEventListener('click', () => {
    activePresetId = null;
    sounds.forEach(s => {
      ensureSoundState(s);
      soundStates[s.id].volume = 0;
      engine.setSoundState(s, 0);
    });

    const pickRandom = (arr) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
    const birds = sounds.filter(s => s.category === 'birds');
    const winds = sounds.filter(s => s.category === 'wind');
    const weathers = sounds.filter(s => s.category === 'weather');
    const extras = sounds.filter(s => ['insects', 'places', 'resonance'].includes(s.category));

    const chosen = [
      pickRandom(birds),
      Math.random() > 0.35 ? pickRandom(birds) : null,
      pickRandom(winds),
      pickRandom(weathers),
      pickRandom(extras)
    ].filter(Boolean);

    chosen.forEach(s => {
      const vol = 0.35 + Math.random() * 0.4;
      soundStates[s.id].volume = vol;
      soundStates[s.id].lastVolume = vol;
      engine.setSoundState(s, vol, soundStates[s.id].density);
    });

    renderPresets();
    updateAllCardsUI();
    renderActiveMixBar();
  });

  btnSavePreset.addEventListener('click', () => {
    const activeList = sounds.filter(s => soundStates[s.id] && soundStates[s.id].volume > 0.005);
    if (activeList.length === 0) {
      alert('먼저 1개 이상의 소리 볼륨을 올려서 조합을 만들어 주세요!');
      return;
    }
    const name = prompt('저장할 매장 프리셋 이름을 입력해 주세요:', `🌿 내 매장 맞춤 조합 (${activeList.length}개 소리)`);
    if (!name) return;

    const mix = {};
    activeList.forEach(s => {
      mix[s.id] = {
        volume: Number(soundStates[s.id].volume.toFixed(2)),
        density: Number(soundStates[s.id].density.toFixed(2))
      };
    });

    const desc = activeList.map(s => s.name).join(' + ');
    const newPreset = {
      id: 'user_preset_' + Date.now(),
      name,
      desc,
      mix,
      isUser: true
    };
    presets.push(newPreset);
    activePresetId = newPreset.id;
    saveUserPresetsToStorage();
    renderPresets();
  });

  function saveUserPresetsToStorage() {
    const userOnly = presets.filter(p => p.isUser);
    localStorage.setItem('nature_user_presets_v2', JSON.stringify(userOnly));
  }

  searchInputEl.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderCategoriesAndSounds();
  });

  // 6. 사운드 추가 / 제외(제거) 핵심 함수
  function addCustomSoundToSystem(newSound, playImmediately = false, refreshUI = true) {
    if (excludedDefaultIds.includes(newSound.id)) {
      excludedDefaultIds = excludedDefaultIds.filter(id => id !== newSound.id);
    }

    if (!sounds.some(s => s.id === newSound.id)) {
      sounds.push(newSound);
    }
    ensureSoundState(newSound);

    if (playImmediately) {
      soundStates[newSound.id].volume = 0.55;
      soundStates[newSound.id].lastVolume = 0.55;
      engine.setSoundState(newSound, 0.55, soundStates[newSound.id].density);
    }

    saveSoundsStateToStorage();

    if (refreshUI) {
      renderCategoryTabs();
      renderCategoriesAndSounds();
      renderActiveMixBar();
    }
  }

  function removeSoundFromSystem(soundId, refreshUI = true) {
    engine.stopChannel(soundId);
    if (soundStates[soundId]) {
      soundStates[soundId].volume = 0;
    }

    const isDefault = window.DEFAULT_SOUNDS.some(d => d.id === soundId);
    if (isDefault && !excludedDefaultIds.includes(soundId)) {
      excludedDefaultIds.push(soundId);
    }

    sounds = sounds.filter(s => s.id !== soundId);
    saveSoundsStateToStorage();

    if (refreshUI) {
      renderCategoryTabs();
      renderCategoriesAndSounds();
      renderActiveMixBar();
    }
  }

  // 7. 모달 열기 및 보관함 추가/제외 관리
  function populateCategorySelects(selectedCat) {
    const opts = window.SOUND_CATEGORIES.map(c =>
      `<option value="${c.id}" ${c.id === selectedCat ? 'selected' : ''}>${c.icon} ${c.name}</option>`
    ).join('');
    customFileCategory.innerHTML = opts;
    customSynthCategory.innerHTML = opts;

    const filterOpts = `
      <option value="all" ${modalFilterCat === 'all' ? 'selected' : ''}>🌈 전체 카테고리 보관함 보기</option>
      ${window.SOUND_CATEGORIES.map(c =>
        `<option value="${c.id}" ${c.id === modalFilterCat ? 'selected' : ''}>${c.icon} ${c.name}만 보기</option>`
      ).join('')}
    `;
    modalCatFilter.innerHTML = filterOpts;
  }

  function openAddSoundModal(catId = 'all') {
    modalFilterCat = catId || 'all';
    const catObj = window.SOUND_CATEGORIES.find(c => c.id === catId);
    document.getElementById('modalTitle').textContent = catObj
      ? `➕ [${catObj.icon} ${catObj.name}] 소리 추가 / 제외 관리`
      : `➕ 전체 사운드 추가 / 제외 관리`;

    populateCategorySelects(catObj ? catObj.id : 'birds');
    renderExpansionLibraryList();
    addSoundModal.classList.add('open');
  }

  modalCatFilter.addEventListener('change', (e) => {
    modalFilterCat = e.target.value;
    renderExpansionLibraryList();
  });

  btnOpenGlobalAdd.addEventListener('click', () => openAddSoundModal(currentCategoryFilter));
  btnCloseModal.addEventListener('click', () => addSoundModal.classList.remove('open'));
  addSoundModal.addEventListener('click', (e) => {
    if (e.target === addSoundModal) addSoundModal.classList.remove('open');
  });

  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.modal-tab-content').forEach(c => c.style.display = 'none');
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).style.display = 'block';
    });
  });

  function getManageableLibraryItems() {
    const excludedDefaults = window.DEFAULT_SOUNDS.filter(d => excludedDefaultIds.includes(d.id));
    const userCreated = sounds.filter(
      s => !window.DEFAULT_SOUNDS.some(d => d.id === s.id) && !window.EXPANSION_LIBRARY.some(x => x.id === s.id)
    );
    const combined = [...userCreated, ...excludedDefaults, ...window.EXPANSION_LIBRARY];

    if (modalFilterCat === 'all') {
      return combined;
    }
    return combined.filter(item => item.category === modalFilterCat);
  }

  function renderExpansionLibraryList() {
    const list = getManageableLibraryItems();

    if (list.length === 0) {
      expansionListContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 24px; text-align: center; color: #94a3b8;">
          이 카테고리에 해당하는 보관함 사운드가 없습니다. 상단 드롭다운에서 [전체 카테고리 보관함 보기]로 전환해 보세요.
        </div>
      `;
      return;
    }

    expansionListContainer.innerHTML = list.map(item => {
      const alreadyAdded = sounds.some(s => s.id === item.id);
      const catInfo = window.SOUND_CATEGORIES.find(c => c.id === item.category);
      return `
        <div class="exp-item ${alreadyAdded ? 'is-added' : ''}">
          <div style="min-width: 0;">
            <div style="font-size:0.72rem; color:#34d399; font-weight:600;">
              ${catInfo ? catInfo.icon + ' ' + catInfo.name : ''}
              ${alreadyAdded ? '<span style="color:#6ee7b7; margin-left:4px;">● 현재 반영됨</span>' : ''}
            </div>
            <div style="font-weight:700; font-size:0.9rem; margin-top:2px;">${item.icon || '🎵'} ${item.name}</div>
            <div style="font-size:0.74rem; color:#94a3b8; margin-top:2px;">${item.subtitle || ''}</div>
          </div>
          <button class="btn ${alreadyAdded ? 'btn-danger' : 'btn-primary'}" data-toggle-exp="${item.id}">
            ${alreadyAdded ? '✕ 제외' : '＋ 추가'}
          </button>
        </div>
      `;
    }).join('');

    expansionListContainer.querySelectorAll('button[data-toggle-exp]').forEach(btn => {
      btn.addEventListener('click', () => {
        const expId = btn.dataset.toggleExp;
        const alreadyAdded = sounds.some(s => s.id === expId);

        if (alreadyAdded) {
          removeSoundFromSystem(expId, true);
        } else {
          const allPool = [...window.DEFAULT_SOUNDS, ...window.EXPANSION_LIBRARY];
          const item = allPool.find(x => x.id === expId);
          if (item) {
            addCustomSoundToSystem(item, chkAutoPlayOnAdd.checked, true);
          }
        }
        renderExpansionLibraryList();
      });
    });
  }

  btnAddAllVisible.addEventListener('click', () => {
    const list = getManageableLibraryItems();
    const autoPlay = chkAutoPlayOnAdd.checked;
    list.forEach(item => {
      addCustomSoundToSystem(item, autoPlay, false);
    });
    if (modalFilterCat !== 'all' && currentCategoryFilter !== 'all' && currentCategoryFilter !== modalFilterCat) {
      currentCategoryFilter = modalFilterCat;
    }
    renderCategoryTabs();
    renderCategoriesAndSounds();
    renderActiveMixBar();
    renderExpansionLibraryList();
  });

  btnRemoveAllVisible.addEventListener('click', () => {
    const list = getManageableLibraryItems();
    list.forEach(item => {
      if (sounds.some(s => s.id === item.id)) {
        removeSoundFromSystem(item.id, false);
      }
    });
    renderCategoryTabs();
    renderCategoriesAndSounds();
    renderActiveMixBar();
    renderExpansionLibraryList();
  });

  btnRestoreDefaults.addEventListener('click', () => {
    excludedDefaultIds = [];
    window.DEFAULT_SOUNDS.forEach(d => {
      if (!sounds.some(s => s.id === d.id)) {
        sounds.push(d);
        ensureSoundState(d);
      }
    });
    saveSoundsStateToStorage();
    renderCategoryTabs();
    renderCategoriesAndSounds();
    renderActiveMixBar();
    renderExpansionLibraryList();
  });

  // 방법 2: 로컬 오디오 파일 또는 스트리밍 URL 추가
  document.getElementById('btnSubmitFileSound').addEventListener('click', () => {
    const cat = customFileCategory.value;
    const name = document.getElementById('customFileName').value.trim() || '사용자 추가 실제 음원';
    const subtitle = document.getElementById('customFileDesc').value.trim() || '직접 추가한 스트리밍/파일 음원 (무한 루프)';
    const fileInput = document.getElementById('customFileInput');
    const urlInput = document.getElementById('customStreamUrl').value.trim();

    let audioUrl = urlInput;
    if (fileInput.files && fileInput.files[0]) {
      audioUrl = URL.createObjectURL(fileInput.files[0]);
    }

    if (!audioUrl) {
      alert('오디오 파일을 선택하거나 무료 음원 스트리밍 URL을 입력해 주세요.');
      return;
    }

    const newSound = {
      id: 'custom_audio_' + Date.now(),
      category: cat,
      name,
      subtitle,
      icon: '🎧',
      playStyle: 'continuous',
      customAudioUrl: audioUrl,
      tags: ['사용자 실제음원', '무한 루프'],
      defaultDensity: 0.65
    };

    addCustomSoundToSystem(newSound, true, true);
    addSoundModal.classList.remove('open');
  });

  // 방법 3: 실제 녹음 음원 피치 변형 / 커스텀 주파수 추가
  const customSynthPitch = document.getElementById('customSynthPitch');
  const pitchScaleLabel = document.getElementById('pitchScaleLabel');
  customSynthPitch.addEventListener('input', (e) => {
    const ratio = (parseInt(e.target.value, 10) / 100).toFixed(2);
    pitchScaleLabel.textContent = `${ratio}x 배율`;
  });

  document.getElementById('btnSubmitSynthSound').addEventListener('click', () => {
    const cat = customSynthCategory.value;
    const name = document.getElementById('customSynthName').value.trim() || '커스텀 사운드';
    const baseVal = document.getElementById('customSynthBase').value;
    const pitchRatio = parseInt(customSynthPitch.value, 10) / 100;

    let newSound;
    if (baseVal.startsWith('real:')) {
      const parts = baseVal.split(':');
      const audioPath = parts[1];
      const pStyle = parts[2] || 'continuous';
      newSound = {
        id: 'custom_real_' + Date.now(),
        category: cat,
        name,
        subtitle: `실제 녹음 음원 기반 (${pitchRatio.toFixed(2)}x 음역 변형)`,
        icon: '🎙️',
        audioUrl: audioPath,
        playStyle: pStyle,
        baseRate: pitchRatio,
        tags: ['실제녹음 변형', `${pitchRatio.toFixed(2)}x 음역`],
        defaultDensity: 0.65
      };
    } else {
      const synthName = baseVal.replace('synth:', '');
      newSound = {
        id: 'custom_synth_' + Date.now(),
        category: cat,
        name,
        subtitle: `정밀 주파수 (${pitchRatio.toFixed(2)}x 배율)`,
        icon: '✨',
        synthType: synthName,
        pitchShift: pitchRatio,
        tags: ['커스텀 주파수', `${pitchRatio.toFixed(2)}x 배율`],
        defaultDensity: 0.55
      };
    }

    addCustomSoundToSystem(newSound, true, true);
    addSoundModal.classList.remove('open');
  });

  // 8. 실시간 주파수 스펙트럼 비주얼라이저
  const canvas = document.getElementById('spectrumCanvas');
  const cCtx = canvas.getContext('2d');
  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    cCtx.clearRect(0, 0, canvas.width, canvas.height);

    const freqData = engine.getFrequencyData();
    const bars = 28;
    const barWidth = (canvas.width / bars) - 2;

    for (let i = 0; i < bars; i++) {
      let val = 3;
      if (freqData && !engine.isMuted) {
        val = Math.max(3, (freqData[i * 2] / 255) * (canvas.height - 4));
      }
      const x = i * (barWidth + 2) + 2;
      const y = canvas.height - val;
      const grad = cCtx.createLinearGradient(0, canvas.height, 0, 0);
      grad.addColorStop(0, '#10b981');
      grad.addColorStop(1, '#38bdf8');
      cCtx.fillStyle = grad;
      cCtx.fillRect(x, y, barWidth, val);
    }
  }
  drawVisualizer();

  // 9. 매장용 화면 꺼짐 방지 (Wake Lock API)
  let wakeLock = null;
  async function requestWakeLock() {
    if ('wakeLock' in navigator && !wakeLock) {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        document.getElementById('wakeLockBadge').textContent = '매장 연속재생 보호 ON';
      } catch (e) {}
    }
  }

  // 초기 렌더링
  renderCategoryTabs();
  renderPresets();
  renderCategoriesAndSounds();
  renderActiveMixBar();
});
