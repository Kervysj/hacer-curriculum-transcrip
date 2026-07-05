// ============================================
// VARIABLES GLOBALES
// ============================================
let currentType = '';
let experienciaCount = 0;
let educacionCount = 0;
let cursosCount = 0;

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    checkTheme();
});

// ============================================
// MODO OSCURO/CLARO
// ============================================
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-toggle');
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        btn.textContent = '☀️ Modo Claro';
        localStorage.setItem('theme', 'dark');
    } else {
        btn.textContent = '🌙 Modo Oscuro';
        localStorage.setItem('theme', 'light');
    }
}

function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    const btn = document.getElementById('theme-toggle');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (btn) btn.textContent = '☀️ Modo Claro';
    }
}

// ============================================
// NAVEGACIÓN ENTRE PASOS
// ============================================
function selectType(type) {
    currentType = type;
    document.getElementById('step-type').style.display = 'none';
    document.getElementById('step-data').style.display = 'block';

    if (type === 'cv') {
        document.getElementById('data-title').textContent = 'Ingresa los datos de tu CV';
        document.getElementById('form-cv').style.display = 'block';
        document.getElementById('form-transcripcion').style.display = 'none';
    } else {
        document.getElementById('data-title').textContent = 'Configura tu Transcripción';
        document.getElementById('form-cv').style.display = 'none';
        document.getElementById('form-transcripcion').style.display = 'block';
    }
    window.scrollTo(0, 0);
}

function goBackToType() {
    document.getElementById('step-data').style.display = 'none';
    document.getElementById('step-type').style.display = 'block';
    window.scrollTo(0, 0);
}

function goBackToEdit() {
    document.getElementById('step-preview').style.display = 'none';
    document.getElementById('step-data').style.display = 'block';
    window.scrollTo(0, 0);
}

function startOver() {
    document.getElementById('step-preview').style.display = 'none';
    document.getElementById('step-type').style.display = 'block';
    document.getElementById('form-cv').style.display = 'none';
    document.getElementById('form-transcripcion').style.display = 'none';
    currentType = '';
    window.scrollTo(0, 0);
}

// ============================================
// TOGGLE SECCIONES CV
// ============================================
function toggleSecciones() {
    const completo = document.getElementById('cv-completo').checked;
    const select = document.getElementById('secciones-select');
    select.style.display = completo ? 'none' : 'block';
}

// ============================================
// AGREGAR CAMPOS DINÁMICOS
// ============================================
function addExperiencia() {
    experienciaCount++;
    const container = document.getElementById('experiencia-list');
    const div = document.createElement('div');
    div.className = 'item-row';
    div.id = `exp-${experienciaCount}`;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('exp-${experienciaCount}')">✕</button>
        <div class="form-grid">
            <div class="form-group"><label>Empresa</label><input type="text" class="exp-empresa" placeholder="Ej: Empresa XYZ"></div>
            <div class="form-group"><label>Cargo</label><input type="text" class="exp-cargo" placeholder="Ej: Gerente"></div>
            <div class="form-group"><label>Fecha Inicio</label><input type="text" class="exp-inicio" placeholder="Ej: 2020"></div>
            <div class="form-group"><label>Fecha Fin</label><input type="text" class="exp-fin" placeholder="Ej: Actualidad"></div>
        </div>
        <div class="form-group"><label>Descripción</label><textarea class="exp-desc" rows="3" placeholder="Funciones..."></textarea></div>
    `;
    container.appendChild(div);
}

function addEducacion() {
    educacionCount++;
    const container = document.getElementById('educacion-list');
    const div = document.createElement('div');
    div.className = 'item-row';
    div.id = `edu-${educacionCount}`;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('edu-${educacionCount}')"></button>
        <div class="form-grid">
            <div class="form-group"><label>Institución</label><input type="text" class="edu-inst" placeholder="Ej: Universidad"></div>
            <div class="form-group"><label>Título</label><input type="text" class="edu-titulo" placeholder="Ej: Licenciatura"></div>
            <div class="form-group"><label>Inicio</label><input type="text" class="edu-inicio" placeholder="Ej: 2015"></div>
            <div class="form-group"><label>Fin</label><input type="text" class="edu-fin" placeholder="Ej: 2019"></div>
        </div>
    `;
    container.appendChild(div);
}

