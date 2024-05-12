import * as fs from "fs";
import * as path from "path";
import { sendwebhook, embed } from "../index";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { CANCEL } from "bdsx/common";

    console.log('[Atomic-AntiCheat] Loaded NoFall Detections')
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
          badskin: {
            [key: string]: boolean;
            T1?: boolean;
            T2?: boolean;
          },
          nofall: {
            [key: string]: boolean;
            T1?: boolean;
            T2?: boolean;
          }
      };
    }
    const configdata = fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8');
    const config: acconfig = JSON.parse(configdata);
    const rps = new Map<string, number>()
    if (config.modules.nofall.T1 === true) {
    setInterval(() => {
        for (const player of bedrockServer.serverInstance.getPlayers()) {
            if (!player) return;
             const rpsm = rps.get(player.getName())
             if (rpsm) {
                 rps.set(player.getName(), 0)
             }
        }
      }, 1000);
    }
    events.packetBefore(MinecraftPacketIds.PlayerAction).on((pkt, ni) => {
      console.log(pkt)
      console.log(rps.get(ni.getActor()?.getName()))
      const username = ni.getActor()?.getName()
      if (pkt.action === 7 && pkt.face === 0 && config.modules.nofall.T2 === true) {
        if (username) {
          bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: NoFall [T2]\nDiscord: ${config.discord}`);
                  console.log(`${config.prefix}\nPlayer ${username} was kicked for NoFall [T2] This means the player sent a invalid respawn packet.`);
                  if (config.webhook !== "None") {
                      const embeds: embed[] = [
                          {
                              title: 'NoFall [T2]',
                              description: `Kicked ${username} for NoFall [T2] This means the player sent a invalid respawn packet.`,
                              color: 65280,
                          },
                      ];
                      
                      sendwebhook(config.webhook, embeds);
                  }
                  
                  return CANCEL;
          } else {
              bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: NoFall [T2]\nDiscord: ${config.discord}`);
              console.log(`${config.prefix}\nA player was kicked for NoFall [T2] This means the player sent a invalid respawn packet.`);
              if (config.webhook !== "None") {
                  const embeds: embed[] = [
                      {
                          title: 'NoFall [T2]',
                          description: `Kicked a player for NoFall [T1] This means the player sent a invalid respawn packet.`,
                          color: 65280,
                      },
                  ];
                  
                  sendwebhook(config.webhook, embeds);
              }
              
              return CANCEL;
        }
      }
        if (config.modules.nofall.T1 === false) return;
        if (pkt.action === 7) {
          const rpsm = rps.get(ni.getActor()?.getName())
          if (rpsm) {
        rps.set(ni.getActor()?.getName(), rpsm + 1)
          }
        }
        const rpsm = rps.get(ni.getActor()?.getName())
        if (rpsm === undefined) {
          rps.set(ni.getActor()?.getName(), 0)
          return;
        }
        if (rpsm >= 2) {
            if (username) {
                bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: NoFall [T1]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\nPlayer ${username} was kicked for NoFall [T1] This means the player sent 2 respawn actions within a second.`);
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'NoFall [T1]',
                                description: `Kicked ${username} for NoFall [T1] This means the player sent 2 respawn actions within a second.`,
                                color: 65280,
                            },
                        ];
                        
                        sendwebhook(config.webhook, embeds);
                    }
                    
                    return CANCEL;
            } else {
                bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: NoFall [T1]\nDiscord: ${config.discord}`);
                console.log(`${config.prefix}\nA player was kicked for NoFall [T1] This means the player sent 2 respawn actions within a second.`);
                if (config.webhook !== "None") {
                    const embeds: embed[] = [
                        {
                            title: 'NoFall [T1]',
                            description: `Kicked a player for NoFall [T1] This means the player sent 2 respawn actions within a second.`,
                            color: 65280,
                        },
                    ];
                    
                    sendwebhook(config.webhook, embeds);
                }
                
                return CANCEL;
            }
        }
    })