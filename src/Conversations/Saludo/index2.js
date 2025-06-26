// import { Flow } from "../../Flow/Flow.js";
// import {OneLineMessage} from "../../Flow/utils/OneLineMessage.js";
// import {Answer} from "../../Flow/Answer.js";
//
//
// // export const Final = new Flow()
// //     .addAnswer("Gracias por tus datos! :D")
// //     .addAnswer("Paragon te enviara un nuevo mensaje una vez analicemos tus datos.")
// //     .setName("Despedida");
// //
// // const cafes = ["Customer service", "Compliance", "NSF"];
// // export class MenuController extends Answer {
// //     waitForAnswer = true;
// //     async handler(ctx) {
// //         const option = Number(ctx.body[0]);
// //         if (isNaN(option) || !cafes[option - 1]) {
// //             await ctx.reply('Usted ha no ha seleccionado una opción valida!');
// //             ctx.moveToStep(ctx.phoneNumber, 0);
// //             return;
// //         }
// //         ctx.useMemo(ctx.phoneNumber, 'vacant', cafes[option - 1]);
// //         await ctx.reply(ctx.MemoText(ctx.phoneNumber, `Usted ha seleccionado la vacante {vacant} espere un momento estamos conectando con nuestra api`));
// //     }
// // }
// // export const MenuFlow = new Flow()
// //     .addKeyboard(["menu", "menú"])
// //     .addAnswer(`Buenas tardes señor {name}, en que vacante esta interesado?`)
// //     .addAnswer(OneLineMessage(["Tenemos las siguientes vacantes", "1. Customer service", "2. Compliance", "3. Llamadas NSF"]))
// //     .addAnswer(MenuController)
// //     .setName("Menú")
// //     .setNextFlow(Final);
// //
// //
// //
// // export class Saludo extends Answer {
// //     waitForAnswer = true;
// //     constructor() {
// //         super();
// //     }
// //     async handler(ctx) {
// //         ctx.useMemo(ctx.phoneNumber, 'name', ctx.body);
// //         await ctx.delayWithPresence('composing', 1);
// //         await ctx.reply(ctx.MemoText(ctx.phoneNumber, 'Hola {name}!'));
// //         return;
// //     }
// // }
// //
// //
// // export const FlowSaludo = new Flow()
// //     .addKeyboard(['hello', 'sup', 'whats doing'])
// //     .addKeyboard({
// //     key: ["hola", 'que onda', 'weee'],
// //     mode: 'equals',
// //     sensitive: false
// // })
// //     .addAnswer('[RRHH] - Hola, cual es tu nombre?')
// //     .addAnswer(Saludo)
// //     .addAnswer("Será redirigido al menú...")
// //     .setNextFlow(MenuFlow)
// //     .setName("Saludo");
// export const Final = new Flow()
//     .addAnswer("¡Gracias por tu interés en nuestras clases en The Best Academy! 😊")
//     .addAnswer("Te enviaremos un mensaje con más detalles después de analizar tu solicitud.")
//     .setName("Despedida");
//
// const paymentMethods = ["Tarjeta de crédito/débito", "PayPal", "Transferencia bancaria"];
// export class PaymentController extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         const option = Number(ctx.body[0]);
//         if (isNaN(option) || !paymentMethods[option - 1]) {
//             await ctx.reply('No has seleccionado una opción válida. Por favor, intenta nuevamente seleccionando un número.');
//             ctx.moveToStep(ctx.phoneNumber, 0);
//             return;
//         }
//         ctx.useMemo(ctx.phoneNumber, 'paymentMethod', paymentMethods[option - 1]);
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, `Has seleccionado el método de pago: {paymentMethod}.`));
//     }
// }
//
// export const PaymentFlow = new Flow()
//     .addAnswer("Ahora necesitamos que selecciones un método de pago.")
//     .addAnswer(OneLineMessage(["Métodos disponibles:", "1. Tarjeta de crédito/débito", "2. PayPal", "3. Transferencia bancaria"]))
//     .addAnswer(PaymentController)
//     .setName("Método de Pago")
//     .setNextFlow(Final);
//
// const courses = ["Básico", "Intermedio", "Avanzado"];
// export class MenuController extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         const option = Number(ctx.body[0]);
//         if (isNaN(option) || !courses[option - 1]) {
//             await ctx.reply('No has seleccionado una opción válida. Por favor, intenta de nuevo.');
//             ctx.moveToStep(ctx.phoneNumber, 0);
//             return;
//         }
//         ctx.useMemo(ctx.phoneNumber, 'course', courses[option - 1]);
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, `¡Has seleccionado el nivel {course}! En breve, recibirás más información sobre nuestras clases.`));
//     }
// }
//
// export const MenuFlow = new Flow()
//     .addKeyboard(["menu", "clases", "niveles"])
//     .addAnswer(`Hola {name}, ¿en qué nivel de clases estás interesado?`)
//     .addAnswer(OneLineMessage(["Nuestras opciones son:", "1. Básico", "2. Intermedio", "3. Avanzado"]))
//     .addAnswer(MenuController)
//     .setName("Menú")
//     .setNextFlow(PaymentFlow);
//
// export class Saludo extends Answer {
//     waitForAnswer = true;
//     constructor() {
//         super();
//     }
//     async handler(ctx) {
//         ctx.useMemo(ctx.phoneNumber, 'name', ctx.body);
//         await ctx.delayWithPresence('composing', 1);
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, '¡Hola {name}, bienvenido a The Best Academy! 👋'));
//         return;
//     }
// }
//
// export const FlowSaludo = new Flow()
//     .addKeyboard(['hello', 'hi', 'howdy'])
//     .addKeyboard({
//         key: ["hola", "buenos días", "qué tal"],
//         mode: 'equals',
//         sensitive: false
//     })
//     .addAnswer('[The Best Academy] - Hola, ¿cuál es tu nombre?')
//     .addAnswer(Saludo)
//     .addAnswer("Serás redirigido al menú principal...")
//     .setNextFlow(MenuFlow)
//     .setName("Saludo");
//
// // const saludoFlowJson={
// //     "name": "Saludo",
// //     "keyboards": [
// //     ["hello", "hi", "howdy"],
// //     {
// //         "key": ["hola", "buenos días", "qué tal"],
// //         "mode": "equals",
// //         "sensitive": false
// //     }
// // ],
// //     "answers": [
// //     "[The Best Academy] - Hola, ¿cuál es tu nombre?",
// //     {
// //         "type": "custom",
// //         "handler": "Saludo"
// //     },
// //     "Serás redirigido al menú principal..."
// // ],
// //     "nextFlow": "MenuFlow"
// // }
// //
// // export const FlowSaludo = new Flow()
// //     .setName(saludoFlowJson.name)
// //     .addKeyboard(...saludoFlowJson.keyboards)
// //     .addAnswer(saludoFlowJson.answers[0])
// //     .addAnswer(Saludo) // Manejo manual del controlador personalizado.
// //     .addAnswer(saludoFlowJson.answers[2])
// //     .setNextFlow(MenuFlow)
//
// //
// // const vacancies = ["Customer Services", "Compliance", "Negociación", "Data Entry"];
// // const schedules = [
// //     "9:00 a.m. - 10:00 a.m.",
// //     "10:00 a.m. - 11:00 a.m.",
// //     "11:00 a.m. - 12:00 p.m.",
// //     "1:00 p.m. - 2:00 p.m.",
// //     "2:00 p.m. - 3:00 p.m.",
// //     "3:00 p.m. - 4:00 p.m."
// // ];
// //
// // export class ScheduleController extends Answer {
// //     waitForAnswer = true;
// //     async handler(ctx) {
// //         const option = Number(ctx.body[0]);
// //         if (isNaN(option) || !schedules[option - 1]) {
// //             await ctx.reply('No has seleccionado un horario válido. Por favor, intenta nuevamente seleccionando un número.');
// //             ctx.moveToStep(ctx.phoneNumber, 0);
// //             return;
// //         }
// //         ctx.useMemo(ctx.phoneNumber, 'schedule', schedules[option - 1]);
// //         await ctx.reply(ctx.MemoText(ctx.phoneNumber, `Has seleccionado el horario: {schedule}.`));
// //     }
// // }
// //
// // export const ScheduleFlow = new Flow()
// //     .addAnswer("Por favor, selecciona un horario que más te convenga:")
// //     .addAnswer(OneLineMessage(schedules.map((schedule, index) => `${index + 1}. ${schedule}`)))
// //     .addAnswer(ScheduleController)
// //     .setName("Seleccionar Horario")
// //     .addAnswer("Te esperamos en Bulevar Morazán, Torre Morazán, Torre II, oficina 20817.")
// //     .addAnswer("¡Estamos encantados de contar contigo! 😊");
// //
// // export class VacancyController extends Answer {
// //     waitForAnswer = true;
// //     async handler(ctx) {
// //         const option = Number(ctx.body[0]);
// //         if (isNaN(option) || !vacancies[option - 1]) {
// //             await ctx.reply('No has seleccionado una vacante válida. Por favor, intenta nuevamente seleccionando un número.');
// //             ctx.moveToStep(ctx.phoneNumber, 0);
// //             return;
// //         }
// //         ctx.useMemo(ctx.phoneNumber, 'vacancy', vacancies[option - 1]);
// //         await ctx.reply(ctx.MemoText(ctx.phoneNumber, `¡Has seleccionado la vacante: {vacancy}!`));
// //     }
// // }
// //
// // export const VacancyFlow = new Flow()
// //     .addAnswer("Estas son las vacantes disponibles:")
// //     .addAnswer(OneLineMessage(vacancies.map((vacancy, index) => `${index + 1}. ${vacancy}`)))
// //     .addAnswer(VacancyController)
// //     .setName("Seleccionar Vacante")
// //     .setNextFlow(ScheduleFlow);
// //
// // export class EnglishController extends Answer {
// //     waitForAnswer = true;
// //     async handler(ctx) {
// //         const option = Number(ctx.body[0]);
// //         if (option !== 1 && option !== 2) {
// //             await ctx.reply('Por favor, selecciona una opción válida (1 o 2).');
// //             ctx.moveToStep(ctx.phoneNumber, 0);
// //             return;
// //         }
// //         if (option === 2) {
// //             await ctx.reply("Gracias por tu interés. Actualmente, es necesario hablar inglés para postularse. ¡Te deseamos lo mejor!");
// //             return;
// //         }
// //         await ctx.reply("¡Genial! Continuemos con las vacantes disponibles.");
// //         ctx.moveToStep(ctx.phoneNumber, 1); // Cambia al siguiente paso manualmente
// //     }
// // }
// //
// // export const EnglishFlow = new Flow()
// //     .addAnswer("¿Hablas inglés? Por favor, responde:")
// //     .addAnswer(OneLineMessage(["1. Sí", "2. No"]))
// //     .addAnswer(EnglishController)
// //     .setName("Confirmar Inglés")
// //     .setNextFlow(VacancyFlow);
// //
// // export class NameController extends Answer {
// //     waitForAnswer = true;
// //     async handler(ctx) {
// //         ctx.useMemo(ctx.phoneNumber, 'name', ctx.body);
// //         await ctx.reply(`Gracias, ${ctx.body}. ¿Cuál es tu profesión actual?`);
// //     }
// // }
// //
// // export class ProfessionController extends Answer {
// //     waitForAnswer = true;
// //     async handler(ctx) {
// //         ctx.useMemo(ctx.phoneNumber, 'profession', ctx.body);
// //         await ctx.reply("Perfecto. Ahora, por favor, indícanos tu correo electrónico.");
// //     }
// // }
// //
// // export class EmailController extends Answer {
// //     waitForAnswer = true;
// //     async handler(ctx) {
// //         ctx.useMemo(ctx.phoneNumber, 'email', ctx.body);
// //         await ctx.reply("Por último, ¿podrías proporcionarnos tu número de teléfono?");
// //     }
// // }
// //
// // export class PhoneController extends Answer {
// //     waitForAnswer = true;
// //     async handler(ctx) {
// //         ctx.useMemo(ctx.phoneNumber, 'phone', ctx.body);
// //         await ctx.reply("Gracias por proporcionar todos tus datos. Continuemos...");
// //     }
// // }
// //
// //
// //
// // export const FlowSaludo = new Flow()
// //     .addKeyboard(['hello', 'hi', 'howdy'])
// //     .addKeyboard({
// //         key: ["hola", "buenos días", "qué tal"],
// //         mode: 'equals',
// //         sensitive: false
// //     })
// //     .addAnswer('¡Hola! 😊 Bienvenido a nuestro sistema de reclutamiento. Por favor, proporciona la siguiente información separada por punto y coma: Nombre; Profesión; Correo; Teléfono.')
// //     .addAnswer(NameController)
// //     .addAnswer("Serás redirigido con un agente...")
// //     .setNextFlow(EnglishFlow)
// //     .setName("Saludo");
//
// export class MenuController extends Answer {
//     waitForAnswer = true;
//     async handler(ctx) {
//         const option = Number(ctx.body[0]);
//         if (isNaN(option) || !cafes[option - 1]) {
//             await ctx.reply('Usted ha no ha seleccionado una opción valida!');
//             ctx.moveToStep(ctx.phoneNumber, 0);
//             return;
//         }
//         ctx.useMemo(ctx.phoneNumber, 'cafe', cafes[option - 1]);
//         await ctx.reply(ctx.MemoText(ctx.phoneNumber, `Usted ha seleccionado Café {cafe}`));
//     }
// }