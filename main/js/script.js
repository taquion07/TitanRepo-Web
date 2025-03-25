let recordatorios = [];
let popupAbierto = null;
let recordatorioAEliminar = null;

// Elementos del DOM
const confirmacionModal = document.getElementById("confirmacion-modal");
const confirmarBtn = document.getElementById("confirmar-eliminar");
const cancelarBtn = document.getElementById("cancelar-eliminar");
const popupRecordatorio = document.getElementById("popup-recordatorio");
const popupContenido = document.getElementById("popup-contenido");

// Event listeners para los botones de confirmación
confirmarBtn.addEventListener("click", confirmarEliminacion);
cancelarBtn.addEventListener("click", cancelarEliminacion);

function agregarRecordatorio() {
  const materia = document.getElementById("materia").value;
  const motivo = document.getElementById("motivo").value;
  const descripcion = document.getElementById("descripcion").value;
  const fechaRecordatorio = document.getElementById("fecha-recordatorio").value;

  if (!materia || !motivo || !fechaRecordatorio) {
    alert("Por favor complete los campos obligatorios");
    return;
  }

  const nuevoRecordatorio = {
    id: Date.now(),
    materia,
    motivo,
    descripcion,
    fecha: new Date(fechaRecordatorio),
    activo: true,
  };

  recordatorios.push(nuevoRecordatorio);
  actualizarLista();
  verificarRecordatorios();

  // Limpiar formulario
  document.getElementById("materia").value = "";
  document.getElementById("motivo").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("fecha-recordatorio").value = "";
}

function actualizarLista() {
  const lista = document.getElementById("lista-recordatorios");
  lista.innerHTML = "";

  recordatorios.forEach((recordatorio) => {
    if (recordatorio.activo) {
      const item = document.createElement("div");
      item.className = "recordatorio-item";
      item.innerHTML = `
                <h3>${recordatorio.materia}</h3>
                <p><strong>Motivo:</strong> ${recordatorio.motivo}</p>
                <p><strong>Descripción:</strong> ${
                  recordatorio.descripcion || "N/A"
                }</p>
                <p><strong>Fecha:</strong> ${recordatorio.fecha.toLocaleString()}</p>
                <p><strong>Tiempo restante:</strong> <span class="countdown" id="countdown-${
                  recordatorio.id
                }"></span></p>
                <button class="eliminar-btn" onclick="solicitarEliminacion(${
                  recordatorio.id
                })">
                  <img src="/img/close.png" alt="Eliminar" width="20" height="20">
                </button>
            `;
      lista.appendChild(item);
      actualizarCuentaRegresiva(recordatorio.id, recordatorio.fecha);
    }
  });
}

function actualizarCuentaRegresiva(id, fechaObjetivo) {
  const elemento = document.getElementById(`countdown-${id}`);
  if (!elemento) return;

  const interval = setInterval(() => {
    const ahora = new Date();
    const diferencia = fechaObjetivo - ahora;

    if (diferencia <= 0) {
      clearInterval(interval);
      elemento.textContent = "¡Ahora!";
      mostrarPopup(id);
      return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    elemento.textContent = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  }, 1000);
}

function solicitarEliminacion(id) {
  recordatorioAEliminar = id;
  confirmacionModal.style.display = "flex";
}

function confirmarEliminacion() {
  if (recordatorioAEliminar) {
    recordatorios = recordatorios.filter((r) => r.id !== recordatorioAEliminar);
    if (popupAbierto === recordatorioAEliminar) {
      cerrarPopup();
    }
    actualizarLista();
  }
  confirmacionModal.style.display = "none";
  recordatorioAEliminar = null;
}

function cancelarEliminacion() {
  confirmacionModal.style.display = "none";
  recordatorioAEliminar = null;
}

function verificarRecordatorios() {
  const ahora = new Date();
  recordatorios.forEach((recordatorio) => {
    if (recordatorio.activo && recordatorio.fecha <= ahora) {
      mostrarPopup(recordatorio.id);
    }
  });
}

// Verificar recordatorios cada segundo
setInterval(verificarRecordatorios, 1000);

// Cerrar modal haciendo clic fuera del contenido
confirmacionModal.addEventListener("click", (e) => {
  if (e.target === confirmacionModal) {
    confirmacionModal.style.display = "none";
    recordatorioAEliminar = null;
  }
});
