/* =========================================
   TEXTOS DE LOS FORMULARIOS EN CATALÁN E INGLÉS
   window.advT('texto en castellano') devuelve el texto en el idioma
   de la página (<html lang>). Si falta una traducción, queda en castellano.
   Se carga en el <head>, antes que el resto de scripts.
   ========================================= */
(function () {
  var lang = (document.documentElement.lang || 'es').slice(0, 2);
  var D = {
    // --- Solicitud: títulos, subtítulos y mensajes por interés
    'Automatiza tu negocio con el Sistema Advantys': ['Automatitza el teu negoci amb el Sistema Advantys', 'Automate your business with the Advantys System'],
    'Déjanos tus datos y te llamamos para entender tus procesos y proponerte por dónde empezar.': ["Deixa'ns les teves dades i et truquem per entendre els teus processos i proposar-te per on començar.", "Leave your details and we'll call you to understand your processes and suggest where to start."],
    '¿Qué procesos te gustaría automatizar? (opcional)': "Quins processos t'agradaria automatitzar? (opcional)|Which processes would you like to automate? (optional)",
    'Solicitar el Diagnóstico de Operaciones': ["Sol·licitar el Diagnòstic d'Operacions", 'Request the Operations Diagnostic'],
    'Te llamamos, comprobamos que el diagnóstico encaja con tu empresa y te enviamos el contrato para firmar.': ["Et truquem, comprovem que el diagnòstic encaixa amb la teva empresa i t'enviem el contracte per signar.", "We call you, check the diagnostic fits your company and send you the contract to sign."],
    '¿Dónde crees que se te escapa más dinero? Almacén, rutas, administración... (opcional)': ['On creus que se t’escapen més diners? Magatzem, rutes, administració... (opcional)', 'Where do you think you lose the most money? Warehouse, routes, admin... (optional)'],
    'Cuéntanos tu proyecto de IA': ["Explica'ns el teu projecte d'IA", 'Tell us about your AI project'],
    'Revisamos tu caso y te contactamos en menos de 24 h.': ['Revisem el teu cas i et contactem en menys de 24 h.', "We review your case and get back to you within 24 hours."],
    'Describe el proceso que quieres resolver con IA (opcional)': ['Descriu el procés que vols resoldre amb IA (opcional)', 'Describe the process you want to solve with AI (optional)'],
    'Solicitar información de una solución sectorial': ["Sol·licitar informació d'una solució sectorial", 'Request information about a sector solution'],
    'Déjanos tus datos y agendamos una demo personalizada de la solución.': ["Deixa'ns les teves dades i programem una demo personalitzada de la solució.", "Leave your details and we'll book a tailored demo of the solution."],
    '¿Qué te gustaría ver en la demo? (opcional)': "Què t'agradaria veure a la demo? (opcional)|What would you like to see in the demo? (optional)",
    'Quiero invertir en una spin-off de Advantys': ['Vull invertir en una spin-off d’Advantys', 'I want to invest in an Advantys spin-off'],
    'Déjanos tus datos y te enviamos el business case y las condiciones de participación.': ["Deixa'ns les teves dades i t'enviem el business case i les condicions de participació.", "Leave your details and we'll send you the business case and participation terms."],
    '¿Algo que debamos saber sobre tu perfil inversor? (opcional)': ['Alguna cosa que hàgim de saber sobre el teu perfil inversor? (opcional)', 'Anything we should know about your investor profile? (optional)'],
    'Hablemos de tu proyecto': ['Parlem del teu projecte', "Let's talk about your project"],
    'Déjanos tus datos y nuestro equipo se pondrá en contacto contigo en menos de 24h.': ["Deixa'ns les teves dades i el nostre equip es posarà en contacte amb tu en menys de 24 h.", "Leave your details and our team will contact you within 24 hours."],
    'Cuéntanos brevemente qué necesitas (opcional)': ["Explica'ns breument què necessites (opcional)", 'Tell us briefly what you need (optional)'],
    'Programa de partners': ['Programa de partners', 'Partner programme'],
    'Colabora con Advantys como integrador, consultora o prescriptor.': ['Col·labora amb Advantys com a integrador, consultora o prescriptor.', 'Work with Advantys as an integrator, consultancy or referrer.'],
    '¿En qué spin-off te interesa invertir?': ["En quina spin-off t'interessa invertir?", 'Which spin-off are you interested in?'],
    '¿Qué solución te interesa?': ["Quina solució t'interessa?", 'Which solution are you interested in?'],
    'Empresa (opcional)': ['Empresa (opcional)', 'Company (optional)'],
    'Empresa': ['Empresa', 'Company'],
    'Quiero invertir en': ['Vull invertir en', 'I want to invest in'],
    'Solicitar información': ['Sol·licitar informació', 'Request information'],
    // --- Opciones de interés (solo lo que se ve; al CRM va el texto original)
    'Automatizar marketing, ventas, posventa o gestión': ['Automatitzar màrqueting, vendes, postvenda o gestió', 'Automate marketing, sales, after-sales or admin'],
    'Diagnóstico de Operaciones': ["Diagnòstic d'Operacions", 'Operations Diagnostic'],
    'Un proyecto de IA a medida para un proceso concreto': ["Un projecte d'IA a mida per a un procés concret", 'A custom AI project for a specific process'],
    'Implantar una de nuestras soluciones sectoriales': ['Implantar una de les nostres solucions sectorials', 'Implement one of our sector solutions'],
    'Invertir en una spin-off de Advantys': ['Invertir en una spin-off d’Advantys', 'Invest in an Advantys spin-off'],
    'Ser partner o colaborador de Advantys': ["Ser partner o col·laborador d'Advantys", 'Become an Advantys partner'],
    'Otra consulta': ['Una altra consulta', 'Other enquiry'],
    // --- Errores y avisos
    'Elige una opción para continuar.': ['Tria una opció per continuar.', 'Choose an option to continue.'],
    'Selecciona una opción.': ['Selecciona una opció.', 'Select an option.'],
    'Introduce tu nombre y apellidos.': ['Escriu el teu nom i cognoms.', 'Enter your full name.'],
    'Introduce tu nombre completo.': ['Escriu el teu nom complet.', 'Enter your full name.'],
    'Introduce un email válido.': ['Escriu un correu electrònic vàlid.', 'Enter a valid email.'],
    'Introduce un teléfono válido.': ['Escriu un telèfon vàlid.', 'Enter a valid phone number.'],
    'Introduce el nombre de tu empresa.': ["Escriu el nom de la teva empresa.", 'Enter your company name.'],
    'Introduce ciudad y país.': ['Escriu ciutat i país.', 'Enter city and country.'],
    '¡Gracias! Hemos recibido tu solicitud. Te contactaremos en breve.': ['Gràcies! Hem rebut la teva sol·licitud. Et contactarem aviat.', "Thank you! We've received your request. We'll be in touch shortly."],
    '¡Gracias! Hemos recibido tu solicitud. Te contactaremos en menos de 24 h.': ['Gràcies! Hem rebut la teva sol·licitud. Et contactarem en menys de 24 h.', "Thank you! We've received your request. We'll contact you within 24 hours."],
    'Revisa los datos e inténtalo de nuevo.': ['Revisa les dades i torna-ho a provar.', 'Check your details and try again.'],
    'Ya hemos recibido tu solicitud. Nuestro equipo se pondrá en contacto contigo.': ['Ja hem rebut la teva sol·licitud. El nostre equip es posarà en contacte amb tu.', "We've already received your request. Our team will be in touch."],
    'No hemos podido enviar el formulario. Inténtalo de nuevo en unos minutos.': ["No hem pogut enviar el formulari. Torna-ho a provar d'aquí a uns minuts.", "We couldn't send the form. Please try again in a few minutes."],
    'No hemos podido enviar el formulario. Inténtalo de nuevo o escríbenos directamente.': ["No hem pogut enviar el formulari. Torna-ho a provar o escriu-nos directament.", "We couldn't send the form. Please try again or email us directly."],
    'No hemos podido enviar tu solicitud. Inténtalo de nuevo o escríbenos a soporte@advantys.ai.': ['No hem pogut enviar la teva sol·licitud. Torna-ho a provar o escriu-nos a soporte@advantys.ai.', "We couldn't send your request. Please try again or email soporte@advantys.ai."],
    // --- Curso
    'Escribe tu nombre y apellidos.': ['Escriu el teu nom i cognoms.', 'Enter your full name.'],
    'Revisa el email: así no podemos enviarte el acceso.': ["Revisa el correu: així no et podem enviar l'accés.", "Check your email: we can't send you access like this."],
    'Elige tu perfil.': ['Tria el teu perfil.', 'Choose your profile.'],
    'Elige tu sector.': ['Tria el teu sector.', 'Choose your sector.'],
    'Necesitamos que aceptes la política de privacidad.': ['Cal que acceptis la política de privacitat.', 'Please accept the privacy policy.'],
    'Enviando…': ['Enviant…', 'Sending…'],
    'Inscríbete gratis': ["Inscriu-t'hi gratis", 'Sign up for free'],
    'Inscripción completada': ['Inscripció completada', "You're signed up"],
    'Te enviaremos el acceso a {email} para que crees tu contraseña y entres al curso. Si no lo ves, revisa la carpeta de spam.': ["T'enviarem l'accés a {email} perquè creïs la contrasenya i entris al curs. Si no el veus, revisa la carpeta de correu brossa.", "We'll send access to {email} so you can create your password and start the course. If you can't see it, check your spam folder."],
    'No hemos podido enviar la inscripción. Inténtalo de nuevo en unos minutos o escríbenos a contacto@advantys.ai.': ["No hem pogut enviar la inscripció. Torna-ho a provar d'aquí a uns minuts o escriu-nos a contacto@advantys.ai.", "We couldn't send your sign-up. Please try again in a few minutes or email contacto@advantys.ai."],
    // --- Autodiagnóstico
    'Flujo de trabajo': ['Flux de treball', 'Workflow'],
    'Datos y decisiones': ['Dades i decisions', 'Data and decisions'],
    'Personas y dependencias': ['Persones i dependències', 'People and dependencies'],
    'Sistemas': ['Sistemes', 'Systems'],
    'Cliente y cobro': ['Client i cobrament', 'Customer and billing'],
    'Operación sana': ['Operació sana', 'Healthy operation'],
    'Tu empresa funciona con orden': ['La teva empresa funciona amb ordre', 'Your company runs in good order'],
    'Hay pocas señales de pérdida. Lo más rentable ahora es atacar la mejora que más se repite cada día: pequeña, medible y con retorno rápido.': ["Hi ha pocs senyals de pèrdua. El més rendible ara és atacar la millora que més es repeteix cada dia: petita, mesurable i amb retorn ràpid.", 'There are few signs of loss. The best move now is the improvement that repeats most every day: small, measurable and quick to pay back.'],
    'Pérdidas silenciosas': ['Pèrdues silencioses', 'Silent losses'],
    'Es el resultado más habitual': ['És el resultat més habitual', 'This is the most common result'],
    'Varias fricciones del día a día probablemente te cuestan miles de euros al año sin aparecer en ningún informe. Merece la pena medirlas antes de comprar ninguna herramienta.': ["Diverses friccions del dia a dia probablement et costen milers d'euros l'any sense aparèixer en cap informe. Val la pena mesurar-les abans de comprar cap eina.", "Several day-to-day frictions probably cost you thousands of euros a year without showing up in any report. Measure them before you buy any tool."],
    'Crecer te está saliendo caro': ["Créixer t'està sortint car", 'Growth is costing you'],
    'Tu operación depende demasiado de personas, hojas de cálculo y papel': ['La teva operació depèn massa de persones, fulls de càlcul i paper', 'Your operation relies too much on people, spreadsheets and paper'],
    'Cada pedido nuevo añade trabajo manual. Antes de crecer más, conviene ordenar los procesos que más se repiten y decidir qué automatizar primero.': ['Cada comanda nova afegeix feina manual. Abans de créixer més, convé ordenar els processos que més es repeteixen i decidir què automatitzar primer.', 'Every new order adds manual work. Before growing further, tidy up the processes that repeat most and decide what to automate first.'],
    '{n} de {t} respondidas': ['{n} de {t} respostes', '{n} of {t} answered'],
    'Escribe el nombre de tu empresa.': ["Escriu el nom de la teva empresa.", 'Enter your company name.'],
    'Revisa el email.': ['Revisa el correu.', 'Check your email.'],
    'Enviarme el resultado': ["Envia'm el resultat", 'Send me my result'],
    'Enviado': ['Enviat', 'Sent'],
    'Te escribiremos a {email} con tu resultado. Mientras, aquí tienes la versión en PDF para hacerlo con tu equipo.': ["T'escriurem a {email} amb el resultat. Mentrestant, aquí tens la versió en PDF per fer-lo amb el teu equip.", "We'll email your result to {email}. Meanwhile, here is the PDF version to go through with your team."],
    'Descargar el autodiagnóstico en PDF': ["Descarregar l'autodiagnòstic en PDF", 'Download the self-assessment (PDF, Spanish)'],
    'No hemos podido enviarlo. Inténtalo de nuevo en unos minutos o escríbenos a contacto@advantys.ai.': ["No l'hem pogut enviar. Torna-ho a provar d'aquí a uns minuts o escriu-nos a contacto@advantys.ai.", "We couldn't send it. Please try again in a few minutes or email contacto@advantys.ai."],
    // --- Cookies
    'Preferencias de cookies': ['Preferències de galetes', 'Cookie preferences'],
    'Usamos cookies': ['Fem servir galetes', 'We use cookies'],
    'Las técnicas son necesarias para que el sitio funcione. Las analíticas nos ayudan a entender cómo se usa la web y solo se activan si las aceptas. Más detalle en la': ["Les tècniques són necessàries perquè el lloc funcioni. Les analítiques ens ajuden a entendre com es fa servir el web i només s'activen si les acceptes. Més detall a la", 'Technical cookies are needed for the site to work. Analytics cookies help us understand how the site is used and are only set if you accept them. More detail in the'],
    'Política de Cookies': ['Política de galetes', 'Cookie Policy'],
    'Solo necesarias': ['Només les necessàries', 'Necessary only'],
    'Aceptar': ['Acceptar', 'Accept'],
  };
  var I = { ca: 0, en: 1 };
  window.advLang = lang;
  window.advT = function (s, vars) {
    var out = s;
    if (lang !== 'es' && D[s] !== undefined) {
      var v = D[s];
      if (typeof v === 'string') v = v.split('|');
      out = v[I[lang]] || s;
    }
    if (vars) Object.keys(vars).forEach(function (k) { out = out.split('{' + k + '}').join(vars[k]); });
    return out;
  };
  // Rutas equivalentes entre idiomas (para enlaces generados por script)
  window.advRuta = function (ruta) {
    var R = window.ADV_RUTAS || {};
    return (R[lang] && R[lang][ruta]) || ruta;
  };
})();
