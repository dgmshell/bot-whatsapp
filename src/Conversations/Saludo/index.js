import { Flow } from "../../Flow/Flow.js";
import {OneLineMessage} from "../../Flow/utils/OneLineMessage.js";
import {Answer} from "../../Flow/Answer.js";
// supabaseClient.js

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ezpflgfldhwriukyywix.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6cGZsZ2ZsZGh3cml1a3l5d2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODE5MjAsImV4cCI6MjA2NjA1NzkyMH0.cnID4BdcBbb8CaaB9sNCKTf_WgW4P7qsNBJ9RFLDx7A"
const supabase = createClient(supabaseUrl, supabaseKey)

export const Final = new Flow()
    .addAnswer("Gracias un agente te contactara! :D")
    .addAnswer("Business agradece su preferencía")
    .setName("Despedida");
const cafes = ["Helado", "Con Leche", "Capuchino"];
export class MenuController extends Answer {
    waitForAnswer = true;
    async handler(ctx) {
        const phone = ctx.body;

        if (phone.length < 8){
            await ctx.reply('Su numero es incorrecto!');
            ctx.moveToStep(ctx.phoneNumber, 0);
            return;
        }


        ctx.useMemo(ctx.phoneNumber, 'phone', phone);

        await ctx.reply(
            ctx.MemoText(
                ctx.phoneNumber,
                `👤 Su nombre es: {name}\n📞 Su teléfono es: {phone}`
            )
        );
        const dbName = ctx.useMemo(ctx.phoneNumber, 'name');
        const dbPhone = ctx.useMemo(ctx.phoneNumber, 'phone');
        // Insertar en Supabase
        const { data, error } = await supabase
            .from('whatsapp')
            .insert([
                {
                    userName: dbName,
                    userPhone: dbPhone
                }
            ])
            .select();

        if (error) {
            console.error('Error insertando en Supabase:', error);
        } else {
            console.log('Insertado en Supabase:', data);
        }

    }
}

export const MenuFlow = new Flow()
    .addKeyboard(["menu", "menú"])
    .addAnswer(`Buenas tardes señor {name}`)
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

