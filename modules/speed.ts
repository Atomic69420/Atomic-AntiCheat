import * as fs from "fs";
import * as path from "path";
import { pdb, pdatar, sendwebhook, embed } from "../index";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { CANCEL } from "bdsx/common";
import { ArmorSlot, HandSlot } from "bdsx/bds/inventory";

    console.log('[Atomic-AntiCheat] Loaded Bot Detections')
    interface botconfig {
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
      const config: botconfig = JSON.parse(configdata);
      events.packetBefore(MinecraftPacketIds.PlayerAuthInput).on((pkt, ni) => {
        const pdata: pdatar | undefined = pdb.get(ni.toString().split(":")[0]);
        const actor = ni.getActor()
        const isRiding = actor?.isRiding()
        const elytra = actor?.getArmor(ArmorSlot.Torso);
        const trident = actor?.getMainhandSlot()
        if (config.modules.speed.T1 === true) {
          if (pkt.delta === undefined) return;
          if (isRiding === true) return;
          if (elytra !== undefined) {
          if (elytra.getRawNameId() === "elytra") return;
          }
          if (trident !== undefined) {
            if (trident.getRawNameId() === "trident") return;
            }
          if (Math.abs(pkt.delta.x) > 0.5 || Math.abs(pkt.delta.z) > 0.5) {
            if (pdata) {
              bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Speed [T1]\nDiscord: ${config.discord}`);
              console.log(`${config.prefix}\nPlayer ${pdata.username} was kicked for Speed [T1] This means the player was moving too fast`);
              
              if (config.webhook !== "None") {
                  const embeds: embed[] = [
                      {
                          title: 'Speed [T1]',
                          description: `Kicked ${pdata.username} for Speed [T1] This means the player was moving too fast`,
                          color: 65280,
                      },
                  ];
                  
                  sendwebhook(config.webhook, embeds);
              }
              
              return CANCEL;
          } else {
              bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Speed [T1]\nDiscord: ${config.discord}`);
              console.log(`${config.prefix}\nA player was kicked for Speed [T1] This means the player was moving too fast`);
              
              if (config.webhook !== "None") {
                  const embeds: embed[] = [
                      {
                          title: 'Speed [T1]',
                          description: `Kicked a player for Speed [T1] This means the player was moving too fast`,
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