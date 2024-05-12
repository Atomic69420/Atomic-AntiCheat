import * as fs from "fs";
import * as path from "path";
import { sendwebhook, embed } from "../index";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { CANCEL } from "bdsx/common";

    console.log('[Atomic-AntiCheat] Loaded Bot Detections')
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
          T5?: boolean;
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
      events.packetAfter(MinecraftPacketIds.Login).on((pkt, ni) => {
        const connreq = pkt.connreq;
        if (connreq) {
            const cert = connreq.cert
            const connreqdata = connreq.getJsonValue()!;
            const tid = cert.json.value()["extraData"]["titleId"];
            const username = cert.getIdentityName()
            const devicemodel = connreq.getJsonValue()!["DeviceModel"];
            if (config.modules.bot.T1 === true) {
            if (tid === "2047319603") {
                bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Suspected Bot [T1]\nDiscord: ${config.discord}`);
                console.log(`${config.prefix}\nPlayer ${username} was kicked for Suspected Bot [T1] This means the player is either on Nintendo or a bot.`)
                if (config.webhook !== "None") {
                  const embeds: embed[] = [
                    {
                        title: 'Suspected Bot [T1]',
                        description: `Kicked ${username} for Suspected Bot [T1] This means the player is either on Nintendo or a bot.`,
                        color: 65280,
                    },
                ];
                
                sendwebhook(config.webhook, embeds);
                }
            }
        }
        if (config.modules.bot.T2 === true) {
          if (devicemodel === "PrismarineJS") {
              bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Suspected Bot\nDiscord: ${config.discord}`);
              console.log(`${config.prefix}\nPlayer ${username} was kicked for Suspected Bot [T2] This means the player is a bot`)
              if (config.webhook !== "None") {
                const embeds: embed[] = [
                  {
                      title: 'Suspected Bot [T2]',
                      description: `Kicked ${username} for Suspected Bot [T2] This means the player is a bot`,
                      color: 65280,
                  },
              ];
              
              sendwebhook(config.webhook, embeds);
              }
          }
      }
      if (config.modules.bot.T4 === true) {
        if (typeof connreqdata.ClientRandomId === "string") {
          bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Suspected Bot\nDiscord: ${config.discord}`);
              console.log(`${config.prefix}\nPlayer ${username} was kicked for Suspected Bot [T4] This means the player is a bot`)
              if (config.webhook !== "None") {
                const embeds: embed[] = [
                  {
                      title: 'Suspected Bot [T4]',
                      description: `Kicked ${username} for Suspected Bot [T4] This means the player is a bot`,
                      color: 65280,
                  },
              ];
              
              sendwebhook(config.webhook, embeds);
              }
        }
      }
    }
  })
  events.packetBefore(MinecraftPacketIds.SubClientLogin).on((pkt, ni) => {
    const username = ni.getActor()?.getName()
    
    if (config.modules.bot.T3 === true) {
        if (username) {
            bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Suspected Bot\nDiscord: ${config.discord}`);
            console.log(`${config.prefix}\nPlayer ${username} was kicked for Suspected Bot [T3] This means the player requested for a sub client to join which is a fake player.`);
            
            if (config.webhook !== "None") {
                const embeds: embed[] = [
                    {
                        title: 'Suspected Bot [T3]',
                        description: `Kicked ${username} for Suspected Bot [T3] This means the player requested for a sub client to join which is a fake player.`,
                        color: 65280,
                    },
                ];
                
                sendwebhook(config.webhook, embeds);
            }
            
            return CANCEL;
        } else {
            bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Suspected Bot\nDiscord: ${config.discord}`);
            console.log(`${config.prefix}\nA player was kicked for Suspected Bot [T3] This means the player requested for a sub client to join which is a fake player.`);
            
            if (config.webhook !== "None") {
                const embeds: embed[] = [
                    {
                        title: 'Suspected Bot [T3]',
                        description: `Kicked a player for Suspected Bot [T3] This means the player requested for a sub client to join which is a fake player.`,
                        color: 65280,
                    },
                ];
                
                sendwebhook(config.webhook, embeds);
            }
            
            return CANCEL;
        }
    }
});
events.packetBefore(MinecraftPacketIds.TickSync).on((pkt, ni) => {
    const username = ni.getActor()?.getName()
    
  if (config.modules.bot.T5 === true) {
      if (username) {
          bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Suspected Bot\nDiscord: ${config.discord}`);
          console.log(`${config.prefix}\nPlayer ${username} was kicked for Suspected Bot [T5] This means the player sent a tick_sync packet which is used in bedrock protocol.`);
          
          if (config.webhook !== "None") {
              const embeds: embed[] = [
                  {
                      title: 'Suspected Bot [T5]',
                      description: `Kicked ${username} for Suspected Bot [T5] This means the player sent a tick_sync packet which is used in bedrock protocol.`,
                      color: 65280,
                  },
              ];
              
              sendwebhook(config.webhook, embeds);
          }
          
          return CANCEL;
      } else {
          bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Suspected Bot\nDiscord: ${config.discord}`);
          console.log(`${config.prefix}\nA player was kicked for Suspected Bot [T5] This means the player sent a tick_sync packet which is used in bedrock protocol.`);
          
          if (config.webhook !== "None") {
              const embeds: embed[] = [
                  {
                      title: 'Suspected Bot [T5]',
                      description: `Kicked a player for Suspected Bot [T5] This means the player sent a tick_sync packet which is used in bedrock protocol.`,
                      color: 65280,
                  },
              ];
              
              sendwebhook(config.webhook, embeds);
          }
          
          return CANCEL;
      }
  }
});