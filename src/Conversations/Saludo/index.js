import { Flow } from "../../Flow/Flow.js";
import {OneLineMessage} from "../../Flow/utils/OneLineMessage.js";
import {Answer} from "../../Flow/Answer.js";




export const Final = new Flow()
    .addAnswer("Gracias por tus datos! :D")
    .addAnswer("Paragon te enviara un nuevo mensaje una vez analicemos tus datos.")
    .setName("Despedida");

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
export const MenuFlow = new Flow()
    .addKeyboard(["menu", "menú"])
    .addAnswer(`Buenas tardes señor {name}, en que vacante esta interesado?`)
    .addAnswer(OneLineMessage(["Tenemos las siguientes vacantes", "1. Customer service", "2. Compliance", "3. Llamadas NSF"]))
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
    .addAnswer('[RRHH] - Hola, cual es tu nombre?')
    .addAnswer(Saludo)
    .addAnswer("Será redirigido al menú...")
    .setNextFlow(MenuFlow)
    .setName("Saludo");