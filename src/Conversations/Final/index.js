import { Flow } from "../../Flow/Flow.js";
import fs from "fs";
// export const Final = new Flow()
//     .addAnswer("Gracias por tus datos! :D")
//     .addAnswer("Paragon te enviara un nuevo mensaje una vez analicemos tus datos.")
//     .setName("Despedida");
//
//
//

export const Final = new Flow()
    .addAnswer("Gracias por tus datos! :D")
    .addAnswer({
        image: fs.readFileSync("./src/Media/coffe.jpg"),
        caption: "Bienvenido te muestro una imagen de nuestra marca, cual es tu nombre?",
    }).setName("Despedida");