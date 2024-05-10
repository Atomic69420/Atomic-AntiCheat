import * as fs from "fs";
import * as path from "path";
import { sendwebhook, embed } from "../index";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { CANCEL } from "bdsx/common";
import { EnchantUtils, Enchant } from "bdsx/bds/enchants";

    console.log('[Atomic-AntiCheat] Loaded Reach Detections')
    interface acconfig {
      discord: string;
      prefix: string;
      webhook: string;
      modules: {
        bot: {
          [key: string]: boolean;
          T1?: boolean;
          T2?: boolean;
          T3?: boolean;
          T4?: boolean;
        };
        badpacket: {
          [key: string]: boolean;
          T1?: boolean;
        }
        speed: {
          [key: string]: boolean;
          T1?: boolean;
        },
        crasher: {
          [key: string]: boolean;
          T1?: boolean;
          T2?: boolean;
        },
        reach: {
            [key: string]: boolean;
            T1?: boolean;
          }
      };
    }
    const configdata = fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8');
    const config: acconfig = JSON.parse(configdata);
    events.entityKnockback.on(event => {
        if (event.source && event.target) {
   if (event.source.isPlayer() === false) return;
   if (event.source.isMob() === false) return;
   if (event.target.getEntityTypeId() === 2854) return;
   const item = event.source.getNetworkIdentifier()?.getActor()?.getMainhandSlot()  
   const username = event.source.getNetworkIdentifier()?.getActor()?.getName()
        const dx = event.source.getPosition().x - event.target.getPosition().x;
        const dz = event.source.getPosition().z - event.target.getPosition().z
const distance = Math.sqrt(dx * dx + dz * dz);
if (distance >= 4.9) {
    if (config.modules.reach.T1 === true) {
      if (item !== undefined) {
        if (EnchantUtils.getEnchantLevel(Enchant.Type.WeaponKnockback, item) > 0) return;
      }
        if (username) {
        bedrockServer.serverInstance.disconnectClient(event.source.getNetworkIdentifier(), `${config.prefix}\nYou Have Been Kicked!\nReason: Reach [T1]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\n${username} was kicked for Reach [T1] This means the player hit a entity from or more than 4 blocks away.`);
                    
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Reach [T1]',
                                description: `Kicked ${username} for Reach [T1] This means the player hit a entity from or more than 4 blocks away.`,
                                color: 65280,
                            },
                        ];
                        
                        sendwebhook(config.webhook, embeds);
                    }
                    
                    return CANCEL;
                } else {
                    bedrockServer.serverInstance.disconnectClient(event.source.getNetworkIdentifier(), `${config.prefix}\nYou Have Been Kicked!\nReason: Reach [T1]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\nA player was kicked for Reach [T1] This means the player hit a entity from 4 blocks away.`);
                    
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Reach [T1]',
                                description: `Kicked a player for Reach [T1] This means the player hit a entity from or more than 4 blocks away.`,
                                color: 65280,
                            },
                        ];
                        
                        sendwebhook(config.webhook, embeds);
                    }
                    
                    return CANCEL;
    }
    }
        }
    }
    });