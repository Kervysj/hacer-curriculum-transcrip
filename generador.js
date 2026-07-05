// VARIABLES GLOBALES
let cvData = null;
let currentStyle = 'moderno';
let fotoBase64 = null;

// MODO OSCURO
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('theme-toggle');
    if (document.body.classList.contains('dark-mode')) {
        btn.textContent = '☀️ Modo Claro';
        localStorage.setItem('theme', 'dark');
    } else {
        btn.textContent = '🌙 Modo Oscuro';
        localStorage.setItem('theme', 'light');
    }
}

// Cargar tema guardado
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('theme-toggle').textContent = '☀️ Modo Claro';
}

// Toggle tipo de foto
function toggleFotoType() {
    const type = document.querySelector('input[name="foto-type"]:checked').value;
    document.getElementById('foto-url-container').style.display = type === 'url' ? 'block' : 'none';
    document.getElementById('foto-upload-container').style.display = type === 'upload' ? 'block' : 'none';
}

// Manejar upload de foto
function handleFotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            fotoBase64 = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// ANALIZAR CV
function analizarCV() {
    const texto = document.getElementById('cv-texto').value.trim();
    
    if (!texto) {
        alert('❌ Por favor pega el contenido de tu CV');
        return;
    }
    
    // Obtener foto
    const fotoType = document.querySelector('input[name="foto-type"]:checked').value;
    let foto = null;
    
    if (fotoType === 'url') {
        foto = document.getElementById('cv-foto-url').value.trim();
    } else {
        foto = fotoBase64;
    }
    
    // Parsear CV
    cvData = parsearCV(texto, foto);
    
    // Generar vista previa
    generarVistaPrevia(currentStyle);
    
    // Mostrar paso 2
    document.getElementById('step-input').style.display = 'none';
    document.getElementById('step-preview').style.display = 'block';
    window.scrollTo(0, 0);
}

