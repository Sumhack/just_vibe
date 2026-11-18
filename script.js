/* ==========================================================================
   Get Well Soon - Interactive Logic & Audio Synthesis
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const packageStage = document.getElementById('package-stage');
  const letterStage = document.getElementById('letter-stage');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  const customizeBtn = document.getElementById('customize-btn');
  const customModal = document.getElementById('custom-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const saveCustomBtn = document.getElementById('save-custom-btn');
  const copyLinkBtn = document.getElementById('copy-link-btn');
  const copyConfirmText = document.getElementById('copy-confirm-text');

  // Personalization fields
  const inputRecipient = document.getElementById('input-recipient');
  const inputSender = document.getElementById('input-sender');
  const inputMessage = document.getElementById('input-message');
  const nameTargets = document.querySelectorAll('.name-target');
  const senderTarget = document.getElementById('sender-target');
  const customMessageText = document.getElementById('custom-message-text');

  // Remedy elements
  const teacup = document.getElementById('teacup-icon');
  const brewTeaBtn = document.getElementById('brew-tea-btn');
  const teaLiquid = document.getElementById('tea-liquid');
  const teaTag = document.getElementById('tea-tag');
  const teaStatusText = document.getElementById('tea-status-text');

  const pillBottle = document.getElementById('pill-bottle');
  const popPillBtn = document.getElementById('pop-pill-btn');
  const capsuleNote = document.getElementById('capsule-note');
  const doseCounter = document.getElementById('dose-counter');

  const gardenBed = document.getElementById('garden-bed');
  const waterGardenBtn = document.getElementById('water-garden-btn');
  const gardenNote = document.getElementById('garden-note');

  const hugBtn = document.getElementById('hug-btn');
  const hugFill = document.getElementById('hug-fill');
  const hugStatus = document.getElementById('hug-status');
  const hugMascot = document.getElementById('hug-mascot');

  const bubbleArea = document.getElementById('bubble-area');
  const popCounter = document.getElementById('pop-counter');
  const resetBubblesBtn = document.getElementById('reset-bubbles-btn');
  const burstCheerBtn = document.getElementById('burst-cheer-btn');

  // ==========================================================================
  // URL Parameters & State Initialization
  // ==========================================================================
  function parseUrlParams() {
    const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search);
    return {
      to: params.get('to') || params.get('name') || '',
      from: params.get('from') || '',
      msg: params.get('msg') || ''
    };
  }

  function applyPersonalization(toName, fromName, message) {
    if (toName) {
      nameTargets.forEach(el => el.textContent = toName);
      inputRecipient.value = toName;
    }
    if (fromName) {
      senderTarget.textContent = `${fromName} 🌻`;
      inputSender.value = fromName;
    }
    if (message) {
      customMessageText.textContent = message;
      inputMessage.value = message;
    }
  }

  const initialData = parseUrlParams();
  if (initialData.to || initialData.from || initialData.msg) {
    applyPersonalization(initialData.to, initialData.from, initialData.msg);
  }

  // ==========================================================================
  // Web Audio API: Peaceful Harp / Chime Synthesizer
  // ==========================================================================
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicInterval = null;

  const peacefulNotes = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25  // E5
  ];

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration = 1.6, type = 'sine', volume = 0.15) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  function playChimeChord() {
    initAudio();
    const chord = [peacefulNotes[0], peacefulNotes[2], peacefulNotes[4], peacefulNotes[5]];
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 2.2, 'triangle', 0.1);
      }, idx * 120);
    });
  }

  function playPopSound() {
    initAudio();
    playTone(587.33, 0.15, 'sine', 0.12);
  }

  function startAmbientChimes() {
    initAudio();
    isPlayingMusic = true;
    soundBtn.classList.add('playing');
    soundIcon.textContent = '🔊';

    const playRandomMelody = () => {
      if (!isPlayingMusic) return;
      const note = peacefulNotes[Math.floor(Math.random() * peacefulNotes.length)];
      playTone(note, 2.8, 'sine', 0.08);
      
      const nextDelay = 1200 + Math.random() * 1800;
      musicInterval = setTimeout(playRandomMelody, nextDelay);
    };

    playRandomMelody();
  }

  function stopAmbientChimes() {
    isPlayingMusic = false;
    soundBtn.classList.remove('playing');
    soundIcon.textContent = '🎵';
    if (musicInterval) {
      clearTimeout(musicInterval);
      musicInterval = null;
    }
  }

  soundBtn.addEventListener('click', () => {
    if (isPlayingMusic) {
      stopAmbientChimes();
    } else {
      startAmbientChimes();
    }
  });

  // ==========================================================================
  // Stage 1 -> Stage 2: Opening the Care Package Envelope
  // ==========================================================================
  function openCarePackage() {
    initAudio();
    playChimeChord();

    envelopeWrapper.classList.add('opening');
    createBurstEffect(window.innerWidth / 2, window.innerHeight / 2, 40);

    setTimeout(() => {
      packageStage.style.opacity = '0';
      packageStage.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        packageStage.classList.remove('stage-active');
        packageStage.classList.add('stage-hidden');

        letterStage.classList.remove('stage-hidden');
        letterStage.classList.add('stage-active');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Auto start gentle ambient chime if permitted
        if (!isPlayingMusic) {
          startAmbientChimes();
        }
      }, 500);
    }, 800);
  }

  envelopeWrapper.addEventListener('click', openCarePackage);
  envelopeWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      openCarePackage();
    }
  });

  // ==========================================================================
  // Particle Canvas Background (Gentle Petals & Light Orbs)
  // ==========================================================================
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 0.9 + 0.4;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.03;
      this.opacity = Math.random() * 0.45 + 0.25;
      
      const colors = [
        'rgba(255, 182, 193,', // soft pink
        'rgba(254, 215, 170,', // soft peach
        'rgba(233, 213, 255,', // soft lavender
        'rgba(254, 240, 138,'  // soft sunlight
      ];
      this.baseColor = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.angle) * 0.5;
      this.angle += this.spin;

      if (this.y > canvas.height + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = `${this.baseColor} ${this.opacity})`;

      // Draw soft petal shape
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(this.size * 0.8, -this.size * 0.2, 0, this.size);
      ctx.quadraticCurveTo(-this.size * 0.8, -this.size * 0.2, 0, -this.size);
      ctx.fill();

      ctx.restore();
    }
  }

  // Create initial petals
  for (let i = 0; i < 35; i++) {
    particles.push(new Particle());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // ==========================================================================
  // Full-Screen Burst & Confetti System
  // ==========================================================================
  function createBurstEffect(x, y, count = 25) {
    const emojis = ['🌸', '💛', '✨', '🌼', '💖', '🌿', '🧸', '🍵'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.position = 'fixed';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
      el.style.pointerEvents = 'none';
      el.style.zIndex = '9999';
      el.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease-out';
      
      document.body.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 220 + 60;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance - 40;

      requestAnimationFrame(() => {
        el.style.transform = `translate(${destX}px, ${destY}px) rotate(${Math.random() * 360}deg) scale(1.3)`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 1300);
    }
  }

  burstCheerBtn.addEventListener('click', (e) => {
    const rect = burstCheerBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    createBurstEffect(centerX, centerY, 35);
    playChimeChord();
  });

  // ==========================================================================
  // Remedy 1: Brew Warm Tea Logic
  // ==========================================================================
  const teaBlends = [
    { name: "Lemon & Honey 🍯", color: "#d97706", desc: "Soothing warmth for your throat with pure golden honey." },
    { name: "Chamomile Calmer 🌼", color: "#eab308", desc: "Gentle floral notes to ease all tension and help you snooze." },
    { name: "Ginger Peppermint 🌿", color: "#16a34a", desc: "Spicy ginger warmth to clear up sniffles and restore energy." },
    { name: "Cozy Spiced Chai ☕", color: "#b45309", desc: "Rich cinnamon and cardamom hug in a cup!" },
    { name: "Lavender Dream 💜", color: "#9333ea", desc: "Relaxing lavender petals for the sweetest, deepest recovery nap." }
  ];
  let currentTeaIndex = 0;

  function brewNextTea() {
    initAudio();
    playTone(440, 0.4, 'sine', 0.1);

    currentTeaIndex = (currentTeaIndex + 1) % teaBlends.length;
    const blend = teaBlends[currentTeaIndex];

    teaLiquid.style.background = blend.color;
    teaTag.textContent = blend.name;
    teaStatusText.textContent = `Brewed: ${blend.name} — ${blend.desc}`;

    teacup.style.transform = 'scale(1.15) rotate(-3deg)';
    setTimeout(() => teacup.style.transform = 'scale(1)', 250);

    const rect = teacup.getBoundingClientRect();
    createBurstEffect(rect.left + rect.width / 2, rect.top, 8);
  }

  brewTeaBtn.addEventListener('click', brewNextTea);
  teacup.addEventListener('click', brewNextTea);

  // ==========================================================================
  // Remedy 2: Prescription / Dose of Smiles
  // ==========================================================================
  const recoveryAffirmations = [
    "Your only job today is to wrap in a blanket and be cute! 🛌",
    "Sending you 1,000,000 units of Vitamin Hugs! 💖",
    "Reminder: Resting isn't wasting time, it's recharging your superpowers ⚡",
    "I volunteer to be on standby if you need snack deliveries! 🍕",
    "Germs picked the wrong person to mess with. You're too strong for them! 💪",
    "Hydrate like a leafy plant after a rainstorm 🌱",
    "May your soup be hot and your Netflix suggestions be 10/10 🍲",
    "Sending you a warm telepathic head massage and foot warmers 💆‍♀️",
    "Even when under the weather, you are wonderful and deeply loved 🌸",
    "Breathe easy, close your eyes, and let your body heal at its own pace 🕊️"
  ];
  let doseTakenCount = 0;

  function popPill() {
    initAudio();
    playTone(523.25, 0.25, 'triangle', 0.12);

    doseTakenCount++;
    const randomNote = recoveryAffirmations[Math.floor(Math.random() * recoveryAffirmations.length)];
    
    capsuleNote.innerHTML = `<strong>Dose #${doseTakenCount}:</strong> ${randomNote}`;
    capsuleNote.classList.remove('highlight');
    void capsuleNote.offsetWidth;
    capsuleNote.classList.add('highlight');

    pillBottle.style.transform = 'rotate(-15deg) scale(1.12)';
    setTimeout(() => pillBottle.style.transform = 'rotate(0) scale(1)', 200);

    doseCounter.textContent = `Refills taken: ${doseTakenCount} 💊 Unlimited supply left!`;
  }

  popPillBtn.addEventListener('click', popPill);
  pillBottle.addEventListener('click', popPill);

  // ==========================================================================
  // Remedy 3: Healing Flower Garden Bed
  // ==========================================================================
  const flowerTypes = ['🌸', '🌻', '🌷', '🌼', '🌺', '🌹', '💐'];
  let flowerCount = 0;

  function bloomFlower() {
    initAudio();
    playTone(659.25, 0.3, 'sine', 0.1);

    if (flowerCount >= 7) {
      gardenBed.querySelectorAll('.flower-stem').forEach(f => f.remove());
      flowerCount = 0;
    }

    flowerCount++;
    const stem = document.createElement('div');
    stem.className = 'flower-stem';

    const petals = document.createElement('span');
    petals.className = 'flower-petals';
    petals.textContent = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];

    const stalk = document.createElement('div');
    stalk.className = 'flower-stalk';
    stalk.style.height = `${Math.floor(Math.random() * 25 + 25)}px`;

    stem.appendChild(petals);
    stem.appendChild(stalk);
    gardenBed.appendChild(stem);

    gardenNote.textContent = `You blossomed ${flowerCount} flower${flowerCount > 1 ? 's' : ''}! Sending you a whole bouquet of vitality 💐`;
  }

  waterGardenBtn.addEventListener('click', bloomFlower);

  // Auto bloom 3 initial flowers
  bloomFlower();
  bloomFlower();
  bloomFlower();

  // ==========================================================================
  // Remedy 4: Giant Warm Bear Hug Meter
  // ==========================================================================
  let hugProgress = 0;
  let hugInterval = null;

  function startHug() {
    initAudio();
    hugMascot.classList.add('hugging');
    
    hugInterval = setInterval(() => {
      if (hugProgress < 100) {
        hugProgress += 4;
        hugFill.style.width = `${hugProgress}%`;
        hugStatus.textContent = `Warmth: ${hugProgress}% — Charging up the ultimate hug!`;
        playTone(300 + hugProgress * 4, 0.1, 'sine', 0.05);

        if (hugProgress >= 100) {
          clearInterval(hugInterval);
          hugStatus.textContent = 'Warmth: 100%! Giant Super-Hug Delivered! 💖';
          playChimeChord();
          const rect = hugMascot.getBoundingClientRect();
          createBurstEffect(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
        }
      }
    }, 60);
  }

  function releaseHug() {
    clearInterval(hugInterval);
    hugMascot.classList.remove('hugging');
    if (hugProgress < 100) {
      hugStatus.textContent = `Warmth: ${hugProgress}% — Hold longer to deliver the full hug!`;
    }
  }

  hugBtn.addEventListener('pointerdown', startHug);
  window.addEventListener('pointerup', releaseHug);
  window.addEventListener('pointercancel', releaseHug);

  // ==========================================================================
  // Remedy 5: Pop Away Bad Germs Mini-Game
  // ==========================================================================
  let germsPopped = 0;
  const germIcons = ['🦠', '🤧', '🤒', '🥶', '💤', '🥱', '🥺'];

  function spawnBubbles() {
    bubbleArea.innerHTML = '';
    const bubbleCount = 8;
    
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble-item';
      bubble.textContent = germIcons[Math.floor(Math.random() * germIcons.length)];
      
      const posX = Math.random() * (bubbleArea.clientWidth - 50);
      const posY = Math.random() * (bubbleArea.clientHeight - 50);
      bubble.style.left = `${Math.max(10, posX)}px`;
      bubble.style.top = `${Math.max(10, posY)}px`;
      bubble.style.animationDelay = `${Math.random() * 2}s`;

      bubble.addEventListener('click', () => {
        bubble.classList.add('popping');
        playPopSound();
        germsPopped++;
        popCounter.textContent = `Germs Busted: ${germsPopped} 🌟 Health increasing!`;

        setTimeout(() => {
          bubble.remove();
          if (bubbleArea.children.length === 0) {
            bubbleArea.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#059669;font-weight:600;">All icky germs popped away! You're on your way to 100% 🌈</div>`;
            playChimeChord();
          }
        }, 220);
      });

      bubbleArea.appendChild(bubble);
    }
  }

  resetBubblesBtn.addEventListener('click', spawnBubbles);
  spawnBubbles();

  // ==========================================================================
  // Personalization Modal & Shareable Link Generator
  // ==========================================================================
  customizeBtn.addEventListener('click', () => {
    customModal.classList.add('open');
    customModal.setAttribute('aria-hidden', 'false');
  });

  closeModalBtn.addEventListener('click', () => {
    customModal.classList.remove('open');
    customModal.setAttribute('aria-hidden', 'true');
    copyConfirmText.textContent = '';
  });

  customModal.addEventListener('click', (e) => {
    if (e.target === customModal) {
      customModal.classList.remove('open');
      customModal.setAttribute('aria-hidden', 'true');
      copyConfirmText.textContent = '';
    }
  });

  saveCustomBtn.addEventListener('click', () => {
    const to = inputRecipient.value.trim() || 'Friend';
    const from = inputSender.value.trim() || 'Your Friend';
    const msg = inputMessage.value.trim();

    applyPersonalization(to, from, msg);

    // Update URL hash without reload
    const params = new URLSearchParams();
    params.set('to', to);
    params.set('from', from);
    if (msg) params.set('msg', msg);
    window.location.hash = params.toString();

    customModal.classList.remove('open');
    customModal.setAttribute('aria-hidden', 'true');
    copyConfirmText.textContent = '';

    playChimeChord();
  });

  copyLinkBtn.addEventListener('click', async () => {
    const to = inputRecipient.value.trim() || 'Friend';
    const from = inputSender.value.trim() || 'Your Friend';
    const msg = inputMessage.value.trim();

    applyPersonalization(to, from, msg);

    const params = new URLSearchParams();
    params.set('to', to);
    params.set('from', from);
    if (msg) params.set('msg', msg);

    const shareUrl = `${window.location.origin}${window.location.pathname}#${params.toString()}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        copyConfirmText.textContent = '✨ Link copied to clipboard! Ready to send to your friend.';
      } else {
        copyConfirmText.textContent = `Copy this URL: ${shareUrl}`;
      }
    } catch (err) {
      copyConfirmText.textContent = `Link generated: ${shareUrl}`;
    }
  });
});
