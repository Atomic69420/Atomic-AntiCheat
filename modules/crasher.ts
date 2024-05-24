import * as fs from "fs";
import * as path from "path";
import { sendwebhook, embed } from "../index";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { CANCEL } from "bdsx/common";

    console.log('[Atomic-AntiCheat] Loaded Crasher Detections')
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
          T2?: {
            enabled?: boolean;
            maxtextpersecond?: number
          }
        }
      };
    }
    const configdata = fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8');
    const config: acconfig = JSON.parse(configdata);
    const ptps = new Map<string, number>()
    if (config.modules.crasher.T2?.enabled === true) {
    setInterval(() => {
        for (const player of bedrockServer.serverInstance.getPlayers()) {
            if (!player) return;
             const cptps = ptps.get(player.getName())
             if (cptps) {
                 ptps.set(player.getName(), 0)
             }
        }
      }, 1000);
    }
      events.packetBefore(MinecraftPacketIds.CommandRequest).on((pkt, ni) => {
        const crash = pkt.command.match(/\@e/g)
        const cmd = pkt.command.split(" ")[0]
        const crashcmds = ["/me", "/tell", "/w", "/msg"]
            if (crash && crashcmds.includes(cmd)) {
            const username = ni.getActor()?.getName()
    
            if (config.modules.crasher.T1 === true) {
                if (username) {
                    bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Crasher [T1]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\nPlayer ${username} was kicked for Crasher [T1] This means the player sent a command with a @e in it which is used in horion freeze type 3.`);
                    
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Crasher [T1]',
                                description: `Kicked ${username} for Crasher [T1] This means the player sent a command with a @e in it which is used in horion freeze type 3.`,
                                color: 65280,
                            },
                        ];
                        
                        sendwebhook(config.webhook, embeds);
                    }
                    
                    return CANCEL;
                } else {
                    bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Crasher [T1]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\nA player was kicked for Crasher [T1] This means the player sent a command with a @e in it which is used in horion freeze type 3.`);
                    
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Crasher [T1]',
                                description: `Kicked a player for Crasher [T1] This means the player sent a command with a @e in it which is used in horion freeze type 3.`,
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
      events.packetBefore(MinecraftPacketIds.Text).on((pkt, ni) => {
      if (config.modules.crasher.T2?.enabled === true) {
        const cptps = ptps.get(ni.getActor()?.getName())
        if (cptps === undefined) { 
            ptps.set(ni.getActor()?.getName(), 0)
            return;
        }
        ptps.set(ni.getActor()?.getName(), cptps + 1)
     if (!config.modules.crasher.T2.maxtextpersecond) config.modules.crasher.T2.maxtextpersecond = 20
       if (cptps >= config.modules.crasher.T2.maxtextpersecond) {
        const username = ni.getActor()?.getName()
    
                if (username) {
                    bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Crasher [T2]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\nPlayer ${username} was kicked for Crasher [T2] This means the player sent ${config.modules.crasher.T2.maxtextpersecond} text messages in 1 second.`);
                    
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Crasher [T2]',
                                description: `Kicked ${username} for Crasher [T2] This means the player sent ${config.modules.crasher.T2.maxtextpersecond} text messages in 1 second.`,
                                color: 65280,
                            },
                        ];
                        
                        sendwebhook(config.webhook, embeds);
                    }
                    
                    return CANCEL;
                } else {
                    bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Crasher [T2]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\nA player was kicked for Crasher [T2] This means the player sent ${config.modules.crasher.T2.maxtextpersecond} text messages in 1 second.`);
                    
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Crasher [T2]',
                                description: `Kicked a player for Crasher [T2] This means the player sent ${config.modules.crasher.T2.maxtextpersecond} text messages in 1 second.`,
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