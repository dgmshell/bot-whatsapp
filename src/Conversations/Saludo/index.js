import { Flow } from "../../Flow/Flow.js";
import {OneLineMessage} from "../../Flow/utils/OneLineMessage.js";
import {Answer} from "../../Flow/Answer.js";
// supabaseClient.js
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ezpflgfldhwriukyywix.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6cGZsZ2ZsZGh3cml1a3l5d2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODE5MjAsImV4cCI6MjA2NjA1NzkyMH0.cnID4BdcBbb8CaaB9sNCKTf_WgW4P7qsNBJ9RFLDx7A"
const supabase = createClient(supabaseUrl, supabaseKey)

// export const Final = new Flow()
//     .addAnswer("Gracias un agente te contactara! :D")
//     .addAnswer("Business agradece su preferencía")
//     .setName("Despedida");
// const cafes = ["Helado", "Con Leche", "Capuchino"];
// export class MenuController extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         const phone = ctx.body;
//
//         if (phone.length < 8){
//             await ctx.reply('Su numero es incorrecto {name}!');
//             ctx.moveToStep(ctx.phoneNumber, 0);
//             return;
//         }
//
//         ctx.useMemo(ctx.phoneNumber, 'phone', phone);
//
//         await ctx.reply(
//             ctx.MemoText(
//                 ctx.phoneNumber,
//                 `👤 Su nombre es: {name}\n📞 Su teléfono es: {phone}`
//             )
//         );
//         const dbName = ctx.useMemo(ctx.phoneNumber, 'name');
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
//     }
// }
// export const MenuFlow = new Flow()
//     .addKeyboard(["menu", "menú"])
//     .addAnswer(`Buenas tardes señor {name}`)
//     .addAnswer(OneLineMessage(["Me puedes brindar tu numero de telefono?"]))
//     .addAnswer(MenuController)
//     .setNextFlow(Final)
//     .setName("Menú")
//
// export class Saludo extends Answer {
//     waitForAnswer = true;
//     constructor() {
//         super();
//     }
//     async handler(ctx) {
//         ctx.useMemo(ctx.phoneNumber, 'name', ctx.body);
//         await ctx.delayWithPresence('composing', 1);
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, 'Hola {name}!'));
//         return;
//     }
// }
// export const FlowSaludo = new Flow()
//     .addKeyboard(['hello', 'sup', 'whats doing'])
//     .addKeyboard({
//         key: ["hola", 'que onda', 'weee'],
//         mode: 'equals',
//         sensitive: false
//     })
//     .addAnswer('Hola soy *neobot*, cual es tu nombre?')
//     .addAnswer(Saludo)
//     .addAnswer("Será redirigido a un agente...")
//     .setNextFlow(MenuFlow)
//     .setName("Saludo");