// Parsear texto del CV
function parsearCV(texto, foto) {
    const lineas = texto.split('\n').map(l => l.trim()).filter(l => l);
    
    const datos = {
        nombre: '',
        titulo: '',
        telefono: '',
        email: '',
        ciudad: '',
        linkedin: '',
        perfil: '',
        experiencia: [],
        educacion: [],
        habilidades: '',
        idiomas: '',
        cursos: [],
        foto: foto
    };
    
    let seccionActual = 'inicio';
    let bufferExp = null;
    
    const keywords = {
        perfil: ['PERFIL PROFESIONAL', 'PERFIL', 'OBJETIVO', 'SOBRE MÍ', 'SOBRE MI'],
        experiencia: ['EXPERIENCIA LABORAL', 'EXPERIENCIA PROFESIONAL', 'EXPERIENCIA'],
        educacion: ['FORMACIÓN ACADÉMICA', 'EDUCACIÓN', 'EDUCACION', 'ESTUDIOS'],
        habilidades: ['HABILIDADES', 'SKILLS', 'COMPETENCIAS'],
        idiomas: ['IDIOMAS', 'LANGUAGES'],
        cursos: ['CURSOS', 'CERTIFICACIONES', 'CAPACITACIONES']
    };
    
    for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i];
        const lineaUpper = linea.toUpperCase();
        let esInicioSeccion = false;
        
        // Detectar sección
        for (const [key, words] of Object.entries(keywords)) {
            if (words.some(w => lineaUpper.includes(w))) {
                if (bufferExp) {
                    datos.experiencia.push(bufferExp);
                    bufferExp = null;
                }
                seccionActual = key;
                esInicioSeccion = true;
                break;
            }
        }
        
        if (esInicioSeccion) continue;
        
        // Procesar según sección
        if (seccionActual === 'inicio') {
            if (!datos.nombre && i === 0) {
                datos.nombre = linea;
            } else if (!datos.titulo && i === 1 && linea.length < 100) {
                datos.titulo = linea;
            } else if (linea.match(/04\d{2}-?\d{7}/) || linea.toLowerCase().includes('teléfono') || linea.toLowerCase().includes('telefono')) {
                datos.telefono = linea.replace(/.*?:\s*/i, '').trim();
            } else if (linea.includes('@')) {
                datos.email = linea.replace(/.*?:\s*/i, '').trim();
            } else if (linea.toLowerCase().match(/ciudad|ubicación|direccion|edo\.|estado/)) {
                datos.ciudad = linea.replace(/.*?:\s*/i, '').trim();
            } else if (linea.toLowerCase().match(/linkedin|web|portfolio/)) {
                datos.linkedin = linea.replace(/.*?:\s*/i, '').trim();
            }
        } else if (seccionActual === 'perfil') {
            datos.perfil += linea + ' ';
        } else if (seccionActual === 'experiencia') {
            if (linea.includes(' - ') || linea.match(/\(\d{4}/)) {
                if (bufferExp) datos.experiencia.push(bufferExp);
                const partes = linea.split(' - ');
                bufferExp = {
                    cargo: partes[0].trim(),
                    empresa: partes[1] ? partes[1].replace(/\(.*?\)/, '').trim() : '',
                    fecha: linea.match(/\(.*?\)/) ? linea.match(/\(.*?\)/)[0] : '',
                    descripcion: ''
                };
            } else if (bufferExp && linea.startsWith('-')) {
                bufferExp.descripcion += linea.substring(1).trim() + ' ';
            } else if (bufferExp) {
                bufferExp.descripcion += linea + ' ';
            }
        } else if (seccionActual === 'educacion') {
            if (linea.includes(' - ') || linea.match(/\d{4}/)) {
                const partes = linea.split(' - ');
                const anioMatch = linea.match(/\d{4}/);
                datos.educacion.push({
                    titulo: partes[0].trim(),
                    institucion: partes[1] ? partes[1].replace(/\(.*?\)/, '').trim() : '',
                    anio: anioMatch ? anioMatch[0] : ''
                });
            }
        } else if (seccionActual === 'habilidades') {
            datos.habilidades += linea + ', ';
        } else if (seccionActual === 'idiomas') {
            datos.idiomas += linea + ', ';
        } else if (seccionActual === 'cursos') {
            if (linea.includes(' - ') || linea.match(/\d{4}/)) {
                const partes = linea.split(' - ');
                const anioMatch = linea.match(/\d{4}/);
                datos.cursos.push({
                    nombre: partes[0].trim(),
                    institucion: partes[1] ? partes[1].replace(/\(.*?\)/, '').trim() : '',
                    anio: anioMatch ? anioMatch[0] : ''
                });
            }
        }
    }
    
    if (bufferExp) datos.experiencia.push(bufferExp);
    
    // Limpiar datos
    datos.habilidades = datos.habilidades.replace(/,\s*$/, '');
    datos.idiomas = datos.idiomas.replace(/,\s*$/, '');
    datos.perfil = datos.perfil.trim();
    
    return datos;
}

// Generar vista previa
function generarVistaPrevia(estilo) {
    let html = '';
    
    switch(estilo) {
        case 'moderno':
            html = generarModerno();
            break;
        case 'clasico':
            html = generarClasico();
            break;
        case 'creativo':
            html = generarCreativo();
            break;
        case 'minimalista':
            html = generarMinimalista();
            break;
        case 'profesional':
            html = generarProfesional();
            break;
    }
    
    document.getElementById('cv-preview').innerHTML = html;
}

