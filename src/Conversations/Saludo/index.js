import { Flow } from "../../Flow/Flow.js";
import {OneLineMessage} from "../../Flow/utils/OneLineMessage.js";
import {Answer} from "../../Flow/Answer.js";

// === CLASES DE RESPUESTA ===

export class AskName extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        const nombre = ctx.body.trim();
        ctx.useMemo(ctx.phoneNumber, 'name', nombre);
        await ctx.reply(`Gracias, ${nombre}. ¿Podrías proporcionarme tu número de teléfono?`);
    }
}

export class AskPhone extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        const telefono = ctx.body.trim();
        ctx.useMemo(ctx.phoneNumber, 'telefono', telefono);
        await ctx.reply("Perfecto. Ahora indícame tu correo electrónico.");
    }
}

export class AskEmail extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        const email = ctx.body.trim();
        ctx.useMemo(ctx.phoneNumber, 'email', email);
        await ctx.reply("✅ Registro completado. Un momento por favor...");
    }
}

// === FLUJOS EN ORDEN CORRECTO ===

export const FlowBienvenidaRRHH = new Flow()
    .addAnswer(`Hola {name} 👤, tus datos han sido registrados correctamente.`)
    .addAnswer(`📞 Teléfono: {telefono}\n📧 Correo: {email}`)
    .addAnswer("El equipo de RRHH te contactará pronto o podrás continuar con otros trámites.")
    .setName("BienvenidaRRHH");

export const FlowAskEmail = new Flow()
    .addAnswer(AskEmail)
    .setName("CapturaCorreo")
    .setNextFlow(FlowBienvenidaRRHH);

export const FlowAskPhone = new Flow()
    .addAnswer(AskPhone)
    .setName("CapturaTeléfono")
    .setNextFlow(FlowAskEmail);

export const FlowSaludo = new Flow()
    .addKeyboard(['hola', 'buenas', 'buen día', 'que onda', 'hello'])
    .addAnswer('👋 Bienvenido al sistema de Recursos Humanos.')
    .addAnswer('¿Cuál es tu nombre completo?')
    .addAnswer(AskName)
    .setName("Saludo")
    .setNextFlow(FlowAskPhone);
