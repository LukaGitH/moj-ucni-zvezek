// Programska logika za aplikacijo "Moj učni zvezek"

document.addEventListener("DOMContentLoaded", () => {
  // --- STATE (STANJE APLIKACIJE) ---
  let starsCount = parseInt(localStorage.getItem("starsCount")) || 0;
  let sfxEnabled = localStorage.getItem("sfxEnabled") !== "false"; // privzeto vklopljeni zvoki
  let currentSubject = ""; // "slovenscina" ali "matematika"
  let currentGameId = ""; // aktivna igra oz. tip naloge (lahko se menja med mešanim načinom)
  let activeGameId = ""; // dejanska izbira iz menija (npr. "sl-mešano")
  let isMixedMode = false; // ali igramo mešani način
  let currentTasks = []; // premešan seznam nalog za trenutno igro/predmet
  let currentTaskIndex = 0; // katera naloga po vrsti je v igri
  let currentTask = null; // trenutna naloga (vsebina)
  let autoAdvanceTimeout = null; // časovnik za samodejni prehod
  let taskCompleted = false; // prepreči večkratno točkovanje iste naloge

  // Posodobitev začetnega prikaza zvezdic in gumba za zvok
  document.getElementById("stars-count").textContent = starsCount;
  updateSoundToggleButton();

  // --- AUDIO SYNTHESIS (Spletni sintesajzer zvokov) ---
  // Ustvarimo zvoke preko Web Audio API, da ne potrebujemo zunanjih zvočnih datotek
  function getAudioContext() {
    return new (window.AudioContext || window.webkitAudioContext)();
  }

  function playSuccessSound() {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Prvi ton (C5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);
      
      // Drugi ton (G5) z malim zamikom
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(783.99, now + 0.1); // G5
      gain2.gain.setValueAtTime(0.15, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.4);
    } catch (e) {
      console.log("AudioContext ne deluje.", e);
    }
  }

  function playErrorSound() {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.4); // padajoči pitch
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.log("AudioContext ne deluje.", e);
    }
  }

  function playMatchSound() {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, now); // E5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.log("AudioContext ne deluje.", e);
    }
  }

  function playDrumBeatSound() {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Mehki kick udarec bobna z nizko frekvenco
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.15);
      
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.log("AudioContext ne deluje.", e);
    }
  }

  // --- POMOŽNI ALGORITMI ---
  
  // Fisher-Yates mešalni algoritem za pošteno naključje
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Pridobi naključni pod-nabor elementov
  function getRandomSubarray(arr, size) {
    return shuffleArray(arr).slice(0, size);
  }

  // Preveri, če je niz emoji
  function isEmoji(str) {
    const charCode = str.codePointAt(0);
    return charCode > 0x1f000;
  }

  // Pridobi napačne črke (distractorje) iz slovenske abecede
  function getIncorrectLetters(word, count = 2) {
    const alphabet = ['A', 'B', 'C', 'Č', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'V', 'Z', 'Ž'];
    const wordLetters = new Set(word.split(""));
    const pool = alphabet.filter(char => !wordLetters.has(char));
    return getRandomSubarray(pool, count);
  }

  const GAME_META = {
    "sl-anagrami": { name: "Premeči črke", icon: "ABC", desc: "Sestavi besedo iz ponujenih črk" },
    "sl-manjkajoce": { name: "Dopolni besedo", icon: "_A_", desc: "Izberi črko, ki manjka v besedi" },
    "sl-povezovanje": { name: "Poveži pare", icon: "↔", desc: "Poveži črke, slike, besede ali povedi" },
    "sl-izberi-besedo": { name: "Izberi besedo", icon: "☑", desc: "Označi pravo besedo ob sliki" },
    "sl-poisci-crko": { name: "Poišči črko", icon: "Č", desc: "Označi besede, kjer vidiš izbrano črko" },
    "sl-uredi-poved": { name: "Uredi poved", icon: "A B", desc: "Postavi besede v pravilni vrstni red" },
    "sl-posluh": { name: "Kje slišiš glas?", icon: "C", desc: "Označi mesto glasu v besedi" },
    "sl-boben": { name: "Zlogi", icon: "• •", desc: "Preštej zloge z udarci" },
    "sl-mešano": { name: "Mešane vaje", icon: "✓", desc: "Naključne naloge iz vseh slovenskih sklopov" },
    "ma-racunanje": { name: "Preštej in izračunaj", icon: "5+2", desc: "Seštevaj in odštevaj s slikami" },
    "ma-tehtnica": { name: "Primerjaj", icon: "< >", desc: "Izberi znak za več, manj ali enako" },
    "ma-gosenica": { name: "Dopolni vzorec", icon: "○●", desc: "Nadaljuj barvni ali številski vzorec" },
    "ma-zaporedje": { name: "Številski trak", icon: "11 _", desc: "Dopolni manjkajoče število v zaporedju" },
    "ma-pari-do-10": { name: "Pari do 10", icon: "4+_", desc: "Poišči manjkajoče število do 10" },
    "ma-zgodba": { name: "Računska zgodba", icon: "?", desc: "Preberi kratko nalogo in izberi odgovor" },
    "ma-merjenje": { name: "Merjenje", icon: "📏", desc: "Primerjaj dolžino, težo ali količino" },
    "ma-povezovanje": { name: "Število in količina", icon: "4 •", desc: "Poveži število s pravo količino" },
    "ma-labirint": { name: "Številska pot", icon: "1-8", desc: "Klikaj številke po vrsti od 1 do 8" },
    "ma-mešano": { name: "Mešane vaje", icon: "✓", desc: "Naključne naloge iz vseh matematičnih sklopov" }
  };

  const SUBJECT_CATALOG = {
    slovenscina: {
      title: "Slovenščina 1 - del 2",
      sections: [
        { title: "Črke, glasovi in zlogi", games: ["sl-manjkajoce", "sl-poisci-crko", "sl-posluh", "sl-boben"] },
        { title: "Besede in povezovanje", games: ["sl-anagrami", "sl-izberi-besedo", "sl-povezovanje", "sl-uredi-poved"] },
        { title: "Naključno iz zvezka", games: ["sl-mešano"] }
      ]
    },
    matematika: {
      title: "Matematika 1 - del 3",
      sections: [
        { title: "Števila do 20", games: ["ma-povezovanje", "ma-zaporedje", "ma-tehtnica", "ma-labirint"] },
        { title: "Računanje", games: ["ma-racunanje", "ma-pari-do-10", "ma-zgodba", "ma-gosenica"] },
        { title: "Merjenje in primerjanje", games: ["ma-merjenje"] },
        { title: "Naključno iz zvezka", games: ["ma-mešano"] }
      ]
    }
  };

  function getSlovenscinaTaskTypes() {
    return [
      { gameId: "sl-anagrami", source: window.SLOVENSCINA_DATA.words },
      { gameId: "sl-manjkajoce", source: window.SLOVENSCINA_DATA.words },
      { gameId: "sl-povezovanje", source: [1, 2, 3, 4, 5, 6] },
      { gameId: "sl-izberi-besedo", source: window.SLOVENSCINA_DATA.wordChoices },
      { gameId: "sl-poisci-crko", source: window.SLOVENSCINA_DATA.letterSearches },
      { gameId: "sl-uredi-poved", source: window.SLOVENSCINA_DATA.sentenceOrders },
      { gameId: "sl-posluh", source: window.SLOVENSCINA_DATA.sounds },
      { gameId: "sl-boben", source: window.SLOVENSCINA_DATA.words }
    ];
  }

  function getMatematikaTaskTypes() {
    return [
      { gameId: "ma-racunanje", source: window.MATEMATIKA_DATA.calculations },
      { gameId: "ma-tehtnica", source: window.MATEMATIKA_DATA.comparisons },
      { gameId: "ma-gosenica", source: window.MATEMATIKA_DATA.patterns },
      { gameId: "ma-zaporedje", source: window.MATEMATIKA_DATA.numberSequences },
      { gameId: "ma-pari-do-10", source: window.MATEMATIKA_DATA.tenPairs },
      { gameId: "ma-zgodba", source: window.MATEMATIKA_DATA.storyProblems },
      { gameId: "ma-merjenje", source: window.MATEMATIKA_DATA.measurements },
      { gameId: "ma-povezovanje", source: [1] },
      { gameId: "ma-labirint", source: [1, 2, 3, 4, 5] }
    ];
  }

  function createTaskList(taskTypes, selectedGameId = null) {
    const activeTypes = selectedGameId
      ? taskTypes.filter(type => type.gameId === selectedGameId)
      : taskTypes;

    return activeTypes.flatMap(type =>
      (type.source || []).map(taskData => ({ gameId: type.gameId, taskData }))
    );
  }

  function shuffleTasksAvoidingImmediateRepeats(tasks, previousGameId = null) {
    const shuffled = shuffleArray(tasks);
    const result = [];
    const remaining = [...shuffled];

    while (remaining.length > 0) {
      const lastGameId = result[result.length - 1]?.gameId || previousGameId;
      let nextIndex = remaining.findIndex(task => task.gameId !== lastGameId);

      if (nextIndex === -1) {
        nextIndex = 0;
      }

      result.push(remaining.splice(nextIndex, 1)[0]);
    }

    return result;
  }

  // --- NAVIGACIJA MED ZASLONI ---
  function showScreen(screenId) {
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("submenu").classList.add("hidden");
    document.getElementById("game-arena").classList.add("hidden");
    
    document.getElementById(screenId).classList.remove("hidden");
    
    // Ob menjavi zaslona počistimo samodejni prehod
    if (autoAdvanceTimeout) {
      clearTimeout(autoAdvanceTimeout);
      autoAdvanceTimeout = null;
    }
    taskCompleted = false;
  }

  // --- DOGODKI GLAVNEGA MENIJA ---
  document.getElementById("menu-card-slovenscina").addEventListener("click", () => {
    selectSubject("slovenscina");
  });

  document.getElementById("menu-card-matematika").addEventListener("click", () => {
    selectSubject("matematika");
  });

  document.getElementById("submenu-back-btn").addEventListener("click", () => {
    showScreen("main-menu");
  });

  document.getElementById("game-back-btn").addEventListener("click", () => {
    showScreen("submenu");
  });

  // --- IZBIRA PREDMETA IN GENERIRANJE PODMENIJA ---
  function selectSubject(subject) {
    currentSubject = subject;
    const title = document.getElementById("submenu-title");
    const grid = document.getElementById("game-select-grid");
    grid.innerHTML = ""; // Počistimo prejšnje igre

    const catalog = SUBJECT_CATALOG[subject];
    title.textContent = catalog.title;

    catalog.sections.forEach(section => {
      const sectionEl = document.createElement("div");
      sectionEl.className = "game-section";
      sectionEl.innerHTML = `<h3 class="game-section-title">${section.title}</h3>`;

      const sectionGrid = document.createElement("div");
      sectionGrid.className = "game-section-grid";
      section.games.forEach(gameId => {
        sectionGrid.appendChild(createGameCard({ id: gameId, ...GAME_META[gameId] }));
      });

      sectionEl.appendChild(sectionGrid);
      grid.appendChild(sectionEl);
    });
    
    showScreen("submenu");
  }

  function createGameCard(game) {
    const card = document.createElement("div");
    card.className = "game-card";
    card.innerHTML = `
      <div class="game-card-icon">${game.icon}</div>
      <h3>${game.name}</h3>
      <p style="font-size: 0.95rem; opacity: 0.8; line-height:1.2;">${game.desc}</p>
    `;
    card.addEventListener("click", () => startNewGame(game.id, game.name));
    return card;
  }

  // --- ZAČETEK NOVE IGRE ---
  function startNewGame(gameId, gameName) {
    if (autoAdvanceTimeout) {
      clearTimeout(autoAdvanceTimeout);
      autoAdvanceTimeout = null;
    }
    
    activeGameId = gameId;
    currentTaskIndex = 0;
    document.getElementById("current-game-title").textContent = gameName;
    
    // Ustvarimo in premešamo seznam nalog
    setupTasksForGame(gameId);
    
    loadTask();
    showScreen("game-arena");
  }

  // --- SESTAVLJANJE IN MEŠANJE NALOG ---
  function setupTasksForGame(gameId) {
    let tasks = [];
    isMixedMode = false;
    
    if (gameId === "sl-mešano") {
      isMixedMode = true;
      tasks = createTaskList(getSlovenscinaTaskTypes());
    } else if (gameId === "ma-mešano") {
      isMixedMode = true;
      tasks = createTaskList(getMatematikaTaskTypes());
    } else {
      const subjectTypes = gameId.startsWith("sl-") ? getSlovenscinaTaskTypes() : getMatematikaTaskTypes();
      tasks = createTaskList(subjectTypes, gameId);
    }
    
    // Naključno premešamo celoten vrstni red in pri mešanih vajah zmanjšamo ponavljanje istega tipa.
    currentTasks = isMixedMode ? shuffleTasksAvoidingImmediateRepeats(tasks) : shuffleArray(tasks);
  }

  // --- NALAGANJE POSAMEZNE NALOGE ---
  function loadTask() {
    if (autoAdvanceTimeout) {
      clearTimeout(autoAdvanceTimeout);
      autoAdvanceTimeout = null;
    }

    document.getElementById("feedback-container").classList.add("hidden");
    taskCompleted = false;
    const canvas = document.getElementById("game-canvas");
    canvas.classList.remove("task-completed");
    canvas.innerHTML = ""; // Izpraznimo prejšnjo nalogo
    
    if (currentTasks.length === 0) {
      document.getElementById("visual-instruction-banner").textContent = "Za ta sklop še ni pripravljenih nalog.";
      canvas.innerHTML = `
        <div class="empty-task-message">
          Ta sklop je pripravljen, naloge pa še niso naložene. Poskusi osvežiti stran.
        </div>
      `;
      return;
    }
    
    // Če rešimo vse, premešamo znova in gremo na začetek
    if (currentTaskIndex >= currentTasks.length) {
      const lastGameId = currentTasks[currentTasks.length - 1]?.gameId;
      currentTasks = isMixedMode ? shuffleTasksAvoidingImmediateRepeats(currentTasks, lastGameId) : shuffleArray(currentTasks);
      currentTaskIndex = 0;
    }
    
    const taskWrapper = currentTasks[currentTaskIndex];
    currentGameId = taskWrapper.gameId;
    currentTask = taskWrapper.taskData;
    
    // Posodobimo naslov, če smo v mešanem načinu
    if (isMixedMode) {
      document.getElementById("current-game-title").textContent = GAME_META[currentGameId]?.name || "Mešana naloga";
    }
    
    // Nastavimo vizualno navodilo
    document.getElementById("visual-instruction-banner").textContent = getInstructionText();
    
    // Klic ustreznega generatorja igre
    switch (currentGameId) {
      case "sl-anagrami":
        renderAnagramGame(canvas);
        break;
      case "sl-manjkajoce":
        renderMissingLetterGame(canvas);
        break;
      case "sl-povezovanje":
        renderWordMatchingGame(canvas);
        break;
      case "sl-izberi-besedo":
        renderWordChoiceGame(canvas);
        break;
      case "sl-poisci-crko":
        renderLetterSearchGame(canvas);
        break;
      case "sl-uredi-poved":
        renderSentenceOrderGame(canvas);
        break;
      case "sl-posluh":
        renderSoundPositionGame(canvas);
        break;
      case "sl-boben":
        renderDrumSyllablesGame(canvas);
        break;
      case "ma-racunanje":
        renderVisualArithmeticGame(canvas);
        break;
      case "ma-tehtnica":
        renderCrocodileScaleGame(canvas);
        break;
      case "ma-gosenica":
        renderCaterpillarPatternGame(canvas);
        break;
      case "ma-zaporedje":
        renderNumberSequenceGame(canvas);
        break;
      case "ma-pari-do-10":
        renderTenPairGame(canvas);
        break;
      case "ma-zgodba":
        renderMathStoryGame(canvas);
        break;
      case "ma-merjenje":
        renderMeasurementGame(canvas);
        break;
      case "ma-povezovanje":
        renderQuantityMatchingGame(canvas);
        break;
      case "ma-labirint":
        renderNumberMazeGame(canvas);
        break;
    }
  }

  // --- VIZUALNA NAVODILA ---
  function getInstructionText() {
    switch (currentGameId) {
      case "sl-anagrami":
        return `Poglej sliko. Premeči črke in sestavi besedo.`;
      case "sl-manjkajoce":
        return `Katera črka manjka v besedi? Izberi pravo črko.`;
      case "sl-povezovanje":
        return "Poveži pare, ki sodijo skupaj.";
      case "sl-izberi-besedo":
        return "Poglej sliko in označi pravo besedo.";
      case "sl-poisci-crko":
        return `Poišči vse besede, kjer vidiš črko ${currentTask.letter}.`;
      case "sl-uredi-poved":
        return "Besede postavi v pravilen vrstni red, da nastane poved.";
      case "sl-posluh":
        return `Kje v besedi ${currentTask.word} slišiš glas ${currentTask.letter}? Klikni na pravi krožec spodaj.`;
      case "sl-boben":
        return `Udarjaj po bobnu za vsak zlog v besedi ${currentTask.word}! Preveri svoj odgovor z gumbom.`;
      case "ma-racunanje":
        return `Preštej sadje in izračunaj! Koliko je ${currentTask.item1} ${currentTask.operation === "+" ? "in" : "manj"} ${currentTask.item2}?`;
      case "ma-tehtnica":
        return "Primerjaj količini. Izberi pravi znak.";
      case "ma-gosenica":
        return "Dokončaj zabavni vzorec na gosenici. Kateri del telesa sledi na koncu?";
      case "ma-zaporedje":
        return "Dopolni manjkajoče število v zaporedju.";
      case "ma-pari-do-10":
        return `Katero število manjka, da bo skupaj 10?`;
      case "ma-zgodba":
        return "Preberi računsko zgodbo in izberi pravilen odgovor.";
      case "ma-merjenje":
        return "Primerjaj predmete in izberi pravilen odgovor.";
      case "ma-povezovanje":
        return "Poveži številko na levi s pravilnim številom pikic na desni z vlečenjem črte.";
      case "ma-labirint":
        return "Številski labirint! Pomagaj prečkati mrežo tako, da klikaš številke po vrsti od 1 do 8!";
      default:
        return "Reši naslednjo zabavno nalogo!";
    }
  }

  // --- ZVOČNA IKONA IN KONTROLE (SFX) ---
  function updateSoundToggleButton() {
    const btn = document.getElementById("sound-toggle");
    if (btn) {
      if (sfxEnabled) {
        btn.textContent = "🔊";
        btn.title = "Zvočni učinki vklopljeni. Klikni za utišanje.";
        btn.style.opacity = "1";
      } else {
        btn.textContent = "🔇";
        btn.title = "Zvočni učinki izklopljeni. Klikni za vklop.";
        btn.style.opacity = "0.6";
      }
    }
  }

  document.getElementById("sound-toggle").addEventListener("click", () => {
    sfxEnabled = !sfxEnabled;
    localStorage.setItem("sfxEnabled", sfxEnabled);
    updateSoundToggleButton();
    if (sfxEnabled) {
      playSuccessSound(); // predvajamo potrditveni ton
    }
  });

  // PREOBLEKA (THEME SELECTOR)
  document.getElementById("theme-selector").addEventListener("change", (e) => {
    const theme = e.target.value;
    document.documentElement.setAttribute("data-theme", theme);
    
    const titleText = document.getElementById("header-title");
    if (theme === "space") {
      titleText.textContent = "Vesoljska šola 🚀";
    } else if (theme === "dino") {
      titleText.textContent = "Dino akademija 🦖";
    } else if (theme === "ocean") {
      titleText.textContent = "Morski svet 🌊";
    } else {
      titleText.textContent = "Moj učni zvezek";
    }
  });


  // ==========================================
  // --- SLOVENŠČINA: RENDERERJI IN LOGIKA ---
  // ==========================================

  // --- IGRA 1: ANAGRAMI (Z NAPAČNIMI ČRRAMI - DISTRACTORS) ---
  function renderAnagramGame(canvas) {
    const word = currentTask.word;
    const emoji = currentTask.emoji;
    
    // Dobimo prave črke in dodamo 2 dodatni napačni črki
    let wordLetters = word.split("");
    const distractors = getIncorrectLetters(word, 2);
    let allLetters = [...wordLetters, ...distractors];
    
    // Zmešamo celoten nabor
    do {
      allLetters = shuffleArray(allLetters);
    } while (allLetters.slice(0, word.length).join("") === word && word.length > 1);

    canvas.innerHTML = `
      <div class="visual-emoji">${emoji}</div>
      <div class="slots-container" id="anagram-slots"></div>
      <div class="letters-pool" id="anagram-letters"></div>
    `;

    const slotsContainer = document.getElementById("anagram-slots");
    const lettersPool = document.getElementById("anagram-letters");
    const placedLetters = new Array(word.length).fill(null);

    // Ustvarimo prazne reže (slots) samo za dolžino besede!
    for (let i = 0; i < word.length; i++) {
      const slot = document.createElement("div");
      slot.className = "letter-slot";
      slot.dataset.index = i;
      slot.addEventListener("click", () => {
        // Klik na zasedeno režo vrne črko nazaj v bazen
        if (placedLetters[i] !== null) {
          const letterCardId = placedLetters[i];
          const card = document.getElementById(letterCardId);
          if (card) card.classList.remove("used");
          slot.textContent = "";
          slot.classList.remove("filled");
          placedLetters[i] = null;
        }
      });
      slotsContainer.appendChild(slot);
    }

    // Ustvarimo gumbe s črkami v bazenu (prave + 2 napačni)
    allLetters.forEach((char, idx) => {
      const card = document.createElement("div");
      card.className = "letter-card";
      card.id = `letter-card-${idx}`;
      card.textContent = char;
      card.addEventListener("click", () => {
        // Poiščemo prvo prosto režo
        const freeSlotIndex = placedLetters.indexOf(null);
        if (freeSlotIndex !== -1) {
          placedLetters[freeSlotIndex] = card.id;
          card.classList.add("used");
          
          const slot = slotsContainer.children[freeSlotIndex];
          slot.textContent = char;
          slot.classList.add("filled");
          
          // Če so vse reže polne, preverimo pravilnost
          if (!placedLetters.includes(null)) {
            checkAnagramAnswer(placedLetters, word);
          }
        }
      });
      lettersPool.appendChild(card);
    });
  }

  function checkAnagramAnswer(placedLetters, originalWord) {
    const spelled = placedLetters.map(id => {
      const card = document.getElementById(id);
      return card ? card.textContent : "";
    }).join("");
    
    if (spelled === originalWord) {
      handleSuccess();
    } else {
      handleFailure("anagram-slots");
      // Avtomatsko vrnemo vse črke v bazen po 800ms
      setTimeout(() => {
        const slots = document.getElementById("anagram-slots").children;
        for (let slot of slots) {
          slot.click();
        }
      }, 800);
    }
  }

  // --- IGRA 2: MANJKAJOČE ČRKE ---
  function renderMissingLetterGame(canvas) {
    const word = currentTask.word;
    const emoji = currentTask.emoji;
    const missingIndex = currentTask.missingIndex;
    const choices = currentTask.choices;
    
    let wordHtml = "";
    for (let i = 0; i < word.length; i++) {
      if (i === missingIndex) {
        wordHtml += `<span class="missing-slot" id="missing-slot">?</span>`;
      } else {
        wordHtml += `<span>${word[i]}</span>`;
      }
    }

    canvas.innerHTML = `
      <div class="visual-emoji">${emoji}</div>
      <div class="word-with-missing">${wordHtml}</div>
      <div class="choices-pool" id="choices-pool"></div>
    `;

    const choicesPool = document.getElementById("choices-pool");
    const shuffledChoices = shuffleArray(choices);

    shuffledChoices.forEach(char => {
      const card = document.createElement("div");
      card.className = "choice-card";
      card.textContent = char;
      card.addEventListener("click", () => {
        if (char === currentTask.missingChar) {
          const slot = document.getElementById("missing-slot");
          slot.textContent = char;
          slot.style.borderStyle = "solid";
          slot.style.borderColor = "var(--success-color)";
          slot.style.background = "var(--success-color)";
          slot.style.color = "white";
          handleSuccess();
        } else {
          card.classList.add("animate-shake");
          playErrorSound();
          setTimeout(() => card.classList.remove("animate-shake"), 500);
        }
      });
      choicesPool.appendChild(card);
    });
  }

  // --- POMOŽNA ZA POVEZOVANJE Z MIŠKO (CANVAS DRAWING ENGINE) ---
  function setupMatchingInteractivity(container, leftCards, rightCards, checkMatch) {
    const canvasElement = document.createElement("canvas");
    canvasElement.className = "matching-canvas-overlay";
    container.appendChild(canvasElement);
    
    const ctx = canvasElement.getContext("2d");
    let matchedPairs = [];
    let activeLeftCard = null;
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let hoveredRightCard = null;

    function resizeCanvas() {
      const rect = container.getBoundingClientRect();
      canvasElement.width = rect.width;
      canvasElement.height = rect.height;
      drawLines();
    }
    
    setTimeout(resizeCanvas, 100);
    window.addEventListener("resize", resizeCanvas);
    
    function drawLines() {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      const containerRect = container.getBoundingClientRect();
      
      // 1. Risanje že povezanih (pravilnih) parov
      matchedPairs.forEach(pair => {
        const leftRect = pair.left.getBoundingClientRect();
        const rightRect = pair.right.getBoundingClientRect();
        
        const x1 = leftRect.right - containerRect.left;
        const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
        const x2 = rightRect.left - containerRect.left;
        const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#4caf50"; // Zelena črta
        ctx.lineCap = "round";
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(76, 175, 80, 0.4)";
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      });
      
      // 2. Risanje črte med vlečenjem/aktivno levo kartico
      if (activeLeftCard) {
        const leftRect = activeLeftCard.getBoundingClientRect();
        const x1 = leftRect.right - containerRect.left;
        const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(mouseX, mouseY);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#ff9800"; // Oranžna vodilna črta
        ctx.lineCap = "round";
        ctx.setLineDash([8, 8]); // Pikasta črta med vlečenjem
        ctx.stroke();
        ctx.setLineDash([]); // reset
      }
    }
    
    // Nastavimo dogodke za leve kartice (mousedown / dotik)
    leftCards.forEach(card => {
      card.addEventListener("mousedown", (e) => {
        if (card.classList.contains("matched")) return;
        
        leftCards.forEach(c => c.classList.remove("selected"));
        activeLeftCard = card;
        card.classList.add("selected");
        isDragging = true;
        
        const containerRect = container.getBoundingClientRect();
        mouseX = e.clientX - containerRect.left;
        mouseY = e.clientY - containerRect.top;
        drawLines();
      });
    });
    
    // Nastavimo dogodke za desne kartice
    rightCards.forEach(card => {
      card.addEventListener("mouseenter", () => {
        if (card.classList.contains("matched")) return;
        hoveredRightCard = card;
      });
      
      card.addEventListener("mouseleave", () => {
        hoveredRightCard = null;
      });
      
      card.addEventListener("click", () => {
        if (card.classList.contains("matched")) return;
        if (activeLeftCard) {
          attemptMatch(activeLeftCard, card);
        }
      });
    });
    
    // Premik miške
    const onMouseMove = (e) => {
      if (!activeLeftCard) return;
      const containerRect = container.getBoundingClientRect();
      mouseX = e.clientX - containerRect.left;
      mouseY = e.clientY - containerRect.top;
      drawLines();
    };
    
    // Spustitev miške
    const onMouseUp = () => {
      if (!activeLeftCard) return;
      
      if (isDragging) {
        if (hoveredRightCard) {
          attemptMatch(activeLeftCard, hoveredRightCard);
        }
        isDragging = false;
      }
    };
    
    // Self-healing preprečevalec nabiranja globalnih event listenerjev
    const selfHealingMouseMove = (e) => {
      if (!document.body.contains(container)) {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("resize", resizeCanvas);
        return;
      }
      onMouseMove(e);
    };
    
    window.addEventListener("mousemove", selfHealingMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    
    function attemptMatch(leftCard, rightCard) {
      if (checkMatch(leftCard, rightCard)) {
        leftCard.classList.remove("selected");
        leftCard.classList.add("matched");
        rightCard.classList.add("matched");
        
        matchedPairs.push({ left: leftCard, right: rightCard });
        playMatchSound();
        
        activeLeftCard = null;
        hoveredRightCard = null;
        drawLines();
        
        if (matchedPairs.length === leftCards.length) {
          handleSuccess();
        }
      } else {
        leftCard.classList.add("animate-shake");
        rightCard.classList.add("animate-shake");
        playErrorSound();
        
        const tempLeft = activeLeftCard;
        activeLeftCard = null;
        drawLines();
        
        setTimeout(() => {
          leftCard.classList.remove("animate-shake", "selected");
          rightCard.classList.remove("animate-shake");
          if (tempLeft) tempLeft.classList.remove("selected");
        }, 500);
      }
    }
  }

  // --- IGRA 3: POVEZOVANJE KARTIC ---
  function renderWordMatchingGame(canvas) {
    const mode = currentTask; 
    let leftItems = [];
    let rightItems = [];
    
    if (mode === 1) {
      // Velike in male črke (4 naključne besede)
      const selectedWords = getRandomSubarray(window.SLOVENSCINA_DATA.words, 4);
      leftItems = selectedWords.map(w => ({ id: w.word, text: w.word }));
      rightItems = selectedWords.map(w => ({ id: w.word, text: w.word.toLowerCase() }));
    } else if (mode === 2) {
      // Sopomenke (4 naključni pari)
      const selectedSynonyms = getRandomSubarray(window.SLOVENSCINA_DATA.synonyms, 4);
      leftItems = selectedSynonyms.map(s => ({ id: s.word1, text: s.word1 }));
      rightItems = selectedSynonyms.map(s => ({ id: s.word1, text: s.word2 }));
    } else if (mode === 3) {
      // Slike in besede (4 naključne besede)
      const selectedWords = getRandomSubarray(window.SLOVENSCINA_DATA.pictureWords, 4);
      leftItems = selectedWords.map(w => ({ id: w.word, text: w.emoji }));
      rightItems = selectedWords.map(w => ({ id: w.word, text: w.word }));
    } else if (mode === 4) {
      // Zapis črk in zlogi (N U -> NU)
      const selectedPairs = getRandomSubarray(window.SLOVENSCINA_DATA.syllablePairs, 4);
      leftItems = selectedPairs.map(pair => ({ id: pair.syllable, text: pair.letters }));
      rightItems = selectedPairs.map(pair => ({ id: pair.syllable, text: pair.syllable.toLowerCase() }));
    } else if (mode === 6) {
      // Začetki in konci povedi
      const selectedPairs = getRandomSubarray(window.SLOVENSCINA_DATA.sentencePairs, 4);
      leftItems = selectedPairs.map((pair, index) => ({ id: `sentence-${index}`, text: pair.start }));
      rightItems = selectedPairs.map((pair, index) => ({ id: `sentence-${index}`, text: pair.end }));
    } else {
      // Besede in slike iz širšega nabora zvezkovnih primerov
      const selectedWords = getRandomSubarray(window.SLOVENSCINA_DATA.pictureWords, 4);
      leftItems = selectedWords.map(w => ({ id: w.word, text: w.word }));
      rightItems = selectedWords.map(w => ({ id: w.word, text: w.emoji }));
    }

    const shuffledLeft = shuffleArray(leftItems);
    const shuffledRight = shuffleArray(rightItems);

    canvas.innerHTML = `
      <div style="font-size:1.2rem; font-weight:700; margin-bottom:15px; color:var(--primary-color)">
        Poveži pravilne pare s črto!
      </div>
      <div class="matching-columns-container" id="matching-container">
        <div class="matching-column" id="left-column"></div>
        <div class="matching-column" id="right-column"></div>
      </div>
    `;

    const leftCol = document.getElementById("left-column");
    const rightCol = document.getElementById("right-column");

    shuffledLeft.forEach(item => {
      const card = document.createElement("div");
      card.className = "matching-card";
      card.textContent = item.text;
      card.dataset.id = item.id;
      
      if (item.text.length <= 3 && isEmoji(item.text)) {
        card.style.fontSize = "2.8rem";
      }
      leftCol.appendChild(card);
    });

    shuffledRight.forEach(item => {
      const card = document.createElement("div");
      card.className = "matching-card";
      card.textContent = item.text;
      card.dataset.id = item.id;
      rightCol.appendChild(card);
    });

    // Vzpostavimo interaktivni Canvas Engine za risanje črt!
    setupMatchingInteractivity(
      document.getElementById("matching-container"),
      Array.from(leftCol.children),
      Array.from(rightCol.children),
      (left, right) => left.dataset.id === right.dataset.id
    );
  }

  // --- IGRA: IZBERI PRAVO BESEDO OB SLIKI ---
  function renderWordChoiceGame(canvas) {
    const task = currentTask;
    const choices = shuffleArray(task.choices);

    canvas.innerHTML = `
      <div class="word-choice-container">
        <div class="visual-emoji">${task.emoji}</div>
        <div class="sound-instruction-text">
          Kaj je na sliki? Označi pravo besedo.
        </div>
        <div class="word-choice-grid" id="word-choice-grid"></div>
      </div>
    `;

    const grid = document.getElementById("word-choice-grid");
    choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "word-choice-btn";
      btn.textContent = choice;
      btn.addEventListener("click", () => {
        if (choice === task.answer) {
          btn.classList.add("correct");
          handleSuccess();
        } else {
          btn.classList.add("animate-shake", "incorrect");
          playErrorSound();
          setTimeout(() => btn.classList.remove("animate-shake", "incorrect"), 600);
        }
      });
      grid.appendChild(btn);
    });
  }

  // --- IGRA: POIŠČI BESEDE Z DOLOČENO ČRKO ---
  function renderLetterSearchGame(canvas) {
    const task = currentTask;
    const answers = new Set(task.answers);
    const selected = new Set();

    canvas.innerHTML = `
      <div class="letter-search-container">
        <div class="letter-target-card">${task.letter}</div>
        <div class="sound-instruction-text">
          Označi vse besede, ki vsebujejo črko <span class="letter-highlight">${task.letter}</span>.
        </div>
        <div class="letter-search-grid" id="letter-search-grid"></div>
        <button class="drum-action-btn check" id="letter-search-check">Preveri</button>
      </div>
    `;

    const grid = document.getElementById("letter-search-grid");
    shuffleArray(task.words).forEach(word => {
      const btn = document.createElement("button");
      btn.className = "letter-search-word";
      btn.textContent = word;
      btn.addEventListener("click", () => {
        if (selected.has(word)) {
          selected.delete(word);
          btn.classList.remove("selected");
        } else {
          selected.add(word);
          btn.classList.add("selected");
        }
      });
      grid.appendChild(btn);
    });

    document.getElementById("letter-search-check").addEventListener("click", () => {
      const isCorrect =
        selected.size === answers.size &&
        Array.from(answers).every(word => selected.has(word));

      if (isCorrect) {
        grid.querySelectorAll(".letter-search-word").forEach(btn => {
          if (answers.has(btn.textContent)) btn.classList.add("correct");
        });
        handleSuccess();
      } else {
        grid.classList.add("animate-shake");
        playErrorSound();
        setTimeout(() => grid.classList.remove("animate-shake"), 600);
      }
    });
  }

  // --- IGRA: UREDI BESEDE V POVED ---
  function renderSentenceOrderGame(canvas) {
    const task = currentTask;
    const selectedWords = [];
    const correctSentence = task.sentence.join(" ");

    canvas.innerHTML = `
      <div class="sentence-order-container">
        <div class="visual-emoji">${task.image}</div>
        <div class="sentence-drop-row" id="sentence-drop-row"></div>
        <div class="sentence-word-bank" id="sentence-word-bank"></div>
        <div class="drum-controls">
          <button class="drum-action-btn reset" id="sentence-reset-btn">Ponovi</button>
          <button class="drum-action-btn check" id="sentence-check-btn">Preveri</button>
        </div>
      </div>
    `;

    const dropRow = document.getElementById("sentence-drop-row");
    const bank = document.getElementById("sentence-word-bank");

    function renderSelected() {
      dropRow.innerHTML = "";
      if (selectedWords.length === 0) {
        dropRow.innerHTML = `<span class="sentence-placeholder">Klikni besede v pravilnem vrstnem redu.</span>`;
        return;
      }

      selectedWords.forEach((word, index) => {
        const chip = document.createElement("button");
        chip.className = "sentence-chip selected";
        chip.textContent = word;
        chip.addEventListener("click", () => {
          selectedWords.splice(index, 1);
          renderSelected();
          renderBank();
        });
        dropRow.appendChild(chip);
      });
    }

    function renderBank() {
      bank.innerHTML = "";
      shuffleArray(task.sentence).forEach(word => {
        const usedCount = selectedWords.filter(w => w === word).length;
        const totalBefore = task.sentence.filter(w => w === word).length;
        if (usedCount >= totalBefore) return;

        const chip = document.createElement("button");
        chip.className = "sentence-chip";
        chip.textContent = word;
        chip.addEventListener("click", () => {
          selectedWords.push(word);
          renderSelected();
          renderBank();
        });
        bank.appendChild(chip);
      });
    }

    document.getElementById("sentence-reset-btn").addEventListener("click", () => {
      selectedWords.splice(0, selectedWords.length);
      renderSelected();
      renderBank();
      playMatchSound();
    });

    document.getElementById("sentence-check-btn").addEventListener("click", () => {
      if (selectedWords.join(" ") === correctSentence) {
        dropRow.classList.add("correct");
        handleSuccess();
      } else {
        handleFailure("sentence-drop-row");
      }
    });

    renderSelected();
    renderBank();
  }

  // --- IGRA 4: KJE SLIŠIŠ GLAS ---
  function renderSoundPositionGame(canvas) {
    const word = currentTask.word;
    const letter = currentTask.letter;
    const emoji = currentTask.emoji;
    const length = currentTask.length;
    const targetIndex = currentTask.targetIndex;

    canvas.innerHTML = `
      <div class="visual-emoji">${emoji}</div>
      <div class="sound-instruction-text">
        Kje slišiš glas <span class="letter-highlight">${letter}</span> v besedi <span style="color:var(--primary-color)">${word}</span>?
      </div>
      <div class="circles-container" id="sound-circles"></div>
      <div style="font-size:1.1rem; opacity:0.8; font-weight:600">
        Beseda ima ${length} glasov. Klikni na pravi krogec!
      </div>
    `;

    const circlesContainer = document.getElementById("sound-circles");

    for (let i = 0; i < length; i++) {
      const circle = document.createElement("div");
      circle.className = "sound-circle";
      circle.dataset.index = i;
      circle.title = `Glas ${i + 1}`;
      
      circle.addEventListener("click", () => {
        const siblings = circlesContainer.children;
        for (let sibling of siblings) {
          sibling.classList.remove("incorrect-guess");
        }

        if (i === targetIndex) {
          circle.classList.add("correct-guess");
          handleSuccess();
        } else {
          circle.classList.add("incorrect-guess");
          playErrorSound();
          setTimeout(() => circle.classList.remove("incorrect-guess"), 500);
        }
      });
      circlesContainer.appendChild(circle);
    }
  }

  // --- SLOVENŠČINA NOVO: IGRA 5: ZLOGOVANJE Z BOBNOM 🥁 ---
  function renderDrumSyllablesGame(canvas) {
    const word = currentTask.word;
    const emoji = currentTask.emoji;
    const syllables = currentTask.syllables;
    let beatCount = 0;

    canvas.innerHTML = `
      <div class="drum-game-container">
        <div class="visual-emoji">${emoji}</div>
        <div style="font-size: 2.2rem; font-weight: 700; color: var(--primary-color); margin-bottom: 5px; letter-spacing: 2px;">
          ${word}
        </div>
        
        <!-- Prikaz krogcev za število udarcev -->
        <div class="drum-beats-display" id="drum-beats-display"></div>
        
        <!-- Veliki boben za klikanje -->
        <button class="giant-drum-btn" id="giant-drum-btn" title="Klikni za udarec!">🥁</button>
        
        <!-- Ukazi -->
        <div class="drum-controls">
          <button class="drum-action-btn check" id="drum-check-btn">Preveri 🔍</button>
          <button class="drum-action-btn reset" id="drum-reset-btn">Ponovi 🔄</button>
        </div>
      </div>
    `;

    const display = document.getElementById("drum-beats-display");
    const drumBtn = document.getElementById("giant-drum-btn");
    const checkBtn = document.getElementById("drum-check-btn");
    const resetBtn = document.getElementById("drum-reset-btn");

    // Začetni izris sivih krogcev
    function updateDots() {
      display.innerHTML = "";
      const totalDots = Math.max(syllables, beatCount, 4); // vedno prikažemo vsaj 4 krogce
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("div");
        dot.className = "drum-beat-dot" + (i < beatCount ? " active" : "");
        display.appendChild(dot);
      }
    }
    updateDots();

    // Klik na boben
    drumBtn.addEventListener("mousedown", () => {
      beatCount++;
      playDrumBeatSound();
      updateDots();
      
      // Hitra vizualna animacija stiska bobna
      drumBtn.style.transform = "scale(0.92) translateY(2px)";
      setTimeout(() => {
        drumBtn.style.transform = "";
      }, 80);
    });

    // Ponastavitev
    resetBtn.addEventListener("click", () => {
      beatCount = 0;
      updateDots();
      playMatchSound(); // kratek potrditveni zvok ponastavitve
    });

    // Preverjanje
    checkBtn.addEventListener("click", () => {
      if (beatCount === syllables) {
        handleSuccess();
      } else {
        handleFailure("drum-beats-display");
        playErrorSound();
        // Opozorilno utripanje
        display.classList.add("animate-shake");
        setTimeout(() => {
          display.classList.remove("animate-shake");
          beatCount = 0;
          updateDots();
        }, 800);
      }
    });
  }


  // ==========================================
  // --- MATEMATIKA: RENDERERJI IN LOGIKA ---
  // ==========================================

  // --- IGRA 1: RAČUNANJE S SLIKICAMI ---
  function renderVisualArithmeticGame(canvas) {
    const num1 = currentTask.item1;
    const num2 = currentTask.item2;
    const op = currentTask.operation;
    const emoji = currentTask.emoji;
    const answer = currentTask.answer;

    let leftGroupHtml = "";
    for (let i = 0; i < num1; i++) {
      leftGroupHtml += `<span class="visual-item-emoji animate-bounce" style="animation-delay:${i * 0.08}s">${emoji}</span>`;
    }

    let rightGroupHtml = "";
    for (let i = 0; i < num2; i++) {
      rightGroupHtml += `<span class="visual-item-emoji animate-bounce" style="animation-delay:${i * 0.08 + 0.2}s">${emoji}</span>`;
    }

    canvas.innerHTML = `
      <div class="math-calc-container">
        <div class="calc-visual-row">
          <div class="visual-items-group">${leftGroupHtml}</div>
          <div class="calc-operator">${op}</div>
          <div class="visual-items-group">${rightGroupHtml}</div>
        </div>
        
        <div class="calc-numerical-row">
          <span>${num1}</span>
          <span>${op === "+" ? "+" : "-"}</span>
          <span>${num2}</span>
          <span>=</span>
          <div class="calc-answer-slot" id="calc-answer-slot">?</div>
        </div>

        <div class="calc-choices-container" id="calc-choices"></div>
      </div>
    `;

    // Ponudimo 4 možnosti (1 pravilna, 3 napačne)
    const choices = new Set();
    choices.add(answer);
    while (choices.size < 4) {
      const offset = Math.floor(Math.random() * 5) - 2; // -2 do +2
      const candidate = answer + offset;
      if (candidate >= 0 && candidate <= 20) {
        choices.add(candidate);
      }
    }

    const shuffledChoices = Array.from(choices).sort((a, b) => a - b);
    const choicesContainer = document.getElementById("calc-choices");

    shuffledChoices.forEach(num => {
      const btn = document.createElement("button");
      btn.className = "calc-choice-btn";
      btn.textContent = num;
      btn.addEventListener("click", () => {
        if (num === answer) {
          const slot = document.getElementById("calc-answer-slot");
          slot.textContent = num;
          slot.style.borderStyle = "solid";
          slot.style.borderColor = "var(--success-color)";
          slot.style.background = "var(--success-color)";
          slot.style.color = "white";
          
          handleSuccess();
        } else {
          btn.classList.add("animate-shake");
          playErrorSound();
          setTimeout(() => btn.classList.remove("animate-shake"), 500);
        }
      });
      choicesContainer.appendChild(btn);
    });
  }

  // --- IGRA 2: KROKODILJA TEHTNICA ---
  function renderCrocodileScaleGame(canvas) {
    const leftVal = currentTask.left;
    const rightVal = currentTask.right;
    const emoji = currentTask.emoji;
    
    let correctCrocSymbol = "=";
    if (leftVal > rightVal) correctCrocSymbol = ">";
    if (leftVal < rightVal) correctCrocSymbol = "<";

    let leftPlateHtml = "";
    for (let i = 0; i < leftVal; i++) {
      leftPlateHtml += `<span class="scale-plate-emoji">${emoji}</span>`;
    }

    let rightPlateHtml = "";
    for (let i = 0; i < rightVal; i++) {
      rightPlateHtml += `<span class="scale-plate-emoji">${emoji}</span>`;
    }

    // Nagib tehtnice
    let leftAngle = 0;
    let rightAngle = 0;
    if (leftVal > rightVal) {
      leftAngle = 12;
      rightAngle = -12;
    } else if (leftVal < rightVal) {
      leftAngle = -12;
      rightAngle = 12;
    }

    canvas.innerHTML = `
      <div class="crocodile-scale-container">
        <div style="font-size: 1.3rem; font-weight:700; color:var(--primary-color)">
          Kateri kupček je večji? Nahrani lačnega krokodila!
        </div>

        <div class="css-scale">
          <!-- LEVI KUPČEK -->
          <div class="scale-plate" id="left-plate" style="transform: translateY(${leftAngle}px)">
            <div class="scale-plate-items">${leftPlateHtml}</div>
            <div class="scale-plate-count">${leftVal}</div>
          </div>
          
          <!-- ZNAK MED KUPČKOMA -->
          <div class="scale-center-slot" id="scale-center-slot">?</div>
          
          <!-- DESNI KUPČEK -->
          <div class="scale-plate" id="right-plate" style="transform: translateY(${rightAngle}px)">
            <div class="scale-plate-items">${rightPlateHtml}</div>
            <div class="scale-plate-count">${rightVal}</div>
          </div>
        </div>

        <!-- TRI KROKODILJE IZBIRE -->
        <div class="croc-choices-row" id="croc-choices">
          <div class="croc-choice-card" data-symbol=">">
            <span class="croc-choice-symbol">🐊 &gt;</span>
            <span class="croc-choice-label">večji</span>
          </div>
          <div class="croc-choice-card" data-symbol="=">
            <span class="croc-choice-symbol">🐊 =</span>
            <span class="croc-choice-label">enak</span>
          </div>
          <div class="croc-choice-card" data-symbol="<">
            <span class="croc-choice-symbol">🐊 &lt;</span>
            <span class="croc-choice-label">manjši</span>
          </div>
        </div>
      </div>
    `;

    const scaleSlot = document.getElementById("scale-center-slot");
    const crocCards = document.querySelectorAll(".croc-choice-card");

    crocCards.forEach(card => {
      card.addEventListener("click", () => {
        const selectedSymbol = card.dataset.symbol;
        
        if (selectedSymbol === correctCrocSymbol) {
          scaleSlot.textContent = selectedSymbol;
          scaleSlot.classList.add("filled");
          
          // Izravnamo tehtnico ob pravilnem odgovoru
          document.getElementById("left-plate").style.transform = "translateY(0)";
          document.getElementById("right-plate").style.transform = "translateY(0)";

          handleSuccess();
        } else {
          card.classList.add("animate-shake");
          playErrorSound();
          setTimeout(() => card.classList.remove("animate-shake"), 500);
        }
      });
    });
  }

  // --- IGRA 3: DOPOLNI GOSENICO ---
  function renderCaterpillarPatternGame(canvas) {
    const sequence = currentTask.sequence;
    const choices = currentTask.choices;
    const answer = currentTask.answer;
    
    let segmentsHtml = "";
    
    sequence.forEach((item, idx) => {
      segmentsHtml += `<div class="caterpillar-segment animate-bounce" style="animation-delay:${idx * 0.08}s">${item}</div>`;
    });
    
    // Prazna reža za dokončanje vzorca
    segmentsHtml += `<div class="caterpillar-segment target" id="caterpillar-target">?</div>`;

    canvas.innerHTML = `
      <div class="caterpillar-game-container">
        <div style="font-size: 1.3rem; font-weight:700; color:var(--primary-color)">
          Dokončaj barvno ali številsko zaporedje gosenice!
        </div>

        <div class="caterpillar-wrapper">
          <div class="caterpillar-body">
            <div class="caterpillar-head" id="caterpillar-head"></div>
            ${segmentsHtml}
          </div>
        </div>

        <div class="caterpillar-choices" id="caterpillar-choices"></div>
      </div>
    `;

    // Fallback emoji, če slika caterpillar.png slučajno ne obstaja
    const head = document.getElementById("caterpillar-head");
    const imgTest = new Image();
    imgTest.src = "assets/images/caterpillar.png";
    imgTest.onerror = () => {
      head.classList.add("fallback");
      head.textContent = "🐛";
    };

    const choicesContainer = document.getElementById("caterpillar-choices");

    choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "caterpillar-choice-btn animate-bounce";
      btn.textContent = choice;
      btn.addEventListener("click", () => {
        if (choice === answer) {
          const target = document.getElementById("caterpillar-target");
          target.textContent = choice;
          target.classList.add("filled");
          
          handleSuccess();
        } else {
          btn.classList.add("animate-shake");
          playErrorSound();
          setTimeout(() => btn.classList.remove("animate-shake"), 500);
        }
      });
      choicesContainer.appendChild(btn);
    });
  }

  // --- IGRA: ŠTEVILSKI TRAK IN MANJKAJOČE ŠTEVILO ---
  function renderNumberSequenceGame(canvas) {
    const task = currentTask;
    const choices = new Set([task.answer]);
    while (choices.size < 4) {
      const candidate = task.answer + Math.floor(Math.random() * 7) - 3;
      if (candidate >= 0 && candidate <= 20) choices.add(candidate);
    }

    canvas.innerHTML = `
      <div class="number-sequence-container">
        <div class="number-sequence-row">
          ${task.sequence.map(num => num === null
            ? `<div class="number-sequence-cell target" id="number-sequence-target">?</div>`
            : `<div class="number-sequence-cell">${num}</div>`
          ).join("")}
        </div>
        <div class="calc-choices-container" id="number-sequence-choices"></div>
      </div>
    `;

    const choicesContainer = document.getElementById("number-sequence-choices");
    Array.from(choices).sort((a, b) => a - b).forEach(num => {
      const btn = document.createElement("button");
      btn.className = "calc-choice-btn";
      btn.textContent = num;
      btn.addEventListener("click", () => {
        if (num === task.answer) {
          const target = document.getElementById("number-sequence-target");
          target.textContent = num;
          target.classList.add("filled");
          handleSuccess();
        } else {
          btn.classList.add("animate-shake");
          playErrorSound();
          setTimeout(() => btn.classList.remove("animate-shake"), 500);
        }
      });
      choicesContainer.appendChild(btn);
    });
  }

  // --- IGRA: PARI ŠTEVIL DO 10 ---
  function renderTenPairGame(canvas) {
    const task = currentTask;
    const choices = new Set([task.answer]);
    while (choices.size < 4) choices.add(Math.floor(Math.random() * 11));

    canvas.innerHTML = `
      <div class="ten-pair-container">
        <div class="flower-pair">
          <div class="flower-number">${task.known}</div>
          <div class="flower-number target" id="ten-pair-target">?</div>
        </div>
        <div class="calc-numerical-row">
          <span>${task.known}</span><span>+</span><span>?</span><span>=</span><span>10</span>
        </div>
        <div class="calc-choices-container" id="ten-pair-choices"></div>
      </div>
    `;

    const choicesContainer = document.getElementById("ten-pair-choices");
    Array.from(choices).sort((a, b) => a - b).forEach(num => {
      const btn = document.createElement("button");
      btn.className = "calc-choice-btn";
      btn.textContent = num;
      btn.addEventListener("click", () => {
        if (num === task.answer) {
          document.getElementById("ten-pair-target").textContent = num;
          document.getElementById("ten-pair-target").classList.add("filled");
          handleSuccess();
        } else {
          btn.classList.add("animate-shake");
          playErrorSound();
          setTimeout(() => btn.classList.remove("animate-shake"), 500);
        }
      });
      choicesContainer.appendChild(btn);
    });
  }

  // --- IGRA: RAČUNSKA ZGODBA ---
  function renderMathStoryGame(canvas) {
    const task = currentTask;
    const choices = new Set([task.answer]);
    while (choices.size < 4) {
      const candidate = task.answer + Math.floor(Math.random() * 7) - 3;
      if (candidate >= 0 && candidate <= 20) choices.add(candidate);
    }

    canvas.innerHTML = `
      <div class="math-story-container">
        <div class="visual-emoji">${task.emoji}</div>
        <p class="story-text">${task.text}</p>
        <div class="story-equation">${task.equation} = ?</div>
        <div class="calc-choices-container" id="story-choices"></div>
      </div>
    `;

    const choicesContainer = document.getElementById("story-choices");
    Array.from(choices).sort((a, b) => a - b).forEach(num => {
      const btn = document.createElement("button");
      btn.className = "calc-choice-btn";
      btn.textContent = num;
      btn.addEventListener("click", () => {
        if (num === task.answer) {
          btn.classList.add("correct-answer");
          handleSuccess();
        } else {
          btn.classList.add("animate-shake");
          playErrorSound();
          setTimeout(() => btn.classList.remove("animate-shake"), 500);
        }
      });
      choicesContainer.appendChild(btn);
    });
  }

  // --- IGRA: MERJENJE IN PRIMERJANJE ---
  function renderMeasurementGame(canvas) {
    const task = currentTask;
    let items = task.items || (task.choices || []).map((choice, index) => ({
      label: choice,
      value: [52, 86, 68][index] || 60,
      color: ["#4caf50", "#2196f3", "#e53935"][index] || "#2196f3"
    }));
    items = buildMeasurementItems(task, items);
    const answer = getMeasurementAnswer(task, items);
    const choices = items.map(item => item.label);
    const display = task.display || "bars";

    canvas.innerHTML = `
      <div class="measurement-container">
        <div class="measurement-visual" id="measurement-visual"></div>
        <div class="sound-instruction-text">${task.prompt}</div>
        <div class="word-choice-grid" id="measurement-choices"></div>
      </div>
    `;

    const visual = document.getElementById("measurement-visual");
    items.forEach(item => {
      const itemEl = document.createElement("div");
      itemEl.className = `measurement-item ${display}`;
      itemEl.innerHTML = `
        <div class="measurement-label">${item.label}</div>
        <div class="measurement-object">
          ${renderMeasurementObject(display, item)}
        </div>
      `;
      visual.appendChild(itemEl);
    });

    const choicesContainer = document.getElementById("measurement-choices");
    shuffleArray(choices).forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "word-choice-btn";
      btn.textContent = choice;
      btn.addEventListener("click", () => {
        if (choice === answer) {
          btn.classList.add("correct");
          handleSuccess();
        } else {
          btn.classList.add("animate-shake", "incorrect");
          playErrorSound();
          setTimeout(() => btn.classList.remove("animate-shake", "incorrect"), 600);
        }
      });
      choicesContainer.appendChild(btn);
    });
  }

  function buildMeasurementItems(task, items) {
    const valuesByMode = {
      longest: [48, 68, 88],
      shortest: [44, 66, 84],
      heaviest: [30, 56, 86]
    };
    const values = shuffleArray(valuesByMode[task.mode] || [48, 68, 88]);
    return shuffleArray(items).map((item, index) => ({
      ...item,
      value: values[index]
    }));
  }

  function getMeasurementAnswer(task, items) {
    const sorted = [...items].sort((a, b) => a.value - b.value);
    if (task.mode === "shortest") return sorted[0].label;
    return sorted[sorted.length - 1].label;
  }

  function renderMeasurementObject(display, item) {
    if (display === "bars") {
      return `<div class="measure-bar" style="width:${item.value}%; background:${item.color};"></div>`;
    }

    if (display === "liquid") {
      return `
        <div class="liquid-cup">
          <div class="liquid-fill" style="height:${item.value}%;"></div>
          <span>${item.icon}</span>
        </div>
      `;
    }

    return `
      <div class="weight-object" style="transform: translateY(${Math.max(0, item.value - 50) / 3}px);">
        <span>${item.icon}</span>
      </div>
      <div class="weight-line"></div>
    `;
  }

  // --- IGRA 4: ŠTEVILO IN KOLIČINA ---
  function renderQuantityMatchingGame(canvas) {
    // Izberemo 4 naključna števila med 1 in 9
    const numbers = [];
    while (numbers.length < 4) {
      const r = Math.floor(Math.random() * 9) + 1;
      if (!numbers.includes(r)) numbers.push(r);
    }

    const emojis = ["🍎", "🎈", "⭐", "🐰", "🚗", "🍌", "🍒", "🍩", "🦕"];
    const gameEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const leftItems = numbers.map(num => ({ id: num, text: num.toString() }));
    const rightItems = numbers.map(num => {
      let repeated = "";
      for (let i = 0; i < num; i++) {
        repeated += gameEmoji;
      }
      return { id: num, text: repeated };
    });

    const shuffledLeft = shuffleArray(leftItems);
    const shuffledRight = shuffleArray(rightItems);

    canvas.innerHTML = `
      <div style="font-size:1.2rem; font-weight:700; margin-bottom:15px; color:var(--primary-color)">
        Poveži številko s pravim številom pikic/slik s črto!
      </div>
      <div class="matching-columns-container" id="matching-container">
        <div class="matching-column" id="left-column"></div>
        <div class="matching-column" id="right-column"></div>
      </div>
    `;

    const leftCol = document.getElementById("left-column");
    const rightCol = document.getElementById("right-column");

    shuffledLeft.forEach(item => {
      const card = document.createElement("div");
      card.className = "matching-card";
      card.textContent = item.text;
      card.dataset.id = item.id;
      card.style.fontSize = "2.5rem";
      leftCol.appendChild(card);
    });

    shuffledRight.forEach(item => {
      const card = document.createElement("div");
      card.className = "matching-card";
      card.textContent = item.text;
      card.dataset.id = item.id;
      
      // Zmanjšamo pisavo pri velikih količinah, da se lepše prilega
      if (item.id > 6) {
        card.style.fontSize = "1rem";
        card.style.letterSpacing = "-2px";
      } else {
        card.style.fontSize = "1.3rem";
        card.style.letterSpacing = "-1px";
      }
      rightCol.appendChild(card);
    });

    // Zaženemo interaktivno Canvas povezovanje!
    setupMatchingInteractivity(
      document.getElementById("matching-container"),
      Array.from(leftCol.children),
      Array.from(rightCol.children),
      (left, right) => parseInt(left.dataset.id) === parseInt(right.dataset.id)
    );
  }

  // --- MATEMATIKA NOVO: IGRA 5: ŠTEVILSKI LABIRINT (MAZE) 🚀 ---
  function renderNumberMazeGame(canvas) {
    const rows = 4;
    const cols = 4;
    let expectedNumber = 1;

    // Generiramo naključno sosednjo pot dolžine 8 (1 do 8) v 4x4 mreži
    function generateMazePath() {
      while (true) {
        const path = [];
        const visited = new Set();
        
        let currR = Math.floor(Math.random() * rows);
        let currC = Math.floor(Math.random() * cols);
        
        path.push({ r: currR, c: currC });
        visited.add(`${currR},${currC}`);
        
        let success = true;
        for (let step = 2; step <= 8; step++) {
          const neighbors = [];
          const dirs = [
            { r: -1, c: 0 }, // gor
            { r: 1, c: 0 },  // dol
            { r: 0, c: -1 }, // levo
            { r: 0, c: 1 }   // desno
          ];
          
          dirs.forEach(d => {
            const nr = currR + d.r;
            const nc = currC + d.c;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              const key = `${nr},${nc}`;
              if (!visited.has(key)) {
                neighbors.push({ r: nr, c: nc });
              }
            }
          });
          
          if (neighbors.length === 0) {
            success = false;
            break; // mrtva veja, ponovi generiranje
          }
          
          const nextCell = neighbors[Math.floor(Math.random() * neighbors.length)];
          path.push(nextCell);
          visited.add(`${nextCell.r},${nextCell.c}`);
          currR = nextCell.r;
          currC = nextCell.c;
        }
        
        if (success) return path;
      }
    }

    const path = generateMazePath();

    // Sestavimo 4x4 matriko, kamor postavimo pot in napolnimo ostalo
    const gridData = Array.from({ length: rows }, () => Array(cols).fill(0));
    
    // Postavimo pot (1 do 8)
    path.forEach((cell, idx) => {
      gridData[cell.r][cell.c] = idx + 1;
    });

    // Napolnimo ostale prazne celice z napačnimi distractorji (10 do 20)
    const distractorPool = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const shuffledDistractors = shuffleArray(distractorPool);
    let distIdx = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (gridData[r][c] === 0) {
          gridData[r][c] = shuffledDistractors[distIdx++];
        }
      }
    }

    // Izrišemo mrežno labirinta
    canvas.innerHTML = `
      <div class="maze-game-container">
        <div style="font-size: 1.3rem; font-weight:700; color:var(--primary-color)">
          Poveži pot! Klikaj številke po vrsti: 1 ➔ 2 ➔ 3 ➔ 4 ➔ 5 ➔ 6 ➔ 7 ➔ 8!
        </div>
        <div class="maze-grid" id="maze-grid"></div>
      </div>
    `;

    const gridContainer = document.getElementById("maze-grid");

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const value = gridData[r][c];
        const node = document.createElement("div");
        node.className = "maze-node";
        node.textContent = value;
        
        node.addEventListener("click", () => {
          // Če je že pravilno kliknjen v preteklosti, ne naredimo ničesar
          if (node.classList.contains("correct")) return;
          
          if (value === expectedNumber) {
            node.classList.add("correct");
            playMatchSound();
            expectedNumber++;
            
            // Če kliknemo končno število 8, je naloga uspešno rešena!
            if (expectedNumber === 9) {
              handleSuccess();
            }
          } else {
            // Napačno število
            node.classList.add("incorrect");
            playErrorSound();
            setTimeout(() => {
              node.classList.remove("incorrect");
            }, 500);
          }
        });
        
        gridContainer.appendChild(node);
      }
    }
  }


  // ==========================================
  // --- USPEH IN NAPAKE: SPLOŠNI HANDLERJI ---
  // ==========================================

  const SUCCESS_CONGRATS = [
    "Odlično! Zelo dobro ti gre! 🌟",
    "Čudovito! Pravilno rešeno! 🎉",
    "Bravo! Ti si pravi mojster! 🚀",
    "Super! Pravilno! Zaslužiš si zvezdico! ⭐",
    "Izjemno! Tako se dela! 🦉"
  ];

  function handleSuccess() {
    if (taskCompleted) return;
    taskCompleted = true;
    playSuccessSound();
    document.getElementById("game-canvas").classList.add("task-completed");
    
    // Dodamo zvezdico v število in lokalno shrambo
    starsCount += 1;
    localStorage.setItem("starsCount", starsCount);
    document.getElementById("stars-count").textContent = starsCount;
    
    // Izberemo naključno zabavno čestitko
    const congrats = SUCCESS_CONGRATS[Math.floor(Math.random() * SUCCESS_CONGRATS.length)];
    
    // Prikažemo povratno informacijo
    const feedback = document.getElementById("feedback-container");
    const feedbackText = document.getElementById("feedback-text");
    feedbackText.textContent = congrats;
    feedbackText.className = "feedback-text";
    feedback.classList.remove("hidden");
    
    // Bouncing učinek za štetje zvezdic
    const starsCounter = document.getElementById("stars-counter");
    starsCounter.classList.add("animate-bounce");
    setTimeout(() => starsCounter.classList.remove("animate-bounce"), 1000);

    // SAMODEJNO NAPREDOVANJE PO 1.5 SEKUNDE
    if (autoAdvanceTimeout) clearTimeout(autoAdvanceTimeout);
    autoAdvanceTimeout = setTimeout(() => {
      currentTaskIndex++;
      loadTask();
    }, 1500);
  }

  function handleFailure(containerId) {
    playErrorSound();
    const container = document.getElementById(containerId);
    if (container) {
      container.classList.add("animate-shake");
      setTimeout(() => container.classList.remove("animate-shake"), 500);
    }
  }

  // NASLEDNJA NALOGA (Ročni prehod)
  document.getElementById("next-task-btn").addEventListener("click", () => {
    // Počistimo samodejni prehod, da ne naložimo naloge dvakrat
    if (autoAdvanceTimeout) {
      clearTimeout(autoAdvanceTimeout);
      autoAdvanceTimeout = null;
    }
    currentTaskIndex++;
    loadTask();
  });
});