// Estilo Moderno
function generarModerno() {
    const d = cvData;
    let sidebar = `<div class="cv-sidebar">`;
    if (d.foto) sidebar += `<img src="${d.foto}" style="width:150px; height:150px; border-radius:50%; object-fit:cover; margin-bottom:20px; border: 4px solid white;">`;
    sidebar += `<h2 style="margin-bottom:20px;">${d.nombre}</h2>`;
    if (d.titulo) sidebar += `<p style="font-size:1.1rem; margin-bottom:15px;">${d.titulo}</p>`;
    if (d.telefono) sidebar += `<p>📞 ${d.telefono}</p>`;
    if (d.email) sidebar += `<p>✉️ ${d.email}</p>`;
    if (d.ciudad) sidebar += `<p>📍 ${d.ciudad}</p>`;
    if (d.linkedin) sidebar += `<p>🔗 ${d.linkedin}</p>`;
    
    if (d.habilidades) {
        sidebar += `<div style="margin-top:30px;"><h3 style="border-bottom:2px solid white; padding-bottom:10px; margin-bottom:15px;">Habilidades</h3><p>${d.habilidades}</p></div>`;
    }
    if (d.idiomas) {
        sidebar += `<div style="margin-top:20px;"><h3 style="border-bottom:2px solid white; padding-bottom:10px; margin-bottom:15px;">Idiomas</h3><p>${d.idiomas}</p></div>`;
    }
    sidebar += `</div>`;
    
    let main = `<div class="cv-main">`;
    if (d.perfil) main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Perfil Profesional</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    
    if (d.experiencia.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Experiencia Laboral</h2>`;
        d.experiencia.forEach(e => {
            main += `<div style="margin-bottom:20px;"><h3 style="margin-bottom:5px;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${e.empresa} ${e.fecha}</p><p style="line-height:1.6;">${e.descripcion}</p></div>`;
        });
        main += `</div>`;
    }
    
    if (d.educacion.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Educación</h2>`;
        d.educacion.forEach(e => {
            main += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.institucion} ${e.anio}</p></div>`;
        });
        main += `</div>`;
    }
    
    if (d.cursos.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#3b82f6; border-bottom:3px solid #3b82f6; padding-bottom:10px; margin-bottom:15px;">Cursos</h2>`;
        d.cursos.forEach(c => {
            main += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.institucion} ${c.anio}</p></div>`;
        });
        main += `</div>`;
    }
    main += `</div>`;
    
    return `<div class="cv-moderno">${sidebar}${main}</div>`;
}

// Estilo Clásico
function generarClasico() {
    const d = cvData;
    let html = `<div class="cv-clasico"><div class="cv-header"><h1 style="font-size:2rem; margin-bottom:10px;">${d.nombre}</h1>`;
    if (d.titulo) html += `<p style="font-size:1.2rem; color:#6b7280; margin-bottom:10px;">${d.titulo}</p>`;
    html += `<div style="color:#6b7280;">`;
    if (d.telefono) html += `<span>${d.telefono}</span>`;
    if (d.email) html += `<span> | ${d.email}</span>`;
    if (d.ciudad) html += `<span> | ${d.ciudad}</span>`;
    html += `</div></div>`;
    
    if (d.perfil) html += `<div style="margin-bottom:30px; text-align:left;"><h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">PERFIL PROFESIONAL</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    
    if (d.experiencia.length > 0) {
        html += `<div style="margin-bottom:30px; text-align:left;"><h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">EXPERIENCIA LABORAL</h2>`;
        d.experiencia.forEach(e => {
            html += `<div style="margin-bottom:20px;"><h3 style="margin-bottom:5px;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${e.empresa} ${e.fecha}</p><p style="line-height:1.6;">${e.descripcion}</p></div>`;
        });
        html += `</div>`;
    }
    
    if (d.educacion.length > 0) {
        html += `<div style="margin-bottom:30px; text-align:left;"><h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">EDUCACIÓN</h2>`;
        d.educacion.forEach(e => {
            html += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.institucion} ${e.anio}</p></div>`;
        });
        html += `</div>`;
    }
    
    if (d.habilidades) html += `<div style="margin-bottom:30px; text-align:left;"><h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">HABILIDADES</h2><p>${d.habilidades}</p></div>`;
    if (d.idiomas) html += `<div style="margin-bottom:30px; text-align:left;"><h2 style="border-bottom:2px solid #333; padding-bottom:5px; margin-bottom:15px;">IDIOMAS</h2><p>${d.idiomas}</p></div>`;
    
    html += `</div>`;
    return html;
}

// Estilo Creativo
function generarCreativo() {
    const d = cvData;
    let html = `<div class="cv-creativo"><div class="cv-header"><h1 style="font-size:2.5rem; margin-bottom:10px;">${d.nombre}</h1>`;
    if (d.titulo) html += `<p style="font-size:1.2rem; margin-bottom:10px;">${d.titulo}</p>`;
    html += `<div style="font-size:1.1rem;">`;
    if (d.telefono) html += `<span>📞 ${d.telefono}</span>`;
    if (d.email) html += `<span> | ✉️ ${d.email}</span>`;
    if (d.ciudad) html += `<span> | 📍 ${d.ciudad}</span>`;
    html += `</div></div>`;
    
    if (d.perfil) html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b; margin-bottom:15px;">Sobre Mí</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    
    if (d.experiencia.length > 0) {
        html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b; margin-bottom:15px;">Experiencia</h2>`;
        d.experiencia.forEach(e => {
            html += `<div style="margin-bottom:20px; padding-left:15px; border-left:4px solid #f59e0b;"><h3 style="margin-bottom:5px;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${e.empresa} ${e.fecha}</p><p style="line-height:1.6;">${e.descripcion}</p></div>`;
        });
        html += `</div>`;
    }
    
    if (d.educacion.length > 0) {
        html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b; margin-bottom:15px;">Educación</h2>`;
        d.educacion.forEach(e => {
            html += `<div style="margin-bottom:15px; padding-left:15px; border-left:4px solid #f59e0b;"><h3 style="margin-bottom:5px;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.institucion} ${e.anio}</p></div>`;
        });
        html += `</div>`;
    }
    
    if (d.habilidades) html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b; margin-bottom:15px;">Habilidades</h2><p>${d.habilidades}</p></div>`;
    if (d.idiomas) html += `<div style="margin-bottom:30px;"><h2 style="color:#f59e0b; margin-bottom:15px;">Idiomas</h2><p>${d.idiomas}</p></div>`;
    
    html += `</div>`;
    return html;
}

// Estilo Minimalista
function generarMinimalista() {
    const d = cvData;
    let html = `<div class="cv-minimalista"><div class="cv-header"><h1 style="font-size:2.5rem; font-weight:300; margin-bottom:10px;">${d.nombre}</h1>`;
    if (d.titulo) html += `<p style="font-size:1.2rem; color:#6b7280; margin-bottom:10px;">${d.titulo}</p>`;
    html += `<div style="color:#6b7280;">`;
    if (d.telefono) html += `<span>${d.telefono}</span>`;
    if (d.email) html += `<span> · ${d.email}</span>`;
    if (d.ciudad) html += `<span> · ${d.ciudad}</span>`;
    html += `</div></div>`;
    
    if (d.perfil) html += `<div style="margin-bottom:40px;"><p style="line-height:1.8; font-size:1.1rem;">${d.perfil}</p></div>`;
    
    if (d.experiencia.length > 0) {
        html += `<div style="margin-bottom:40px;"><h2 style="font-weight:300; font-size:1.2rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Experiencia</h2>`;
        d.experiencia.forEach(e => {
            html += `<div style="margin-bottom:25px;"><h3 style="font-weight:500; margin-bottom:5px;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${e.empresa} ${e.fecha}</p><p style="line-height:1.6;">${e.descripcion}</p></div>`;
        });
        html += `</div>`;
    }
    
    if (d.educacion.length > 0) {
        html += `<div style="margin-bottom:40px;"><h2 style="font-weight:300; font-size:1.2rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Educación</h2>`;
        d.educacion.forEach(e => {
            html += `<div style="margin-bottom:20px;"><h3 style="font-weight:500; margin-bottom:5px;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.institucion} ${e.anio}</p></div>`;
        });
        html += `</div>`;
    }
    
    if (d.habilidades) html += `<div style="margin-bottom:40px;"><h2 style="font-weight:300; font-size:1.2rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Habilidades</h2><p>${d.habilidades}</p></div>`;
    if (d.idiomas) html += `<div style="margin-bottom:40px;"><h2 style="font-weight:300; font-size:1.2rem; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">Idiomas</h2><p>${d.idiomas}</p></div>`;
    
    html += `</div>`;
    return html;
}

// Estilo Profesional
function generarProfesional() {
    const d = cvData;
    let sidebar = `<div class="cv-sidebar">`;
    if (d.foto) sidebar += `<img src="${d.foto}" style="width:150px; height:150px; border-radius:50%; object-fit:cover; margin-bottom:20px;">`;
    sidebar += `<h2 style="margin-bottom:20px; color:#1e3a8a;">${d.nombre}</h2>`;
    if (d.titulo) sidebar += `<p style="color:#6b7280; margin-bottom:15px;">${d.titulo}</p>`;
    if (d.telefono) sidebar += `<p>📞 ${d.telefono}</p>`;
    if (d.email) sidebar += `<p>✉️ ${d.email}</p>`;
    if (d.ciudad) sidebar += `<p>📍 ${d.ciudad}</p>`;
    if (d.linkedin) sidebar += `<p>🔗 ${d.linkedin}</p>`;
    
    if (d.habilidades) sidebar += `<div style="margin-top:30px;"><h3 style="color:#1e3a8a; border-bottom:2px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Habilidades</h3><p>${d.habilidades}</p></div>`;
    if (d.idiomas) sidebar += `<div style="margin-top:20px;"><h3 style="color:#1e3a8a; border-bottom:2px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Idiomas</h3><p>${d.idiomas}</p></div>`;
    sidebar += `</div>`;
    
    let main = `<div>`;
    if (d.perfil) main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Perfil Profesional</h2><p style="line-height:1.6;">${d.perfil}</p></div>`;
    
    if (d.experiencia.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Experiencia Laboral</h2>`;
        d.experiencia.forEach(e => {
            main += `<div style="margin-bottom:20px;"><h3 style="margin-bottom:5px;">${e.cargo}</h3><p style="color:#6b7280; font-style:italic; margin-bottom:10px;">${e.empresa} ${e.fecha}</p><p style="line-height:1.6;">${e.descripcion}</p></div>`;
        });
        main += `</div>`;
    }
    
    if (d.educacion.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Educación</h2>`;
        d.educacion.forEach(e => {
            main += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${e.titulo}</h3><p style="color:#6b7280; font-style:italic;">${e.institucion} ${e.anio}</p></div>`;
        });
        main += `</div>`;
    }
    
    if (d.cursos.length > 0) {
        main += `<div style="margin-bottom:30px;"><h2 style="color:#1e3a8a; border-bottom:3px solid #1e3a8a; padding-bottom:10px; margin-bottom:15px;">Cursos</h2>`;
        d.cursos.forEach(c => {
            main += `<div style="margin-bottom:15px;"><h3 style="margin-bottom:5px;">${c.nombre}</h3><p style="color:#6b7280; font-style:italic;">${c.institucion} ${c.anio}</p></div>`;
        });
        main += `</div>`;
    }
    main += `</div>`;
    
    return `<div class="cv-profesional">${sidebar}${main}</div>`;
}

