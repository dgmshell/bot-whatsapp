import {
    makeWASocket,
    useMultiFileAuthState,
    Browsers,
    DisconnectReason
} from "baileys";
import { Manager } from './Flow/Manager.js';
import PINO from "pino";
import qrcode from "qrcode-terminal"; // ← Importa para mostrar el QR
// import "./Conversations/index.js";

// class BaileyClient {
//     constructor() {
//         this.DIR_SESSION = `Sessions/auth`;
//     }
//
//     listenMessages = async ({ messages }) => {
//         const messageCtx = messages[0];
//         const remoteJid = messageCtx.key.remoteJid;
//         const fromMe = messageCtx.key.fromMe;
//         let messageBody = messageCtx?.message?.extendedTextMessage?.text ?? messageCtx?.message?.conversation;
//
//         if (fromMe || messageBody === "" || !messageBody) return;
//
//         console.log('opened connection');
//         console.log({
//             remoteJid,
//             fromMe,
//             messageBody,
//             messageCtx
//         });
//     }
//
//     async connect() {
//         try {
//             const { state, saveCreds } = await useMultiFileAuthState(this.DIR_SESSION);
//             this.client = makeWASocket({
//                 auth: state,
//                 browser: Browsers.windows("Desktop"),
//                 syncFullHistory: false,
//                 logger: PINO({ level: "error" }),
//             });
//
//             this.client.ev.on("creds.update", saveCreds);
//             this.client.ev.on("connection.update", this.handleConnectionUpdate);
//         } catch (error) {
//             console.log("Ha ocurrido un error", error);
//         }
//     }
//
//     handleConnectionUpdate = async (update) => {
//         try {
//             const { connection, lastDisconnect, qr } = update;
//             const statusCode = lastDisconnect?.error?.output?.statusCode;
//
//             // ✅ Mostrar QR manualmente si existe
//             if (qr) {
//                 qrcode.generate(qr, { small: true });
//             }
//
//             if (connection === "close") {
//                 if (statusCode !== DisconnectReason.loggedOut) {
//                     await this.connect();
//                 }
//
//                 if (statusCode === DisconnectReason.loggedOut) {
//                     console.log("Reiniciar bailey");
//                     await this.connect();
//                 }
//             }
//
//             if (connection === "open") {
//                 console.log("Bailey conectado...");
//
//             }
//         } catch (error) {
//             console.log("Ha ocurrido un error, reinicie o verifique su conexión a internet");
//         }
//     }
// }
//
// // Crear una instancia de BaileyClient
// const bailey = new BaileyClient();

// Manager.getInstance().attach(this.client);
// Inicializar la conexión
// bailey.connect().then(() => {});
// const dbName = ctx.useMemo(ctx.phoneNumber, 'name');
// const dbPhone = ctx.useMemo(ctx.phoneNumber, 'phone');
// // Insertar en Supabase
// const { data, error } = await supabase
//     .from('whatsapp')
//     .insert([
//         {
//             userName: dbName,
//             userPhone: dbPhone
//         }
//     ])
//     .select();
//
// if (error) {
//     console.error('Error insertando en Supabase:', error);
// } else {
//     console.log('Insertado en Supabase:', data);
// }

/**
 * Motor de flujo muy pequeño en memoria.
 * Cada chat (remoteJid) obtiene su propia máquina de estados para que muchos
 * usuarios puedan rellenar el formulario al mismo tiempo sin interferirse.
 */

