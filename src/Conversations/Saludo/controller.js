import { Kind } from "../../Flow/Context.js";
import { Answer } from "../../Flow/Answer.js";
export class Saludo extends Answer {
    waitForAnswer = true;
    constructor() {
        super();
    }
    async handler(ctx) {
        ctx.useMemo(ctx.phoneNumber, 'name', ctx.body);
        await ctx.delayWithPresence('composing', 1);
        await ctx.reply(ctx.MemoText(ctx.phoneNumber, 'Hola {name}!'));
        return;
    }
}
// //# sourceMappingURL=controller.js.map
// import axios from 'axios';
// import { Kind } from "../../Flow/Context.js";
// import { Answer } from "../../Flow/Answer.js";
//
// export class Saludo extends Answer {
//     waitForAnswer = true;
//
//     constructor() {
//         super();
//     }
//
//     async obtenerEmpleos() {
//         try {
//             const response = await axios.get('https://www.arbeitnow.com/api/job-board-api');
//             const trabajos = response.data.data.slice(0, 3); // Tomamos solo los primeros 3
//
//             return trabajos.map(job => ({
//                 titulo: job.title,
//                 empresa: job.company_name,
//                 ubicacion: job.location,
//                 enlace: job.url
//             }));
//         } catch (error) {
//             console.error("Error al obtener empleos:", error.message);
//             return [];
//         }
//     }
//
//     async handler(ctx) {
//         ctx.useMemo(ctx.phoneNumber, 'name', ctx.body);
//         await ctx.delayWithPresence('composing', 1);
//
//         const name = ctx.MemoText(ctx.phoneNumber, 'name');
//         const empleos = await this.obtenerEmpleos();
//
//         let mensaje = `Hola ${name} 👋\nAquí tienes algunas ofertas de empleo remoto disponibles:\n\n`;
//
//         if (empleos.length === 0) {
//             mensaje += "No se encontraron empleos en este momento. 🚫";
//         } else {
//             for (const empleo of empleos) {
//                 mensaje += `💼 *${empleo.titulo}* en *${empleo.empresa}*\n📍 ${empleo.ubicacion}\n🔗 ${empleo.enlace}\n\n`;
//             }
//         }
//
//         await ctx.reply(mensaje);
//     }
// }
