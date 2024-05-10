import * as fs from "fs";
import * as path from "path";
import { sendwebhook, embed } from "../index";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { CANCEL } from "bdsx/common";
import { serverProperties } from "bdsx/serverproperties";
    console.log('[Atomic-AntiCheat] Loaded Bad Packet Detections')
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
            T2?: boolean;
          }
          speed: {
            [key: string]: boolean;
            T1?: boolean;
          }
        };
      }
      const configdata = fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8');
      const config: acconfig = JSON.parse(configdata);
      events.packetBefore(MinecraftPacketIds.EntityEvent).on((pkt, ni) => {
        if (config.modules.badpacket.T2 === false) return;
      if (pkt.event === 34) {
        const username = ni.getActor()?.getName()
        if (username) {
          bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Bad Packet [T2]\nDiscord: ${config.discord}`);
         console.log(`${config.prefix}\nPlayer ${username} was kicked for Bad Packet [T2] This means the player sent a EntityEvent packet trying to get xp.`)
         if (config.webhook !== "None") {
           const embeds: embed[] = [
             {
                 title: 'Bad Packet [T2]',
                 description: `Kicked ${username} for Bad Packet [T1] This means the player sent a EntityEvent packet trying to get xp.`,
                 color: 65280,
             },
         ];
         
         sendwebhook(config.webhook, embeds);
        }
        return CANCEL;
        } else {
          bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Bad Packet [T2]\nDiscord: ${config.discord}`);
          console.log(`${config.prefix}\nA player was kicked for Bad Packet [T2] This means the player sent a EntityEvent packet trying to get xp..`)
          if (config.webhook !== "None") {
            const embeds: embed[] = [
              {
                  title: 'Bad Packet [T2]',
                  description: `Kicked a player for Bad Packet [T2] This means the player sent a EntityEvent packet trying to get xp.`,
                  color: 65280,
              },
          ];
          
          sendwebhook(config.webhook, embeds);
          }
          return CANCEL;
        }
      }
    })
      if (serverProperties["server-authoritative-movement"] !== "client-auth") {
      events.packetBefore(MinecraftPacketIds.MovePlayer).on((pkt, ni) => {
        const username = ni.getActor()?.getName()
        if (config.modules.badpacket.T1 === true) {
         if (username) {
         bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Bad Packet [T1]\nDiscord: ${config.discord}`);
         console.log(`${config.prefix}\nPlayer ${username} was kicked for Bad Packet [T1] This means the player sent a move player packet which is only used if ServerAuthoritativeMovementMode is false.`)
         if (config.webhook !== "None") {
           const embeds: embed[] = [
             {
                 title: 'Bad Packet [T1]',
                 description: `Kicked ${username} for Bad Packet [T1] This means the player sent a move player packet which is only used if ServerAuthoritativeMovementMode is false.`,
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