// #### START1
// class FormFlow {
//     /**
//      * Lista ordenada de preguntas a realizar.
//      * Cada entrada posee un `field` (clave) y la `question` (pregunta a enviar).
//      */
//     static STEPS = [
//         { field: "fullName", question: "¿Cuál es tu nombre completo?" },
//         { field: "age", question: "¿Cuál es tu edad?" },
//         { field: "email", question: "¿Cuál es tu correo electrónico?" },
//         { field: "phone", question: "¿Cuál es tu número de teléfono?" },
//     ];
//
//     constructor(remoteJid) {
//         this.remoteJid = remoteJid;
//         this.stepIndex = 0; // Posición actual en STEPS
//         this.answers = {};
//         this.finished = false;
//     }
//
//     /** Devuelve la pregunta pendiente actual */
//     get currentQuestion() {
//         return FormFlow.STEPS[this.stepIndex]?.question;
//     }
//
//     /**
//      * Procesa un mensaje entrante del usuario.
//      * Devuelve una cadena para enviar como respuesta o `null` si no hay nada que enviar.
//      * Cuando el flujo termina devuelve el resumen y marca el flujo como finalizado.
//      */
//     handleIncoming(text) {
//         // Si es la primera interacción ignoramos el trigger "hola"
//         if (this.stepIndex === 0 && !this.answers[FormFlow.STEPS[0].field]) {
//             return null;
//         }
//
//         // Guardar la respuesta a la pregunta previa
//         const prevField = FormFlow.STEPS[this.stepIndex - 1].field;
//         this.answers[prevField] = text.trim();
//
//         // Avanzar al siguiente paso
//         if (this.stepIndex < FormFlow.STEPS.length) {
//             const step = FormFlow.STEPS[this.stepIndex];
//             this.stepIndex += 1;
//             return step.question;
//         }
//
//         // Todas las preguntas respondidas -> crear resumen
//         this.finished = true;
//         return this.buildSummary();
//     }
//
//     isFinished() {
//         return this.finished;
//     }
//
//     buildSummary() {
//         return (
//             "✅ ¡Gracias por completar el formulario! Aquí están tus datos:\n" +
//             `• Nombre: ${this.answers.fullName}\n` +
//             `• Edad: ${this.answers.age}\n` +
//             `• Correo: ${this.answers.email}\n` +
//             `• Teléfono: ${this.answers.phone}\n\n` +
//             "En breve uno de nuestros agentes se pondrá en contacto contigo. ¡Que tengas un excelente día!"
//         );
//     }
// }
//
// export default class BaileyClient {
//     constructor() {
//         // Carpeta donde se guardarán las credenciales
//         this.DIR_SESSION = `Sessions/auth`;
//         /**
//          * Mapa remoteJid → instancia de FormFlow
//          * Permite varios flujos concurrentes (uno por usuario/chat).
//          */
//         this.flows = new Map();
//     }
//
//     /**
//      * Callback principal que procesa los mensajes entrantes.
//      */
//     listenMessages = async ({ messages }) => {
//         const messageCtx = messages?.[0];
//         if (!messageCtx) return;
//
//         const { remoteJid } = messageCtx.key;
//         const fromMe = messageCtx.key.fromMe;
//         const messageBody =
//             messageCtx.message?.extendedTextMessage?.text ??
//             messageCtx.message?.conversation ??
//             "";
//
//         if (fromMe || !messageBody.trim()) return;
//
//         const text = messageBody.trim();
//
//         // Verificamos si ya existe un flujo para este chat
//         let flow = this.flows.get(remoteJid);
//
//         // Palabra gatillo: crea un flujo si aún no existe
//         if (!flow && text.toLowerCase() === "hola") {
//             flow = new FormFlow(remoteJid);
//             this.flows.set(remoteJid, flow);
//             await this.sendMessage(remoteJid, {
//                 text:
//                     "¡Hola! Para poder ayudarte, necesito algunos datos. " +
//                     FormFlow.STEPS[0].question,
//             });
//             flow.stepIndex = 1; // Ya enviamos la primera pregunta
//             return;
//         }
//
//         // Si el flujo existe, delegamos el procesamiento
//         if (flow) {
//             const response = flow.handleIncoming(text);
//             if (response) {
//                 await this.sendMessage(remoteJid, { text: response });
//             }
//
//             // Limpiar si finalizó
//             if (flow.isFinished()) {
//                 this.flows.delete(remoteJid);
//             }
//             return;
//         }
//
//         // Respuesta por defecto si no hay flujo
//         await this.sendMessage(remoteJid, {
//             text:
//                 "🤖 Escribe *hola* para iniciar el proceso de registro y recibir asistencia personalizada.",
//         });
//     };
//
//     /**
//      * Envía un mensaje mostrando primero el indicador de "escribiendo…".
//      */
//     async sendMessage(jid, content) {
//         try {
//             // Suscribirse a presencia y mostrar "escribiendo"
//             await this.client.presenceSubscribe(jid);
//             await this.client.sendPresenceUpdate("composing", jid);
//
//             // Pequeña pausa para que el usuario perciba el indicador
//             await new Promise((r) => setTimeout(r, 600));
//
//             await this.client.sendMessage(jid, content);
//
//             // Cambiar a "pausado"
//             await this.client.sendPresenceUpdate("paused", jid);
//         } catch (err) {
//             console.error("Error enviando mensaje", err);
//         }
//     }
//
//     /**
//      * Conexión inicial a WhatsApp.
//      */
//     async connect() {
//         try {
//             const { state, saveCreds } = await useMultiFileAuthState(
//                 this.DIR_SESSION
//             );
//             this.client = makeWASocket({
//                 auth: state,
//                 browser: Browsers.windows("Desktop"),
//                 syncFullHistory: false,
//                 logger: PINO({ level: "error" }),
//             });
//
//             // Registrar eventos
//             this.client.ev.on("creds.update", saveCreds);
//             this.client.ev.on("connection.update", this.handleConnectionUpdate);
//             this.client.ev.on("messages.upsert", this.listenMessages);
//         } catch (error) {
//             console.log("Ha ocurrido un error", error);
//         }
//     }
//
//     /**
//      * Maneja cambios de estado de la conexión.
//      */
//     handleConnectionUpdate = async (update) => {
//         try {
//             const { connection, lastDisconnect, qr } = update;
//             const statusCode = lastDisconnect?.error?.output?.statusCode;
//
//             // Mostrar el QR en consola si aparece
//             if (qr) qrcode.generate(qr, { small: true });
//
//             if (connection === "close") {
//                 if (statusCode !== DisconnectReason.loggedOut) {
//                     await this.connect();
//                 }
//
//                 if (statusCode === DisconnectReason.loggedOut) {
//                     console.log("Sesión cerrada, reiniciando Bailey…");
//                     await this.connect();
//                 }
//             }
//
//             if (connection === "open") {
//                 console.log("Bailey conectado…");
//             }
//         } catch (error) {
//             console.log(
//                 "Ha ocurrido un error, reinicie o verifique su conexión a internet"
//             );
//         }
//     };
// }
//
// // Crear la instancia y conectar
// const bailey = new BaileyClient();
// bailey.connect();

// START2

