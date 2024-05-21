import * as fs from "fs";
import * as path from "path";
import { sendwebhook, embed } from "../index";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { CANCEL } from "bdsx/common";
import { MinecraftPacketIds } from "bdsx/bds/packetids";

    console.log('[Atomic-AntiCheat] Loaded Autoclicker Detections')
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
          },
          autoclicker: {
            [key: string]: boolean;
            T1?: boolean;
            maxcps?: number;
          }
      };
    }
    const configdata = fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8');
    const config: acconfig = JSON.parse(configdata);
    const cps = new Map<string, number>()
    if (config.modules.autoclicker.T1 === true) {
      setInterval(() => {
          for (const player of bedrockServer.serverInstance.getPlayers()) {
              if (player) {
                  cps.set(player.getName(), 0);
              }
          }
      }, 1000);
  }
    events.packetBefore(MinecraftPacketIds.InventoryTransaction).on((pkt, ni) => {
      if (pkt.transaction?.isItemUseOnEntityTransaction() === false) return;
      const username = ni.getActor()?.getName()
      if (username) {
        const cpsm = cps.get(username) || 0
        cps.set(username, cpsm + 1)
        if (!config.modules.autoclicker.maxcps) config.modules.autoclicker.maxcps = 20
        if (cpsm >= config.modules.autoclicker.maxcps) {
          bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Autoclicker [T1], CPS: ${cpsm}\nDiscord: ${config.discord}`);
          console.log(`${config.prefix}\nPlayer ${username} was kicked for Autoclicker [T1] This means the player attacked at a rate of ${cpsm} which is greater than${config.modules.autoclicker.maxcps}.`);
          
          if (config.webhook !== "None") {
              const embeds: embed[] = [
                  {
                      title: 'Autoclicker [T1]',
                      description: `Kicked ${username} for Autoclicker [T1] This means the player attacked at a rate of ${cpsm} which is greater than ${config.modules.autoclicker.maxcps}.`,
                      color: 65280,
                  },
              ];
              
              sendwebhook(config.webhook, embeds);
          }
          
          return CANCEL;
        }
      } else {
        bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Autoclicker [T1], CPS: ${cpsm}\nDiscord: ${config.discord}`);
        console.log(`${config.prefix}\nA player was kicked for Autoclicker [T1] This means the player attacked at a rate of ${cpsm} which is greater than ${config.modules.autoclicker.maxcps}.`);
          
          if (config.webhook !== "None") {
              const embeds: embed[] = [
                  {
                      title: 'Autoclicker [T1]',
                      description: `Kicked a player for Autoclicker [T1] This means the player attacked at a rate of ${cpsm} which is greater than ${config.modules.autoclicker.maxcps}.`,
                      color: 65280,
                  },
              ];
              
              sendwebhook(config.webhook, embeds);
          }
          
          return CANCEL;
      }
    })