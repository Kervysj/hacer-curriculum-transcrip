// VARIABLES GLOBALES
let currentType = '';
let currentCVData = null;
let currentStyle = 'moderno';

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
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = '☀️ Modo Claro';
}

// Navegación
function goToStep(stepId) {
    document.querySelectorAll('.step').forEach(step => {
        step.style.display = 'none';
    });
    document.getElementById(stepId).style.display = 'block';
    window.scrollTo(0, 0);
}

function selectType(type) {
    currentType = type;
    document.getElementById('step-type').style.display = 'none';
    document.getElementById('step-input').style.display = 'block';

    if (type === 'cv') {
        document.getElementById('input-title').textContent = 'Pega tu Currículum';
        document.getElementById('cv-input').style.display = 'block';
        document.getElementById('carta-input').style.display = 'none';
        document.getElementById('legal-input').style.display = 'none';
    } else if (type === 'carta') {
        document.getElementById('input-title').textContent = 'Configura tu Carta';
        document.getElementById('cv-input').style.display = 'none';
        document.getElementById('carta-input').style.display = 'block';
        document.getElementById('legal-input').style.display = 'none';
        updateCartaPlaceholder();
    } else if (type === 'legal') {
        document.getElementById('input-title').textContent = 'Documento Legal/Transcripción';
        document.getElementById('cv-input').style.display = 'none';
        document.getElementById('carta-input').style.display = 'none';
        document.getElementById('legal-input').style.display = 'block';
    }
}

