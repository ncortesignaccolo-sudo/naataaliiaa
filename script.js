// =========================================================================
// CONFIGURACIÓN DEL EVENTO (EDITA ESTOS DATOS)
// =========================================================================

// Fecha en formato "AAAA-MM-DD"
const FECHA_EVENTO = "2026-11-21";

// 5 Códigos QR cada 3 horas: 09:00, 12:00, 15:00, 18:00 y 21:00
const momentos = [
    {
        id: 1,
        hora: "09:00",
        titulo: "Capítulo 1: El Despertar",
        descripcion: "Para empezar tus 50 años con una sonrisa.",
        qrContenido: "https://ejemplo.com/sorpresa-0900",
        mensajeDesbloqueado: "¡Buenos días! Hoy cumples 50 años y empieza tu día de sorpresas.",
        esFinal: false
    },
    {
        id: 2,
        hora: "12:00",
        titulo: "Capítulo 2: Años Dorados",
        descripcion: "Un pequeño viaje al pasado...",
        qrContenido: "https://ejemplo.com/sorpresa-1200",
        mensajeDesbloqueado: "Llega el mediodía: escanea este QR para descubrir el segundo detalle.",
        esFinal: false
    },
    {
        id: 3,
        hora: "15:00",
        titulo: "Capítulo 3: Sobremesa",
        descripcion: "Alguien tiene algo que decirte.",
        qrContenido: "https://ejemplo.com/sorpresa-1500",
        mensajeDesbloqueado: "¡Hora de sobremesa! Toca abrir la tercera sorpresa.",
        esFinal: false
    },
    {
        id: 4,
        hora: "18:00",
        titulo: "Capítulo 4: La Cuenta Atrás",
        descripcion: "Ya queda poco para el gran momento de las 21:00.",
        qrContenido: "https://ejemplo.com/sorpresa-1800",
        mensajeDesbloqueado: "La tarde avanza y el gran final está a la vuelta de la esquina.",
        esFinal: false
    },
    {
        id: 5,
        hora: "21:00",
        titulo: "Capítulo 5: Vídeo y Mensaje Final",
        descripcion: "El broche de oro a tus 50 años.",
        // Texto que aparecerá en el móvil al escanear el QR final
        qrContenido: "¡FELICES 50 AÑOS! Gracias por cada momento, cada risa y por hacer estos 50 años tan especiales.",
        mensajeDesbloqueado: "✨ ¡FELICES 50 AÑOS! ✨\nLlegaron las 21:00: este es el QR final con tu mensaje conmemorativo y el acceso al vídeo.",
        textoModal: "¡FELICES 50 AÑOS!\n\nGracias por ser una persona tan importante en nuestras vidas, por cada consejo, cada abrazo y cada recuerdo compartido. ¡Por muchos años más celebrándote!",
        urlVideoFinal: "https://ejemplo.com/video-final-50",
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
                    <div class="countdown" id="timer-${item.id}">00:00:00</div>
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

        new QRCode(document.getElementById(`qrcode-${item.id}`), {
            text: item.qrContenido,
            width: 180,
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });
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
    document.getElementById("reloj-actual").textContent =
        `Hora actual: ${ahora.toLocaleTimeString('es-ES')}`;

    momentos.forEach((item) => {
        const fechaObjetivo = new Date(`${FECHA_EVENTO}T${item.hora}:00`);
        const diferencia = fechaObjetivo - ahora;

        const card = document.getElementById(`card-${item.id}`);
        const overlay = document.getElementById(`overlay-${item.id}`);
        const unlockedInfo = document.getElementById(`unlocked-info-${item.id}`);
        const timerEl = document.getElementById(`timer-${item.id}`);

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
    if (!item) return;

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

document.getElementById("close-modal").addEventListener("click", () => {
    modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

inicializarTarjetas();
actualizarRelojes();
setInterval(actualizarRelojes, 1000);