// /**
//  * Motor de flujo simple (en memoria) que guía al usuario por un formulario.
//  * Cada chat (remoteJid) tiene su propia instancia ⇒ contexto individual.
//  */
// class FormFlow {
//     /**
//      * Pasos del formulario.
//      * `question` puede ser un string o una función que reciba las respuestas
//      * actuales y devuelva el texto a mostrar, permitiendo personalización.
//      */
//     static STEPS = [
//         {
//             field: "fullName",
//             question: "¿Cuál es tu nombre completo?",
//         },
//         {
//             field: "idNumber",
//             question: (answers) =>
//                 `¡Gracias ${answers.fullName?.split(" ")[0] || ""}! ¿Cuál es tu número de identificación?`,
//         },
//         {
//             field: "email",
//             question: (answers) =>
//                 `Perfecto, ${answers.fullName?.split(" ")[0] || ""}. ¿Cuál es tu correo electrónico?`,
//         },
//     ];
//
//     constructor(remoteJid) {
//         this.remoteJid = remoteJid;
//         this.stepIndex = 0; // Índice del paso actual
//         this.answers = {};
//         this.finished = false;
//     }
//
//     /** Genera la pregunta correspondiente al paso actual */
//     get currentQuestion() {
//         const step = FormFlow.STEPS[this.stepIndex];
//         if (!step) return null;
//         return typeof step.question === "function"
//             ? step.question(this.answers)
//             : step.question;
//     }
//
//     /** Procesa texto entrante y decide la siguiente respuesta */
//     handleIncoming(text) {
//         // Si es la primera interacción (se activó con «hola») no guardamos nada
//         if (this.stepIndex === 0 && !this.answers[FormFlow.STEPS[0].field]) {
//             return null;
//         }
//
//         // Almacenar la respuesta al paso anterior
//         const prevField = FormFlow.STEPS[this.stepIndex - 1].field;
//         this.answers[prevField] = text.trim();
//
//         // Avanzar
//         if (this.stepIndex < FormFlow.STEPS.length) {
//             const question = this.currentQuestion;
//             this.stepIndex += 1;
//             return question;
//         }
//
//         // Formulario finalizado
//         this.finished = true;
//         return this.buildSummary();
//     }
//
//     isFinished() {
//         return this.finished;
//     }
//
//     /** Construye un resumen amigable */
//     buildSummary() {
//         return (
//             "✅ ¡Formulario completado! Estos son tus datos:\n" +
//             `• Nombre: ${this.answers.fullName}\n` +
//             `• ID: ${this.answers.idNumber}\n` +
//             `• Correo: ${this.answers.email}\n\n` +
//             "¡Muchas gracias por la información! Nos pondremos en contacto pronto."
//         );
//     }
// }
//
// export default class BaileyClient {
//     constructor() {
//         this.DIR_SESSION = `Sessions/auth`;
//         /** Mapa remoteJid → FormFlow */
//         this.flows = new Map();
//     }
//
//     /** Procesa mensajes entrantes */
//     listenMessages = async ({ messages }) => {
//         const messageCtx = messages?.[0];
//         if (!messageCtx) return;
//
//         const { remoteJid } = messageCtx.key;
//         const fromMe = messageCtx.key.fromMe;
//         const body =
//             messageCtx.message?.extendedTextMessage?.text ??
//             messageCtx.message?.conversation ??
//             "";
//
//         if (fromMe || !body.trim()) return;
//
//         const text = body.trim();
//
//         // Verificar flujo activo
//         let flow = this.flows.get(remoteJid);
//
//         // Detectar disparador "hola" (con posible nombre)
//         if (!flow && text.toLowerCase().startsWith("hola")) {
//             flow = new FormFlow(remoteJid);
//
//             // Si el usuario escribió "hola Juan" capturamos el nombre
//             const maybeName = text.slice(4).trim();
//             if (maybeName) {
//                 flow.answers.fullName = maybeName;
//                 flow.stepIndex = 1; // Ya tenemos la respuesta del paso 0
//             }
//
//             this.flows.set(remoteJid, flow);
//
//             await this.sendMessage(remoteJid, {
//                 text:
//                     `¡Hola ${maybeName || ""}! ` +
//                     (flow.stepIndex === 1
//                         ? flow.currentQuestion // pedimos ID directo
//                         : FormFlow.STEPS[0].question),
//             });
//             if (flow.stepIndex === 0) flow.stepIndex = 1; // si preguntamos nombre
//             else flow.stepIndex = 2; // saltamos al paso de email
//             return;
//         }
//
//         // Si existe flujo, procesar
//         if (flow) {
//             const response = flow.handleIncoming(text);
//             if (response) await this.sendMessage(remoteJid, { text: response });
//             if (flow.isFinished()) this.flows.delete(remoteJid);
//             return;
//         }
//
//         // Sin flujo ni disparador
//         await this.sendMessage(remoteJid, {
//             text: "🤖 Escribe *hola* para iniciar el registro.",
//         });
//     };
//
//     /** Envía mensaje mostrando indicador "escribiendo" */
//     async sendMessage(jid, content) {
//         try {
//             await this.client.presenceSubscribe(jid);
//             await this.client.sendPresenceUpdate("composing", jid);
//             await new Promise((r) => setTimeout(r, 5000));
//             await this.client.sendMessage(jid, content);
//             await this.client.sendPresenceUpdate("paused", jid);
//         } catch (e) {
//             console.error("Error enviando mensaje", e);
//         }
//     }
//
//     /** Conecta a WhatsApp */
//     async connect() {
//         try {
//             const { state, saveCreds } = await useMultiFileAuthState(this.DIR_SESSION);
//             this.client = makeWASocket({
//                 auth: state,
//                 browser: Browsers.windows("Desktop"),
//                 syncFullHistory: false,
//                 logger: PINO({ level: "error" }),
//             });
//             this.client.ev.on("creds.update", saveCreds);
//             this.client.ev.on("connection.update", this.handleConnectionUpdate);
//             this.client.ev.on("messages.upsert", this.listenMessages);
//         } catch (err) {
//             console.log("Error en conexión", err);
//         }
//     }
//
//     /** Maneja actualizaciones de conexión */
//     handleConnectionUpdate = async (update) => {
//         try {
//             const { connection, lastDisconnect, qr } = update;
//             const code = lastDisconnect?.error?.output?.statusCode;
//             if (qr) qrcode.generate(qr, { small: true });
//             if (connection === "close") {
//                 if (code !== DisconnectReason.loggedOut) await this.connect();
//                 else await this.connect();
//             }
//             if (connection === "open") console.log("Bailey conectado…");
//         } catch {
//             console.log("Problema de conexión: verifique su red o reinicie.");
//         }
//     };
// }
//
// // Crear instancia y conectar
// const bailey = new BaileyClient();
// bailey.connect();