function addCurso() {
    cursosCount++;
    const container = document.getElementById('cursos-list');
    const div = document.createElement('div');
    div.className = 'item-row';
    div.id = `cur-${cursosCount}`;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('cur-${cursosCount}')">✕</button>
        <div class="form-grid">
            <div class="form-group"><label>Nombre del Curso</label><input type="text" class="cur-nombre" placeholder="Ej: Excel Avanzado"></div>
            <div class="form-group"><label>Institución</label><input type="text" class="cur-inst" placeholder="Ej: Google"></div>
            <div class="form-group"><label>Año</label><input type="text" class="cur-anio" placeholder="Ej: 2023"></div>
        </div>
    `;
    container.appendChild(div);
}

function removeItem(id) {
    const item = document.getElementById(id);
    if (item) item.remove();
}

// ============================================
// 🤖 FUNCIÓN PARA ANALIZAR CV PEGADO
// ============================================
function parsearCVCompleto() {
    const texto = document.getElementById('cv-texto-completo').value.trim();
    if (!texto) {
        showNotification('Por favor pega el contenido de tu CV primero', 'error');
        return;
    }

    const lineas = texto.split('\n').map(l => l.trim()).filter(l => l);
    
    // Estructura para guardar los datos
    const datos = {
        nombre: '', telefono: '', email: '', ciudad: '', linkedin: '',
        perfil: '',
        experiencia: [], educacion: [], cursos: [],
        habilidades: '', idiomas: ''
    };

    let seccionActual = 'inicio';
    let bufferExp = null;
    let bufferEdu = null;

    // Palabras clave para detectar secciones
    const keywords = {
        perfil: ['PERFIL PROFESIONAL', 'PERFIL', 'OBJETIVO', 'SOBRE MÍ', 'RESUMEN'],
        experiencia: ['EXPERIENCIA LABORAL', 'EXPERIENCIA PROFESIONAL', 'EXPERIENCIA', 'TRAYECTORIA'],
        educacion: ['FORMACIÓN ACADÉMICA', 'EDUCACIÓN', 'ESTUDIOS', 'FORMACION', 'ACADEMICO'],
        habilidades: ['HABILIDADES', 'SKILLS', 'COMPETENCIAS', 'DESTREZAS', 'CONOCIMIENTOS'],
        cursos: ['CURSOS', 'CERTIFICACIONES', 'CAPACITACIONES', 'TALLERES'],
        idiomas: ['IDIOMAS', 'LANGUAGES']
    };

    // 1. Procesar las primeras líneas para datos personales (antes de cualquier sección)
    for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i];
        const lineaUpper = linea.toUpperCase();
        let esInicioSeccion = false;

        // Revisar si esta línea es el inicio de una sección
        for (const [key, words] of Object.entries(keywords)) {
            if (words.some(word => lineaUpper.includes(word))) {
                seccionActual = key;
                esInicioSeccion = true;
                break;
            }
        }

        if (esInicioSeccion) {
            // Si ya pasamos el inicio, guardamos lo que teníamos en buffer
            if (bufferExp) { datos.experiencia.push(bufferExp); bufferExp = null; }
            if (bufferEdu) { datos.educacion.push(bufferEdu); bufferEdu = null; }
            continue;
        }

        // Si estamos en la sección "inicio" (datos personales)
        if (seccionActual === 'inicio') {
            if (!datos.nombre && i === 0) {
                datos.nombre = linea; // La primera línea casi siempre es el nombre
            } else if (linea.match(/04\d{2}-?\d{7}/) || linea.match(/teléfono|telefono|celular/i)) {
                datos.telefono = linea.replace(/.*?:\s*/i, '');
            } else if (linea.includes('@')) {
                datos.email = linea.replace(/.*?:\s*/i, '');
            } else if (linea.match(/ciudad|ubicación|direccion|edo\./i)) {
                datos.ciudad = linea.replace(/.*?:\s*/i, '');
            } else if (linea.match(/linkedin|web|portfolio/i)) {
                datos.linkedin = linea.replace(/.*?:\s*/i, '');
            } else if (!datos.ciudad && linea.match(/edo\.|estado|caracas|méxico|bogota/i)) {
                datos.ciudad = linea;
            }
            continue;
        }

        // Procesar según la sección actual
        switch (seccionActual) {
            case 'perfil':
                datos.perfil += linea + ' ';
                break;
            
            case 'experiencia':
                // Si la línea parece un cargo o empresa (tiene guiones o es muy corta y en mayúsculas)
                if (linea.includes(' - ') || (linea.length < 60 && lineaUpper === linea)) {
                    if (bufferExp) datos.experiencia.push(bufferExp);
                    const partes = linea.split(' - ');
                    bufferExp = {
                        empresa: partes[0] || '',
                        cargo: partes[1] || '',
                        fecha: '',
                        descripcion: ''
                    };
                } else if (bufferExp) {
                    if (linea.match(/\d{4}/) && !bufferExp.fecha) {
                        bufferExp.fecha = linea;
                    } else {
                        bufferExp.descripcion += linea + ' ';
                    }
                } else {
                    // Si no hay buffer, creamos uno nuevo
                    bufferExp = { empresa: '', cargo: linea, fecha: '', descripcion: '' };
                }
                break;

            case 'educacion':
                if (linea.includes(' - ') || linea.match(/\d{4}/)) {
                    if (bufferEdu) datos.educacion.push(bufferEdu);
                    const partes = linea.split(' - ');
                    bufferEdu = {
                        inst: partes[1] || partes[0] || '',
                        titulo: partes[0] || linea,
                        inicio: '', fin: ''
                    };
                } else if (bufferEdu) {
                    bufferEdu.titulo += ' ' + linea;
                } else {
                    bufferEdu = { inst: '', titulo: linea, inicio: '', fin: '' };
                }
                break;

            case 'habilidades':
                // Si tiene formato "Categoría: Descripción"
                if (linea.includes(':')) {
                    datos.habilidades += linea + '. ';
                } else {
                    datos.habilidades += linea + ', ';
                }
                break;

            case 'cursos':
                if (linea.includes(' - ') || linea.match(/\d{4}/)) {
                    const partes = linea.split(' - ');
                    datos.cursos.push({
                        nombre: partes[0].trim(),
                        inst: partes[1] ? partes[1].replace(/\(\d{4}\)/, '').trim() : '',
                        anio: linea.match(/\d{4}/) ? linea.match(/\d{4}/)[0] : ''
                    });
                } else {
                    datos.cursos.push({ nombre: linea, inst: '', anio: '' });
                }
                break;

            case 'idiomas':
                datos.idiomas += linea + ', ';
                break;
        }
    }

    // Guardar los últimos buffers pendientes
    if (bufferExp) datos.experiencia.push(bufferExp);
    if (bufferEdu) datos.educacion.push(bufferEdu);

    // ============================================
    // LLENAR EL FORMULARIO CON LOS DATOS
    // ============================================
    if (datos.nombre) document.getElementById('cv-nombre').value = datos.nombre;
    if (datos.telefono) document.getElementById('cv-telefono').value = datos.telefono;
    if (datos.email) document.getElementById('cv-email').value = datos.email;
    if (datos.ciudad) document.getElementById('cv-ciudad').value = datos.ciudad;
    if (datos.linkedin) document.getElementById('cv-linkedin').value = datos.linkedin;
    if (datos.perfil.trim()) document.getElementById('cv-perfil').value = datos.perfil.trim();
    if (datos.habilidades.trim()) document.getElementById('cv-habilidades').value = datos.habilidades.trim();
    if (datos.idiomas.trim()) document.getElementById('cv-idiomas').value = datos.idiomas.trim();

    // Llenar experiencias
    datos.experiencia.forEach(exp => {
        if (exp.cargo || exp.empresa) {
            addExperiencia();
            const items = document.querySelectorAll('#experiencia-list .item-row');
            const last = items[items.length - 1];
            if (exp.empresa) last.querySelector('.exp-empresa').value = exp.empresa;
            if (exp.cargo) last.querySelector('.exp-cargo').value = exp.cargo;
            if (exp.fecha) last.querySelector('.exp-inicio').value = exp.fecha;
            if (exp.descripcion) last.querySelector('.exp-desc').value = exp.descripcion.trim();
        }
    });

    // Llenar educación
    datos.educacion.forEach(edu => {
        if (edu.titulo || edu.inst) {
            addEducacion();
            const items = document.querySelectorAll('#educacion-list .item-row');
            const last = items[items.length - 1];
            if (edu.titulo) last.querySelector('.edu-titulo').value = edu.titulo;
            if (edu.inst) last.querySelector('.edu-inst').value = edu.inst;
        }
    });

    // Llenar cursos
    datos.cursos.forEach(cur => {
        if (cur.nombre) {
            addCurso();
            const items = document.querySelectorAll('#cursos-list .item-row');
            const last = items[items.length - 1];
            if (cur.nombre) last.querySelector('.cur-nombre').value = cur.nombre;
            if (cur.inst) last.querySelector('.cur-inst').value = cur.inst;
            if (cur.anio) last.querySelector('.cur-anio').value = cur.anio;
        }
    });

    showNotification('✅ ¡CV analizado y organizado automáticamente!', 'success');
    
    // Limpiar el textarea para no confundir al usuario
    document.getElementById('cv-texto-completo').value = '';
}

// ============================================
// GENERAR DOCUMENTO
// ============================================
function generateDocument() {
    if (currentType === 'cv') {
        generateCV();
    } else {
        generateTranscripcion();
    }
    document.getElementById('step-data').style.display = 'none';
    document.getElementById('step-preview').style.display = 'block';
    window.scrollTo(0, 0);
}

// ============================================
// GENERAR CV (Recopila datos y elige estilo)
// ============================================
function generateCV() {
    const data = {
        nombre: document.getElementById('cv-nombre').value || 'Tu Nombre',
        telefono: document.getElementById('cv-telefono').value,
        email: document.getElementById('cv-email').value,
        ciudad: document.getElementById('cv-ciudad').value,
        linkedin: document.getElementById('cv-linkedin').value,
        foto: document.getElementById('cv-foto').value,
        perfil: document.getElementById('cv-perfil').value,
        habilidades: document.getElementById('cv-habilidades').value,
        idiomas: document.getElementById('cv-idiomas').value,
        experiencias: [],
        educaciones: [],
        cursos: []
    };

    document.querySelectorAll('#experiencia-list .item-row').forEach(row => {
        data.experiencias.push({
            empresa: row.querySelector('.exp-empresa').value,
            cargo: row.querySelector('.exp-cargo').value,
            inicio: row.querySelector('.exp-inicio').value,
            fin: row.querySelector('.exp-fin').value,
            desc: row.querySelector('.exp-desc').value
        });
    });

    document.querySelectorAll('#educacion-list .item-row').forEach(row => {
        data.educaciones.push({
            inst: row.querySelector('.edu-inst').value,
            titulo: row.querySelector('.edu-titulo').value,
            inicio: row.querySelector('.edu-inicio').value,
            fin: row.querySelector('.edu-fin').value
        });
    });

    document.querySelectorAll('#cursos-list .item-row').forEach(row => {
        data.cursos.push({
            nombre: row.querySelector('.cur-nombre').value,
            inst: row.querySelector('.cur-inst').value,
            anio: row.querySelector('.cur-anio').value
        });
    });

    const completo = document.getElementById('cv-completo').checked;
    let secciones = ['perfil', 'experiencia', 'educacion', 'cursos', 'habilidades', 'idiomas'];
    if (!completo) {
        secciones = [];
        document.querySelectorAll('.seccion-check:checked').forEach(cb => secciones.push(cb.value));
    }
    data.secciones = secciones;

    const styleRadio = document.querySelector('input[name="cv-style"]:checked');
    const estilo = styleRadio ? styleRadio.value : 'moderno';

    let html = '';
    switch(estilo) {
        case 'moderno': html = generateCVModerno(data); break;
        case 'clasico': html = generateCVClasico(data); break;
        case 'creativo': html = generateCVCreativo(data); break;
        case 'minimalista': html = generateCVMinimalista(data); break;
        case 'profesional': html = generateCVProfesional(data); break;
    }

    document.getElementById('document-preview').innerHTML = html;
}

// ============================================
// ESTILOS DE CV (5 Variantes)
// ============================================
function generateCVModerno(d) {
    let sidebar = `<div class="cv-sidebar">
        ${d.foto ? `<img src="${d.foto}" style="width:150px; height:150px; border-radius:50%; object-fit:cover; margin-bottom:20px; border: 4px solid white;">` : ''}
        <h2 style="margin-bottom:20px;">${d.nombre}</h2>
        ${d.telefono ? `<p>📞 ${d.telefono}</p>` : ''}
        ${d.email ? `<p>✉️ ${d.email}</p>` : ''}
        ${d.ciudad ? `<p> ${d.ciudad}</p>` : ''}
        ${d.linkedin ? `<p>🔗 ${d.linkedin}</p>` : ''}
        ${d.secciones.includes('habilidades') && d.habilidades ? `<div style="margin-top:30px;"><h3 style="border-bottom:2px solid white; padding-bottom:10px; margin-bottom:15px;">Habilidades</h3><ul style="list-style:none; padding:0;">${d.habilidades.split(',').map(h => `<li style="margin-bottom:8px;">• ${h.trim()}</li>`).join('')}</ul></div>` : ''}
        ${d.secciones.includes('idiomas') && d.idiomas ? `<div style="margin-top:30px;"><h3 style="border-bottom:2px solid white; padding-bottom:10px; margin-bottom:15px;">Idiomas</h3><ul style="list-style:none; padding:0;">${d.idiomas.split(',').map(i => `<li style="margin-bottom:8px;">• ${i.trim()}</li>`).join('')}</ul></div>` : ''}
    </div>`;
    let main = `<div class="cv-main">`;
    if (d.secciones.includes('perfil') && d.perfil) main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Perfil Profesional</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    if (d.secciones.includes('experiencia') && d.experiencias.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Experiencia Laboral</h2>`;
        d.experiencias.forEach(e => { main += `<div style="margin-bottom:20px;"><h3 style="margin-bottom:5px;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${e.empresa} | ${e.inicio} - ${e.fin}</p><p style="line-height:1.6;">${e.desc}</p></div>`; });
        main += `</div>`;
    }
    if (d.secciones.includes('educacion') && d.educaciones.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Educación</h2>`;
        d.educaciones.forEach(e => { main += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.inst} | ${e.inicio} - ${e.fin}</p></div>`; });
        main += `</div>`;
    }
    if (d.secciones.includes('cursos') && d.cursos.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Cursos</h2>`;
        d.cursos.forEach(c => { main += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.inst} | ${c.anio}</p></div>`; });
        main += `</div>`;
    }
    main += `</div>`;
    return `<div class="cv-moderno">${sidebar}${main}</div>`;
}

