import { events } from "bdsx/event";
import { detectBots } from "./modules/bot.ts"
events.serverOpen.on(() => {
	console.log('[Atomic-AntiCheat] Successfully Started Loading Sequence!')
    detectBots()
});