// START3 ADAPTANDO LO DE CARLOS FLOW
// /*************************************************
//  *  MINI‐MOTOR DE FLUJOS (100 % en memoria)      *
//  *  Inspirado en `bot-whatsapp`, sin dependencias*
//  *************************************************/
//
// /******************** Answer *********************/
// export class Answer {
//     /** Si el controlador debe esperar una respuesta nueva */
//     waitForAnswer = false;
//     /**
//      * @param {object} ctx  - utilidades (reply, body, delayWithPresence…)
//      * @param {object} memo - objeto donde puedes leer/escribir datos del usuario
//      */
//     async handler(/* ctx, memo */) {
//         throw new Error("Debes implementar handler(ctx, memo)");
//     }
// }
//
// /********************* Flow **********************/
// export class Flow {
//     constructor() {
//         this.keyboards = [];   // disparadores de inicio
//         this.steps = [];       // textos o Answers
//         this.nextFlow = null;  // referencia a otro Flow
//         this.name = "anon";
//     }
//     addKeyboard(def) {
//         if (Array.isArray(def)) {
//             this.keyboards.push({ key: def, mode: "includes", sensitive: false });
//         } else {
//             this.keyboards.push({
//                 key: def.key,
//                 mode: def.mode || "includes",
//                 sensitive: def.sensitive ?? false,
//             });
//         }
//         return this;
//     }
//     addAnswer(step) {
//         this.steps.push(step);
//         return this;
//     }
//     setNextFlow(flowDef) {
//         this.nextFlow = flowDef;
//         return this;
//     }
//     setName(name) {
//         this.name = name;
//         return this;
//     }
//     /** true si `text` coincide con el disparador */
//     matches(text) {
//         const txt = text ?? "";
//         return this.keyboards.some((cfg) =>
//             cfg.key.some((k) => {
//                 const candidate = cfg.sensitive ? txt : txt.toLowerCase();
//                 const trigger = cfg.sensitive ? k : k.toLowerCase();
//                 return cfg.mode === "equals" ? candidate === trigger : candidate.includes(trigger);
//             }),
//         );
//     }
//     createSession() {
//         return new FlowSession(this);
//     }
// }
//
// /***************** FlowSession *******************/
// class FlowSession {
//     constructor(definition) {
//         this.def = definition;
//         this.stepIndex = 0;
//         this.memo = {}; // almacena datos capturados
//     }
//     get finished() {
//         return this.stepIndex >= this.def.steps.length;
//     }
//     /** Maneja el mensaje y avanza */
//     async handleMessage(ctx) {
//         if (this.finished) return { done: true };
//
//         const step = this.def.steps[this.stepIndex];
//
//         // Texto simple → se envía y se avanza
//         if (typeof step === "string") {
//             await ctx.reply(step);
//             this.stepIndex += 1;
//             return { done: false, wait: true };
//         }
//
//         // Answer (clase o instancia)
//         if (step.prototype instanceof Answer || step instanceof Answer) {
//             const instance = step.prototype instanceof Answer ? new step() : step;
//             await instance.handler(ctx, this.memo);
//             this.stepIndex += 1;
//             if (instance.waitForAnswer) return { done: false, wait: true };
//             return await this.handleMessage(ctx); // encadenar si no espera
//         }
//
//         throw new Error("Paso no soportado");
//     }
// }
//
// /**************** Flujos & Answers ***************/
// // 1️⃣ Guardar nombre
// export class GuardarNombre extends Answer {
//     waitForAnswer = true;
//     async handler(ctx, memo) {
//         memo.name = ctx.body.trim();
//         await ctx.delayWithPresence("composing", 1);
//         await ctx.reply(`¡Encantado, ${memo.name}! ` +
//             "¿Cuál es tu número de identificación?");
//     }
// }
//
// // 2️⃣ Guardar ID con validación numérica
// export class GuardarID extends Answer {
//     waitForAnswer = true;
//     async handler(ctx, memo) {
//         const id = ctx.body.replace(/\D/g, "");
//         if (!id) {
//             return ctx.reply("Solo dígitos, por favor. Intenta de nuevo:");
//         }
//         memo.id = id;
//         await ctx.reply("ID registrado ✅. Ahora tu correo electrónico:");
//     }
// }
//
// // 3️⃣ Guardar correo con validación
// export class GuardarEmail extends Answer {
//     waitForAnswer = true;
//     async handler(ctx, memo) {
//         const email = ctx.body.trim();
//         const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//         if (!ok) return ctx.reply("Formato de correo inválido. Prueba otra vez:");
//         memo.email = email;
//
//         // Resumen
//         await ctx.reply(
//             "✅ Formulario completado:\n" +
//             `• Nombre: ${memo.name}\n` +
//             `• ID: ${memo.id}\n` +
//             `• Correo: ${memo.email}`,
//         );
//     }
// }
//
// // Menú principal después de registro
// export const MenuFlow = new Flow()
//     .addKeyboard(["menu", "1", "2"])
//     .addAnswer("*1* Información\n*2* Ayuda")
//     .addAnswer(
//         class ResponderMenu extends Answer {
//             waitForAnswer = true;
//             async handler(ctx) {
//                 if (ctx.body === "1") return ctx.reply("Aquí la información…");
//                 if (ctx.body === "2") return ctx.reply("Aquí la ayuda…");
//                 return ctx.reply("Opción no válida. Escribe 1 o 2.");
//             }
//         },
//     )
//     .setName("Menú");
//
// // Flujo de registro (después de saludo)
// export const RegistroFlow = new Flow()
//     .addAnswer("Por favor, dinos tu nombre:")
//     .addAnswer(GuardarNombre)
//     .addAnswer(GuardarID)
//     .addAnswer(GuardarEmail)
//     .setNextFlow(MenuFlow)
//     .setName("Registro");
//
// // Flujo de saludo inicial
// export const FlowSaludo = new Flow()
//     .addKeyboard(["hola", "hello", "que onda", "weee", "sup", "whats doing"])
//     .addAnswer("¡Hola! Soy tu asistente virtual 🤖. Escribe cualquier cosa para empezar.")
//     .setNextFlow(RegistroFlow)
//     .setName("Saludo");
//
// /******************  CTX utils  *******************/
// function createCtx(client, messageCtx, sessionMap) {
//     const remoteJid = messageCtx.key.remoteJid;
//     const body =
//         messageCtx.message?.extendedTextMessage?.text ?? messageCtx.message?.conversation ?? "";
//
//     return {
//         body,
//         reply: (text) => client.sendMessage(remoteJid, { text }),
//         delayWithPresence: async (type, sec) => {
//             await client.presenceSubscribe(remoteJid);
//             await client.sendPresenceUpdate(type, remoteJid);
//             await new Promise((r) => setTimeout(r, sec * 9000));
//             await client.sendPresenceUpdate("paused", remoteJid);
//         },
//     };
// }
//
// /**************** BaileyClient *******************/
// export default class BaileyClient {
//     constructor() {
//         this.DIR_SESSION = `Sessions/auth`;
//         /** Map<remoteJid, FlowSession> */
//         this.sessions = new Map();
//         this.rootFlows = [FlowSaludo];
//     }
//
//     /** Listener mensajes */
//     listenMessages = async ({ messages }) => {
//         const msg = messages?.[0];
//         if (!msg) return;
//         if (msg.key.fromMe) return; // ignorar propios
//
//         const jid = msg.key.remoteJid;
//         const ctx = createCtx(this.client, msg, this.sessions);
//
//         // Recuperar sesión o crear según disparador
//         let session = this.sessions.get(jid);
//         if (!session) {
//             const def = this.rootFlows.find((f) => f.matches(ctx.body.trim()));
//             if (!def) {
//                 await ctx.reply("🤖 Escribe *hola* para iniciar.");
//                 return;
//             }
//             session = def.createSession();
//             this.sessions.set(jid, session);
//         }
//
//         // Delegar al flujo
//         const res = await session.handleMessage(ctx);
//
//         // Si terminó, saltar a nextFlow o limpiar
//         if (res.done) {
//             const next = session.def.nextFlow;
//             if (next) {
//                 const nextSession = next.createSession();
//                 this.sessions.set(jid, nextSession);
//                 await nextSession.handleMessage(ctx);
//             } else {
//                 this.sessions.delete(jid);
//             }
//         }
//     };
//
//     /** Conectarse a WhatsApp */
//     async connect() {
//         const { state, saveCreds } = await useMultiFileAuthState(this.DIR_SESSION);
//         this.client = makeWASocket({
//             auth: state,
//             browser: Browsers.windows("Desktop"),
//             syncFullHistory: false,
//             logger: PINO({ level: "error" }),
//         });
//         this.client.ev.on("creds.update", saveCreds);
//         this.client.ev.on("connection.update", this.handleConnectionUpdate);
//         this.client.ev.on("messages.upsert", this.listenMessages);
//     }
//
//     handleConnectionUpdate = async (u) => {
//         const { connection, lastDisconnect, qr } = u;
//         const code = lastDisconnect?.error?.output?.statusCode;
//         if (qr) qrcode.generate(qr, { small: true });
//         if (connection === "close") {
//             if (code !== DisconnectReason.loggedOut) await this.connect();
//             else await this.connect();
//         }
//         if (connection === "open") console.log("✅ Bailey conectado");
//     };
// }
//
// // Iniciar bot
// const bot = new BaileyClient();
// bot.connect();

