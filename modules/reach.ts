import * as fs from "fs";
import * as path from "path";
import { pdb, pdatar, sendwebhook, embed } from "../index";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { CANCEL } from "bdsx/common";

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
            const pdata: pdatar | undefined = pdb.get(event.source.getNetworkIdentifier().toString().split(":")[0]);
        const dx = event.source.getPosition().x - event.target.getPosition().x;
        const dz = event.source.getPosition().z - event.target.getPosition().z
const distance = Math.sqrt(dx * dx + dz * dz);
if (4 <= distance) {
    if (config.modules.reach.T1 === true) {
        if (pdata) {
        bedrockServer.serverInstance.disconnectClient(event.source.getNetworkIdentifier(), `${config.prefix}\nYou Have Been Kicked!\nReason: Reach [T1]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\n${pdata.username} was kicked for Reach [T1] This means the player hit a entity from or more than 4 blocks away.`);
                    
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Reach [T1]',
                                description: `Kicked ${pdata.username} for Reach [T1] This means the player hit a entity from or more than 4 blocks away.`,
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