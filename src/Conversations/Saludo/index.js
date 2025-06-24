import { Flow } from "../../Flow/Flow.js";
import {OneLineMessage} from "../../Flow/utils/OneLineMessage.js";
import {Answer} from "../../Flow/Answer.js";

export const Final = new Flow()
    .addAnswer("Gracias por su pedido! :D")
    .addAnswer("Cafe Juanito agradece su preferencía")
    .setName("Despedida");
const cafes = ["Helado", "Con Leche", "Capuchino"];
export class MenuController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        const phone = ctx.body;

        if (phone.length < 8){
            await ctx.reply('Usted ha no ha seleccionado una opción valida!');
            ctx.moveToStep(ctx.phoneNumber, 0);
            return;
        }


        ctx.useMemo(ctx.phoneNumber, 'phone', phone);
        await ctx.reply(ctx.MemoText(ctx.phoneNumber, `Su numero es {phone}`));
    }
}

export const MenuFlow = new Flow()
    .addKeyboard(["menu", "menú"])
    .addAnswer(`Buenas tardes señor {name}, cual es tu numero?`)
    .addAnswer(OneLineMessage(["cual es tu numero?"]))
    .addAnswer(MenuController)
    .setName("Menú")
    .setNextFlow(Final);

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

export const FlowSaludo = new Flow()
    .addKeyboard(['hello', 'sup', 'whats doing'])
    .addKeyboard({
        key: ["hola", 'que onda', 'weee'],
        mode: 'equals',
        sensitive: false
    })
    .addAnswer('[TESTING] - Hola, cual es tu nombre?')
    .addAnswer(Saludo)
    .addAnswer("Será redirigido al menú...")
    .setNextFlow(MenuFlow)
    .setName("Saludo");