// import { GoogleGenAI } from "@google/genai";
//
// const ai = new GoogleGenAI({ apiKey: "AIzaSyAaLwqcOD3Tx1kbtGjrp9YiKGB2gfR8Kdg" });
//
// /**
//  * Flujo Final: cuando se transfiere a un agente
//  */
// export const Final = new Flow()
//     .addAnswer("Gracias, un agente te contactará pronto. 😊")
//     .addAnswer("Humanosisu agradece tu preferencia.")
//     .setName("Despedida");
// export class IAAnswer extends Answer {
//     waitForAnswer = true;
//
//     async handler(ctx) {
//         const phoneId = ctx.phoneNumber;
//         const userInput = ctx.body.toLowerCase();
//
//         if (userInput.includes("agente") || userInput.includes("salir")) {
//             await ctx.reply("Entendido, te transfiero a un agente...");
//             return ctx.setNextFlow(Final);
//         }
//
//         await ctx.delayWithPresence('composing', 3);
// //         const systemInstructions = `
// // Eres el asistente virtual de Neositio, una empresa hondureña fundada en 2025 por Gustavo Noel (gerente de ventas) y David Maldonado (programador). Usan tecnologías de última generación.
// //
// // Neositio ofrece los siguientes servicios:
// // - Páginas web: $500
// // - Tiendas virtuales: $900
// // - Redes sociales: desde $200
// // - Diseño web: $300
// // - Catálogos en línea: desde $200
// //
// // Si el cliente menciona "descuento", ofrécele un 10% y haz el cálculo exacto.
// //
// // Ejemplo:
// // - Página web con 10% = $450
// // - Tienda virtual con 10% = $810
// //
// // Si dice que comprará, pide nombre, teléfono y correo.
// // Si pregunta algo fuera del negocio, responde:
// // > “Esa información no la manejo. ¿Deseas hablar con un agente humano?”
// //
// // Sé breve, profesional y motiva al usuario a comprar.
// //
// // Usuario: ${ctx.body}
// // Asistente:
// //         `.trim();
//         const systemInstructions = `
// Eres el asistente virtual de HUMANOSISU, una empresa de Recursos Humanos. Ofrece oportunidades laborales a personas y servicios de contratación a empresas.
//
// Tu rol es identificar si el usuario:
// 1. Está buscando empleo → muéstrale vacantes disponibles, agenda una cita y pásalo al flujo de aplicación.
// 2. Es una empresa → explícales los beneficios de usar nuestros servicios y dirígelos al flujo de contratación.
//
// Si el usuario menciona:
// - "empleo", "trabajo", "busco trabajo", etc.:
//     ✔️ Muestra 2 o 3 vacantes inventadas (con cargo, horario, y modalidad).
//     ✔️ Pregunta si desea aplicar y, si dice que sí, solicita:
//         - Nombre completo
//         - Teléfono
//         - Correo
//     ✔️ Luego, agenda una cita ficticia para entrevista (día y hora) y pásalo al flujo de aplicación.
//
// - "empresa", "contratar", "RRHH", etc.:
//     ✔️ Explica brevemente por qué HUMANOSISU es ideal:
//         - Filtramos candidatos
//         - Aceleramos contrataciones
//         - Agenda rápida de entrevistas
//     ✔️ Invítalos a continuar al flujo de contratación para empresas.
//
// Si el usuario pregunta cosas fuera del tema (clima, medicina, recetas, fútbol, etc.), responde:
// > “Esa información no la manejo. ¿Deseas hablar con un agente humano?”
//
// Tu estilo debe ser profesional, corto, claro y útil. Siempre busca llevar al usuario al flujo adecuado (empleo o empresa) y motívalo a continuar.
//
// Usuario: ${ctx.body}
// Asistente:
// `.trim();
//         const response = await ai.models.generateContent({
//             model: "gemini-1.5-flash",
//             contents: systemInstructions
//         });
//         const reply = response.text?.trim() || "No entendí eso, ¿puedes repetirlo?";
//         await ctx.delayWithPresence('composing', 2);
//         await ctx.reply(reply);
//         return ctx.moveToStep(ctx.phoneNumber, 0);
//     }
// }
// export const FlowSaludo = new Flow()
//     .addKeyboard(['hello', 'sup', 'whats doing'])
//     .addKeyboard({
//         key: ["hola", "que onda", "weee"],
//         mode: "equals",
//         sensitive: false
//     })
//     .addAnswer("Hola soy *Neobot*, asistente virtual de humanosisu.")
//     .addAnswer(OneLineMessage(["¿En qué puedo ayudarte hoy?"]))
//     .addAnswer(IAAnswer)
//     .setName("Saludo");
const sendApplication = async (dbName,dbPhone,dbEmail) => {
    const url = "https://www.careers-page.com/api/v1.0/jobs/2885687/application-form/";

    const payload = {
        application_data: {
            "1640663": dbName,     // Nombre
            "1640664": dbEmail,   // Correo electrónico
            "1640665": dbPhone         // Teléfono
            // Eliminado el campo del archivo
        },
        application_metadata: {
            source: "null",
            job_portal_slug: "null",
            source_reference: "null"
        }
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en la respuesta:", errorData);
            return;
        }

        const result = await response.json();
        console.log("Aplicación enviada exitosamente:", result);
    } catch (error) {
        console.error("Error al enviar la aplicación:", error.message);
    }
};
export const Final = new Flow()
    .addAnswer("Gracias, un agente se pondrá en contacto contigo para coordinar una entrevista.")
    .setName("Despedida");

export class MenuController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        const phone = ctx.body;

        if (phone.length < 8){
            await ctx.reply('¡Su número es incorrecto, {name}!');
            ctx.moveToStep(ctx.phoneNumber, 0);
            return;
        }

        ctx.useMemo(ctx.phoneNumber, 'phone', phone);
    }
}

export class EmailController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        const email = ctx.body;

        ctx.useMemo(ctx.phoneNumber, 'email', email);

        await ctx.reply(
            ctx.MemoText(
                ctx.phoneNumber,
                `👤 Su nombre es: {name}\n📞 Su teléfono es: {phone}\n📧 Su correo electrónico es: {email}`
            )
        );
        const dbName = ctx.useMemo(ctx.phoneNumber, 'name');
        const dbPhone = ctx.useMemo(ctx.phoneNumber, 'phone');
        const dbEmail = ctx.useMemo(ctx.phoneNumber, 'email');

        await sendApplication(dbName, dbPhone, dbEmail);
    }
}

export const Email = new Flow()
    .addKeyboard(["menu", "menú"])
    .addAnswer(OneLineMessage(["Excelente, ahora tu correo electrónico?"]))
    .addAnswer(EmailController)
    .setNextFlow(Final)
    .setName("Email");

export const MenuFlow = new Flow()
    .addKeyboard(["menu", "menú"])
    .addAnswer(OneLineMessage(["{name}, ahora bríndame tu número de teléfono."]))
    .addAnswer(MenuController)
    .setNextFlow(Email)
    .setName("Menú");

export class Saludo extends Answer {
    waitForAnswer = true;
    constructor() {
        super();
    }
    async handler(ctx) {
        ctx.useMemo(ctx.phoneNumber, 'name', ctx.body);
        await ctx.delayWithPresence('composing', 1);
        await ctx.reply(ctx.MemoText(ctx.phoneNumber, '¡Hola {name}!'));
        return;
    }
}

export const FlowSaludo = new Flow()
    .addKeyboard(['hello', 'sup', 'whats doing'])
    .addKeyboard({
        key: ["hola", 'que onda', 'weee'],
        mode: 'equals',
        sensitive: false
    })
    .addAnswer('Hola, soy David. ¿Me puedes brindar tu nombre?')
    .addAnswer(Saludo)
    .setNextFlow(MenuFlow)
    .setName("Saludo");
