import * as fs from "fs";
import * as path from "path";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { serverProperties } from "bdsx/serverproperties";
    console.log('[Atomic-AntiCheat] Loaded Seed Hider')
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
          },
          seedhider: boolean;
      };
    }
    const configdata = fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8');
    const config: acconfig = JSON.parse(configdata);
    if (config.modules.seedhider === true) {
        if (serverProperties["client-side-chunk-generation-enabled"] === true) {
            console.log(`Seed hider causes issues when client-side-chunk-generation-enabled is set to true in server.properties please disable it or set seedhider to false in config.json for no further issues`)
        }
        events.packetSend(MinecraftPacketIds.StartGame).on((pkt, ni) => {
            pkt.settings.seed = 0;
          });
    }