// Cambiar estilo
function cambiarEstilo(estilo) {
    currentStyle = estilo;
    
    // Actualizar botones
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Regenerar vista previa
    generarVistaPrevia(estilo);
}

// Editar CV
function editarCV() {
    document.getElementById('step-preview').style.display = 'none';
    document.getElementById('step-input').style.display = 'block';
    window.scrollTo(0, 0);
}

// Nuevo CV
function nuevoCV() {
    if (confirm('¿Seguro que quieres crear un nuevo CV? Se perderán los datos actuales.')) {
        document.getElementById('cv-texto').value = '';
        document.getElementById('cv-foto-url').value = '';
        document.getElementById('cv-foto-file').value = '';
        fotoBase64 = null;
        cvData = null;
        document.getElementById('step-preview').style.display = 'none';
        document.getElementById('step-input').style.display = 'block';
        window.scrollTo(0, 0);
    }
}

// Descargar PDF
function descargarPDF() {
    window.print();
}

// Descargar Word
function descargarWord() {
    const content = document.getElementById('cv-preview').innerHTML;
    const html = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>CV</title></head>
        <body>${content}</body>
        </html>
    `;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mi-cv.doc';
    link.click();
    URL.revokeObjectURL(url);
    alert('📝 CV descargado como Word');
}
