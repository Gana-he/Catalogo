const IVA_RATE = 0.15;

const productos = [
    { name: "Leche Entera", base: 1.20, iva: false, img: "leche.jpg", color: "#f0f9ff" },
    { name: "Yogurt Natural", base: 2.50, iva: true, img: "yogurt.jpg", color: "#fdf2f8" },
    { name: "Huevos (30u)", base: 4.50, iva: false, img: "huevos.jpg", color: "#fffbeb" },
    { name: "Celular Smartphone", base: 450.00, iva: true, img: "celular.avif", color: "#f8fafc" },
    { name: "Botella de Alcohol", base: 35.00, iva: true, img: "botella.jpg", color: "#fef2f2" },
    { name: "Base Maquillaje", base: 18.00, iva: true, img: "base.jpg", color: "#faf5ff" },
    { name: "Servicio Computación", base: 30.00, iva: true, img: "servicio.jpg", color: "#f0fdf4" },
    { name: "Libro", base: 15.00, iva: false, img: "libro.jpg", color: "#f5f5f5" },
    { name: "Vehículo SUV", base: 22000.00, iva: true, img: "carro.png", color: "#f1f5f9" },
    { name: "Computadora", base: 850.00, iva: true, img: "pc.webp", color: "#ecfeff" },
    { name: "Salsa de Tomate", base: 1.60, iva: true, img: "salsa.png", color: "#fff1f2" }
];

function init() {
    const grid = document.getElementById('grid-productos');
    const qrAdminContainer = document.getElementById('contenedor-qrs');

    // Limpiamos contenedores por si acaso
    grid.innerHTML = "";
    qrAdminContainer.innerHTML = "";

    productos.forEach((item, index) => {
        // 1. Crear tarjeta en el catálogo
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => verDetalle(item);
        
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}" style="object-fit: cover;" onerror="this.src='https://via.placeholder.com/300?text=Imagen'">
            <h3>${item.name}</h3>
        `;
        grid.appendChild(card);

        // 2. Crear contenedor para el QR
        const qrDiv = document.createElement('div');
        qrDiv.className = 'qr-item';
        qrDiv.innerHTML = `<p style="font-weight:bold; margin-bottom:10px;">${item.name}</p><div id="canvas-${index}"></div>`;
        qrAdminContainer.appendChild(qrDiv);

        // 3. Generar el QR con el enlace dinámico correcto
        setTimeout(() => {
            const el = document.getElementById(`canvas-${index}`);
            if (el) {
                // Quitamos espacios y caracteres raros para el enlace
                const idProducto = encodeURIComponent(item.name.replace(/\s/g, ""));
                // Usamos window.location.href para asegurar que tome la URL completa de tu GitHub
                const urlBase = window.location.href.split('#')[0];
                const urlFinal = urlBase + "#" + idProducto;
                
                new QRCode(el, {
                    text: urlFinal,
                    width: 140,
                    height: 140,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            }
        }, 200 * (index + 1)); 
    });

    // Revisar si el usuario entró directamente por un QR escaneado
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        revisarRutaQR();
    }, 1500);
}

function revisarRutaQR() {
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (hash) {
        const encontrado = productos.find(p => p.name.replace(/\s/g, "") === hash);
        if (encontrado) {
            verDetalle(encontrado);
        }
    }
}

function verDetalle(item) {
    const vistaCatalogo = document.getElementById('vista-catalogo');
    const vistaDetalle = document.getElementById('vista-detalle');
    const detalleContenido = document.getElementById('detalle-contenido');

    const valorIva = item.iva ? item.base * IVA_RATE : 0;
    const total = item.base + valorIva;

    detalleContenido.style.backgroundColor = item.color;
    detalleContenido.innerHTML = `
        <div class="detalle-card">
            <img src="${item.img}" class="detalle-img" alt="${item.name}" onerror="this.src='https://via.placeholder.com/400?text=Error'">
            <div class="detalle-info">
                <span style="font-weight:700; color:#64748b">${item.iva ? 'IVA 15%' : 'TARIFA 0%'}</span>
                <h1>${item.name}</h1>
                <p style="color:#64748b; margin-bottom:20px">Producto verificado - Catálogo 2026.</p>
                <div style="font-size:3rem; font-weight:800; margin-bottom:10px">$${total.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                <div style="background:#f1f5f9; padding:20px; border-radius:15px; font-size:1rem">
                    <p><strong>Precio Base:</strong> $${item.base.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                    <p><strong>IVA (15%):</strong> $${valorIva.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                    <hr style="margin:10px 0; border:0; border-top:1px solid #cbd5e1">
                    <p style="font-size:1.2rem"><strong>Total a Pagar:</strong> $${total.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                </div>
            </div>
        </div>
    `;

    vistaCatalogo.classList.add('hidden');
    vistaDetalle.classList.remove('hidden');
    window.location.hash = item.name.replace(/\s/g, ""); 
}

function irAlCatalogo() {
    document.getElementById('vista-catalogo').classList.remove('hidden');
    document.getElementById('vista-detalle').classList.add('hidden');
    history.replaceState(null, null, window.location.pathname); 
}

function abrirAdmin() { document.getElementById('panel-admin').classList.remove('hidden'); }
function cerrarAdmin() { document.getElementById('panel-admin').classList.add('hidden'); }

window.onload = init;