function updateCartaPlaceholder() {
    const tipo = document.getElementById('carta-tipo').value;
    const textarea = document.getElementById('carta-texto');
    const fecha = new Date().toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'});

    const placeholders = {
        trabajo: `${fecha}

A QUIEN CORRESPONDA:

Por medio de la presente, hago constar que [NOMBRE DEL EMPLEADO], con documento de identidad [NÚMERO DE DOCUMENTO], labora en [NOMBRE DE LA EMPRESA] desde el [FECHA DE INGRESO] hasta la fecha, desempeñando el cargo de [CARGO ACTUAL].

Durante su tiempo en la empresa, ha demostrado ser una persona responsable, cumplida y con excelente desempeño en sus funciones.

Se expide la presente carta a solicitud del interesado para los fines que estime convenientes.

Atentamente,

[NOMBRE DEL REPRESENTANTE LEGAL O RRHH]
[CARGO]
[NOMBRE DE LA EMPRESA]
[Teléfono de contacto]
[Email]`,

        renuncia: `${fecha}

A: [NOMBRE DEL JEFE O DEPARTAMENTO DE RRHH]
[CARGO]
[NOMBRE DE LA EMPRESA]

Estimado/a [NOMBRE]:

Por medio de la presente, comunico mi decisión de renunciar voluntariamente al cargo de [TU CARGO] que he venido desempeñando en [NOMBRE DE LA EMPRESA], efectiva a partir del [FECHA DE ÚLTIMO DÍA DE TRABAJO].

Esta decisión responde a motivos estrictamente personales y profesionales que me impiden continuar formando parte de su equipo de trabajo.

Agradezco profundamente las oportunidades de crecimiento profesional y personal que me han brindado durante mi tiempo en la empresa, así como la confianza depositada en mi persona.

Me comprometo a realizar una transición ordenada de mis responsabilidades y dejar todos los procesos en orden antes de mi salida.

Sin más por el momento, me despido cordialmente.

Atentamente,

[TU NOMBRE COMPLETO]
[TU CARGO]
[TU DOCUMENTO DE IDENTIDAD]
[Firma]`,

        despido: `${fecha}

[NOMBRE DEL EMPLEADO]
[CARGO DEL EMPLEADO]
Presente.-

Estimado/a [NOMBRE DEL EMPLEADO]:

Por medio de la presente, lamentamos informarle que la empresa [NOMBRE DE LA EMPRESA] ha tomado la decisión de dar por terminado su contrato de trabajo, efectiva a partir del [FECHA DE DESPIDO].

Esta decisión se basa en [MOTIVO DEL DESPIDO - especificar según corresponda: bajo desempeño, reestructuración organizacional, supresión del cargo, etc.].

Le informamos que se realizará el pago de sus prestaciones sociales, liquidación y demás derechos laborales que le corresponden según la legislación vigente, en la fecha [FECHA DE PAGO].

Agradecemos los servicios prestados durante su tiempo en la empresa y le deseamos éxito en sus futuros proyectos profesionales.

Atentamente,

[NOMBRE DEL REPRESENTANTE LEGAL O RRHH]
[CARGO]
[NOMBRE DE LA EMPRESA]
[Firma y sello]`,

        recomendacion: `${fecha}

A QUIEN CORRESPONDA:

Por medio de la presente, recomiendo ampliamente a [NOMBRE DE LA PERSONA RECOMENDADA], quien laboró bajo mi supervisión en [NOMBRE DE LA EMPRESA] durante el período comprendido entre [FECHA DE INICIO] y [FECHA DE FIN], desempeñando el cargo de [CARGO DESEMPEÑADO].

Durante este tiempo, [NOMBRE] demostró ser una persona altamente responsable, comprometida, proactiva y con excelentes habilidades para [MENCIONAR HABILIDADES ESPECÍFICAS].

Su desempeño fue siempre satisfactorio, cumpliendo con las metas establecidas y manteniendo una actitud positiva hacia el trabajo y sus compañeros.

No tengo inconveniente en recomendarlo/a para cualquier posición que desee desempeñar, ya que estoy convencido/a de que será un valioso aporte para cualquier organización.

Quedo a su disposición para cualquier información adicional que requieran.

Atentamente,

[TU NOMBRE COMPLETO]
[TU CARGO]
[NOMBRE DE LA EMPRESA]
[Teléfono de contacto]
[Email]`,

        permiso: `${fecha}

A: [NOMBRE DEL JEFE O SUPERVISOR]
[CARGO]
[NOMBRE DE LA EMPRESA]

Estimado/a [NOMBRE]:

Por medio de la presente, solicito formalmente se me conceda un permiso [REMUNERADO / NO REMUNERADO] por [NÚMERO DE DÍAS] días, desde el [FECHA DE INICIO] hasta el [FECHA DE FIN], por motivos de [ESPECIFICAR MOTIVO].

Me comprometo a dejar todas mis responsabilidades debidamente organizadas y delegadas antes de mi ausencia, así como a reintegrarme a mis labores en la fecha indicada.

Agradezco de antemano su comprensión y atención a esta solicitud.

Atentamente,

[TU NOMBRE COMPLETO]
[TU CARGO]
[TU DOCUMENTO DE IDENTIDAD]
[Firma]`,

        autorizacion: `${fecha}

A QUIEN CORRESPONDA:

Yo, [TU NOMBRE COMPLETO], identificado/a con [TIPO Y NÚMERO DE DOCUMENTO DE IDENTIDAD], por medio de la presente autorizo a [NOMBRE DE LA PERSONA AUTORIZADA], identificado/a con [TIPO Y NÚMERO DE DOCUMENTO DE IDENTIDAD DE LA PERSONA AUTORIZADA], para que en mi nombre realice el siguiente trámite o acción:

[DESCRIBIR DETALLADAMENTE EL TRÁMITE O ACCIÓN AUTORIZADA]

Esta autorización es válida desde el [FECHA DE INICIO] hasta el [FECHA DE EXPIRACIÓN] o hasta que sea revocada por escrito.

Agradezco de antemano la atención prestada a la presente.

Atentamente,

[TU NOMBRE COMPLETO]
[TU DOCUMENTO DE IDENTIDAD]
[Teléfono de contacto]
[Firma]`,

        compromiso: `${fecha}

CARTA DE COMPROMISO

Yo, [NOMBRE COMPLETO], identificado/a con [TIPO Y NÚMERO DE DOCUMENTO DE IDENTIDAD], en mi calidad de [CARGO O ROL], por medio de la presente me comprometo formalmente a:

[DESCRIBIR DETALLADAMENTE EL COMPROMISO ADQUIRIDO]

Me obligo a cumplir con este compromiso en el plazo establecido, que vence el [FECHA LÍMITE DE CUMPLIMIENTO].

En caso de incumplimiento, acepto las consecuencias legales y/o contractuales que de ello se deriven.

Se firma la presente en [CIUDAD], a los [DÍA] días del mes de [MES] de [AÑO].

Atentamente,

[NOMBRE COMPLETO]
[DOCUMENTO DE IDENTIDAD]
[CARGO O ROL]
[Firma]`,

        cobro: `${fecha}

[NOMBRE DEL DEUDOR O EMPRESA DEUDORA]
[DIRECCIÓN]
[CARGO O DEPARTAMENTO]

Estimados señores:

Por medio de la presente, nos dirigimos a ustedes para solicitar formalmente el pago de la factura número [NÚMERO DE FACTURA] por un monto de [MONTO A COBRAR], la cual se encuentra vencida desde el [FECHA DE VENCIMIENTO].

Detalles de la deuda:
- Factura N°: [NÚMERO]
- Fecha de emisión: [FECHA]
- Fecha de vencimiento: [FECHA]
- Monto adeudado: [MONTO]
- Concepto: [DESCRIPCIÓN DEL PRODUCTO O SERVICIO]

Les solicitamos realizar el pago a la mayor brevedad posible en la siguiente cuenta bancaria:
- Banco: [NOMBRE DEL BANCO]
- Cuenta: [NÚMERO DE CUENTA]
- Titular: [NOMBRE DEL TITULAR]

En caso de que el pago ya haya sido realizado, agradecemos nos envíen el comprobante correspondiente.

Quedamos a su disposición para cualquier consulta o aclaración.

Atentamente,

[TU NOMBRE O NOMBRE DE LA EMPRESA]
[CARGO]
[Teléfono de contacto]
[Email]`,

        presentacion: `${fecha}

[NOMBRE DEL DESTINATARIO O EMPRESA]
[CARGO]
[DIRECCIÓN]

Estimados señores:

Me dirijo a ustedes con el propósito de presentarme formalmente y poner a su disposición mis servicios profesionales en el área de [ÁREA DE ESPECIALIZACIÓN].

Soy [TU NOMBRE COMPLETO], [TU PROFESIÓN O TÍTULO], con [NÚMERO] años de experiencia en [ÁREA DE EXPERIENCIA]. A lo largo de mi trayectoria, he trabajado en [MENCIONAR EMPRESAS O PROYECTOS RELEVANTES], donde he desarrollado habilidades en [MENCIONAR HABILIDADES CLAVE].

Ofrezco servicios de:
- [SERVICIO 1]
- [SERVICIO 2]
- [SERVICIO 3]

Estoy convencido/a de que mi experiencia y competencias pueden aportar valor significativo a su organización. Adjunto mi currículum vitae para su consideración y quedo a su entera disposición para concertar una entrevista personal donde pueda ampliar la información sobre mi perfil profesional.

Agradezco de antemano su atención y tiempo.

Atentamente,

[TU NOMBRE COMPLETO]
[TU PROFESIÓN]
[Teléfono]
[Email]
[LinkedIn o sitio web - opcional]`,

        agradecimiento: `${fecha}

[NOMBRE DEL DESTINATARIO]
[CARGO]
[NOMBRE DE LA EMPRESA O INSTITUCIÓN]

Estimado/a [NOMBRE]:

Por medio de la presente, deseo expresarle mi más sincero agradecimiento por [MOTIVO DEL AGRADECIMIENTO].

Su apoyo y disposición han sido fundamentales para [DESCRIBIR EL IMPACTO POSITIVO].

Valoro profundamente [MENCIONAR ALGUNA CUALIDAD O ACCIÓN ESPECÍFICA QUE DESEES DESTACAR] y espero poder corresponder a su confianza en futuras oportunidades.

Reitero mi agradecimiento y quedo a su entera disposición.

Cordialmente,

[TU NOMBRE COMPLETO]
[TU CARGO O RELACIÓN]
[Teléfono - opcional]
[Email]`,

        poder: `${fecha}

CARTA PODER

Yo, [TU NOMBRE COMPLETO], identificado/a con [TIPO Y NÚMERO DE DOCUMENTO DE IDENTIDAD], en mi carácter de [PODERDANTE], por medio de la presente otorgo poder especial y suficiente a [NOMBRE DEL APODERADO], identificado/a con [TIPO Y NÚMERO DE DOCUMENTO DE IDENTIDAD DEL APODERADO], para que en mi nombre y representación realice los siguientes actos:

[DESCRIBIR DETALLADAMENTE LOS ACTOS AUTORIZADOS]

Este poder tiene vigencia desde el [FECHA DE INICIO] hasta el [FECHA DE EXPIRACIÓN] o hasta que sea revocado por escrito.

El apoderado deberá actuar siempre en beneficio de mis intereses y dentro de los límites establecidos en este documento.

Se firma la presente en [CIUDAD], a los [DÍA] días del mes de [MES] de [AÑO].

PODERDANTE:

[TU NOMBRE COMPLETO]
[TU DOCUMENTO DE IDENTIDAD]
[Firma]

APODERADO:

[NOMBRE DEL APODERADO]
[DOCUMENTO DE IDENTIDAD]
[Firma]

TESTIGOS (opcional):

1. [NOMBRE DEL TESTIGO 1]
   Documento: [NÚMERO]
   Firma: _______________

2. [NOMBRE DEL TESTIGO 2]
   Documento: [NÚMERO]
   Firma: _______________`,

        invitacion: `${fecha}

CARTA DE INVITACIÓN

Yo, [TU NOMBRE COMPLETO], identificado/a con [TIPO Y NÚMERO DE DOCUMENTO DE IDENTIDAD], residente en [TU DIRECCIÓN COMPLETA], por medio de la presente invito formalmente a [NOMBRE DEL INVITADO], identificado/a con [TIPO Y NÚMERO DE DOCUMENTO DE IDENTIDAD DEL INVITADO], residente en [DIRECCIÓN DEL INVITADO], a visitar [PAÍS/CIUDAD] con el propósito de [MOTIVO DE LA INVITACIÓN].

Durante su estancia, el/la invitado/a se hospedará en [DIRECCIÓN DONDE SE ALOJARÁ] y permanecerá en el país desde el [FECHA DE LLEGADA] hasta el [FECHA DE SALIDA].

Me comprometo a asumir los gastos de [ESPECIFICAR GASTOS QUE CUBRIRÁS] durante su visita, así como a garantizar su retorno a su país de origen antes de la fecha indicada.

Datos del invitado:
- Nombre completo: [NOMBRE]
- Documento de identidad: [NÚMERO]
- Fecha de nacimiento: [FECHA]
- Nacionalidad: [NACIONALIDAD]
- Relación con el invitante: [PARENTESCO O RELACIÓN]

Quedo a su disposición para cualquier información adicional que requieran.

Atentamente,

[TU NOMBRE COMPLETO]
[TU DOCUMENTO DE IDENTIDAD]
[Tu dirección completa]
[Teléfono de contacto]
[Email]
[Firma]`,

        explicacion: `${fecha}

CARTA DE EXPLICACIÓN / DECLARACIÓN

A QUIEN CORRESPONDA:

Yo, [TU NOMBRE COMPLETO], identificado/a con [TIPO Y NÚMERO DE DOCUMENTO DE IDENTIDAD], por medio de la presente me dirijo a ustedes con el propósito de explicar y aclarar la siguiente situación:

[DESCRIBIR DETALLADAMENTE LA SITUACIÓN O HECHO QUE REQUIERE EXPLICACIÓN]

Los hechos ocurrieron de la siguiente manera:

[DESCRIBIR CRONOLÓGICAMENTE LOS HECHOS]

Las razones o motivos que me llevaron a [ACCION O SITUACION] fueron:

[EXPLICAR LAS RAZONES O CIRCUNSTANCIAS]

Declaro que la información proporcionada en esta carta es veraz y completa, asumiendo la responsabilidad que de ello se derive.

Estoy a su entera disposición para ampliar esta información o proporcionar documentación adicional que consideren necesaria.

Atentamente,

[TU NOMBRE COMPLETO]
[TU DOCUMENTO DE IDENTIDAD]
[Teléfono de contacto]
[Email]
[Firma]`,

        reclamo: `${fecha}

[NOMBRE DE LA EMPRESA O ENTIDAD]
[DEPARTAMENTO DE ATENCIÓN AL CLIENTE O RRHH]
[DIRECCIÓN]

Estimados señores:

Por medio de la presente, me dirijo a ustedes para expresar formalmente mi inconformidad y presentar un reclamo respecto a [DESCRIBIR EL PRODUCTO O SERVICIO DEFECTUOSO].

Detalles del reclamo:

- Fecha del incidente: [FECHA]
- Número de factura o contrato: [NÚMERO]
- Producto o servicio: [DESCRIPCIÓN]
- Lugar: [SUCURSAL, TIENDA O UBICACIÓN]

Descripción del problema:

[DESCRIBIR DETALLADAMENTE EL PROBLEMA]

He intentado resolver esta situación a través de [MENCIONAR ACCIONES PREVIAS] sin obtener una solución satisfactoria.

Por lo expuesto, solicito formalmente:

[ESPECIFICAR QUÉ SOLUCIÓN ESPERAS]

Adjunto a esta carta los siguientes documentos de respaldo:
- [DOCUMENTO 1]
- [DOCUMENTO 2]

Espero recibir una respuesta formal en un plazo no mayor a [NÚMERO] días hábiles. De no obtener una solución satisfactoria, me veré en la obligación de acudir a las autoridades competentes para hacer valer mis derechos.

Atentamente,

[TU NOMBRE COMPLETO]
[TU DOCUMENTO DE IDENTIDAD]
[Tu dirección]
[Teléfono de contacto]
[Email]
[Firma]`
    };

    textarea.placeholder = placeholders[tipo] || placeholders.trabajo;
}

