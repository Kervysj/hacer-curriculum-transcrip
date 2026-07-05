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

// ============================================
// PLANTILLAS DE CARTAS CON EJEMPLOS COMPLETOS
// ============================================
function updateCartaPlaceholder() {
    const tipo = document.getElementById('carta-tipo').value;
    const textarea = document.getElementById('carta-texto');

    const ejemplos = {
        // ============================================
        // CARTAS LABORALES
        // ============================================
        trabajo: `Ciudad de México, 15 de julio de 2025

A QUIEN CORRESPONDA:

Por medio de la presente, hago constar que (María González Ramírez), con documento de identidad (V-18.456.789), labora en (Distribuidora ABC, C.A.) desde el (15 de marzo de 2020) hasta la fecha, desempeñando el cargo de (Coordinadora de Ventas).

Durante su tiempo en la empresa, ha demostrado ser una persona responsable, cumplida y con excelente desempeño en sus funciones, destacándose por su liderazgo y compromiso con los objetivos del equipo.

Se expide la presente carta a solicitud del interesado para los fines que estime convenientes.

Atentamente,

(Carlos Mendoza)
(Gerente de Recursos Humanos)
(Distribuidora ABC, C.A.)
(Teléfono: 0212-555-1234)
(Email: rrhh@distribuidoraabc.com)`,

        renuncia: `Ciudad de México, 15 de julio de 2025

A: (Lic. Roberto Sánchez)
(Director de Recursos Humanos)
(Empresa XYZ, S.A. de C.V.)

Estimado (Lic. Sánchez):

Por medio de la presente, comunico mi decisión de renunciar voluntariamente al cargo de (Analista de Marketing Digital) que he venido desempeñando en (Empresa XYZ, S.A. de C.V.), efectiva a partir del (30 de julio de 2025).

Esta decisión responde a motivos estrictamente personales y profesionales que me impiden continuar formando parte de su equipo de trabajo.

Agradezco profundamente las oportunidades de crecimiento profesional y personal que me han brindado durante mi tiempo en la empresa, así como la confianza depositada en mi persona durante estos (3 años).

Me comprometo a realizar una transición ordenada de mis responsabilidades y dejar todos los procesos en orden antes de mi salida.

Sin más por el momento, me despido cordialmente.

Atentamente,

(Ana Lucía Fernández)
(Analista de Marketing Digital)
(V-22.345.678)
(Firma)`,

        despido: `Ciudad de México, 15 de julio de 2025

(Pedro Jiménez López)
(Técnico de Soporte)
Presente.-

Estimado (Sr. Jiménez):

Por medio de la presente, lamentamos informarle que la empresa (TechSolutions México, S.A. de C.V.) ha tomado la decisión de dar por terminado su contrato de trabajo, efectiva a partir del (31 de julio de 2025).

Esta decisión se basa en (reestructuración organizacional del departamento de soporte técnico, que ha reducido la necesidad de personal en su área).

Le informamos que se realizará el pago de sus prestaciones sociales, liquidación y demás derechos laborales que le corresponden según la legislación vigente, en la fecha (15 de agosto de 2025).

Agradecemos los servicios prestados durante su tiempo en la empresa y le deseamos éxito en sus futuros proyectos profesionales.

Atentamente,

(Lic. Patricia Morales)
(Directora de Recursos Humanos)
(TechSolutions México, S.A. de C.V.)
(Firma y sello)`,

        recomendacion: `Ciudad de México, 15 de julio de 2025

A QUIEN CORRESPONDA:

Por medio de la presente, recomiendo ampliamente a (Juan Carlos Pérez), quien laboró bajo mi supervisión en (Grupo Empresarial del Norte, S.A.) durante el período comprendido entre (enero de 2021) y (junio de 2024), desempeñando el cargo de (Supervisor de Logística).

Durante este tiempo, (Juan Carlos) demostró ser una persona altamente responsable, comprometida, proactiva y con excelentes habilidades para (la coordinación de equipos, la resolución de problemas bajo presión y la optimización de procesos de distribución).

Su desempeño fue siempre satisfactorio, cumpliendo con las metas establecidas y manteniendo una actitud positiva hacia el trabajo y sus compañeros. Fue pieza clave en la reducción de tiempos de entrega en un 25%.

No tengo inconveniente en recomendarlo para cualquier posición que desee desempeñar, ya que estoy convencido de que será un valioso aporte para cualquier organización.

Quedo a su disposición para cualquier información adicional que requieran.

Atentamente,

(Ing. Miguel Ángel Torres)
(Gerente de Operaciones)
(Grupo Empresarial del Norte, S.A.)
(Teléfono: 0212-555-9876)
(Email: mtorres@gruponorte.com)`,

        permiso: `Ciudad de México, 15 de julio de 2025

A: (Lic. Fernando Gutiérrez)
(Gerente de Área)
(Empresa Comercial del Sur, S.A.)

Estimado (Lic. Gutiérrez):

Por medio de la presente, solicito formalmente se me conceda un permiso (no remunerado) por (3) días, desde el (20 de julio de 2025) hasta el (22 de julio de 2025), por motivos de (asistencia al matrimonio de mi hermana en la ciudad de Guadalajara, Jalisco).

Me comprometo a dejar todas mis responsabilidades debidamente organizadas y delegadas en (mi compañera Laura Martínez) antes de mi ausencia, así como a reintegrarme a mis labores el día (23 de julio de 2025) en el horario habitual.

Agradezco de antemano su comprensión y atención a esta solicitud.

Atentamente,

(Ricardo Álvarez Mendoza)
(Analista Contable)
(V-19.876.543)
(Firma)`,

        // ============================================
        // CARTAS ADMINISTRATIVAS Y COMERCIALES
        // ============================================
        autorizacion: `Ciudad de México, 15 de julio de 2025

A QUIEN CORRESPONDA:

Yo, (Laura Beatriz Ramírez), identificada con (cédula de identidad V-20.123.456), por medio de la presente autorizo a (Carlos Eduardo Méndez), identificado con (cédula de identidad V-18.765.432), para que en mi nombre realice el siguiente trámite:

(Retirar el título universitario original de la Universidad Nacional Autónoma de México, correspondiente a la carrera de Licenciatura en Administración, generado en el período 2018-2022).

Esta autorización es válida desde el (15 de julio de 2025) hasta el (30 de julio de 2025) o hasta que sea revocada por escrito.

Agradezco de antemano la atención prestada a la presente.

Atentamente,

(Laura Beatriz Ramírez)
(V-20.123.456)
(Teléfono: 044-55-1234-5678)
(Firma)`,

        compromiso: `Ciudad de México, 15 de julio de 2025

CARTA DE COMPROMISO

Yo, (Roberto Sánchez Díaz), identificado con (cédula de identidad V-15.234.567), en mi calidad de (representante legal de la empresa Constructora del Valle, C.A.), por medio de la presente me comprometo formalmente a:

(Realizar el pago de la suma de $25,000.00 (veinticinco mil pesos 00/100 M.N.) correspondiente a la factura N° 4521, por concepto de materiales de construcción suministrados por la empresa Proveedores Industriales, S.A.).

Me obligo a cumplir con este compromiso en el plazo establecido, que vence el (30 de julio de 2025).

En caso de incumplimiento, acepto las consecuencias legales y/o contractuales que de ello se deriven, incluyendo el pago de intereses moratorios según lo establecido en el contrato.

Se firma la presente en (Ciudad de México), a los (15) días del mes de (julio) de (2025).

Atentamente,

(Roberto Sánchez Díaz)
(V-15.234.567)
(Representante Legal - Constructora del Valle, C.A.)
(Firma)`,

        cobro: `Ciudad de México, 15 de julio de 2025

(Distribuidora El Sol, S.A. de C.V.)
(Av. Insurgentes Sur 1234, Col. Del Valle)
(Departamento de Cuentas por Cobrar)

Estimados señores:

Por medio de la presente, nos dirigimos a ustedes para solicitar formalmente el pago de la factura número (F-2025-0456) por un monto de ($18,500.00 (dieciocho mil quinientos pesos 00/100 M.N.)), la cual se encuentra vencida desde el (30 de junio de 2025).

Detalles de la deuda:
- Factura N°: (F-2025-0456)
- Fecha de emisión: (15 de junio de 2025)
- Fecha de vencimiento: (30 de junio de 2025)
- Monto adeudado: ($18,500.00)
- Concepto: (Suministro de equipos de oficina - 10 sillas ergonómicas y 5 escritorios)

Les solicitamos realizar el pago a la mayor brevedad posible en la siguiente cuenta bancaria:
- Banco: (BBVA)
- Cuenta: (0123 4567 8901 2345)
- Titular: (Mueblería Moderna, S.A. de C.V.)

En caso de que el pago ya haya sido realizado, agradecemos nos envíen el comprobante correspondiente.

Quedamos a su disposición para cualquier consulta o aclaración.

Atentamente,

(Fernanda López Castillo)
(Gerente de Finanzas)
(Teléfono: 0212-555-4321)
(Email: cobranzas@muebleriamoderna.com)`,

        presentacion: `Ciudad de México, 15 de julio de 2025

(Lic. Andrés Martínez)
(Director de Compras)
(Grupo Comercial del Pacífico, S.A.)
(Av. Revolución 567, Col. Centro)

Estimados señores:

Me dirijo a ustedes con el propósito de presentarme formalmente y poner a su disposición mis servicios profesionales en el área de (consultoría en marketing digital y estrategias de comercio electrónico).

Soy (Diana Sofía Herrera), (Licenciada en Mercadotecnia con Maestría en Marketing Digital), con (8) años de experiencia en (el desarrollo de estrategias digitales para empresas del sector retail). A lo largo de mi trayectoria, he trabajado en (empresas como Amazon México, Liverpool y El Palacio de Hierro), donde he desarrollado habilidades en (SEO, SEM, análisis de datos y gestión de campañas publicitarias).

Ofrezco servicios de:
- (Auditoría y estrategia de marketing digital)
- (Gestión de campañas en Google Ads y Meta Ads)
- (Optimización de conversión en tiendas en línea)

Estoy convencida de que mi experiencia y competencias pueden aportar valor significativo a su organización, especialmente en su expansión al comercio electrónico. Adjunto mi currículum vitae para su consideración y quedo a su entera disposición para concertar una entrevista personal.

Agradezco de antemano su atención y tiempo.

Atentamente,

(Diana Sofía Herrera)
(Licenciada en Mercadotecnia)
(Teléfono: 044-55-9876-5432)
(Email: diana.herrera@email.com)
(LinkedIn: linkedin.com/in/dianaherrera)`,

        agradecimiento: `Ciudad de México, 15 de julio de 2025

(Lic. Patricia Vargas)
(Directora de Talento Humano)
(Banco Nacional de México)

Estimada (Lic. Vargas):

Por medio de la presente, deseo expresarle mi más sincero agradecimiento por (la oportunidad de haber formado parte del proceso de selección para el cargo de Analista Financiero Senior, así como por el tiempo y atención que usted y su equipo dedicaron a entrevistarme).

Su apoyo y disposición han sido fundamentales para (conocer más a fondo la cultura organizacional de Banco Nacional de México y reafirmar mi interés en formar parte de una institución tan prestigiosa).

Valoro profundamente (la transparencia y calidez con la que me trataron durante todo el proceso, especialmente durante la entrevista técnica del pasado 10 de julio) y espero poder corresponder a su confianza en futuras oportunidades.

Reitero mi agradecimiento y quedo a su entera disposición.

Cordialmente,

(Javier Ortega Ruiz)
(Candidato al cargo de Analista Financiero Senior)
(Teléfono: 044-55-1122-3344)
(Email: javier.ortega@email.com)`,

        // ============================================
        // CARTAS PERSONALES Y LEGALES
        // ============================================
        poder: `Ciudad de México, 15 de julio de 2025

CARTA PODER

Yo, (Elena María Castillo Rojas), identificada con (cédula de identidad V-17.654.321), en mi carácter de (propietaria del inmueble ubicado en Av. Juárez 456, Col. Centro, Ciudad de México), por medio de la presente otorgo poder especial y suficiente a (Luis Alberto Gómez Pérez), identificado con (cédula de identidad V-19.876.543), para que en mi nombre y representación realice los siguientes actos:

- (Firmar el contrato de arrendamiento del inmueble mencionado)
- (Recibir el pago del depósito y primer mes de renta)
- (Realizar el inventario y entrega del inmueble al arrendatario)
- (Firmar cualquier documento relacionado con dicho arrendamiento)

Este poder tiene vigencia desde el (15 de julio de 2025) hasta el (30 de septiembre de 2025) o hasta que sea revocado por escrito.

El apoderado deberá actuar siempre en beneficio de mis intereses y dentro de los límites establecidos en este documento.

Se firma la presente en (Ciudad de México), a los (15) días del mes de (julio) de (2025).

PODERDANTE:

(Elena María Castillo Rojas)
(V-17.654.321)
(Firma)

APODERADO:

(Luis Alberto Gómez Pérez)
(V-19.876.543)
(Firma)

TESTIGOS:

1. (María José Ramírez)
   Documento: (V-20.111.222)
   Firma: _______________

2. (Carlos Eduardo Díaz)
   Documento: (V-18.333.444)
   Firma: _______________`,

        invitacion: `Ciudad de México, 15 de julio de 2025

CARTA DE INVITACIÓN

Yo, (Roberto Carlos Mendoza), identificado con (pasaporte N° A12345678), residente en (Calle Reforma 789, Departamento 402, Col. Juárez, Ciudad de México, México), por medio de la presente invito formalmente a (Carmen Lucía Vargas), identificada con (cédula de identidad V-22.456.789), residente en (Av. Principal 123, Caracas, Venezuela), a visitar (México) con el propósito de (turismo y visita familiar, ya que es mi esposa y deseamos celebrar nuestro aniversario de bodas).

Durante su estancia, la invitada se hospedará en (mi domicilio: Calle Reforma 789, Departamento 402, Col. Juárez, Ciudad de México) y permanecerá en el país desde el (1 de agosto de 2025) hasta el (15 de agosto de 2025).

Me comprometo a asumir los gastos de (alojamiento, alimentación, transporte interno y seguro médico) durante su visita, así como a garantizar su retorno a su país de origen antes de la fecha indicada.

Datos del invitado:
- Nombre completo: (Carmen Lucía Vargas Mendoza)
- Documento de identidad: (V-22.456.789)
- Fecha de nacimiento: (15 de marzo de 1990)
- Nacionalidad: (Venezolana)
- Relación con el invitante: (Esposa)

Quedo a su disposición para cualquier información adicional que requieran.

Atentamente,

(Roberto Carlos Mendoza)
(Pasaporte N° A12345678)
(Calle Reforma 789, Departamento 402, Col. Juárez, Ciudad de México)
(Teléfono: 044-55-7788-9900)
(Email: roberto.mendoza@email.com)
(Firma)`,

        explicacion: `Ciudad de México, 15 de julio de 2025

CARTA DE EXPLICACIÓN / DECLARACIÓN

A QUIEN CORRESPONDA:

Yo, (Alejandro Jiménez Pérez), identificado con (cédula de identidad V-21.345.678), por medio de la presente me dirijo a ustedes con el propósito de explicar y aclarar la siguiente situación:

(El retraso en la entrega del proyecto "Sistema de Gestión de Inventarios" que tenía como fecha límite el 30 de junio de 2025).

Los hechos ocurrieron de la siguiente manera:

(El día 25 de junio de 2025, el servidor principal de la empresa sufrió una falla técnica inesperada que resultó en la pérdida parcial de los datos del proyecto. El departamento de TI tardó 5 días en recuperar la información, lo que imposibilitó cumplir con la fecha de entrega original).

Las razones o motivos que me llevaron a (solicitar una extensión del plazo) fueron:

(La necesidad de reconstruir parte del código perdido y realizar pruebas adicionales para garantizar la integridad del sistema. Además, se requirió la coordinación con el proveedor del servidor para implementar medidas de seguridad adicionales).

Declaro que la información proporcionada en esta carta es veraz y completa, asumiendo la responsabilidad que de ello se derive.

Estoy a su entera disposición para ampliar esta información o proporcionar documentación adicional que consideren necesaria, incluyendo el reporte técnico del departamento de TI.

Atentamente,

(Alejandro Jiménez Pérez)
(V-21.345.678)
(Teléfono: 044-55-3344-5566)
(Email: alejandro.jimenez@email.com)
(Firma)`,

        reclamo: `Ciudad de México, 15 de julio de 2025

(ElectroHogar México, S.A. de C.V.)
(Departamento de Atención al Cliente)
(Av. Universidad 2345, Col. Del Valle, Ciudad de México)

Estimados señores:

Por medio de la presente, me dirijo a ustedes para expresar formalmente mi inconformidad y presentar un reclamo respecto a (la lavadora automática modelo LH-5000 que adquirí en su sucursal del Centro Comercial Plaza Norte el día 20 de junio de 2025).

Detalles del reclamo:

- Fecha del incidente: (10 de julio de 2025)
- Número de factura: (F-2025-78945)
- Producto: (Lavadora automática ElectroHogar modelo LH-5000, color blanco, 20 kg)
- Lugar: (Sucursal Plaza Norte, Ciudad de México)

Descripción del problema:

(El producto presenta una falla en el sistema de drenaje que provoca que el agua no se evacue correctamente durante el ciclo de lavado, generando inundaciones en el área donde está instalada. Además, emite un ruido excesivo durante el centrifugado que no es normal según las especificaciones del fabricante).

He intentado resolver esta situación a través de (llamada al servicio técnico el 12 de julio y visita del técnico el 14 de julio, quien confirmó la falla pero indicó que no tenía las piezas de repuesto necesarias).

Por lo expuesto, solicito formalmente:

(El reemplazo del producto por uno nuevo en iguales condiciones, o en su defecto, la devolución total del dinero pagado por un monto de $12,500.00 (doce mil quinientos pesos 00/100 M.N.)).

Adjunto a esta carta los siguientes documentos de respaldo:
- (Factura de compra N° F-2025-78945)
- (Fotografías del producto y del daño causado)
- (Reporte del técnico visitante)

Espero recibir una respuesta formal en un plazo no mayor a (10) días hábiles. De no obtener una solución satisfactoria, me veré en la obligación de acudir a la Procuraduría Federal del Consumidor (PROFECO) para hacer valer mis derechos.

Atentamente,

(Sofía Martínez López)
(V-23.456.789)
(Calle Insurgentes 456, Departamento 301, Col. Roma Norte)
(Teléfono: 044-55-6677-8899)
(Email: sofia.martinez@email.com)
(Firma)`
    };

    textarea.value = ejemplos[tipo] || ejemplos.trabajo;
}

// ============================================
// GENERAR CV
// ============================================
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
    if (d.linkedin) sidebar += `<p>🔗 ${d.linkedin}</p>`;
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
    if (d.telefono) sidebar += `<p> ${d.telefono}</p>`;
    if (d.email) sidebar += `<p>✉️ ${d.email}</p>`;
    if (d.ciudad) sidebar += `<p> ${d.ciudad}</p>`;
    if (d.linkedin) sidebar += `<p> ${d.linkedin}</p>`;
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
