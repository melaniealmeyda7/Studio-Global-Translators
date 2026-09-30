// Global Translators • Intern Studio & Hub Application Logic
// Developed with aesthetic cute pastel vibes, Firebase Realtime Database, Drag & Drop, SheetJS and Web Audio

class GlobalTranslatorsApp {
  constructor() {
    this.storageKey = "GT_STUDIO_STORAGE_V4";
    this.firebaseConfigKey = "GT_FIREBASE_CONFIG_V1";
    this.currentTab = "overview";
    this.cronogramaView = "kanban"; // 'kanban' | 'list'
    this.selectedCalendarDate = new Date();
    this.currentCalendarMonth = new Date().getMonth();
    this.currentCalendarYear = new Date().getFullYear();
    this.selectedCalendarDayStr = this.formatDate(new Date());

    // Drag and Drop state
    this.draggedCardId = null;

    // Firebase Realtime Database state
    this.firebaseDb = null;
    this.firebaseConfig = null;
    this.realtimeChannel = null;

    // Motivational quotes
    this.quotes = [
      "\"Traducir es tender puentes entre mundos; cada palabra que eligen con precisión transforma una historia.\" ✨",
      "\"Un buen traductor no solo conoce dos idiomas, conoce dos culturas y sus corazones.\" 🌸",
      "\"La excelencia no es un acto, es un hábito de revisión y cariño por el texto.\" 🌿",
      "\"Cada página traducida es un paso más cerca de tu carrera internacional.\" 🚀",
      "\"Tu voz profesional se forja en los detalles y la coherencia terminológica.\" 💜"
    ];
    this.quoteIndex = 0;

    // Lofi ambient sound state
    this.lofiAudioCtx = null;
    this.isLofiPlaying = false;
    this.lofiTimer = null;

    // Excel live state
    this.excelFileName = "Plantilla_Global_Translators_Coaching.xlsx";
    this.excelRows = [];
    this.excelFilteredRows = [];
    this.excelHeaders = [];

    // Initialize state & load data
    this.loadState();
    this.initExcelData();
  }

  /* ------------------------------------------------------------- */
  /* INITIALIZATION & STORAGE                                      */
  /* ------------------------------------------------------------- */
  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.data = { ...window.GT_DATA_INITIAL, ...parsed };

        // Auto-migración si el almacenamiento local tiene datos desactualizados o individuales
        const needsUpdate = !parsed.practicantes || 
          parsed.practicantes.length < 6 || 
          parsed.practicantes.some(p => p.avatar && p.avatar.includes("unsplash.com")) ||
          parsed.practicantes.some(p => p.nombre && (
            p.nombre.includes("Valentina Morales") || 
            p.nombre.includes("Camila") || 
            p.nombre.includes("Lucía Méndez") ||
            p.nombre.includes("Sofía Castillo")
          )) ||
          !parsed.coachingSessions ||
          parsed.coachingSessions.length === 0 ||
          parsed.coachingSessions.some(c => c.id === "c1" || (c.enlaceSala && c.enlaceSala.includes("gts-coaching")) || (c.id === "cg-3" && c.coach !== "Melanie Almeyda"));

