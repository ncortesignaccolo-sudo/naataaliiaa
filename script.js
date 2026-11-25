// =========================================================================
// CONFIGURACIÓN DEL EVENTO: 25 DE NOVIEMBRE DE 2026
// =========================================================================

const ANIO = 2026;
const MES = 10; // En JavaScript los meses van de 0 a 11 (10 = Noviembre)
const DIA = 25;

const momentos = [
    {
        id: 1,
        horaNum: 9,
        hora: "09:00",
        titulo: "Capítulo 1: El Despertar",
        descripcion: "Para empezar tus 50 años con una sonrisa.",
        qrContenido: "https://google.com",
        mensajeDesbloqueado: "¡Buenos días! Hoy cumples 50 años y empieza tu día de sorpresas.",
        esFinal: false
    },
    {
        id: 2,
        horaNum: 12,
        hora: "12:00",
        titulo: "Capítulo 2: Años Dorados",
        descripcion: "Un pequeño viaje al pasado...",
        qrContenido: "https://google.com",
        mensajeDesbloqueado: "Llega el mediodía: escanea este QR para descubrir el segundo detalle.",
        esFinal: false
    },
    {
        id: 3,
        horaNum: 15,
        hora: "15:00",
        titulo: "Capítulo 3: Sobremesa",
        descripcion: "Alguien tiene algo que decirte.",
        qrContenido: "https://google.com",
        mensajeDesbloqueado: "¡Hora de sobremesa! Toca abrir la tercera sorpresa.",
        esFinal: false
    },
    {
        id: 4,
        horaNum: 18,
        hora: "18:00",
        titulo: "Capítulo 4: La Cuenta Atrás",
        descripcion: "Ya queda poco para el gran momento de las 21:00.",
        qrContenido: "https://google.com",
        mensajeDesbloqueado: "La tarde avanza y el gran final está a la vuelta de la esquina.",
        esFinal: false
    },
    {
        id: 5,
        horaNum: 21,
        hora: "21:00",
        titulo: "Capítulo 5: Vídeo y Mensaje Final",
        descripcion: "El broche de oro a tus 50 años.",
        qrContenido: "¡FELICES 50 AÑOS! Gracias por cada momento, cada risa y por hacer estos 50 años tan especiales.",
        mensajeDesbloqueado: "✨ ¡FELICES 50 AÑOS! ✨\nLlegaron las 21:00: este es el QR final con tu mensaje conmemorativo y el acceso al vídeo.",
        textoModal: "¡FELICES 50 AÑOS!\n\nGracias por ser una persona tan importante en nuestras vidas, por cada consejo, cada abrazo y cada recuerdo compartido. ¡Por muchos años más celebrándote!",
        urlVideoFinal: "https://google.com",
        esFinal: true
    }
];

// =========================================================================
// LÓGICA DE CUENTA ATRÁS Y DESBLOQUEO
// =========================================================================

let modoPrueba = false;
const container = document.getElementById("qr-container");
const modal = document.getElementById("modal-sorpresa");