// # START4 PERMITE MOVERSE DE UN FLOW A OTRO

// /*************************************************
//  *  MOTOR DE FLUJOS – 100 % EN MEMORIA           *
//  *  Inspirado en bot‑whatsapp, pero sin librerías *
//  *************************************************/
//
// /******************** Answer *********************/
// export class Answer {
//     /** Si la subclase debe esperar la siguiente entrada */
//     waitForAnswer = false;
//     /**
//      * @param {object} ctx  Helpers (reply, body, switchTo, …)
//      * @param {object} memo Datos del usuario dentro del flujo
//      */
//     async handler(/* ctx, memo */) {
//         throw new Error("Debes implementar handler(ctx, memo)");
//     }
// }
//
// /********************* Flow **********************/
// export class Flow {
//     constructor() {
//         this.keyboards = [];  // disparadores
//         this.steps = [];      // textos o Answer
//         this.nextFlow = null; // salto fijo opcional
//         this.name = "anon";
//     }
//     addKeyboard(def) {
//         if (Array.isArray(def)) {
//             this.keyboards.push({ key: def, mode: "includes", sensitive: false });
//         } else {
//             this.keyboards.push({
//                 key: def.key,
//                 mode: def.mode || "includes",
//                 sensitive: def.sensitive ?? false,
//             });
//         }
//         return this;
//     }
//     addAnswer(step) { this.steps.push(step); return this; }
//     setNextFlow(f) { this.nextFlow = f; return this; }
//     setName(n) { this.name = n; return this; }
//     matches(txt="") {
//         return this.keyboards.some((cfg) =>
//             cfg.key.some((k) => {
//                 const c = cfg.sensitive ? txt : txt.toLowerCase();
//                 const t = cfg.sensitive ? k : k.toLowerCase();
//                 return cfg.mode === "equals" ? c === t : c.includes(t);
//             }),
//         );
//     }
//     createSession() { return new FlowSession(this); }
// }
//
// /***************** FlowSession *******************/
// class FlowSession {
//     constructor(def) { this.def = def; this.stepIndex = 0; this.memo = {}; }
//     get finished() { return this.stepIndex >= this.def.steps.length; }
//     async handleMessage(ctx) {
//         if (this.finished) return { done: true };
//         const step = this.def.steps[this.stepIndex];
//
//         // Paso: texto plano
//         if (typeof step === "string") {
//             await ctx.reply(step);
//             this.stepIndex += 1;
//             return { done: false, wait: true };
//         }
//
//         // Paso: Answer class / instance
//         if (step.prototype instanceof Answer || step instanceof Answer) {
//             const inst = step.prototype instanceof Answer ? new step() : step;
//             await inst.handler(ctx, this.memo);
//             this.stepIndex += 1;
//             if (inst.waitForAnswer) return { done: false, wait: true };
//             return await this.handleMessage(ctx);
//         }
//         throw new Error("Paso no soportado");
//     }
// }
//
// /************** Answers específicas **************/
// // Seleccionar rol en menú inicial
// export class SeleccionarRol extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         const t = ctx.body.trim().toLowerCase();
//         if (t === "1" || t.includes("empleo")) {
//             await ctx.reply("¡Perfecto! Iniciemos tu registro como candidato.");
//             return ctx.switchTo(RegistroFlow);
//         }
//         if (t === "2" || t.includes("empresa")) {
//             await ctx.reply("Excelente. Comencemos el registro de tu empresa.");
//             return ctx.switchTo(EmpresaFlow);
//         }
//         return ctx.reply("Opción no válida. Escribe 1 o 2.");
//     }
// }
//
// // ——— Registro de candidato ———
// export class GuardarNombre extends Answer {
//     waitForAnswer = true;
//     async handler(ctx, m) {
//         m.name = ctx.body.trim();
//         await ctx.reply(`¡Encantado, ${m.name}! ¿Cuál es tu número de identificación?`);
//     }
// }
//
// export class GuardarID extends Answer {
//     waitForAnswer = true;
//     async handler(ctx, m) {
//         const id = ctx.body.replace(/\D/g, "");
//         if (!id) return ctx.reply("Ingresa solo dígitos. Prueba de nuevo:");
//         m.id = id;
//         await ctx.reply("ID registrado ✅. Ahora tu correo electrónico:");
//     }
// }
//
// export class GuardarEmail extends Answer {
//     waitForAnswer = true;
//     async handler(ctx, m) {
//         const email = ctx.body.trim();
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
//             return ctx.reply("Correo inválido. Intenta otra vez:");
//         m.email = email;
//         await ctx.reply(
//             "✅ Formulario completado:\n" +
//             `• Nombre: ${m.name}\n` +
//             `• ID: ${m.id}\n` +
//             `• Correo: ${m.email}`,
//         );
//     }
// }
//
// // ——— Registro de empresa ———
// export class GuardarEmpresaNombre extends Answer {
//     waitForAnswer = true;
//     async handler(ctx, m) {
//         m.company = ctx.body.trim();
//         await ctx.reply("¿Cuántos empleados tiene tu empresa?");
//     }
// }
// export class GuardarTamanoEmpresa extends Answer {
//     waitForAnswer = true;
//     async handler(ctx, m) {
//         const num = parseInt(ctx.body, 10);
//         if (isNaN(num)) return ctx.reply("Escribe solo números. Intenta nuevamente:");
//         m.employees = num;
//         await ctx.reply("¡Registro empresarial completo! ✅");
//     }
// }
//
// /****************** Flujos ************************/
// // Menu Flow principal después de registros — simple placeholder
// export const MenuFlow = new Flow()
//     .addKeyboard(["menu"])
//     .addAnswer("*1* Información\n*2* Ayuda")
//     .addAnswer(
//         class ResponderMenu extends Answer {
//             waitForAnswer = true;
//             async handler(ctx) {
//                 if (ctx.body === "1") return ctx.reply("Aquí la información…");
//                 if (ctx.body === "2") return ctx.reply("Aquí la ayuda…");
//                 return ctx.reply("Opción no válida. Escribe 1 o 2.");
//             }
//         },
//     )
//     .setName("Menú");
//
// export const RegistroFlow = new Flow()
//     .addAnswer("Por favor, dinos tu nombre:")
//     .addAnswer(GuardarNombre)
//     .addAnswer(GuardarID)
//     .addAnswer(GuardarEmail)
//     .setNextFlow(MenuFlow)
//     .setName("RegistroCandidato");
//
// export const EmpresaFlow = new Flow()
//     .addAnswer("Indícanos el nombre de tu empresa:")
//     .addAnswer(GuardarEmpresaNombre)
//     .addAnswer(GuardarTamanoEmpresa)
//     .setNextFlow(MenuFlow)
//     .setName("RegistroEmpresa");
//
// export const WelcomeFlow = new Flow()
//     .addKeyboard(["hola", "hello", "hi", "que onda", "weee", "sup", "whats doing"])
//     .addAnswer(
//         "¡Bienvenido! Selecciona una opción:\n*1* Busco empleo\n*2* Soy una empresa",
//     )
//     .addAnswer(SeleccionarRol)
//     .setName("Welcome");
//
// /****************** CTX utils *********************/
// function createCtx(client, msg, sessions) {
//     const jid = msg.key.remoteJid;
//     const body = msg.message?.extendedTextMessage?.text ?? msg.message?.conversation ?? "";
//
//     return {
//         body,
//         /** Envía texto simulando presencia 9 s */
//         reply: async (text) => {
//             await client.presenceSubscribe(jid);
//             await client.sendPresenceUpdate("composing", jid);
//             await new Promise((r) => setTimeout(r, 9000)); // 9 seg
//             await client.sendMessage(jid, { text });
//             await client.sendPresenceUpdate("paused", jid);
//         },
//         /** Cambia al flujo indicado inmediatamente */
//         switchTo: async (flowDef) => {
//             const newSession = flowDef.createSession();
//             sessions.set(jid, newSession);
//             await newSession.handleMessage({ ...createCtx(client, msg, sessions), body: "" });
//         },
//     };
// }
//
// /**************** BaileyClient *******************/
// export default class BaileyClient {
//     constructor() {
//         this.DIR_SESSION = `Sessions/auth`;
//         this.sessions = new Map();
//         this.rootFlows = [WelcomeFlow];
//     }
//
//     listenMessages = async ({ messages }) => {
//         const msg = messages?.[0];
//         if (!msg || msg.key.fromMe) return;
//
//         const jid = msg.key.remoteJid;
//         const ctx = createCtx(this.client, msg, this.sessions);
//
//         let session = this.sessions.get(jid);
//         if (!session) {
//             const def = this.rootFlows.find((f) => f.matches(ctx.body.trim()));
//             if (!def) return ctx.reply("🤖 Escribe *hola* para comenzar.");
//             session = def.createSession();
//             this.sessions.set(jid, session);
//         }
//
//         const res = await session.handleMessage(ctx);
//         if (res.done) {
//             const next = session.def.nextFlow;
//             if (next) {
//                 const nextSession = next.createSession();
//                 this.sessions.set(jid, nextSession);
//                 await nextSession.handleMessage(ctx);
//             } else {
//                 this.sessions.delete(jid);
//             }
//         }
//     };
//
//     async connect() {
//         const { state, saveCreds } = await useMultiFileAuthState(this.DIR_SESSION);
//         this.client = makeWASocket({
//             auth: state,
//             browser: Browsers.windows("Desktop"),
//             syncFullHistory: false,
//             logger: PINO({ level: "error" }),
//         });
//         this.client.ev.on("creds.update", saveCreds);
//         this.client.ev.on("connection.update", this.handleConnectionUpdate);
//         this.client.ev.on("messages.upsert", this.listenMessages);
//     }
//
//     handleConnectionUpdate = async (u) => {
//         const { connection, lastDisconnect, qr } = u;
//         if (qr) qrcode.generate(qr, { small: true });
//         const code = lastDisconnect?.error?.output?.statusCode;
//         if (connection === "close") await this.connect();
//         if (connection === "open") console.log("✅ Bailey conectado");
//     };
// }
//
// // arrancar
// const bot = new BaileyClient();
// bot.connect();