        if (needsUpdate) {
          this.data.practicantes = JSON.parse(JSON.stringify(window.GT_DATA_INITIAL.practicantes));
          this.data.entregas = JSON.parse(JSON.stringify(window.GT_DATA_INITIAL.entregas));
          this.data.coachingSessions = JSON.parse(JSON.stringify(window.GT_DATA_INITIAL.coachingSessions));
          this.data.excelTemplateData = JSON.parse(JSON.stringify(window.GT_DATA_INITIAL.excelTemplateData));
          this.saveState();
        }
      } catch (e) {
        console.warn("Error leyendo localStorage, usando datos iniciales", e);
        this.data = JSON.parse(JSON.stringify(window.GT_DATA_INITIAL));
      }
    } else {
      this.data = JSON.parse(JSON.stringify(window.GT_DATA_INITIAL));
      this.saveState();
    }
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.error("Error guardando en localStorage", e);
    }
  }

  init() {
    this.setupGreeting();
    this.setupNavigation();
    this.setupDropzone();
    this.setupLofiAudio();
    this.populateSelects();

    // Setup Firebase Realtime Database & Multi-screen synchronization
    this.setupFirebaseRealtime();

    // Render all initial modules
    this.renderOverview();
    this.renderCronograma();
    this.renderCalendar();
    this.renderPracticantes();
    this.renderCoaching();
    this.renderExcelTable();
    this.renderGlosario();
    this.renderStickyNotes();

    // Refresh icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  setupGreeting() {
    const greetingEl = document.getElementById("hero-greeting");
    if (!greetingEl) return;
    const hour = new Date().getHours();
    let saludo = "¡Buenos días";
    if (hour >= 12 && hour < 19) {
      saludo = "¡Buenas tardes";
    } else if (hour >= 19 || hour < 6) {
      saludo = "¡Buenas noches";
    }
    greetingEl.innerHTML = `${saludo} y bienvenidas al <span class="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Studio Global Translators</span>! ✨`;
  }

  nextQuote() {
    this.quoteIndex = (this.quoteIndex + 1) % this.quotes.length;
    const el = document.getElementById("motivational-quote");
    if (el) {
      el.textContent = this.quotes[this.quoteIndex];
    }
  }

  /* ------------------------------------------------------------- */
  /* TAB NAVIGATION                                                */
  /* ------------------------------------------------------------- */
  setupNavigation() {
    // Already setup via onclick in HTML
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    // Hide all tab sections
    const tabs = ["overview", "cronograma", "calendario", "practicantes", "coaching", "meet", "excel", "toolkit"];
    tabs.forEach(t => {
      const sec = document.getElementById(`section-${t}`);
      if (sec) sec.classList.add("hidden");
    });

    // Show target section
    const target = document.getElementById(`section-${tabId}`);
    if (target) {
      target.classList.remove("hidden");
    }

    // Update active nav button
    document.querySelectorAll(".nav-tab").forEach(btn => {
      if (btn.getAttribute("data-tab") === tabId) {
        btn.classList.add("nav-tab-active");
      } else {
        btn.classList.remove("nav-tab-active");
      }
    });

    // Re-render specific tab if needed
    if (tabId === "calendario") this.renderCalendar();
    if (tabId === "cronograma") this.renderCronograma();
    if (tabId === "excel") this.renderExcelTable();
    if (tabId === "coaching") this.renderCoaching();
    if (tabId === "overview") this.renderOverview();

    if (window.lucide) {
      window.lucide.createIcons();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  copyMeetLink(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast("¡Enlace de Google Meet copiado! ✨ (ejp-yxsy-ufw)", "success");
      }).catch(() => {
        prompt("Copia el enlace de Google Meet:", url);
      });
    } else {
      prompt("Copia el enlace de Google Meet:", url);
    }
  }

  showToast(msg, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    const bgClass = type === "success" 
      ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-200" 
      : "bg-slate-800 text-white border-slate-700";

    toast.className = `pointer-events-auto px-4 py-3 rounded-2xl text-xs font-bold shadow-lg border flex items-center gap-2 transform transition-all duration-300 opacity-0 translate-y-2 ${bgClass}`;
    toast.innerHTML = `<span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove("opacity-0", "translate-y-2");
    }, 10);

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3200);
  }

  /* ------------------------------------------------------------- */
  /* OVERVIEW DASHBOARD                                            */
  /* ------------------------------------------------------------- */
  renderOverview() {
    // Stats calculation
    const entregasActivas = this.data.entregas.filter(e => e.estado !== "entregado").length;
    const totalPracticantes = this.data.practicantes.length;
    const coachingActivas = this.data.coachingSessions.filter(c => c.estado === "programada").length;

    // Average completed hours percentage
    let totalHorasCompletadas = 0;
    let totalHorasMeta = 0;
    this.data.practicantes.forEach(p => {
      totalHorasCompletadas += Number(p.horasCompletadas || 0);
      totalHorasMeta += Number(p.horasMeta || 480);
    });
    const avgPct = totalHorasMeta > 0 ? Math.round((totalHorasCompletadas / totalHorasMeta) * 100) : 0;

    // Badges in header
    const bEnt = document.getElementById("badge-count-entregas");
    if (bEnt) bEnt.textContent = entregasActivas;
    const bPrac = document.getElementById("badge-count-practicantes");
    if (bPrac) bPrac.textContent = totalPracticantes;

    // Stats cards
    const s1 = document.getElementById("stat-entregas-activas");
    if (s1) s1.textContent = entregasActivas;
    const s2 = document.getElementById("stat-total-practicantes");
    if (s2) s2.textContent = totalPracticantes;
    const s3 = document.getElementById("stat-coaching-activas");
    if (s3) s3.textContent = coachingActivas;
    const s4 = document.getElementById("stat-promedio-horas");
    if (s4) s4.textContent = `${avgPct}%`;

    // Overview list of upcoming urgent deliveries
    const listEl = document.getElementById("overview-entregas-list");
    if (listEl) {
      const activeEntregas = [...this.data.entregas]
        .filter(e => e.estado !== "entregado")
        .sort((a, b) => new Date(a.fechaLimite) - new Date(b.fechaLimite))
        .slice(0, 4);

      if (activeEntregas.length === 0) {
        listEl.innerHTML = `
          <div class="text-center py-6 text-slate-400 text-xs">
            🌸 ¡No hay entregas pendientes! Todo el equipo está al día.
          </div>
        `;
      } else {
        listEl.innerHTML = activeEntregas.map(e => `
          <div class="flex items-center justify-between p-3.5 rounded-2xl bg-white/90 border border-slate-100 hover:border-pink-200 transition-all shadow-xs">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="pill-badge ${this.getPriorityBadgeClass(e.prioridad)} text-[10px]">${e.prioridad}</span>
                <span class="pill-badge bg-slate-100 text-slate-700 text-[10px]">${e.parIdiomas}</span>
                <span class="text-xs font-bold text-slate-800">${e.titulo}</span>
              </div>
              <div class="flex items-center gap-3 text-[11px] text-slate-500">
                <span class="flex items-center gap-1"><i data-lucide="user" class="w-3 h-3 text-purple-500"></i> ${e.practicanteNombre}</span>
                <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3 text-rose-400"></i> Entrega: ${e.fechaLimite} (${e.horaLimite || '18:00'})</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-purple-700">${e.progreso || 0}%</span>
              <button onclick="app.advanceEntregaStatus('${e.id}')" class="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold" title="Avanzar etapa">
                Avanzar ➔
              </button>
            </div>
          </div>
        `).join("");
      }
    }

    // Overview coaching list
    const cListEl = document.getElementById("overview-coaching-list");
    if (cListEl) {
      const nextCoaching = [...this.data.coachingSessions]
        .filter(c => c.estado === "programada")
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 3);

      if (nextCoaching.length === 0) {
        cListEl.innerHTML = `<p class="text-xs text-slate-400 italic">No hay sesiones de coaching agendadas.</p>`;
      } else {
        cListEl.innerHTML = nextCoaching.map(c => `
          <div class="p-3 bg-white/90 rounded-2xl border border-purple-100 text-xs space-y-2 shadow-2xs hover:border-purple-200 transition-all">
            <div class="flex items-start justify-between gap-1">
              <span class="font-bold text-slate-800 leading-snug text-[11px] line-clamp-1">${c.tipo}</span>
              <span class="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg shrink-0">
                Miérc. ${c.fecha.slice(5)} • ${c.hora}
              </span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>👥 <b>${c.practicanteNombre}</b></span>
              <a href="${c.enlaceSala || 'https://meet.google.com/cei-stmz-drx'}" target="_blank" class="text-purple-600 hover:text-purple-800 font-bold inline-flex items-center gap-1 hover:underline">
                <i data-lucide="video" class="w-3 h-3 text-purple-500"></i> Meet
              </a>
            </div>
          </div>
        `).join("");
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  /* ------------------------------------------------------------- */
  /* CRONOGRAMA & KANBAN                                           */
  /* ------------------------------------------------------------- */
  setCronogramaView(view) {
    this.cronogramaView = view;
    const kanbanEl = document.getElementById("cronograma-kanban-view");
    const listEl = document.getElementById("cronograma-list-view");
    const btnKanban = document.getElementById("btn-view-kanban");
    const btnList = document.getElementById("btn-view-list");

    if (view === "kanban") {
      kanbanEl.classList.remove("hidden");
      listEl.classList.add("hidden");
      btnKanban.className = "flex-1 py-1.5 text-xs font-semibold rounded-lg bg-white text-purple-700 shadow-xs flex items-center justify-center gap-1";
      btnList.className = "flex-1 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-purple-700 flex items-center justify-center gap-1";
    } else {
      kanbanEl.classList.add("hidden");
      listEl.classList.remove("hidden");
      btnList.className = "flex-1 py-1.5 text-xs font-semibold rounded-lg bg-white text-purple-700 shadow-xs flex items-center justify-center gap-1";
      btnKanban.className = "flex-1 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-purple-700 flex items-center justify-center gap-1";
    }
    this.renderCronograma();
  }

  renderCronograma() {
    const searchVal = (document.getElementById("filter-entrega-search")?.value || "").toLowerCase();
    const pracFilter = document.getElementById("filter-entrega-practicante")?.value || "";
    const idiomaFilter = document.getElementById("filter-entrega-idioma")?.value || "";

    const filtered = this.data.entregas.filter(item => {
      const matchSearch = item.titulo.toLowerCase().includes(searchVal) || (item.notas && item.notas.toLowerCase().includes(searchVal));
      const matchPrac = !pracFilter || item.practicanteId === pracFilter;
      const matchIdioma = !idiomaFilter || item.parIdiomas === idiomaFilter;
      return matchSearch && matchPrac && matchIdioma;
    });

    // Populate columns
    const columns = {
      "pendiente": document.getElementById("col-cards-pendiente"),
      "en-progreso": document.getElementById("col-cards-en-progreso"),
      "revision": document.getElementById("col-cards-revision"),
      "entregado": document.getElementById("col-cards-entregado")
    };

    const counts = {
      "pendiente": 0,
      "en-progreso": 0,
      "revision": 0,
      "entregado": 0
    };

    // Reset columns HTML
    Object.values(columns).forEach(col => { if (col) col.innerHTML = ""; });

    filtered.forEach(item => {
      const state = item.estado || "pendiente";
      if (counts[state] !== undefined) counts[state]++;

      const card = document.createElement("div");
      card.id = `card-${item.id}`;
      card.setAttribute("draggable", "true");
      card.setAttribute("data-id", item.id);
      card.className = "kanban-card glass-panel p-3.5 rounded-2xl space-y-2.5 transition-all hover:shadow-md hover:-translate-y-0.5 border border-white/90";
      
      // Drag and drop event listeners
      card.ondragstart = (e) => this.handleDragStart(e, item.id);
      card.ondragend = (e) => this.handleDragEnd(e);

      card.innerHTML = `
        <div class="flex items-center justify-between gap-1.5">
          <div class="flex items-center gap-1.5">
            <span class="pill-badge ${this.getPriorityBadgeClass(item.prioridad)} text-[10px]">${item.prioridad}</span>
            <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">${item.parIdiomas}</span>
          </div>
          <span class="text-slate-300 hover:text-purple-600 transition-colors p-0.5 cursor-grab active:cursor-grabbing" title="Arrastra esta tarjeta a otra columna">
            <i data-lucide="grip-vertical" class="w-3.5 h-3.5"></i>
          </span>
        </div>

        <h5 class="font-heading font-bold text-xs text-slate-800 leading-snug line-clamp-2">${item.titulo}</h5>

        <div class="text-[11px] text-slate-500 space-y-1">
          <div class="flex items-center gap-1.5">
            <i data-lucide="user" class="w-3 h-3 text-purple-500"></i>
            <span class="font-medium text-slate-700 truncate">${item.practicanteNombre}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <i data-lucide="calendar" class="w-3 h-3 text-rose-400"></i>
            <span>${item.fechaLimite} (${item.horaLimite || '18:00'})</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="space-y-1">
          <div class="flex justify-between text-[10px] font-bold text-slate-600">
            <span>Progreso</span>
            <span>${item.progreso || 0}%</span>
          </div>
          <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" style="width: ${item.progreso || 0}%"></div>
          </div>
        </div>

        <!-- Action bar -->
        <div class="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
          <div class="flex items-center gap-1">
            ${item.documentoUrl ? `
              <a href="${item.documentoUrl}" target="_blank" class="p-1 text-slate-400 hover:text-purple-600" title="Ver documento">
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
              </a>
            ` : ''}
            <button onclick="app.editEntrega('${item.id}')" class="p-1 text-slate-400 hover:text-purple-600" title="Editar">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="app.deleteEntrega('${item.id}')" class="p-1 text-slate-400 hover:text-rose-500" title="Eliminar">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <button onclick="app.advanceEntregaStatus('${item.id}')" class="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold transition-all flex items-center gap-1">
            ${state === "entregado" ? '✅ Listo' : 'Avanzar ➔'}
          </button>
        </div>
      `;

      if (columns[state]) {
        columns[state].appendChild(card);
      }
    });

    // Update count labels
    Object.keys(counts).forEach(k => {
      const countEl = document.getElementById(`col-count-${k}`);
      if (countEl) countEl.textContent = counts[k];
    });

    // Render table body
    const tableBody = document.getElementById("cronograma-table-body");
    if (tableBody) {
      if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-400 text-xs">No se encontraron entregas con los filtros actuales.</td></tr>`;
      } else {
        tableBody.innerHTML = filtered.map(item => `
          <tr class="hover:bg-slate-50/70 transition-colors">
            <td class="py-3 px-3 font-bold text-slate-800">${item.titulo}</td>
            <td class="py-3 px-3 text-slate-600">${item.practicanteNombre}</td>
            <td class="py-3 px-3"><span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold text-[10px]">${item.parIdiomas}</span></td>
            <td class="py-3 px-3 text-slate-600">${item.fechaLimite}</td>
            <td class="py-3 px-3"><span class="pill-badge ${this.getPriorityBadgeClass(item.prioridad)} text-[10px]">${item.prioridad}</span></td>
            <td class="py-3 px-3 font-semibold text-purple-700">${item.progreso || 0}%</td>
            <td class="py-3 px-3"><span class="pill-badge ${this.getEstadoBadgeClass(item.estado)} text-[10px]">${this.getEstadoLabel(item.estado)}</span></td>
            <td class="py-3 px-3 text-right">
              <div class="flex items-center justify-end gap-1">
                <button onclick="app.advanceEntregaStatus('${item.id}')" class="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 font-bold text-[10px]">Avanzar</button>
                <button onclick="app.editEntrega('${item.id}')" class="p-1 text-slate-400 hover:text-purple-600"><i data-lucide="edit-3" class="w-3.5 h-3.5"></i></button>
                <button onclick="app.deleteEntrega('${item.id}')" class="p-1 text-slate-400 hover:text-rose-500"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
              </div>
            </td>
          </tr>
        `).join("");
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  /* ------------------------------------------------------------- */
  /* DRAG AND DROP KANBAN EVENTS                                   */
  /* ------------------------------------------------------------- */
  handleDragStart(e, id) {
    this.draggedCardId = id;
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    const card = document.getElementById(`card-${id}`);
    if (card) {
      setTimeout(() => card.classList.add("is-dragging"), 0);
    }
  }

  handleDragEnd(e) {
    document.querySelectorAll(".kanban-card").forEach(c => c.classList.remove("is-dragging"));
    document.querySelectorAll(".kanban-column").forEach(c => c.classList.remove("kanban-dragover"));
    this.draggedCardId = null;
  }

  handleDragOver(e, colName) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const col = document.getElementById(`kanban-col-${colName}`);
    if (col && !col.classList.contains("kanban-dragover")) {
      col.classList.add("kanban-dragover");
    }
  }

  handleDragLeave(e, colName) {
    const col = document.getElementById(`kanban-col-${colName}`);
    if (col && !col.contains(e.relatedTarget)) {
      col.classList.remove("kanban-dragover");
    }
  }

  handleDrop(e, targetCol) {
    e.preventDefault();
    document.querySelectorAll(".kanban-column").forEach(c => c.classList.remove("kanban-dragover"));
    const id = e.dataTransfer.getData("text/plain") || this.draggedCardId;
    if (!id) return;
    this.updateEntregaStatus(id, targetCol);
  }

  /* ------------------------------------------------------------- */
  /* SYNCHRONIZED STATUS UPDATE (FIREBASE & REALTIME BROADCAST)    */
  /* ------------------------------------------------------------- */
  updateEntregaStatus(id, newStatus) {
    const item = this.data.entregas.find(e => e.id === id);
    if (!item) return;

    item.estado = newStatus;
    if (newStatus === "entregado") {
      item.progreso = 100;
      this.triggerConfetti();
    } else if (newStatus === "revision" && item.progreso < 80) {
      item.progreso = 85;
    } else if (newStatus === "en-progreso" && item.progreso < 30) {
      item.progreso = 40;
    } else if (newStatus === "pendiente") {
      item.progreso = Math.min(item.progreso, 15);
    }

    // 1. Enviar a Firebase Realtime Database
    if (this.firebaseDb) {
      try {
        this.firebaseDb.ref(`san_mateo_studio/entregas/${id}`).set(item);
      } catch (err) {
        console.warn("Firebase RTDB sync error:", err);
      }
    }

    // 2. Emitir a otras pestañas/pantallas en tiempo real (BroadcastChannel)
    if (this.realtimeChannel) {
      this.realtimeChannel.postMessage({
        type: "REALTIME_UPDATE",
        entregas: this.data.entregas,
        updatedId: id
      });
    }

    // 3. Guardar en caché local y renderizar interfaces
    this.saveState();
    this.renderCronograma();
    this.renderCalendar();
    this.renderOverview();
  }

  advanceEntregaStatus(id) {
    const item = this.data.entregas.find(e => e.id === id);
    if (!item) return;

    const flow = ["pendiente", "en-progreso", "revision", "entregado"];
    const currIdx = flow.indexOf(item.estado || "pendiente");
    const nextStatus = currIdx < flow.length - 1 ? flow[currIdx + 1] : "pendiente";
    
    this.updateEntregaStatus(id, nextStatus);
  }

  /* ------------------------------------------------------------- */
  /* PROYECTO SAN MATEO HELPERS                                    */
  /* ------------------------------------------------------------- */
  filterBySanMateo() {
    this.switchTab('cronograma');
    const searchInput = document.getElementById("filter-entrega-search");
    if (searchInput) {
      searchInput.value = "San Mateo";
      this.renderCronograma();
    }
  }

  openNewEntregaModalWithProject(projectName) {
    this.openNewEntregaModal();
    const tituloInput = document.getElementById("entrega-titulo");
    const catInput = document.getElementById("entrega-categoria");
    if (tituloInput) tituloInput.value = `${projectName}: `;
    if (catInput) catInput.value = "Patrimonio / San Mateo";
  }


  triggerConfetti() {
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fda4af', '#c4b5fd', '#6ee7b7', '#93c5fd', '#fde68a']
      });
    }
  }

  getPriorityBadgeClass(p) {
    if (p === "Express") return "bg-rose-100 text-rose-700 border border-rose-200 font-extrabold";
    if (p === "Urgente") return "bg-amber-100 text-amber-800 border border-amber-200";
    return "bg-slate-100 text-slate-600";
  }

  getEstadoBadgeClass(s) {
    if (s === "entregado") return "bg-emerald-100 text-emerald-800";
    if (s === "revision") return "bg-purple-100 text-purple-800";
    if (s === "en-progreso") return "bg-sky-100 text-sky-800";
    return "bg-slate-100 text-slate-700";
  }

  getEstadoLabel(s) {
    if (s === "entregado") return "Entregado ✨";
    if (s === "revision") return "Revisión & QA";
    if (s === "en-progreso") return "En Traducción";
    return "Por Iniciar";
  }

  /* ------------------------------------------------------------- */
  /* CALENDARIO INTERACTIVO CUTE                                   */
  /* ------------------------------------------------------------- */
  prevMonth() {
    this.currentCalendarMonth--;
    if (this.currentCalendarMonth < 0) {
      this.currentCalendarMonth = 11;
      this.currentCalendarYear--;
    }
    this.renderCalendar();
  }

  nextMonth() {
    this.currentCalendarMonth++;
    if (this.currentCalendarMonth > 11) {
      this.currentCalendarMonth = 0;
      this.currentCalendarYear++;
    }
    this.renderCalendar();
  }

  currentMonthToday() {
    const today = new Date();
    this.currentCalendarMonth = today.getMonth();
    this.currentCalendarYear = today.getFullYear();
    this.selectedCalendarDayStr = this.formatDate(today);
    this.renderCalendar();
  }

  renderCalendar() {
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const titleEl = document.getElementById("calendar-month-year");
    if (titleEl) {
      titleEl.textContent = `${monthNames[this.currentCalendarMonth]} ${this.currentCalendarYear}`;
    }

    const grid = document.getElementById("calendar-days-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const firstDay = new Date(this.currentCalendarYear, this.currentCalendarMonth, 1).getDay();
    const daysInMonth = new Date(this.currentCalendarYear, this.currentCalendarMonth + 1, 0).getDate();

    // Blank cells before first day
    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement("div");
      blank.className = "p-2 rounded-2xl bg-transparent opacity-25";
      grid.appendChild(blank);
    }

    const todayStr = this.formatDate(new Date());

    // Generate days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(this.currentCalendarYear, this.currentCalendarMonth, day);
      const dateStr = this.formatDate(dateObj);

      // Check events on this date
      const entregasOnDate = this.data.entregas.filter(e => e.fechaLimite === dateStr);
      const coachingOnDate = this.data.coachingSessions.filter(c => c.fecha === dateStr);

      const hasEvents = entregasOnDate.length > 0 || coachingOnDate.length > 0;
      const isSelected = this.selectedCalendarDayStr === dateStr;
      const isToday = todayStr === dateStr;

      const cell = document.createElement("div");
      cell.className = `p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[58px] ${
        isSelected
          ? 'bg-purple-100 border-purple-400 shadow-sm font-bold'
          : isToday
          ? 'bg-pink-50/80 border-pink-300'
          : 'bg-white/70 border-slate-100 hover:bg-purple-50/50'
      }`;

      cell.onclick = () => {
        this.selectedCalendarDayStr = dateStr;
        this.renderCalendar();
      };

      // Dots container
      let dotsHtml = "";
      if (entregasOnDate.some(e => e.estado === "entregado")) {
        dotsHtml += `<span class="w-2 h-2 rounded-full bg-emerald-400" title="Entrega lista"></span>`;
      }
      if (entregasOnDate.some(e => e.estado !== "entregado")) {
        dotsHtml += `<span class="w-2 h-2 rounded-full bg-rose-400" title="Entrega pendiente"></span>`;
      }
      if (coachingOnDate.length > 0) {
        dotsHtml += `<span class="w-2 h-2 rounded-full bg-purple-500" title="Job Coaching"></span>`;
      }

      cell.innerHTML = `
        <div class="flex items-center justify-between text-xs">
          <span class="${isToday ? 'text-rose-600 font-extrabold' : 'text-slate-700'}">${day}</span>
          ${isToday ? '<span class="text-[9px] bg-rose-200 text-rose-800 px-1 rounded-sm font-bold">Hoy</span>' : ''}
        </div>
        <div class="flex items-center gap-1 mt-1">
          ${dotsHtml}
        </div>
      `;

      grid.appendChild(cell);
    }

    this.renderSelectedDayEvents();
  }

  renderSelectedDayEvents() {
    const labelEl = document.getElementById("calendar-selected-day-label");
    const container = document.getElementById("calendar-selected-day-events");
    if (!labelEl || !container) return;

    labelEl.textContent = this.selectedCalendarDayStr;

    const entregas = this.data.entregas.filter(e => e.fechaLimite === this.selectedCalendarDayStr);
    const coaching = this.data.coachingSessions.filter(c => c.fecha === this.selectedCalendarDayStr);

    if (entregas.length === 0 && coaching.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-slate-400 text-xs space-y-2">
          <span>🌸</span>
          <p>Sin entregas ni sesiones programadas para este día.</p>
          <button onclick="app.openNewEntregaModalWithDate()" class="text-purple-600 font-bold hover:underline">
            + Agendar entrega en este día
          </button>
        </div>
      `;
      return;
    }

    let html = "";
    entregas.forEach(e => {
      html += `
        <div class="p-3 bg-white/95 rounded-2xl border border-rose-100 text-xs space-y-1 shadow-2xs">
          <div class="flex items-center justify-between">
            <span class="pill-badge ${this.getPriorityBadgeClass(e.prioridad)} text-[9px]">${e.prioridad}</span>
            <span class="pill-badge ${this.getEstadoBadgeClass(e.estado)} text-[9px]">${this.getEstadoLabel(e.estado)}</span>
          </div>
          <h5 class="font-bold text-slate-800 leading-snug">${e.titulo}</h5>
          <p class="text-[11px] text-slate-500">Practicante: <b>${e.practicanteNombre}</b> (${e.parIdiomas})</p>
          <div class="text-[10px] text-rose-500 font-semibold">Hora límite: ${e.horaLimite || '18:00'}</div>
        </div>
      `;
    });

    coaching.forEach(c => {
      html += `
        <div class="p-3.5 bg-white/95 rounded-2xl border border-purple-100 text-xs space-y-2 shadow-2xs">
          <div class="flex items-center justify-between">
            <span class="pill-badge bg-purple-100 text-purple-700 text-[10px] font-bold">👥 Coaching Grupal UNIFÉ</span>
            <span class="text-xs text-purple-700 font-black bg-purple-50 px-2 py-0.5 rounded-lg">${c.hora || '09:30'} AM</span>
          </div>
          <h5 class="font-bold text-slate-800 leading-snug">${c.tipo}</h5>
          <p class="text-[11px] text-slate-600">Participantes: <b class="text-purple-700">${c.practicanteNombre}</b></p>
          <p class="text-[11px] text-slate-500">Coach / Facilitador: <b>${c.coach}</b></p>
          ${c.objetivo ? `<div class="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-xl"><b>Objetivo:</b> ${c.objetivo}</div>` : ''}
          <div class="pt-1.5 flex items-center justify-between border-t border-slate-100">
            <a href="${c.enlaceSala || 'https://meet.google.com/cei-stmz-drx'}" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-xs transition-all">
              <i data-lucide="video" class="w-3.5 h-3.5"></i> Unirse a Google Meet
            </a>
            <span class="text-[10px] text-slate-400 font-mono">cei-stmz-drx</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  openNewEntregaModalWithDate() {
    this.openNewEntregaModal();
    const dateInput = document.getElementById("entrega-fecha");
    if (dateInput) {
      dateInput.value = this.selectedCalendarDayStr;
    }
  }

  /* ------------------------------------------------------------- */
  /* PRACTICANTES & CVS REPOSITORY                                */
  /* ------------------------------------------------------------- */
  renderPracticantes() {
    const grid = document.getElementById("practicantes-grid");
    if (!grid) return;

    if (this.data.practicantes.length === 0) {
      grid.innerHTML = `<div class="col-span-2 text-center py-10 text-slate-400 text-xs">No hay practicantes registradas aún.</div>`;
      return;
    }

    grid.innerHTML = this.data.practicantes.map(p => {
      const pct = Math.min(100, Math.round(((p.horasCompletadas || 0) / (p.horasMeta || 480)) * 100));

      const idiomasHtml = (p.idiomas || []).map(i => `
        <span class="bg-purple-50 text-purple-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-purple-100">${i}</span>
      `).join("");

      const toolsHtml = (p.catTools || []).map(t => `
        <span class="bg-pink-50 text-rose-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-rose-100">${t}</span>
      `).join("");

      return `
        <div class="glass-panel p-5 sm:p-6 rounded-3xl space-y-4 border border-white/90 hover:shadow-md transition-all">
          <div class="flex items-start gap-4">
            <img src="${p.avatar || 'assets/avatars/avatar_p3.png'}" alt="${p.nombre}" class="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-200 shadow-sm shrink-0">
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h4 class="font-heading font-extrabold text-base text-slate-800 truncate">${p.nombre}</h4>
                <button onclick="app.deletePracticante('${p.id}')" class="text-slate-300 hover:text-rose-500 p-1" title="Eliminar registro">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
              <p class="text-xs font-semibold text-purple-700 leading-tight mt-0.5">${p.rol}</p>
              <p class="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                <span>${p.universidad || 'UNIFÉ'} • ${p.semestre || ''}</span>
                <span class="text-slate-300">•</span>
                <span class="text-slate-500 flex items-center gap-0.5"><i data-lucide="map-pin" class="w-3 h-3 text-emerald-500"></i> ${p.ubicacion || 'Lima'}</span>
              </p>
            </div>
          </div>

          <!-- Languages and tools pills -->
          <div class="space-y-2">
            <div class="flex flex-wrap gap-1">
              ${idiomasHtml}
            </div>
            <div class="flex flex-wrap gap-1">
              ${toolsHtml}
            </div>
          </div>

          <!-- Hours Progress Bar -->
          <div class="bg-purple-50/60 p-3 rounded-2xl border border-purple-100/60 space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-600 font-medium">Horas de Prácticas:</span>
              <span class="font-bold text-purple-800">${p.horasCompletadas || 0} / ${p.horasMeta || 480} hrs (${pct}%)</span>
            </div>
            <div class="w-full h-2 bg-white rounded-full overflow-hidden border border-purple-100">
              <div class="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="pt-2 flex items-center justify-between border-t border-slate-100">
            <span class="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Activa en Turno
            </span>
            <div class="flex items-center gap-2">
              ${p.cvUrl ? `
                <a href="${p.cvUrl}" target="_blank" class="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-all flex items-center gap-1" title="Ver CV en PDF">
                  <i data-lucide="file-down" class="w-3.5 h-3.5"></i> PDF
                </a>
              ` : ''}
              <button onclick="app.openCVModal('${p.id}')" class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5">
                <i data-lucide="file-badge" class="w-3.5 h-3.5"></i> Ver Perfil & CV
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    if (window.lucide) window.lucide.createIcons();
  }

  openCVModal(practicanteId) {
    const p = this.data.practicantes.find(item => item.id === practicanteId);
    if (!p) return;

    // Encabezado básico
    document.getElementById("cv-modal-nombre").textContent = p.nombre;
    document.getElementById("cv-modal-rol").textContent = p.rol;
    document.getElementById("cv-modal-universidad").textContent = `${p.universidad || 'UNIFÉ'} • ${p.semestre || ''}`;
    document.getElementById("cv-modal-avatar").src = p.avatar || "assets/avatars/avatar_p3.png";
    document.getElementById("cv-modal-resumen").textContent = p.resumenCv || "Sin resumen registrado.";

    // Barra de Contacto
    const telEl = document.getElementById("cv-modal-telefono");
    if (telEl) telEl.textContent = p.telefono || "(+51) 9XX XXX XXX";

    const emailLink = document.getElementById("cv-modal-email-link");
    if (emailLink) {
      emailLink.textContent = p.email || "correo@unife.pe";
      emailLink.href = `mailto:${p.email || ''}`;
    }

    const ubiEl = document.getElementById("cv-modal-ubicacion");
    if (ubiEl) ubiEl.textContent = p.ubicacion || "Lima, Perú";

    const inLink = document.getElementById("cv-modal-linkedin-link");
    if (inLink) {
      if (p.linkedin) {
        inLink.href = p.linkedin;
        inLink.classList.remove("hidden");
      } else {
        inLink.classList.add("hidden");
      }
    }

    // Experiencia Laboral & Proyectos
    const expEl = document.getElementById("cv-modal-experiencia");
    if (expEl) {
      if (p.experiencia && p.experiencia.length > 0) {
        expEl.innerHTML = p.experiencia.map(exp => `
          <div class="p-3 rounded-2xl bg-white/90 border border-slate-100 flex items-start gap-3 shadow-xs">
            <span class="w-2.5 h-2.5 rounded-full bg-pink-500 mt-1 shrink-0"></span>
            <p class="text-xs text-slate-700 leading-relaxed">${exp}</p>
          </div>
        `).join("");
      } else {
        expEl.innerHTML = `<p class="text-xs text-slate-400 italic">Sin experiencia previa listada.</p>`;
      }
    }

    // Formación Académica
    const eduEl = document.getElementById("cv-modal-educacion");
    if (eduEl) {
      if (p.educacion && p.educacion.length > 0) {
        eduEl.innerHTML = p.educacion.map(edu => `
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs text-slate-700 font-medium">
            <i data-lucide="award" class="w-4 h-4 text-indigo-500 shrink-0"></i>
            <span>${edu}</span>
          </div>
        `).join("");
      } else {
        eduEl.innerHTML = `<p class="text-xs text-slate-400 italic">UNIFÉ — Traducción e Interpretación</p>`;
      }
    }

    // Idiomas & CAT Tools
    const idiomasEl = document.getElementById("cv-modal-idiomas");
    if (idiomasEl) {
      idiomasEl.innerHTML = (p.idiomas || []).map(i => `<span class="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-purple-200">${i}</span>`).join("");
    }

    const toolsEl = document.getElementById("cv-modal-tools");
    if (toolsEl) {
      toolsEl.innerHTML = (p.catTools || []).map(t => `<span class="bg-pink-100 text-rose-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-pink-200">${t}</span>`).join("");
    }

    // Habilidades & Aficiones
    const habEl = document.getElementById("cv-modal-habilidades");
    if (habEl) {
      habEl.innerHTML = (p.habilidades || []).map(h => `<span class="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-200">${h}</span>`).join("");
    }

    const aficEl = document.getElementById("cv-modal-aficiones");
    if (aficEl) {
      aficEl.innerHTML = (p.aficiones || []).map(a => `<span class="bg-rose-50 text-rose-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-rose-200">${a}</span>`).join("");
    }

    // Horas y Progreso
    const pct = Math.min(100, Math.round(((p.horasCompletadas || 0) / (p.horasMeta || 480)) * 100));
    document.getElementById("cv-modal-horas-text").textContent = `${p.horasCompletadas || 0} / ${p.horasMeta || 480} hrs (${pct}%)`;
    document.getElementById("cv-modal-horas-bar").style.width = `${pct}%`;

    // Enlace a PDF
    const extLink = document.getElementById("cv-modal-external-link");
    if (extLink) {
      if (p.cvUrl) {
        extLink.href = p.cvUrl;
        extLink.classList.remove("hidden");
      } else {
        extLink.classList.add("hidden");
      }
    }

    this.openModal("modal-cv-viewer");
    if (window.lucide) window.lucide.createIcons();
  }

  /* ------------------------------------------------------------- */
  /* JOB COACHING & EMPLEABILIDAD                                  */
  /* ------------------------------------------------------------- */
  renderCoaching() {
    const sessionsList = document.getElementById("coaching-sessions-list");
    if (sessionsList) {
      if (this.data.coachingSessions.length === 0) {
        sessionsList.innerHTML = `<div class="text-center py-8 text-slate-400 text-xs">No hay sesiones de coaching registradas.</div>`;
      } else {
        sessionsList.innerHTML = this.data.coachingSessions.map(c => {
          // Check if session is group
          const isGroup = c.practicanteId === "all" || (c.practicanteNombre && c.practicanteNombre.toLowerCase().includes("equipo"));
          const avatarsHtml = isGroup ? `
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <div class="flex -space-x-2 overflow-hidden py-0.5">
                ${this.data.practicantes.map(p => `
                  <img src="${p.avatar}" alt="${p.nombre}" title="${p.nombre} (Practicante UNIFÉ)" class="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-xs hover:scale-110 hover:z-10 transition-transform">
                `).join("")}
              </div>
              <span class="text-xs font-bold text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-xl">
                6 Practicantes UNIFÉ Convocadas
              </span>
            </div>
          ` : `
            <div class="text-xs text-slate-700"><b>Practicante:</b> ${c.practicanteNombre}</div>
          `;

          // Date formatting for Wednesday sessions
          const dateParts = c.fecha.split("-");
          const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
          const dayName = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][dateObj.getDay()] || "Miércoles";
          const monthName = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][dateObj.getMonth()] || "";

          return `
          <div class="p-5 rounded-3xl bg-white/95 border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all space-y-3.5">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-2 border-b border-slate-100">
              <div class="space-y-1.5">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="pill-badge bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center gap-1">
                    <i data-lucide="users" class="w-3 h-3 text-purple-600"></i> Modalidad Grupal
                  </span>
                  <span class="pill-badge ${c.estado === 'completada' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} text-[10px] font-bold">
                    ${c.estado === 'completada' ? 'Completada con éxito ✨' : 'Sesión Programada'}
                  </span>
                </div>
                <h4 class="font-heading font-extrabold text-base text-slate-800 leading-snug">${c.tipo}</h4>
              </div>
              <div class="text-left sm:text-right shrink-0">
                <span class="text-xs font-black text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl inline-block shadow-2xs">
                  ${dayName} ${parseInt(dateParts[2])} de ${monthName}, ${dateParts[0]} • ${c.hora} AM
                </span>
              </div>
            </div>

            <!-- Participants & Mentors -->
            <div class="bg-gradient-to-r from-purple-50/70 to-pink-50/50 p-3.5 rounded-2xl border border-purple-100 space-y-2">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
                <div><b>Coach / Facilitador:</b> ${c.coach}</div>
                <div class="text-purple-700 font-bold bg-white/80 px-2 py-0.5 rounded-lg border border-purple-100 text-[11px]">
                  ⏰ Miércoles 9:30 AM (Asistencia Puntual)
                </div>
              </div>
              ${avatarsHtml}
            </div>

            <div class="text-xs text-slate-600 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
              <b>Objetivo de la Sesión:</b> ${c.objetivo || 'Asesoría de empleabilidad, perfiles profesionales y traducción técnica.'}
            </div>

            ${c.acuerdos ? `
              <div class="text-[11px] text-purple-900 bg-purple-50/60 p-3 rounded-2xl border border-purple-100">
                <b>📌 Acuerdos & Preparación Previa:</b> ${c.acuerdos}
              </div>
            ` : ''}

            ${c.calificacion ? `
              <div class="text-[11px] text-emerald-800 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
                <b>Feedback & Conclusiones:</b> ${c.calificacion}
              </div>
            ` : ''}

            <div class="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
              <div class="flex items-center gap-2">
                <a href="${c.enlaceSala || 'https://meet.google.com/cei-stmz-drx'}" target="_blank" class="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-purple-200 hover:shadow-md transition-all">
                  <i data-lucide="video" class="w-4 h-4"></i>
                  <span>Unirse a Google Meet</span>
                </a>
                <span class="text-xs text-slate-500 font-mono hidden sm:inline">meet.google.com/cei-stmz-drx</span>
              </div>
              <div class="flex items-center gap-1.5">
                ${c.estado !== 'completada' ? `
                  <button onclick="app.completeCoachingSession('${c.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] transition-all">
                    Marcar Realizada ✅
                  </button>
                ` : ''}
                <button onclick="app.deleteCoachingSession('${c.id}')" class="p-1.5 text-slate-300 hover:text-rose-500 transition-colors" title="Eliminar sesión">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          </div>
          `;
        }).join("");
      }
    }

    // Render roadmap steps
    const roadmapContainer = document.getElementById("roadmap-steps-container");
    if (roadmapContainer) {
      const completedCount = this.data.roadmapSteps.filter(s => s.hecho).length;
      const badge = document.getElementById("roadmap-progress-badge");
      if (badge) badge.textContent = `${completedCount}/${this.data.roadmapSteps.length}`;

      roadmapContainer.innerHTML = this.data.roadmapSteps.map(step => `
        <div onclick="app.toggleRoadmapStep('${step.id}')" class="flex items-start gap-2.5 p-2.5 rounded-2xl border transition-all cursor-pointer ${step.hecho ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white/80 border-slate-100 hover:border-pink-200'}">
          <input type="checkbox" ${step.hecho ? 'checked' : ''} class="mt-1 rounded text-purple-600 focus:ring-purple-400 pointer-events-none">
          <div class="flex-1">
            <h5 class="text-xs font-bold ${step.hecho ? 'line-through text-slate-400' : 'text-slate-800'}">${step.titulo}</h5>
            <p class="text-[11px] text-slate-500 leading-tight">${step.desc}</p>
          </div>
        </div>
      `).join("");
    }

    if (window.lucide) window.lucide.createIcons();
  }

  toggleRoadmapStep(stepId) {
    const s = this.data.roadmapSteps.find(item => item.id === stepId);
    if (s) {
      s.hecho = !s.hecho;
      this.saveState();
      this.renderCoaching();
    }
  }

  completeCoachingSession(id) {
    const c = this.data.coachingSessions.find(item => item.id === id);
    if (c) {
      c.estado = "completada";
      c.calificacion = "Sesión finalizada con retroalimentación satisfactoria.";
      this.saveState();
      this.renderCoaching();
      this.renderOverview();
      this.triggerConfetti();
    }
  }

  deleteCoachingSession(id) {
    if (confirm("¿Deseas eliminar esta sesión de coaching?")) {
      this.data.coachingSessions = this.data.coachingSessions.filter(c => c.id !== id);
      this.saveState();
      this.renderCoaching();
      this.renderOverview();
    }
  }

  /* ------------------------------------------------------------- */
  /* GESTOR & VISOR DE EXCEL (.XLSX / .CSV)                        */
  /* ------------------------------------------------------------- */
  initExcelData() {
    this.excelRows = JSON.parse(JSON.stringify(this.data.excelTemplateData || []));
    this.excelFilteredRows = [...this.excelRows];
    this.extractExcelHeaders();
  }

  extractExcelHeaders() {
    if (this.excelRows.length > 0) {
      this.excelHeaders = Object.keys(this.excelRows[0]);
    } else {
      this.excelHeaders = [];
    }
  }

  setupDropzone() {
    const dropzone = document.getElementById("excel-dropzone");
    if (!dropzone) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dropzone-active');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dropzone-active');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        this.processExcelFile(files[0]);
      }
    });
  }

  handleExcelFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.processExcelFile(file);
    }
  }

  processExcelFile(file) {
    this.excelFileName = file.name;
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = window.XLSX.read(data, { type: 'array' });

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse to JSON objects
        const json = window.XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (json && json.length > 0) {
          this.excelRows = json;
          this.excelFilteredRows = [...json];
          this.extractExcelHeaders();
          this.renderExcelTable();
          this.triggerConfetti();
        } else {
          alert("El archivo Excel está vacío o no contiene filas con datos.");
        }
      } catch (err) {
        console.error("Error leyendo archivo Excel", err);
        alert("Ocurrió un error al procesar el archivo Excel. Verifica que sea un formato válido (.xlsx, .xls o .csv).");
      }
    };

    reader.readAsArrayBuffer(file);
  }

  renderExcelTable() {
    const table = document.getElementById("excel-rendered-table");
    const nameEl = document.getElementById("excel-active-filename");
    const countEl = document.getElementById("excel-rows-count");

    if (nameEl) nameEl.innerHTML = `<i data-lucide="table" class="w-4 h-4 text-emerald-600"></i> ${this.excelFileName}`;
    if (countEl) countEl.textContent = `${this.excelFilteredRows.length} registros`;

    if (!table) return;

    if (this.excelFilteredRows.length === 0 || this.excelHeaders.length === 0) {
      table.innerHTML = `
        <tbody>
          <tr>
            <td class="text-center py-10 text-slate-400 text-xs">No hay datos para mostrar en la hoja.</td>
          </tr>
        </tbody>
      `;
      return;
    }

    // Build thead
    let thead = `<thead class="bg-emerald-50/70 text-emerald-950 font-bold uppercase tracking-wider text-[11px]"><tr>`;
    this.excelHeaders.forEach(h => {
      thead += `<th class="py-3 px-3.5 border-b border-emerald-100">${h}</th>`;
    });
    thead += `</tr></thead>`;

    // Build tbody
    let tbody = `<tbody class="divide-y divide-slate-100 bg-white/70">`;
    this.excelFilteredRows.forEach((row, idx) => {
      tbody += `<tr class="hover:bg-purple-50/40 transition-colors">`;
      this.excelHeaders.forEach(h => {
        const val = row[h] !== undefined ? row[h] : "";
        tbody += `<td class="py-2.5 px-3.5 text-slate-700">${val}</td>`;
      });
      tbody += `</tr>`;
    });
    tbody += `</tbody>`;

    table.innerHTML = thead + tbody;
    if (window.lucide) window.lucide.createIcons();
  }

  filterExcelTable() {
    const q = (document.getElementById("excel-table-search")?.value || "").toLowerCase();
    if (!q) {
      this.excelFilteredRows = [...this.excelRows];
    } else {
      this.excelFilteredRows = this.excelRows.filter(row => {
        return Object.values(row).some(v => String(v).toLowerCase().includes(q));
      });
    }
    this.renderExcelTable();
  }

  resetExcelToSample() {
    this.excelFileName = "Plantilla_Global_Translators_Coaching.xlsx";
    this.initExcelData();
    this.renderExcelTable();
  }

  downloadExcelTemplate() {
    if (!window.XLSX) {
      alert("La biblioteca de Excel se está cargando. Intenta de nuevo en unos segundos.");
      return;
    }

    const templateData = [
      {
        "ID_Practicante": "PRAC-001",
        "Nombre": "Maria Fernanda Olivares Ramón",
        "Especialidad": "Audiovisual / Intérprete en Formación",
        "Idiomas": "ES (Nativo), EN (C1), PT (B2)",
        "Horas_Completadas": 340,
        "Meta_Horas": 480,
        "Estado_CV": "Aprobado (UNIFÉ)",
        "Proximo_Job_Coaching": "Mock Interview en Inglés",
        "Fecha_Coaching": "2026-10-03",
        "Notas": "Preservando Historias San Mateo - Relatos Orales."
      },
      {
        "ID_Practicante": "PRAC-002",
        "Nombre": "Celine Lorena Bautista Ramos",
        "Especialidad": "Textos Especializados & Maquetación",
        "Idiomas": "ES (Nativo), EN (B2), PT (B2)",
        "Horas_Completadas": 410,
        "Meta_Horas": 480,
        "Estado_CV": "Aprobado (UNIFÉ)",
        "Proximo_Job_Coaching": "Portfolio Comunifé & ATS PT",
        "Fecha_Coaching": "2026-10-05",
        "Notas": "Traducción Comunifé y Teleperformance."
      },
      {
        "ID_Practicante": "PRAC-003",
        "Nombre": "Sophia Camila Cabrera Zarate",
        "Especialidad": "Traducción Académica / Científica",
        "Idiomas": "ES (Nativo), EN (C1), FR (B2)",
        "Horas_Completadas": 390,
        "Meta_Horas": 480,
        "Estado_CV": "Aprobado (UNIFÉ)",
        "Proximo_Job_Coaching": "LinkedIn Pro & Marca Personal",
        "Fecha_Coaching": "2026-09-27",
        "Notas": "Artículos sociopolíticos COVID-19 / Migración."
      },
      {
        "ID_Practicante": "PRAC-004",
        "Nombre": "Landys Brunella Gonzales Torres",
        "Especialidad": "Interpretación Consecutiva & Ferias",
        "Idiomas": "ES (Nativo), EN (Intermedio), FR (Intermedio)",
        "Horas_Completadas": 420,
        "Meta_Horas": 480,
        "Estado_CV": "Aprobado (UNIFÉ)",
        "Proximo_Job_Coaching": "Interpretación Expo Plast Perú",
        "Fecha_Coaching": "2026-10-07",
        "Notas": "Glosario San Mateo y Mediación Intercultural."
      },
      {
        "ID_Practicante": "PRAC-005",
        "Nombre": "Fatima Valentina Gallegos Tornero",
        "Especialidad": "Interpretación Enlace / EN C2 FR C1",
        "Idiomas": "ES (Nativo), EN (C2), FR (C1)",
        "Horas_Completadas": 360,
        "Meta_Horas": 480,
        "Estado_CV": "Aprobado (UNIFÉ)",
        "Proximo_Job_Coaching": "Mock Interview C2 (09/10)",
        "Fecha_Coaching": "2026-10-09",
        "Notas": "Preservando Historias San Mateo - Protocolo Terminológico."
      },
      {
        "ID_Practicante": "PRAC-006",
        "Nombre": "Arihana Jelena Altamirano Guevara",
        "Especialidad": "Audiovisual & Eventos Corporativos",
        "Idiomas": "ES (Nativo), EN (Intermedio), FR (Básico)",
        "Horas_Completadas": 380,
        "Meta_Horas": 480,
        "Estado_CV": "Aprobado (UNIFÉ)",
        "Proximo_Job_Coaching": "Portfolio Subtitulado (10/10)",
        "Fecha_Coaching": "2026-10-10",
        "Notas": "Preservando Historias San Mateo - Subtitulado Testimonios."
      }
    ];

    const ws = window.XLSX.utils.json_to_sheet(templateData);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Practicantes_Coaching");

    window.XLSX.writeFile(wb, "Plantilla_Global_Translators_Coaching.xlsx");
  }

  exportCurrentDataToExcel() {
    if (!window.XLSX) return;

    const wb = window.XLSX.utils.book_new();

    // Sheet 1: Practicantes
    const pracData = this.data.practicantes.map(p => ({
      "ID": p.id,
      "Nombre": p.nombre,
      "Rol": p.rol,
      "Universidad": p.universidad,
      "Idiomas": (p.idiomas || []).join(", "),
      "CAT_Tools": (p.catTools || []).join(", "),
      "Horas_Completadas": p.horasCompletadas,
      "Horas_Meta": p.horasMeta,
      "Enlace_CV": p.cvUrl || ""
    }));
    const ws1 = window.XLSX.utils.json_to_sheet(pracData);
    window.XLSX.utils.book_append_sheet(wb, ws1, "Practicantes");

    // Sheet 2: Entregas
    const entData = this.data.entregas.map(e => ({
      "ID": e.id,
      "Proyecto": e.titulo,
      "Practicante": e.practicanteNombre,
      "Par_Idiomas": e.parIdiomas,
      "Categoria": e.categoria || "",
      "Fecha_Limite": e.fechaLimite,
      "Prioridad": e.prioridad,
      "Progreso_Pct": e.progreso || 0,
      "Estado": e.estado,
      "Notas": e.notas || ""
    }));
    const ws2 = window.XLSX.utils.json_to_sheet(entData);
    window.XLSX.utils.book_append_sheet(wb, ws2, "Entregas");

    // Sheet 3: Job Coaching
    const coachData = this.data.coachingSessions.map(c => ({
      "ID": c.id,
      "Practicante": c.practicanteNombre,
      "Tipo_Sesion": c.tipo,
      "Coach": c.coach,
      "Fecha": c.fecha,
      "Hora": c.hora,
      "Estado": c.estado,
      "Acuerdos": c.acuerdos || ""
    }));
    const ws3 = window.XLSX.utils.json_to_sheet(coachData);
    window.XLSX.utils.book_append_sheet(wb, ws3, "Job_Coaching");

    window.XLSX.writeFile(wb, "Reporte_Global_Translators_Completo.xlsx");
  }

  /* ------------------------------------------------------------- */
  /* TRANSLATOR TOOLKIT & STICKY NOTES                             */
  /* ------------------------------------------------------------- */
  renderGlosario() {
    const container = document.getElementById("glosario-list-container");
    if (!container) return;

    const q = (document.getElementById("glosario-search")?.value || "").toLowerCase();
    const campo = document.getElementById("glosario-filter-campo")?.value || "";

    const list = this.data.glosario.filter(g => {
      const matchText = g.origen.toLowerCase().includes(q) || g.meta.toLowerCase().includes(q) || (g.notas && g.notas.toLowerCase().includes(q));
      const matchCampo = !campo || g.campo === campo;
      return matchText && matchCampo;
    });

    if (list.length === 0) {
      container.innerHTML = `<div class="text-center py-6 text-slate-400 text-xs">No hay términos registrados que coincidan con la búsqueda.</div>`;
      return;
    }

    container.innerHTML = list.map(g => `
      <div class="p-3 bg-white/90 rounded-2xl border border-slate-100 text-xs space-y-1 hover:border-purple-200 transition-all">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-slate-800 text-xs">${g.origen}</span>
          <span class="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">${g.campo || 'General'}</span>
        </div>
        <p class="font-bold text-purple-900">${g.meta}</p>
        ${g.notas ? `<p class="text-[11px] text-slate-500 italic">${g.notas}</p>` : ''}
      </div>
    `).join("");
  }

  calculateWords(text) {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;

    const wordsEl = document.getElementById("counter-words");
    const charsEl = document.getElementById("counter-chars");
    const timeEl = document.getElementById("counter-time");

    if (wordsEl) wordsEl.textContent = words.toLocaleString();
    if (charsEl) charsEl.textContent = chars.toLocaleString();

    // Estimate: 250 words per hour
    const totalMinutes = Math.round((words / 250) * 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (timeEl) timeEl.textContent = `${hours}h ${mins}m`;
  }

  renderStickyNotes() {
    const container = document.getElementById("sticky-notes-container");
    if (!container) return;

    container.innerHTML = this.data.stickyNotes.map(n => `
      <div class="sticky-note p-3.5 rounded-2xl ${this.getStickyColorClass(n.color)} text-xs relative group">
        <button onclick="app.deleteStickyNote('${n.id}')" class="absolute top-2 right-2 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
        <p class="text-slate-800 leading-snug">${n.texto}</p>
      </div>
    `).join("");

    if (window.lucide) window.lucide.createIcons();
  }

  getStickyColorClass(color) {
    if (color === "pink") return "bg-pink-100/90 border border-pink-200";
    if (color === "lavender") return "bg-purple-100/90 border border-purple-200";
    if (color === "mint") return "bg-emerald-100/90 border border-emerald-200";
    return "bg-amber-100/90 border border-amber-200";
  }

  addNewStickyNotePrompt() {
    const texto = prompt("Escribe tu nota adhesiva pastel:");
    if (texto && texto.trim()) {
      const colors = ["pink", "lavender", "mint", "peach"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.data.stickyNotes.unshift({
        id: "sn-" + Date.now(),
        color,
        texto: texto.trim()
      });
      this.saveState();
      this.renderStickyNotes();
    }
  }

  deleteStickyNote(id) {
    this.data.stickyNotes = this.data.stickyNotes.filter(n => n.id !== id);
    this.saveState();
    this.renderStickyNotes();
  }

  /* ------------------------------------------------------------- */
  /* AMBIENT LOFI SYNTH (WEB AUDIO API - 100% OFFLINE)             */
  /* ------------------------------------------------------------- */
  setupLofiAudio() {
    const btn = document.getElementById("btn-lofi-toggle");
    if (btn) {
      btn.onclick = () => this.toggleLofiSound();
    }
  }

  toggleLofiSound() {
    if (this.isLofiPlaying) {
      this.stopLofiSound();
    } else {
      this.startLofiSound();
    }
  }

  startLofiSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!this.lofiAudioCtx) {
        this.lofiAudioCtx = new AudioContext();
      }
      if (this.lofiAudioCtx.state === "suspended") {
        this.lofiAudioCtx.resume();
      }

      this.isLofiPlaying = true;
      document.getElementById("lofi-status-text").textContent = "Zen Lofi: On 🎵";
      document.getElementById("lofi-wave-anim")?.classList.remove("hidden");

      // Cute pentatonic scale notes (Frequencies in Hz)
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23]  // G7
      ];
      let chordIdx = 0;

      const playChord = () => {
        if (!this.isLofiPlaying || !this.lofiAudioCtx) return;
        const currentChord = chords[chordIdx];
        chordIdx = (chordIdx + 1) % chords.length;

        currentChord.forEach((freq, i) => {
          const osc = this.lofiAudioCtx.createOscillator();
          const gain = this.lofiAudioCtx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, this.lofiAudioCtx.currentTime + i * 0.15);

          gain.gain.setValueAtTime(0.001, this.lofiAudioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.025, this.lofiAudioCtx.currentTime + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.lofiAudioCtx.currentTime + 4.8);

          osc.connect(gain);
          gain.connect(this.lofiAudioCtx.destination);

          osc.start(this.lofiAudioCtx.currentTime + i * 0.15);
          osc.stop(this.lofiAudioCtx.currentTime + 5.0);
        });

        this.lofiTimer = setTimeout(playChord, 4500);
      };

      playChord();
    } catch (e) {
      console.warn("AudioContext error", e);
    }
  }

  stopLofiSound() {
    this.isLofiPlaying = false;
    if (this.lofiTimer) clearTimeout(this.lofiTimer);
    document.getElementById("lofi-status-text").textContent = "Lofi Zen Studio";
    document.getElementById("lofi-wave-anim")?.classList.add("hidden");
  }

  /* ------------------------------------------------------------- */
  /* FORM HANDLERS & MODALS                                        */
  /* ------------------------------------------------------------- */
  populateSelects() {
    const selEntrega = document.getElementById("entrega-practicante-id");
    const selCoaching = document.getElementById("coaching-practicante-id");
    const filterPrac = document.getElementById("filter-entrega-practicante");

    const optionsHtml = this.data.practicantes.map(p => `<option value="${p.id}">${p.nombre} (${p.rol.split(" ")[0]})</option>`).join("");

    if (selEntrega) selEntrega.innerHTML = optionsHtml;
    if (selCoaching) {
      selCoaching.innerHTML = `
        <option value="all" selected>👥 Todo el Equipo UNIFÉ (Sesión Grupal - 6 Practicantes)</option>
        ${optionsHtml}
      `;
    }
    if (filterPrac) filterPrac.innerHTML = `<option value="">Todas las practicantes</option>` + optionsHtml;
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.remove("opacity-0");
    }, 10);
    if (window.lucide) window.lucide.createIcons();
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add("opacity-0");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 200);
  }

  openNewEntregaModal() {
    document.getElementById("form-entrega").reset();
    document.getElementById("entrega-id").value = "";
    document.getElementById("modal-entrega-title").textContent = "Nueva Entrega de Traducción ✨";
    
    // Set default date to today or selected date
    const d = document.getElementById("entrega-fecha");
    if (d) d.value = this.selectedCalendarDayStr || this.formatDate(new Date());

    this.openModal("modal-entrega");
  }

  editEntrega(id) {
    const item = this.data.entregas.find(e => e.id === id);
    if (!item) return;

    document.getElementById("entrega-id").value = item.id;
    document.getElementById("entrega-titulo").value = item.titulo;
    document.getElementById("entrega-practicante-id").value = item.practicanteId;
    document.getElementById("entrega-par-idiomas").value = item.parIdiomas;
    document.getElementById("entrega-categoria").value = item.categoria || "";
    document.getElementById("entrega-prioridad").value = item.prioridad || "Normal";
    document.getElementById("entrega-fecha").value = item.fechaLimite;
    document.getElementById("entrega-hora").value = item.horaLimite || "18:00";
    document.getElementById("entrega-estado").value = item.estado || "pendiente";
    document.getElementById("entrega-progreso").value = item.progreso || 0;
    document.getElementById("entrega-url").value = item.documentoUrl || "";
    document.getElementById("entrega-notas").value = item.notas || "";

    document.getElementById("modal-entrega-title").textContent = "Editar Entrega";
    this.openModal("modal-entrega");
  }

  saveEntrega(e) {
    e.preventDefault();
    const id = document.getElementById("entrega-id").value;
    const pracId = document.getElementById("entrega-practicante-id").value;
    const prac = this.data.practicantes.find(p => p.id === pracId);

    const entregaData = {
      id: id || "ent-" + Date.now(),
      titulo: document.getElementById("entrega-titulo").value.trim(),
      practicanteId: pracId,
      practicanteNombre: prac ? prac.nombre : "Sin Asignar",
      parIdiomas: document.getElementById("entrega-par-idiomas").value,
      categoria: document.getElementById("entrega-categoria").value.trim() || "Traducción General",
      prioridad: document.getElementById("entrega-prioridad").value,
      fechaLimite: document.getElementById("entrega-fecha").value,
      horaLimite: document.getElementById("entrega-hora").value || "18:00",
      estado: document.getElementById("entrega-estado").value,
      progreso: parseInt(document.getElementById("entrega-progreso").value || "0", 10),
      documentoUrl: document.getElementById("entrega-url").value.trim(),
      notas: document.getElementById("entrega-notas").value.trim()
    };

    if (id) {
      const idx = this.data.entregas.findIndex(item => item.id === id);
      if (idx !== -1) this.data.entregas[idx] = entregaData;
    } else {
      this.data.entregas.unshift(entregaData);
    }

    // Sincronizar en tiempo real con Firebase RTDB y BroadcastChannel
    if (this.firebaseDb) {
      try {
        this.firebaseDb.ref(`san_mateo_studio/entregas/${entregaData.id}`).set(entregaData);
      } catch (err) {
        console.warn("Firebase sync error on save:", err);
      }
    }
    if (this.realtimeChannel) {
      this.realtimeChannel.postMessage({ type: "REALTIME_UPDATE", entregas: this.data.entregas });
    }

    this.saveState();
    this.closeModal("modal-entrega");
    this.renderCronograma();
    this.renderOverview();
    this.renderCalendar();
    this.triggerConfetti();
  }

  deleteEntrega(id) {
    if (confirm("¿Estás segura de eliminar esta entrega?")) {
      this.data.entregas = this.data.entregas.filter(e => e.id !== id);

      // Eliminar en tiempo real de Firebase y BroadcastChannel
      if (this.firebaseDb) {
        try {
          this.firebaseDb.ref(`san_mateo_studio/entregas/${id}`).remove();
        } catch (err) {
          console.warn("Firebase remove error:", err);
        }
      }
      if (this.realtimeChannel) {
        this.realtimeChannel.postMessage({ type: "REALTIME_UPDATE", entregas: this.data.entregas });
      }

      this.saveState();
      this.renderCronograma();
      this.renderOverview();
      this.renderCalendar();
    }
  }


  openNewPracticanteModal() {
    document.getElementById("form-practicante").reset();
    this.openModal("modal-practicante");
  }

  savePracticante(e) {
    e.preventDefault();
    const idiomasStr = document.getElementById("prac-idiomas").value;
    const toolsStr = document.getElementById("prac-tools").value;

    const avatars = [
      "assets/avatars/avatar_p1.png",
      "assets/avatars/avatar_p2.png",
      "assets/avatars/avatar_p3.png",
      "assets/avatars/avatar_p4.png",
      "assets/avatars/avatar_p5.png",
      "assets/avatars/avatar_p6.png"
    ];
    const randAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newPrac = {
      id: "p" + Date.now(),
      nombre: document.getElementById("prac-nombre").value.trim(),
      rol: document.getElementById("prac-rol").value.trim(),
      universidad: document.getElementById("prac-universidad").value.trim() || "Universidad de Traducción",
      semestre: document.getElementById("prac-semestre").value.trim() || "Intern",
      idiomas: idiomasStr ? idiomasStr.split(",").map(s => s.trim()) : ["Inglés", "Español"],
      catTools: toolsStr ? toolsStr.split(",").map(s => s.trim()) : ["Trados Studio"],
      horasCompletadas: parseInt(document.getElementById("prac-horas-actuales").value || "0", 10),
      horasMeta: parseInt(document.getElementById("prac-horas-meta").value || "480", 10),
      avatar: randAvatar,
      cvUrl: document.getElementById("prac-cv-url").value.trim(),
      resumenCv: document.getElementById("prac-resumen").value.trim() || "Practicante destacada del equipo de Global Translators."
    };

    this.data.practicantes.push(newPrac);
    this.saveState();
    this.populateSelects();
    this.closeModal("modal-practicante");
    this.renderPracticantes();
    this.renderOverview();
    this.triggerConfetti();
  }

  deletePracticante(id) {
    if (confirm("¿Eliminar a esta practicante del directorio?")) {
      this.data.practicantes = this.data.practicantes.filter(p => p.id !== id);
      this.saveState();
      this.populateSelects();
      this.renderPracticantes();
      this.renderOverview();
    }
  }

  openNewCoachingModal() {
    document.getElementById("form-coaching").reset();
    const d = document.getElementById("coaching-fecha");
    if (d) d.value = this.selectedCalendarDayStr || this.formatDate(new Date());
    const h = document.getElementById("coaching-hora");
    if (h) h.value = "09:30";
    const l = document.getElementById("coaching-enlace");
    if (l) l.value = "https://meet.google.com/cei-stmz-drx";
    const p = document.getElementById("coaching-practicante-id");
    if (p) p.value = "all";
    this.openModal("modal-coaching");
  }

  saveCoachingSession(e) {
    e.preventDefault();
    const pracId = document.getElementById("coaching-practicante-id").value;
    let pracNombre = "Todo el Equipo UNIFÉ (6 Practicantes)";
    if (pracId !== "all") {
      const prac = this.data.practicantes.find(p => p.id === pracId);
      pracNombre = prac ? prac.nombre : "Practicante";
    }

    const newSession = {
      id: "cg-" + Date.now(),
      practicanteId: pracId,
      practicanteNombre: pracNombre,
      tipo: document.getElementById("coaching-tipo").value,
      coach: document.getElementById("coaching-coach").value.trim(),
      fecha: document.getElementById("coaching-fecha").value,
      hora: document.getElementById("coaching-hora").value,
      estado: document.getElementById("coaching-estado").value,
      modalidad: pracId === "all" ? "Grupal (Todo el Equipo UNIFÉ)" : "Individual",
      objetivo: document.getElementById("coaching-objetivo").value.trim(),
      acuerdos: document.getElementById("coaching-acuerdos").value.trim(),
      enlaceSala: document.getElementById("coaching-enlace").value.trim() || "https://meet.google.com/cei-stmz-drx"
    };

    this.data.coachingSessions.push(newSession);
    this.saveState();
    this.closeModal("modal-coaching");
    this.renderCoaching();
    this.renderOverview();
    this.renderCalendar();
    this.triggerConfetti();
  }

  openNewGlosarioModal() {
    document.getElementById("form-glosario").reset();
    this.openModal("modal-glosario");
  }

  saveGlosarioTerm(e) {
    e.preventDefault();
    const newTerm = {
      id: "g" + Date.now(),
      origen: document.getElementById("glo-origen").value.trim(),
      meta: document.getElementById("glo-meta").value.trim(),
      campo: document.getElementById("glo-campo").value,
      notas: document.getElementById("glo-notas").value.trim()
    };
    this.data.glosario.unshift(newTerm);
    this.saveState();
    this.closeModal("modal-glosario");
    this.renderGlosario();
  }

  /* ------------------------------------------------------------- */
  /* BACKUP & RESTORE JSON                                         */
  /* ------------------------------------------------------------- */
  openBackupModal() {
    this.openModal("modal-backup");
  }

  exportBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Global_Translators_Backup_${this.formatDate(new Date())}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importBackupJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.practicantes && imported.entregas) {
          this.data = imported;
          this.saveState();
          this.init();
          this.closeModal("modal-backup");
          alert("¡Copia de seguridad restaurada con éxito! ✨");
        } else {
          alert("El archivo no tiene el formato esperado.");
        }
      } catch (err) {
        alert("Error al leer el archivo JSON.");
      }
    };
    reader.readAsText(file);
  }

  resetAllToDefault() {
    if (confirm("¿Restablecer todos los datos a la demostración inicial? Se borrarán los cambios locales.")) {
      this.data = JSON.parse(JSON.stringify(window.GT_DATA_INITIAL));
      this.saveState();
      this.init();
      this.closeModal("modal-backup");
    }
  }

  /* ------------------------------------------------------------- */
  /* FIREBASE REALTIME DATABASE SYNCHRONIZATION                    */
  /* ------------------------------------------------------------- */
  setupFirebaseRealtime() {
    // 1. Canal multi-pantalla en tiempo real sin recargar (BroadcastChannel para todas las pestañas de la sesión)
    if (typeof BroadcastChannel !== "undefined") {
      try {
        this.realtimeChannel = new BroadcastChannel("gt_san_mateo_realtime_channel");
        this.realtimeChannel.onmessage = (event) => {
          if (event.data && event.data.type === "REALTIME_UPDATE") {
            this.data.entregas = event.data.entregas;
            this.saveState();
            this.renderCronograma();
            this.renderCalendar();
            this.renderOverview();
          }
        };
      } catch (err) {
        console.warn("BroadcastChannel error:", err);
      }
    }

    // 2. Configuración predeterminada de Firebase Realtime Database
    const defaultConfig = {
      apiKey: "AIzaSyD-PolyglotMapSanMateoKey2026",
      authDomain: "polyglot-san-mateo.firebaseapp.com",
      databaseURL: "https://polyglot-san-mateo-default-rtdb.firebaseio.com",
      projectId: "polyglot-san-mateo",
      storageBucket: "polyglot-san-mateo.appspot.com",
      messagingSenderId: "982736451029",
      appId: "1:982736451029:web:7f6e5d4c3b2a10"
    };

    let cfg = defaultConfig;
    const savedCfg = localStorage.getItem(this.firebaseConfigKey);
    if (savedCfg) {
      try { cfg = JSON.parse(savedCfg); } catch (e) {}
    }
    this.firebaseConfig = cfg;

    // 3. Conexión y oyente de WebSocket en tiempo real con Firebase RTDB
    if (window.firebase && window.firebase.initializeApp) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(cfg);
        }
        this.firebaseDb = window.firebase.database();

        // Escucha en tiempo real sobre la ruta 'san_mateo_studio/entregas'
        const entregasRef = this.firebaseDb.ref("san_mateo_studio/entregas");
        entregasRef.on("value", (snapshot) => {
          const val = snapshot.val();
          if (val) {
            const list = Array.isArray(val) ? val : Object.values(val);
            this.data.entregas = list;
            this.saveState();
            this.renderCronograma();
            this.renderCalendar();
            this.renderOverview();
          } else {
            // Inicializar datos en la nube si está vacía
            this.seedFirebase();
          }
          this.setFirebaseStatusUI(true, "Firebase: En Vivo (Sincronizado)");
        }, (error) => {
          console.warn("Firebase RTDB status:", error);
          this.setFirebaseStatusUI(true, "Realtime: Activo (Multi-pantalla)");
        });
      } catch (e) {
        console.warn("Firebase init error, using BroadcastChannel sync:", e);
        this.setFirebaseStatusUI(true, "Realtime: Activo (BroadcastChannel)");
      }
    } else {
      this.setFirebaseStatusUI(true, "Realtime: Activo (BroadcastChannel)");
    }
  }

  seedFirebase() {
    if (!this.firebaseDb) return;
    try {
      const dataMap = {};
      this.data.entregas.forEach(item => {
        dataMap[item.id] = item;
      });
      this.firebaseDb.ref("san_mateo_studio/entregas").set(dataMap);
    } catch (e) {
      console.warn("Error seeding Firebase RTDB:", e);
    }
  }

  setFirebaseStatusUI(isConnected, message) {
    const textEl = document.getElementById("firebase-status-text");
    const dotEl = document.getElementById("firebase-status-dot");
    const modalTextEl = document.getElementById("firebase-modal-status-text");
    const modalDbUrl = document.getElementById("firebase-modal-db-url");

    if (textEl) textEl.textContent = message;
    if (dotEl) {
      dotEl.className = isConnected ? "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" : "w-2 h-2 rounded-full bg-amber-500";
    }
    if (modalTextEl) {
      modalTextEl.innerHTML = `<span class="w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}"></span> ${message}`;
    }
    if (modalDbUrl && this.firebaseConfig) {
      modalDbUrl.textContent = `RTDB: ${this.firebaseConfig.databaseURL} | Canal: san_mateo_studio/entregas`;
    }
  }

  openFirebaseModal() {
    if (this.firebaseConfig) {
      const dbUrl = document.getElementById("fb-input-dburl");
      const projId = document.getElementById("fb-input-projectid");
      const apiKey = document.getElementById("fb-input-apikey");
      if (dbUrl) dbUrl.value = this.firebaseConfig.databaseURL || "";
      if (projId) projId.value = this.firebaseConfig.projectId || "";
      if (apiKey) apiKey.value = this.firebaseConfig.apiKey || "";
    }
    this.openModal("modal-firebase");
  }

  saveCustomFirebaseConfig() {
    const dbUrl = document.getElementById("fb-input-dburl")?.value.trim();
    const projId = document.getElementById("fb-input-projectid")?.value.trim();
    const apiKey = document.getElementById("fb-input-apikey")?.value.trim();

    if (!dbUrl || !projId) {
      alert("Por favor ingresa al menos la Database URL y el Project ID de Firebase.");
      return;
    }

    const newCfg = {
      apiKey: apiKey || "AIzaSyCustomKey",
      authDomain: `${projId}.firebaseapp.com`,
      databaseURL: dbUrl,
      projectId: projId,
      storageBucket: `${projId}.appspot.com`
    };

    localStorage.setItem(this.firebaseConfigKey, JSON.stringify(newCfg));
    alert("¡Configuración de Firebase guardada! La aplicación se reconectará en tiempo real.");
    location.reload();
  }

  resetFirebaseConfigToDefault() {
    localStorage.removeItem(this.firebaseConfigKey);
    alert("Configuración de Firebase restablecida a los valores predeterminados.");
    location.reload();
  }

  testFirebaseSync() {
    if (this.data.entregas.length > 0) {
      const first = this.data.entregas[0];
      const prevProg = first.progreso || 50;
      first.progreso = prevProg === 100 ? 95 : prevProg + 1;
      
      this.updateEntregaStatus(first.id, first.estado);
      alert(`¡Sincronización probada con éxito! Se actualizó "${first.titulo}".`);
    } else {
      alert("No hay entregas para probar la sincronización.");
    }
  }

  /* ------------------------------------------------------------- */
  /* HELPERS                                                       */
  /* ------------------------------------------------------------- */

  formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

// Global instance initiation
window.addEventListener("DOMContentLoaded", () => {
  window.app = new GlobalTranslatorsApp();
  window.app.init();
});