function generateCVClasico(d) {
    let html = `<div class="cv-clasico"><div class="cv-header"><h1 style="font-size:2rem; margin-bottom:10px;">${d.nombre}</h1><div style="color:#6b7280;">${d.telefono ? `<span>${d.telefono}</span>` : ''}${d.email ? `<span> | ${d.email}</span>` : ''}${d.ciudad ? `<span> | ${d.ciudad}</span>` : ''}</div></div>`;
    if (d.secciones.includes('perfil') && d.perfil) html += `<div style="margin-bottom:30px; text-align:left;"><h2>PERFIL PROFESIONAL</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    if (d.secciones.includes('experiencia') && d.experiencias.length > 0) {
        html += `<div style="margin-bottom:30px; text-align:left;"><h2>EXPERIENCIA LABORAL</h2>`;
        d.experiencias.forEach(e => { html += `<div style="margin-bottom:20px;"><h3>${e.cargo}</h3><p style="color:#6b7280; font-style:italic;">${e.empresa} | ${e.inicio} - ${e.fin}</p><p style="line-height:1.6;">${e.desc}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('educacion') && d.educaciones.length > 0) {
        html += `<div style="margin-bottom:30px; text-align:left;"><h2>EDUCACIÓN</h2>`;
        d.educaciones.forEach(e => { html += `<div style="margin-bottom:15px;"><h3>${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.inst} | ${e.inicio} - ${e.fin}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('habilidades') && d.habilidades) html += `<div style="margin-bottom:30px; text-align:left;"><h2>HABILIDADES</h2><p>${d.habilidades}</p></div>`;
    if (d.secciones.includes('idiomas') && d.idiomas) html += `<div style="margin-bottom:30px; text-align:left;"><h2>IDIOMAS</h2><p>${d.idiomas}</p></div>`;
    html += `</div>`; return html;
}

function generateCVCreativo(d) {
    let html = `<div class="cv-creativo"><div class="cv-header"><h1 style="font-size:2.5rem; margin-bottom:10px;">${d.nombre}</h1><div style="font-size:1.1rem;">${d.telefono ? `<span>📞 ${d.telefono}</span>` : ''}${d.email ? `<span> | ✉️ ${d.email}</span>` : ''}${d.ciudad ? `<span> | 📍 ${d.ciudad}</span>` : ''}</div></div>`;
    if (d.secciones.includes('perfil') && d.perfil) html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b;">Sobre Mí</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    if (d.secciones.includes('experiencia') && d.experiencias.length > 0) {
        html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b;">Experiencia</h2>`;
        d.experiencias.forEach(e => { html += `<div style="margin-bottom:20px; padding-left:15px; border-left:4px solid #f59e0b;"><h3>${e.cargo}</h3><p style="color:#6b7280; font-style:italic;">${e.empresa} | ${e.inicio} - ${e.fin}</p><p style="line-height:1.6;">${e.desc}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('educacion') && d.educaciones.length > 0) {
        html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b;">Educación</h2>`;
        d.educaciones.forEach(e => { html += `<div style="margin-bottom:15px; padding-left:15px; border-left:4px solid #f59e0b;"><h3>${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.inst} | ${e.inicio} - ${e.fin}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('habilidades') && d.habilidades) {
        html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b;">Habilidades</h2><div style="display:flex; flex-wrap:wrap; gap:10px;">${d.habilidades.split(',').map(h => `<span style="background:#f59e0b; color:white; padding:5px 15px; border-radius:20px;">${h.trim()}</span>`).join('')}</div></div>`;
    }
    if (d.secciones.includes('idiomas') && d.idiomas) html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b;">Idiomas</h2><p>${d.idiomas}</p></div>`;
    html += `</div>`; return html;
}

function generateCVMinimalista(d) {
    let html = `<div class="cv-minimalista"><div class="cv-header"><h1 style="font-size:2.5rem; font-weight:300; margin-bottom:10px;">${d.nombre}</h1><div style="color:#6b7280;">${d.telefono ? `<span>${d.telefono}</span>` : ''}${d.email ? `<span> · ${d.email}</span>` : ''}${d.ciudad ? `<span> · ${d.ciudad}</span>` : ''}</div></div>`;
    if (d.secciones.includes('perfil') && d.perfil) html += `<div style="margin-bottom:40px;"><p style="line-height:1.8; font-size:1.1rem;">${d.perfil}</p></div>`;
    if (d.secciones.includes('experiencia') && d.experiencias.length > 0) {
        html += `<div style="margin-bottom:40px;"><h2>Experiencia</h2>`;
        d.experiencias.forEach(e => { html += `<div style="margin-bottom:25px;"><h3 style="font-weight:500;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic;">${e.empresa} · ${e.inicio} - ${e.fin}</p><p style="line-height:1.6;">${e.desc}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('educacion') && d.educaciones.length > 0) {
        html += `<div style="margin-bottom:40px;"><h2>Educación</h2>`;
        d.educaciones.forEach(e => { html += `<div style="margin-bottom:20px;"><h3 style="font-weight:500;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.inst} · ${e.inicio} - ${e.fin}</p></div>`; });
        html += `</div>`;
    }
    if (d.secciones.includes('habilidades') && d.habilidades) html += `<div style="margin-bottom:40px;"><h2>Habilidades</h2><p>${d.habilidades}</p></div>`;
    if (d.secciones.includes('idiomas') && d.idiomas) html += `<div style="margin-bottom:40px;"><h2>Idiomas</h2><p>${d.idiomas}</p></div>`;
    html += `</div>`; return html;
}

function generateCVProfesional(d) {
    let sidebar = `<div style="background:#f3f4f6; padding:30px; border-radius:10px;">
        ${d.foto ? `<img src="${d.foto}" style="width:150px; height:150px; border-radius:50%; object-fit:cover; margin-bottom:20px;">` : ''}
        <h2 style="margin-bottom:20px; color:#1e3a8a;">${d.nombre}</h2>
        ${d.telefono ? `<p>📞 ${d.telefono}</p>` : ''}${d.email ? `<p>✉️ ${d.email}</p>` : ''}${d.ciudad ? `<p>📍 ${d.ciudad}</p>` : ''}${d.linkedin ? `<p>🔗 ${d.linkedin}</p>` : ''}
        ${d.secciones.includes('habilidades') && d.habilidades ? `<div style="margin-top:30px;"><h3 style="color:#1e3a8a; border-bottom:2px solid #1e3a8a; padding-bottom:10px;">Habilidades</h3><ul style="list-style:none; padding:0;">${d.habilidades.split(',').map(h => `<li>• ${h.trim()}</li>`).join('')}</ul></div>` : ''}
        ${d.secciones.includes('idiomas') && d.idiomas ? `<div style="margin-top:30px;"><h3 style="color:#1e3a8a; border-bottom:2px solid #1e3a8a; padding-bottom:10px;">Idiomas</h3><ul style="list-style:none; padding:0;">${d.idiomas.split(',').map(i => `<li>• ${i.trim()}</li>`).join('')}</ul></div>` : ''}
    </div>`;
    let main = `<div>`;
    if (d.secciones.includes('perfil') && d.perfil) main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px;">Perfil Profesional</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    if (d.secciones.includes('experiencia') && d.experiencias.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px;">Experiencia Laboral</h2>`;
        d.experiencias.forEach(e => { main += `<div style="margin-bottom:20px;"><h3>${e.cargo}</h3><p style="color:#6b7280; font-style:italic;">${e.empresa} | ${e.inicio} - ${e.fin}</p><p style="line-height:1.6;">${e.desc}</p></div>`; });
        main += `</div>`;
    }
    if (d.secciones.includes('educacion') && d.educaciones.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px;">Educación</h2>`;
        d.educaciones.forEach(e => { main += `<div style="margin-bottom:15px;"><h3>${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.inst} | ${e.inicio} - ${e.fin}</p></div>`; });
        main += `</div>`;
    }
    if (d.secciones.includes('cursos') && d.cursos.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px;">Cursos</h2>`;
        d.cursos.forEach(c => { main += `<div style="margin-bottom:15px;"><h3>${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.inst} | ${c.anio}</p></div>`; });
        main += `</div>`;
    }
    main += `</div>`;
    return `<div class="cv-profesional">${sidebar}${main}</div>`;
}

// ============================================
// GENERAR TRANSCRIPCIÓN
// ============================================
function generateTranscripcion() {
    const tipo = document.getElementById('trans-tipo').value;
    const fuente = document.getElementById('trans-fuente').value;
    const interlineado = document.getElementById('trans-interlineado').value;
    const titulo = document.getElementById('trans-titulo').value || 'Transcripción';
    const fecha = document.getElementById('trans-fecha').value;
    const lugar = document.getElementById('trans-lugar').value;
    const participantes = document.getElementById('trans-participantes').value;
    const contenido = document.getElementById('trans-contenido').value;

    let html = '';
    if (tipo === 'apa') {
        html = generateTransAPA({titulo, fecha, lugar, participantes, contenido, fuente, interlineado});
    } else {
        html = generateTransLegal({titulo, fecha, lugar, participantes, contenido, fuente, interlineado});
    }
    document.getElementById('document-preview').innerHTML = html;
}

function generateTransAPA(d) {
    const fechaF = d.fecha ? new Date(d.fecha).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'}) : '';
    let header = `<div style="text-align:center; margin-bottom:30px;"><h1 style="font-size:${d.fuente}pt; margin-bottom:10px;">${d.titulo}</h1>${fechaF ? `<p>${fechaF}</p>` : ''}${d.lugar ? `<p>${d.lugar}</p>` : ''}${d.participantes ? `<p><strong>Participantes:</strong> ${d.participantes}</p>` : ''}</div>`;
    const parrafos = d.contenido.split('\n\n').filter(p => p.trim());
    let body = `<div style="font-family:'Times New Roman', serif; font-size:${d.fuente}pt; line-height:${d.interlineado}; text-align:justify;">`;
    parrafos.forEach(p => { body += `<p style="text-indent:1.27cm; margin-bottom:0;">${p.trim()}</p>`; });
    body += `</div>`;
    return `<div class="trans-apa">${header}${body}</div>`;
}

function generateTransLegal(d) {
    const fechaF = d.fecha ? new Date(d.fecha).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'}) : '';
    let header = `<div style="border:2px solid #333; padding:20px; margin-bottom:30px;"><h1 style="text-align:center; font-size:14pt;">${d.titulo}</h1><p style="text-align:center;"><strong>Fecha:</strong> ${fechaF}</p>${d.lugar ? `<p style="text-align:center;"><strong>Lugar:</strong> ${d.lugar}</p>` : ''}</div>`;
    const lineas = d.contenido.split('\n').filter(l => l.trim());
    let body = `<div style="font-family:'Times New Roman', serif; font-size:${d.fuente}pt; line-height:${d.interlineado};">`;
    lineas.forEach(linea => {
        const match = linea.match(/^([A-ZÁÉÍÓÚÑ\s]+):\s*(.+)$/);
        if (match) {
            body += `<div style="margin-bottom:15px;"><span style="font-weight:bold; text-transform:uppercase;">${match[1]}:</span> ${match[2]}</div>`;
        } else {
            body += `<p style="margin-bottom:10px;">${linea}</p>`;
        }
    });
    body += `</div>`;
    return `<div class="trans-legal">${header}${body}</div>`;
}

// ============================================
// DESCARGAS
// ============================================
function downloadPDF() {
    window.print();
}

function downloadWord() {
    const content = document.getElementById('document-preview').innerHTML;
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Documento</title></head><body>${content}</body></html>`;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'documento.doc';
    link.click();
    URL.revokeObjectURL(url);
}

// ============================================
// NOTIFICACIONES
// ============================================
function showNotification(message, type) {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.cssText = `position: fixed; top: 20px; right: 20px; padding: 15px 25px; background: ${type === 'success' ? '#10b981' : '#ef4444'}; color: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 9999; font-weight: bold; transition: all 0.3s;`;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}