// # START4 AQUI SE HA DEJADO FULL EL FLOW TERMIANDO REGRESA A WLOW WELCOOME
/*************************************************
 *  MOTOR DE FLUJOS – 100 % EN MEMORIA           *
 *  Inspirado en bot‑whatsapp, pero sin librerías *
 *************************************************/

/******************** Answer *********************/
export class Answer {
    /** Si la subclase debe esperar la siguiente entrada */
    waitForAnswer = false;
    /**
     * @param {object} ctx  Helpers (reply, body, switchTo, …)
     * @param {object} memo Datos del usuario dentro del flujo
     */
    async handler(/* ctx, memo */) {
        throw new Error("Debes implementar handler(ctx, memo)");
    }
}

/********************* Flow **********************/
export class Flow {
    constructor() {
        this.keyboards = [];   // disparadores
        this.steps     = [];   // textos o Answer
        this.nextFlow  = null; // flujo a saltar al terminar (opcional)
        this.name      = "anon";
    }
    addKeyboard(def) {
        if (Array.isArray(def)) {
            this.keyboards.push({ key: def, mode: "includes", sensitive: false });
        } else {
            this.keyboards.push({
                key:        def.key,
                mode:       def.mode || "includes",
                sensitive:  def.sensitive ?? false,
            });
        }
        return this;
    }
    addAnswer(step)  { this.steps.push(step); return this; }
    setNextFlow(f)   { this.nextFlow = f;     return this; }
    setName(n)       { this.name = n;         return this; }

