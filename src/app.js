import {
    makeWASocket,
    useMultiFileAuthState,
    Browsers,
    DisconnectReason
} from "baileys";
import { Manager } from './Flow/Manager.js';
import PINO from "pino";
import qrcode from "qrcode-terminal"; // ← Importa para mostrar el QR
import "./Conversations/index.js";

class BaileyClient {
    constructor() {
        this.DIR_SESSION = `Sessions/auth`;
    }

    listenMessages = async ({ messages }) => {
        const messageCtx = messages[0];
        const remoteJid = messageCtx.key.remoteJid;
        const fromMe = messageCtx.key.fromMe;
        let messageBody = messageCtx?.message?.extendedTextMessage?.text ?? messageCtx?.message?.conversation;

        if (fromMe || messageBody === "" || !messageBody) return;

        console.log('opened connection');
        console.log({
            remoteJid,
            fromMe,
            messageBody,
            messageCtx
        });
    }

    async connect() {
        try {
            const { state, saveCreds } = await useMultiFileAuthState(this.DIR_SESSION);
            this.client = makeWASocket({
                auth: state,
                browser: Browsers.windows("Desktop"),
                syncFullHistory: false,
                logger: PINO({ level: "error" }),
            });

            this.client.ev.on("creds.update", saveCreds);
            this.client.ev.on("connection.update", this.handleConnectionUpdate);
        } catch (error) {
            console.log("Ha ocurrido un error", error);
        }
    }

    handleConnectionUpdate = async (update) => {
        try {
            const { connection, lastDisconnect, qr } = update;
            const statusCode = lastDisconnect?.error?.output?.statusCode;

            // ✅ Mostrar QR manualmente si existe
            if (qr) {
                qrcode.generate(qr, { small: true });
            }

            if (connection === "close") {
                if (statusCode !== DisconnectReason.loggedOut) {
                    await this.connect();
                }

                if (statusCode === DisconnectReason.loggedOut) {
                    console.log("Reiniciar bailey");
                    await this.connect();
                }
            }

            if (connection === "open") {
                console.log("Bailey conectado...");
                Manager.getInstance().attach(this.client);
            }
        } catch (error) {
            console.log("Ha ocurrido un error, reinicie o verifique su conexión a internet");
        }
    }
}

// Crear una instancia de BaileyClient
const bailey = new BaileyClient();
// Inicializar la conexión
bailey.connect().then(() => {});
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