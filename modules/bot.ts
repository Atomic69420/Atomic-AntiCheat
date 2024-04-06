import * as fs from "fs";
import { pdb, pdatar, sendwebhook, embed } from "../index.ts";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { CANCEL } from "bdsx/common";
export function detectBots() {
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
        };
      }
      const configdata = fs.readFileSync('./config.json', 'utf8');
      const config: botconfig = JSON.parse(configdata);
    events.packetAfter(MinecraftPacketIds.Login), (pkt, ni) => {
        const connreq = pkt.connreq;
        if (connreq) {
            const cert = connreq.cert
            const tid = cert.json.value()["extraData"]["titleId"];
            const username = cert.getIdentityName()
            const devicemodel = connreq.getJsonValue()!["DeviceModel"];
            if (config.modules.bot.T1 === true) {
            if (tid === 2047319603) {
                bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Suspected Bot [T1]\nDiscord: ${config.discord}`);
                console.log(`${config.prefix}\nPlayer ${username} was kicked for Suspected Bot [T1] This means the player is either on Nintendo or a bot.`)
                if (config.webhook !== "None") {
                  const embeds: embed[] = [
                    {
                        title: 'Suspected Bot [T1]',
                        description: `Kicked ${username} for Suspected Bot [T1] This means the player is either on Nintendo or a bot.`,
                        color: 202334,
                    },
                ];
                
                sendwebhook(config.webhook, embeds);
                }
            }
        }
        if (config.modules.bot.T2 === true) {
          if (devicemodel === "PrismarineJS") {
              bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Suspected Bot [T2]\nDiscord: ${config.discord}`);
              console.log(`${config.prefix}\nPlayer ${username} was kicked for Suspected Bot [T2] This means the player is a bot`)
              if (config.webhook !== "None") {
                const embeds: embed[] = [
                  {
                      title: 'Suspected Bot [T2]',
                      description: `Kicked ${username} for Suspected Bot [T2] This means the player is a bot`,
                      color: 202334,
                  },
              ];
              
              sendwebhook(config.webhook, embeds);
              }
          }
      }
    }
  }
  events.packetBefore(MinecraftPacketIds.SubClientLogin), (pkt, ni) => {
    const pdata: pdatar | undefined = pdb.get(ni);
     if (config.modules.bot.T3 === true) {
      if (pdata) {
      bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Suspected Bot [T3]\nDiscord: ${config.discord}`);
      console.log(`${config.prefix}\nPlayer ${pdata.username} was kicked for Suspected Bot [T3] This means the player requested for a sub client to join which is a fake player.`)
      if (config.webhook !== "None") {
        const embeds: embed[] = [
          {
              title: 'Suspected Bot [T3]',
              description: `Kicked ${pdata.username} for Suspected Bot [T3] This means the player requested for a sub client to join which is a fake player.`,
              color: 202334,
          },
      ];
      
      sendwebhook(config.webhook, embeds);
      }
      return CANCEL;
     }
    } else {
      bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Suspected Bot [T3]\nDiscord: ${config.discord}`);
      console.log(`${config.prefix}\nA player was kicked for Suspected Bot [T3] This means the player requested for a sub client to join which is a fake player.`)
      if (config.webhook !== "None") {
        const embeds: embed[] = [
          {
              title: 'Suspected Bot [T3]',
              description: `Kicked a player for Suspected Bot [T3] This means the player requested for a sub client to join which is a fake player.`,
              color: 202334,
          },
      ];
      
      sendwebhook(config.webhook, embeds);
      }
      return CANCEL;
    }
  }
}