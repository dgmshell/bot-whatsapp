import { Flow } from "../../Flow/Flow.js";
import { OneLineMessage } from "../../Flow/utils/OneLineMessage.js";
import { Final } from "../Final/index.js";
import { MenuController } from "./MenuController.js";
export const MenuFlow = new Flow()
    .addKeyboard(["menu", "menú"])
    .addAnswer(`Buenas tardes señor {name}, en que vacante esta interesado?`)
    .addAnswer(OneLineMessage(["Tenemos las siguientes vacantes", "1. Customer service", "2. Compliance", "3. Llamadas NSF"]))
    .addAnswer(MenuController)
    .setName("Menú");

    // .setNextFlow(Final);
