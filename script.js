// 1. CONFIGURACIÓN DEL EVENTO (Fecha: Año-Mes-Día)
const FECHA_CUMPLEANOS = "2026-11-26"; 

const sorpresas = [
    {
        hora: "09:00",
        titulo: "Capítulo 1: El Despertar",
        descripcion: "Para empezar tus 50 años con una sonrisa.",
        urlVideo: "https://AQUI-TU-ENLACE-VIDEO-1.com"
    },
    {
        hora: "12:00",
        titulo: "Capítulo 2: El Aperitivo",
        descripcion: "Un recuerdo muy especial a media mañana.",
        urlVideo: "https://AQUI-TU-ENLACE-VIDEO-2.com"
    },
    {
        hora: "15:00",
        titulo: "Capítulo 3: Sobremesa",
        descripcion: "Personas que no querían perderse este día.",
        urlVideo: "https://AQUI-TU-ENLACE-VIDEO-3.com"
    },
    {
        hora: "18:00",
        titulo: "Capítulo 4: La Tarde",
        descripcion: "Seguimos celebrando medio siglo de historias.",
        urlVideo: "https://AQUI-TU-ENLACE-VIDEO-4.com"
    },
    {
        hora: "21:00",
        titulo: "Capítulo 5: El Gran Final",
        descripcion: "El broche de oro para un día inolvidable.",
        urlVideo: "https://AQUI-TU-ENLACE-VIDEO-5.com",
        esFinal: true,
        textoModal: "¡Muchísimas felicidades por estos 50 años! Aquí tienes la última sorpresa del día."
    }
];

let modoPrueba = false;
const qrGenerados = {};

// 2. CREAR LAS TARJETAS EN PANTALLA
const container = document.getElementById("qr-container");

sorpresas.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "qr-card";
    card.innerHTML = `
        <div class="card-header">
            <span>QR #${index + 1} DE ${sorpresas.length}</span>
            <span>🕒 ${item.hora}h</span>
        </div>
        <h2>${item.titulo}</h2>
        <p>${item.descripcion}</p>
        <div class="qr-box" id="box-${index}">
            <div class="lock-overlay" id="lock-${index}">
                <div class="lock-icon">🔒</div>
                <div class="countdown" id="timer-${index}">00:00:00</div>
                <small>PARA DESBLOQUEAR</small>
            </div>
            <div id="qrcode-${index}" style="display:none;"></div>
        </div>
    `;
    container.appendChild(card);
});

// 3. CONTROL DEL RELOJ Y DESBLOQUEO
function actualizarTodo() {
    const ahora = new Date();
    const relojEl = document.getElementById("reloj-actual");
    if (relojEl) {
        relojEl.textContent = ahora.toLocaleTimeString("es-ES");
    }

    sorpresas.forEach((item, index) => {
        const fechaObjetivo = new Date(`${FECHA_CUMPLEANOS}T${item.hora}:00`);
        const diferencia = fechaObjetivo - ahora;

        const lockEl = document.getElementById(`lock-${index}`);
        const qrEl = document.getElementById(`qrcode-${index}`);
        const timerEl = document.getElementById(`timer-${index}`);

        if (diferencia <= 0 || modoPrueba) {
            // Desbloquear y dibujar QR
            lockEl.style.display = "none";
            qrEl.style.display = "block";

            if (!qrGenerados[index]) {
                new QRCode(qrEl, {
                    text: item.urlVideo,
                    width: 180,
                    height: 180
                });
                qrGenerados[index] = true;

                // Si es el final, activar ventana emergente al hacer clic
                if (item.esFinal) {
                    qrEl.style.cursor = "pointer";
                    qrEl.addEventListener("click", () => abrirModalFinal(item));
                }
            }
        } else {
            // Mantener bloqueado y actualizar cuenta atrás
            lockEl.style.display = "flex";
            qrEl.style.display = "none";

            const horas = Math.floor(diferencia / (1000 * 60 * 60));
            const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
            const segundos = Math.floor((diferencia / 1000) % 60);

            timerEl.textContent = 
                String(horas).padStart(2, "0") + ":" +
                String(minutos).padStart(2, "0") + ":" +
                String(segundos).padStart(2, "0");
        }
    });
}

// 4. BOTÓN DE MODO PRUEBA Y MODAL FINAL
const btnPrueba = document.getElementById("btn-modo-prueba");
if (btnPrueba) {
    btnPrueba.addEventListener("click", () => {
        modoPrueba = !modoPrueba;
        btnPrueba.textContent = modoPrueba ? "Volver al modo normal" : "Modo Prueba (Desbloquear todo)";
        actualizarTodo();
    });
}

function abrirModalFinal(item) {
    const modal = document.getElementById("modal-sorpresa");
    document.getElementById("modal-titulo").textContent = item.titulo;
    document.getElementById("modal-texto").textContent = item.textoModal;
    document.getElementById("modal-link").href = item.urlVideo;
    modal.classList.remove("hidden");
}

const closeModal = document.getElementById("close-modal");
if (closeModal) {
    closeModal.addEventListener("click", () => {
        document.getElementById("modal-sorpresa").classList.add("hidden");
    });
}

// Iniciar reloj cada segundo
setInterval(actualizarTodo, 1000);
actualizarTodo();
