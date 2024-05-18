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
          }
      };
    }
    const configdata = fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8');
    const config: acconfig = JSON.parse(configdata);
    const cps = new Map<string, number>()
    if (config.modules.autoclicker.T1 === true) {
    setInterval(() => {
        for (const player of bedrockServer.serverInstance.getPlayers()) {
            if (!player) return;
             const cpsm = cps.get(player.getName())
             if (cpsm) {
                cps.set(player.getName(), 0)
             }
        }
      }, 1000);
    }
    events.packetBefore(MinecraftPacketIds.InventoryTransaction).on((pkt, ni) => {
        const cpsm = cps.get(ni.getActor()?.getName())
        if (cpsm) {
            cps.set(ni.getActor()?.getName(), cpsm)
        }
    })