    /** true si `text` coincide con algún disparador */
    matches(txt = "") {
        return this.keyboards.some(cfg =>
            cfg.key.some(k => {
                const c = cfg.sensitive ? txt : txt.toLowerCase();
                const t = cfg.sensitive ? k   : k.toLowerCase();
                return cfg.mode === "equals" ? c === t : c.includes(t);
            }),
        );
    }
    /** crea una sesión independiente */
    createSession() { return new FlowSession(this); }
}

/***************** FlowSession *******************/
class FlowSession {
    constructor(def) {
        this.def       = def;
        this.stepIndex = 0;
        this.memo      = {};
    }
    get finished() { return this.stepIndex >= this.def.steps.length; }

    /** Maneja un mensaje del usuario y avanza el flujo */
    async handleMessage(ctx) {
        if (this.finished) return { done: true };

        const step = this.def.steps[this.stepIndex];

        // ───── Paso: texto plano ─────
        if (typeof step === "string") {
            await ctx.reply(step);
            this.stepIndex += 1;
            return { done: false, wait: true };
        }

        // ───── Paso: Answer (clase o instancia) ─────
        if (step.prototype instanceof Answer || step instanceof Answer) {
            const inst = step.prototype instanceof Answer ? new step() : step;
            await inst.handler(ctx, this.memo);
            this.stepIndex += 1;
            if (inst.waitForAnswer) return { done: false, wait: true };
            // encadenar si no espera
            return await this.handleMessage(ctx);
        }

        throw new Error("Tipo de paso no soportado");
    }
}

/************** Answers específicas **************/
// Seleccionar rol en menú inicial
export class SeleccionarRol extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        const t = ctx.body.trim().toLowerCase();

        if (t === "1" || t.includes("empleo")) {
            await ctx.reply("¡Perfecto! Iniciemos tu registro como candidato.");
            return ctx.switchTo(RegistroFlow);
        }
        if (t === "2" || t.includes("empresa")) {
            await ctx.reply("Excelente. Comencemos el registro de tu empresa.");
            return ctx.switchTo(EmpresaFlow);
        }
        return ctx.reply("Opción no válida. Escribe 1 o 2.");
    }
}