// GENERAR CV
function generarCV() {
    const texto = document.getElementById('cv-texto').value.trim();
    const foto = document.getElementById('cv-foto-url').value.trim();

    if (!texto) {
        alert('❌ Por favor pega el contenido de tu CV');
        return;
    }

    currentCVData = parsearCV(texto, foto);
    renderizarCV(currentStyle);

    document.getElementById('style-selector-cv').style.display = 'block';
    document.getElementById('step-input').style.display = 'none';
    document.getElementById('step-preview').style.display = 'block';
    window.scrollTo(0, 0);
}

function parsearCV(texto, foto) {
    const lineas = texto.split('\n').map(l => l.trim()).filter(l => l);
    const datos = {
        nombre: '', titulo: '', telefono: '', email: '', ciudad: '', linkedin: '',
        perfil: '', experiencia: [], educacion: [], habilidades: '', idiomas: '', cursos: [], foto: foto
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

        for (const [key, words] of Object.entries(keywords)) {
            if (words.some(w => lineaUpper.includes(w))) {
                if (bufferExp) { datos.experiencia.push(bufferExp); bufferExp = null; }
                seccionActual = key;
                esInicioSeccion = true;
                break;
            }
        }

        if (esInicioSeccion) continue;

        if (seccionActual === 'inicio') {
            if (!datos.nombre && i === 0) datos.nombre = linea;
            else if (!datos.titulo && i === 1 && linea.length < 100) datos.titulo = linea;
            else if (linea.match(/04\d{2}-?\d{7}/) || linea.toLowerCase().includes('teléfono')) datos.telefono = linea.replace(/.*?:\s*/i, '').trim();
            else if (linea.includes('@')) datos.email = linea.replace(/.*?:\s*/i, '').trim();
            else if (linea.toLowerCase().match(/ciudad|ubicación|direccion|edo\.|estado/)) datos.ciudad = linea.replace(/.*?:\s*/i, '').trim();
            else if (linea.toLowerCase().match(/linkedin|web|portfolio/)) datos.linkedin = linea.replace(/.*?:\s*/i, '').trim();
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
    datos.habilidades = datos.habilidades.replace(/,\s*$/, '');
    datos.idiomas = datos.idiomas.replace(/,\s*$/, '');
    datos.perfil = datos.perfil.trim();

    return datos;
}

function renderizarCV(estilo) {
    let html = '';
    switch(estilo) {
        case 'moderno': html = generarCVModerno(); break;
        case 'clasico': html = generarCVClasico(); break;
        case 'creativo': html = generarCVCreativo(); break;
        case 'minimalista': html = generarCVMinimalista(); break;
        case 'profesional': html = generarCVProfesional(); break;
    }
    document.getElementById('document-preview').innerHTML = html;
}

function generarCVModerno() {
    const d = currentCVData;
    let sidebar = `<div class="cv-sidebar">`;
    if (d.foto) sidebar += `<img src="${d.foto}" style="width:150px; height:150px; border-radius:50%; object-fit:cover; margin-bottom:20px; border: 4px solid white;">`;
    sidebar += `<h2 style="margin-bottom:20px;">${d.nombre}</h2>`;
    if (d.titulo) sidebar += `<p style="font-size:1.1rem; margin-bottom:15px;">${d.titulo}</p>`;
    if (d.telefono) sidebar += `<p>📞 ${d.telefono}</p>`;
    if (d.email) sidebar += `<p>✉️ ${d.email}</p>`;
    if (d.ciudad) sidebar += `<p>📍 ${d.ciudad}</p>`;
    if (d.linkedin) sidebar += `<p> ${d.linkedin}</p>`;
    if (d.habilidades) sidebar += `<div style="margin-top:30px;"><h3 style="border-bottom:2px solid white; padding-bottom:10px; margin-bottom:15px;">Habilidades</h3><p>${d.habilidades}</p></div>`;
    if (d.idiomas) sidebar += `<div style="margin-top:20px;"><h3 style="border-bottom:2px solid white; padding-bottom:10px; margin-bottom:15px;">Idiomas</h3><p>${d.idiomas}</p></div>`;
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

function generarCVClasico() {
    const d = currentCVData;
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

function generarCVCreativo() {
    const d = currentCVData;
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

function generarCVMinimalista() {
    const d = currentCVData;
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

function generarCVProfesional() {
    const d = currentCVData;
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

function generarCarta() {
    const texto = document.getElementById('carta-texto').value.trim();
    
    if (!texto) {
        alert('❌ Por favor escribe el contenido de la carta');
        return;
    }

    let html = `<div class="carta-formal">`;
    html += `<div class="cuerpo" style="white-space: pre-line; font-family:'Times New Roman', Times, serif; font-size:12pt; line-height:1.5;">${texto}</div>`;
    html += `</div>`;

    document.getElementById('document-preview').innerHTML = html;
    document.getElementById('style-selector-cv').style.display = 'none';
    document.getElementById('step-input').style.display = 'none';
    document.getElementById('step-preview').style.display = 'block';
    window.scrollTo(0, 0);
}

function generarLegal() {
    const tipo = document.getElementById('legal-tipo').value;
    const titulo = document.getElementById('legal-titulo').value || 'Documento';
    const fecha = document.getElementById('legal-fecha').value;
    const lugar = document.getElementById('legal-lugar').value;
    const contenido = document.getElementById('legal-texto').value.trim();

    if (!contenido) {
        alert('❌ Por favor ingresa el contenido del documento');
        return;
    }

    let html = '';
    const fechaFormateada = fecha ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'}) : '';

    if (tipo === 'apa') {
        html = `<div class="apa-2">`;
        html += `<div style="text-align:center; margin-bottom:30px;"><h1 style="font-size:12pt; margin-bottom:10px;">${titulo}</h1>`;
        if (fechaFormateada) html += `<p style="font-size:12pt;">${fechaFormateada}</p>`;
        if (lugar) html += `<p style="font-size:12pt;">${lugar}</p>`;
        html += `</div>`;
        const parrafos = contenido.split('\n\n').filter(p => p.trim());
        parrafos.forEach(p => {
            html += `<p style="text-indent:1.27cm; margin-bottom:0;">${p.trim()}</p>`;
        });
        html += `</div>`;
    } else if (tipo === 'apa15') {
        html = `<div class="apa-15">`;
        html += `<div style="text-align:center; margin-bottom:30px;"><h1 style="font-size:12pt; margin-bottom:10px;">${titulo}</h1>`;
        if (fechaFormateada) html += `<p style="font-size:12pt;">${fechaFormateada}</p>`;
        if (lugar) html += `<p style="font-size:12pt;">${lugar}</p>`;
        html += `</div>`;
        const parrafos = contenido.split('\n\n').filter(p => p.trim());
        parrafos.forEach(p => {
            html += `<p style="text-indent:1.27cm; margin-bottom:0;">${p.trim()}</p>`;
        });
        html += `</div>`;
    } else if (tipo === 'legal') {
        html = `<div class="legal-doc">`;
        html += `<div class="header"><h1 style="font-size:14pt; margin-bottom:10px;">${titulo}</h1>`;
        if (fechaFormateada) html += `<p style="font-size:12pt;"><strong>Fecha:</strong> ${fechaFormateada}</p>`;
        if (lugar) html += `<p style="font-size:12pt;"><strong>Lugar:</strong> ${lugar}</p>`;
        html += `</div>`;
        const lineas = contenido.split('\n').filter(l => l.trim());
        lineas.forEach(linea => {
            const match = linea.match(/^([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+):\s*(.+)$/);
            if (match) {
                html += `<div class="dialogo" style="margin-bottom:15px;"><span class="hablante">${match[1]}:</span> ${match[2]}</div>`;
            } else {
                html += `<p style="margin-bottom:10px;">${linea}</p>`;
            }
        });
        html += `</div>`;
    } else {
        html = `<div style="font-family:'Times New Roman', serif; font-size:12pt; line-height:1.5;">`;
        html += `<h1 style="text-align:center; margin-bottom:30px;">${titulo}</h1>`;
        if (fechaFormateada) html += `<p style="text-align:center; margin-bottom:10px;"><strong>Fecha:</strong> ${fechaFormateada}</p>`;
        if (lugar) html += `<p style="text-align:center; margin-bottom:30px;"><strong>Lugar:</strong> ${lugar}</p>`;
        html += `<div style="white-space: pre-line;">${contenido}</div>`;
        html += `</div>`;
    }

    document.getElementById('document-preview').innerHTML = html;
    document.getElementById('style-selector-cv').style.display = 'none';
    document.getElementById('step-input').style.display = 'none';
    document.getElementById('step-preview').style.display = 'block';
    window.scrollTo(0, 0);
}

function cambiarEstiloCV(estilo) {
    currentStyle = estilo;
    document.querySelectorAll('.style-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderizarCV(estilo);
}

function editarDocumento() {
    document.getElementById('step-preview').style.display = 'none';
    document.getElementById('step-input').style.display = 'block';
    window.scrollTo(0, 0);
}

function nuevoDocumento() {
    if (confirm('¿Seguro que quieres crear un nuevo documento?')) {
        document.getElementById('cv-texto').value = '';
        document.getElementById('cv-foto-url').value = '';
        document.getElementById('carta-texto').value = '';
        document.getElementById('legal-texto').value = '';
        document.getElementById('legal-titulo').value = '';
        currentCVData = null;
        currentType = '';
        document.getElementById('step-preview').style.display = 'none';
        document.getElementById('step-type').style.display = 'block';
        window.scrollTo(0, 0);
    }
}

function descargarPDF() {
    window.print();
}

function descargarWord() {
    const content = document.getElementById('document-preview').innerHTML;
    const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
    <meta charset='utf-8'>
    <title>Documento</title>
    <style>
    body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; }
    </style>
    </head>
    <body>${content}</body>
    </html>
    `;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'documento.doc';
    link.click();
    URL.revokeObjectURL(url);
    alert(' Documento descargado. Ábrelo con Word para editar.');
}