function inicializarTarjetas() {
    if (!container) return;
    container.innerHTML = "";

    momentos.forEach((item) => {
        const card = document.createElement("article");
        card.className = `qr-card locked ${item.esFinal ? "final-special" : ""}`;
        card.id = `card-${item.id}`;

        card.innerHTML = `
            <div class="card-header">
                <span class="step-number">QR #${item.id} DE 5</span>
                <span class="unlock-time">🕒 ${item.hora}h</span>
            </div>
            <h3>${item.titulo}</h3>
            <p class="desc">${item.descripcion}</p>

            <div class="qr-wrapper">
                <div id="qrcode-${item.id}" class="qr-code-box"></div>
                <div class="lock-overlay" id="overlay-${item.id}">
                    <div class="lock-icon">🔒</div>
                    <div class="countdown" id="timer-${item.id}">--:--:--</div>
                    <div class="countdown-label">para desbloquear</div>
                </div>
            </div>

            <div id="unlocked-info-${item.id}" style="display: none;">
                <div class="unlocked-message">${item.mensajeDesbloqueado}</div>
                ${item.esFinal
                    ? `<button class="btn-action" onclick="abrirModalFinal(${item.id})">Leer Texto y Ver Vídeo ✨</button>`
                    : `<a href="${item.qrContenido}" target="_blank" rel="noopener noreferrer" class="btn-action">Abrir Enlace ↗</a>`
                }
            </div>
        `;

        container.appendChild(card);

        if (typeof QRCode !== "undefined") {
            new QRCode(document.getElementById(`qrcode-${item.id}`), {
                text: item.qrContenido,
                width: 180,
                height: 180,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
        }
    });
}

function formatearTiempo(ms) {
    if (ms <= 0) return "00:00:00";
    const totalSegundos = Math.floor(ms / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    return [horas, minutos, segundos]
        .map(v => v < 10 ? "0" + v : v)
        .join(":");
}

function actualizarRelojes() {
    const ahora = new Date();
    const relojEl = document.getElementById("reloj-actual");
    if (relojEl) {
        relojEl.textContent = `Hora actual: ${ahora.toLocaleTimeString("es-ES")}`;
    }

    momentos.forEach((item) => {
        const fechaObjetivo = new Date(ANIO, MES, DIA, item.horaNum, 0, 0);
        const diferencia = fechaObjetivo.getTime() - ahora.getTime();

        const card = document.getElementById(`card-${item.id}`);
        const overlay = document.getElementById(`overlay-${item.id}`);
        const unlockedInfo = document.getElementById(`unlocked-info-${item.id}`);
        const timerEl = document.getElementById(`timer-${item.id}`);

        if (!card || !overlay || !unlockedInfo || !timerEl) return;

        if (diferencia <= 0 || modoPrueba) {
            card.classList.remove("locked");
            card.classList.add("unlocked");
            overlay.style.display = "none";
            unlockedInfo.style.display = "block";
        } else {
            card.classList.add("locked");
            card.classList.remove("unlocked");
            overlay.style.display = "flex";
            unlockedInfo.style.display = "none";
            timerEl.textContent = formatearTiempo(diferencia);
        }
    });
}

function abrirModalFinal(id) {
    const item = momentos.find(m => m.id === id);
    if (!item || !modal) return;

    document.getElementById("modal-titulo").textContent = item.titulo;
    document.getElementById("modal-texto").textContent = item.textoModal || item.qrContenido;

    const btnLink = document.getElementById("modal-link");
    if (item.urlVideoFinal) {
        btnLink.href = item.urlVideoFinal;
        btnLink.style.display = "inline-block";
    } else {
        btnLink.style.display = "none";
    }

    modal.classList.remove("hidden");
}

// Botón Modo Prueba (funciona si está en el HTML y no da error si lo borras)
const btnPrueba = document.getElementById("btn-modo-prueba");
if (btnPrueba) {
    btnPrueba.addEventListener("click", () => {
        modoPrueba = !modoPrueba;
        btnPrueba.textContent = modoPrueba ? "Volver al modo normal" : "Modo Prueba (Desbloquear todo)";
        actualizarRelojes();
    });
}

// Truco secreto: 5 toques en "EDICIÓN ESPECIAL" activan/desactivan el modo prueba aunque borres el botón
let toques = 0;
const badgeEl = document.querySelector(".badge");
if (badgeEl) {
    badgeEl.addEventListener("click", () => {
        toques++;
        if (toques >= 5) {
            modoPrueba = !modoPrueba;
            toques = 0;
            actualizarRelojes();
        }
    });
}

const closeBtn = document.getElementById("close-modal");
if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
}

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

inicializarTarjetas();
actualizarRelojes();
setInterval(actualizarRelojes, 1000);
document.addEventListener("visibilitychange", actualizarRelojes);