// ——— Registro de candidato ———
export class GuardarNombre extends Answer {
    waitForAnswer = true;
    async handler(ctx, m) {
        m.name = ctx.body.trim();
        await ctx.reply(`¡Encantado, ${m.name}! ¿Cuál es tu número de identificación?`);
    }
}
export class GuardarID extends Answer {
    waitForAnswer = true;
    async handler(ctx, m) {
        const id = ctx.body.replace(/\D/g, "");
        if (!id) return ctx.reply("Ingresa solo dígitos. Prueba de nuevo:");
        m.id = id;
        await ctx.reply("ID registrado ✅. Ahora tu correo electrónico:");
    }
}
export class GuardarEmail extends Answer {
    waitForAnswer = true;
    async handler(ctx, m) {
        const email = ctx.body.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return ctx.reply("Correo inválido. Intenta otra vez:");
        m.email = email;
        await ctx.reply(
            "✅ Formulario completado:\n" +
            `• Nombre: ${m.name}\n` +
            `• ID: ${m.id}\n` +
            `• Correo: ${m.email}`,
        );
    }
}

// ——— Registro de empresa ———
export class GuardarEmpresaNombre extends Answer {
    waitForAnswer = true;
    async handler(ctx, m) {
        m.company = ctx.body.trim();
        await ctx.reply("¿Cuántos empleados tiene tu empresa?");
    }
}
export class GuardarTamanoEmpresa extends Answer {
    waitForAnswer = true;
    async handler(ctx, m) {
        const num = parseInt(ctx.body, 10);
        if (isNaN(num)) return ctx.reply("Escribe solo números. Intenta nuevamente:");
        m.employees = num;
        await ctx.reply("¡Registro empresarial completo! ✅");
    }
}

/****************** Flujos ************************/
// ——— Flujo de bienvenida (inicio y retorno) ———
export const WelcomeFlow = new Flow()
    .addKeyboard(["hola", "hello", "hi", "que onda", "weee", "sup", "whats doing"])
    .addAnswer(
        "¡Bienvenido! Selecciona una opción:\n*1* Busco empleo\n*2* Soy una empresa"
    )
    .addAnswer(SeleccionarRol)
    .setName("Welcome");

// ——— Flujo de registro de candidato ———
export const RegistroFlow = new Flow()
    .addAnswer("Por favor, dinos tu nombre:")
    .addAnswer(GuardarNombre)
    .addAnswer(GuardarID)
    .addAnswer(GuardarEmail)
    .setNextFlow(WelcomeFlow)          // ← vuelve al inicio
    .setName("RegistroCandidato");

// ——— Flujo de registro de empresa ———
export const EmpresaFlow = new Flow()
    .addAnswer("Indícanos el nombre de tu empresa:")
    .addAnswer(GuardarEmpresaNombre)
    .addAnswer(GuardarTamanoEmpresa)
    .setNextFlow(WelcomeFlow)          // ← vuelve al inicio
    .setName("RegistroEmpresa");

/****************** CTX utils *********************/
function createCtx(client, msg, sessions) {
    const jid  = msg.key.remoteJid;
    const body = msg.message?.extendedTextMessage?.text
        ?? msg.message?.conversation
        ?? "";

    return {
        body,
        /** Envía texto simulando presencia 9 s */
        reply: async (text) => {
            await client.presenceSubscribe(jid);
            await client.sendPresenceUpdate("composing", jid);
            await new Promise(r => setTimeout(r, 9000)); // 9 seg
            await client.sendMessage(jid, { text });
            await client.sendPresenceUpdate("paused",   jid);
        },
        /** Cambia al flujo indicado inmediatamente */
        switchTo: async (flowDef) => {
            const newSession = flowDef.createSession();
            sessions.set(jid, newSession);
            await newSession.handleMessage({ ...createCtx(client, msg, sessions), body: "" });
        },
    };
}

/**************** BaileyClient *******************/
export default class BaileyClient {
    constructor() {
        this.DIR_SESSION = `Sessions/auth`;
        this.sessions   = new Map();          // Map<jid, FlowSession>
        this.rootFlows  = [WelcomeFlow];      // flujos raíces
    }

    // Listener de mensajes
    listenMessages = async ({ messages }) => {
        const msg = messages?.[0];
        if (!msg || msg.key.fromMe) return;

        const jid = msg.key.remoteJid;
        const ctx = createCtx(this.client, msg, this.sessions);

        // Obtener o crear sesión
        let session = this.sessions.get(jid);
        if (!session) {
            const def = this.rootFlows.find(f => f.matches(ctx.body.trim()));
            if (!def) return ctx.reply("🤖 Escribe *hola* para comenzar.");
            session = def.createSession();
            this.sessions.set(jid, session);
        }

        // Delegar al flujo
        const res = await session.handleMessage(ctx);

        // Saltar al siguiente flujo o limpiar
        if (res.done) {
            const next = session.def.nextFlow;
            if (next) {
                const nextSession = next.createSession();
                this.sessions.set(jid, nextSession);
                await nextSession.handleMessage(ctx);
            } else {
                this.sessions.delete(jid);
            }
        }
    };

    async connect() {
        const { state, saveCreds } = await useMultiFileAuthState(this.DIR_SESSION);
        this.client = makeWASocket({
            auth:   state,
            browser: Browsers.windows("Desktop"),
            syncFullHistory: false,
            logger: PINO({ level: "error" }),
        });
        this.client.ev.on("creds.update",    saveCreds);
        this.client.ev.on("connection.update", this.handleConnectionUpdate);
        this.client.ev.on("messages.upsert",   this.listenMessages);
    }

    handleConnectionUpdate = async (u) => {
        const { connection, lastDisconnect, qr } = u;
        if (qr) qrcode.generate(qr, { small: true });
        if (connection === "close") await this.connect();
        if (connection === "open")  console.log("✅ Bailey conectado");
    };
}

// ── arrancar bot ──
const bot = new BaileyClient();
bot.connect();

