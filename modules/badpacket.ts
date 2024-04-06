import * as fs from "fs";
import * as path from "path";
import { pdb, pdatar, sendwebhook, embed } from "../index";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { CANCEL } from "bdsx/common";
import { serverProperties } from "bdsx/serverproperties";
    console.log('[Atomic-AntiCheat] Loaded Bad Packet Detections')
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
      if (serverProperties["server-authoritative-movement"] !== "client-auth") {
      events.packetBefore(MinecraftPacketIds.MovePlayer).on((pkt, ni) => {
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
                 color: 65280,
             },
         ];
         
         sendwebhook(config.webhook, embeds);
         }
         return CANCEL;
        } else {
         bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Bad Packet [T1]\nDiscord: ${config.discord}`);
         console.log(`${config.prefix}\nA player was kicked for Bad Packet [T1] This means the player sent a move player packet which is only used if ServerAuthoritativeMovementMode is false.`)
         if (config.webhook !== "None") {
           const embeds: embed[] = [
             {
                 title: 'Bad Packet [T1]',
                 description: `Kicked a player for Bad Packet [T1] This means the player sent a move player packet which is only used if ServerAuthoritativeMovementMode is false.`,
                 color: 65280,
             },
         ];
         
         sendwebhook(config.webhook, embeds);
         }
         return CANCEL;
       }
      }
    })
  }