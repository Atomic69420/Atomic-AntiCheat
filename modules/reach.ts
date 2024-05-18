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
            maxreach?: number;
          }
      };
    }
    const configdata = fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8');
    const config: acconfig = JSON.parse(configdata);
    events.entityHurt.on(event => {
       if (event.damageSource.getDamagingEntity()) {
        if (event.damageSource.getDamagingEntity()?.isPlayer() === false) return;
        if (event.entity.getEntityTypeId() === 2854) return;
        if (event.damageSource.cause !== 2) return;
        if (event.damageSource.getDamagingEntity()?.getNetworkIdentifier()?.getActor()) {
        const item = event.damageSource.getDamagingEntity()?.getNetworkIdentifier()?.getActor()?.getMainhandSlot()  
        const username = event.damageSource.getDamagingEntity()?.getNetworkIdentifier()?.getActor()?.getName()
        const dx = event.damageSource.getDamagingEntity()?.getNetworkIdentifier()?.getActor()?.getPosition().x - event.entity.getPosition().x;
        const dz = event.damageSource.getDamagingEntity()?.getNetworkIdentifier()?.getActor()?.getPosition().z - event.entity.getPosition().z
        const distance = Math.sqrt(dx * dx + dz * dz);
        if (config.modules.reach.maxreach === undefined) config.modules.reach.maxreach = 4.9
        if (distance >= config.modules.reach.maxreach) {
          if (config.modules.reach.T1 === true) {
            if (item !== undefined) {
              if (EnchantUtils.getEnchantLevel(Enchant.Type.WeaponKnockback, item) > 0) return;
            }
            if (username) {
              bedrockServer.serverInstance.disconnectClient(event.damageSource.getDamagingEntity()?.getNetworkIdentifier(), `${config.prefix}\nYou Have Been Kicked!\nReason: Reach [T1]\nDiscord: ${config.discord}`);
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
                    bedrockServer.serverInstance.disconnectClient(event.damageSource.getDamagingEntity()?.getNetworkIdentifier(), `${config.prefix}\nYou Have Been Kicked!\nReason: Reach [T1]\nDiscord: ${config.discord}`);
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
       }
    })