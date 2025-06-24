import { Answer } from "../../Flow/Answer.js";
const cafes = ["Customer service", "Compliance", "NSF"];
export class MenuController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        const option = Number(ctx.body[0]);
        if (isNaN(option) || !cafes[option - 1]) {
            await ctx.reply('Usted ha no ha seleccionado una opción valida!');
            ctx.moveToStep(ctx.phoneNumber, 0);
            return;
        }
        ctx.useMemo(ctx.phoneNumber, 'vacant', cafes[option - 1]);
        await ctx.reply(ctx.MemoText(ctx.phoneNumber, `Usted ha seleccionado la vacante {vacant} espere un momento estamos conectando con nuestra api`));
    }
}