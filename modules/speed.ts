import * as fs from "fs";
import * as path from "path";
import { sendwebhook, embed } from "../index";
import { events } from "bdsx/event";
import { AbilitiesIndex } from "bdsx/bds/abilities";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { ArmorSlot } from "bdsx/bds/inventory";
import { EnchantUtils, Enchant } from "bdsx/bds/enchants";
import { CANCEL } from "bdsx/common";

    console.log('[Atomic-AntiCheat] Loaded Speed Detections')
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
        };
        badpacket: {
          [key: string]: boolean;
          T1?: boolean;
        }
        speed: {
          [key: string]: boolean;
          T1?: boolean;
        }
      };
    }
    const configdata = fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8');
      const config: acconfig = JSON.parse(configdata);
      events.packetBefore(MinecraftPacketIds.PlayerAuthInput).on((pkt, ni) => {
        const username = ni.getActor()?.getName()
        const actor = ni.getActor()
        const abilities = actor?.abilities;
        const creativefly = abilities?.getAbility(AbilitiesIndex.MayFly)
        const isRiding = actor?.isRiding()
        const elytra = actor?.getArmor(ArmorSlot.Torso);
        const trident = actor?.getMainhandSlot()
        if (config.modules.speed.T1 === true) {
          if (pkt.delta === undefined) return;
          if (creativefly !== undefined && creativefly.value.boolVal === true) return;
          if (actor?.isCreative() !== undefined && actor.isCreative() === true) return;
          if (isRiding === true) return;
          if (actor?.getLastHurtByMobTime() !== undefined && actor?.getLastHurtByMobTime() !== 0) return;
          if (actor?.getLastHurtCause() === 11) return;
          if (elytra !== undefined) {
          if (elytra.getRawNameId() === "elytra") return;
          }
          if (trident !== undefined) {
            if (trident.getRawNameId() === "trident" && EnchantUtils.getEnchantLevel(Enchant.Type.TridentRiptide, trident) > 0) return;
            }
          if (Math.abs(pkt.delta.x) > 0.5 || Math.abs(pkt.delta.z) > 0.5) {
            if (username) {
              bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Speed [T1]\nDiscord: ${config.discord}`);
              console.log(`${config.prefix}\nPlayer ${username} was kicked for Speed [T1] This means the player was moving too fast.`);
              
              if (config.webhook !== "None") {
                  const embeds: embed[] = [
                      {
                          title: 'Speed [T1]',
                          description: `Kicked ${username} for Speed [T1] This means the player was moving too fast.`,
                          color: 65280,
                      },
                  ];
                  
                  sendwebhook(config.webhook, embeds);
              }
              return CANCEL;
          } else {
              bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Speed [T1]\nDiscord: ${config.discord}`);
              console.log(`${config.prefix}\nA player was kicked for Speed [T1] This means the player was moving too fast.`);
              
              if (config.webhook !== "None") {
                  const embeds: embed[] = [
                      {
                          title: 'Speed [T1]',
                          description: `Kicked a player for Speed [T1] This means the player was moving too fast.`,
                          color: 65280,
                      },
                  ];
                  
                  sendwebhook(config.webhook, embeds);
              }
              return CANCEL;
          }
        }
      }
      })