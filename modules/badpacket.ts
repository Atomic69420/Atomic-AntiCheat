import * as fs from "fs";
import { pdb, pdatar, sendwebhook, embed } from "../index.ts";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { CANCEL } from "bdsx/common";
export function detectBadPackets() {
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
        };
      }
      const configdata = fs.readFileSync('./config.json', 'utf8');
      const config: botconfig = JSON.parse(configdata);
      events.packetBefore(MinecraftPacketIds.MovePlayer), (pkt, ni) {
        const pdata: pdatar | undefined = pdb.get(ni);
        if (config.modules.badpacket.T1 === true) {
         if (pdata) {
         bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Bad Packet [T1]\nDiscord: ${config.discord}`);
         console.log(`${config.prefix}\nPlayer ${pdata.username} was kicked for Bad Packet [T1] This means the player sent a move player packet which is only used if ServerAuthoritativeMovementMode is false.`)
         if (config.webhook !== "None") {
           const embeds: embed[] = [
             {
                 title: 'Bad Packet [T1]',
                 description: `Kicked ${pdata.username} for Bad Packet [T1] This means the player sent a move player packet which is only used if ServerAuthoritativeMovementMode is false.`,
                 color: 202334,
             },
         ];
         
         sendwebhook(config.webhook, embeds);
         }
         return CANCEL;
        }
       } else {
         bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Bad Packet [T1]\nDiscord: ${config.discord}`);
         console.log(`${config.prefix}\nA player was kicked for Bad Packet [T1] This means the player sent a move player packet which is only used if ServerAuthoritativeMovementMode is false.`)
         if (config.webhook !== "None") {
           const embeds: embed[] = [
             {
                 title: 'Bad Packet [T1]',
                 description: `Kicked a player for Bad Packet [T1] This means the player sent a move player packet which is only used if ServerAuthoritativeMovementMode is false.`,
                 color: 202334,
             },
         ];
         
         sendwebhook(config.webhook, embeds);
         }
         return CANCEL;
       }
      }
    }