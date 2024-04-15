import * as fs from "fs";
import * as path from "path";
import { pdb, pdatar, sendwebhook, embed } from "../index";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { CANCEL } from "bdsx/common";

    console.log('[Atomic-AntiCheat] Loaded Reach Detections')
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
          }
      };
    }
    const configdata = fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8');
    const config: acconfig = JSON.parse(configdata);
    events.packetAfter(MinecraftPacketIds.Login).on((pkt, ni) => {
        if (config.modules.badskin.T1 === false) return;
        const connreq = pkt.connreq;
        if (connreq) {
            const cert = connreq.cert
            const username = cert.getIdentityName()
            const connreqdata = connreq.getJsonValue()!;
            const gemdata = Buffer.from(connreq.getJson()!.get("SkinResourcePatch").value(), "base64")
            if (gemdata.includes(' "default" : "geometry.humanoid"\n')) {
                bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Bad Skin [T1]\nDiscord: ${config.discord}`);
                console.log(`${config.prefix}\nPlayer ${username} was kicked for Bad Skin [T1] This means the player tried to join with a invisible skin.`)
                if (config.webhook !== "None") {
                  const embeds: embed[] = [
                    {
                        title: 'Bad Skin [T1]',
                        description: `Kicked ${username} for Bad Skin [T1] This means the player tried to join with a invisible skin.`,
                        color: 65280,
                    },
                ];
                
                sendwebhook(config.webhook, embeds);
                }
            }
        }
        })
    events.packetBefore(MinecraftPacketIds.PlayerSkin).on((pkt, ni) => {
        if (config.modules.badskin.T2 === false) return;
        if (pkt.skin.resourcePatch.includes(' "default" : "geometry.humanoid"\n')) {
            const pdata: pdatar | undefined = pdb.get(ni.toString().split(":")[0]);
            if (pdata) {
                bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Bad Skin [T2]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\nPlayer ${pdata.username} was kicked for Bad Skin [T2] This means the player changed their skin to a invisible skin.`);
                    
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Bad Skin [T2]',
                                description: `Kicked ${pdata.username} for Bad Skin [T2] This means the player changed their skin to a invisible skin.`,
                                color: 65280,
                            },
                        ];
                        
                        sendwebhook(config.webhook, embeds);
                    }

            return CANCEL;
            } else {
                bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Bad Skin [T2]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\nA player was kicked for Bad Skin [T2] This means the player changed their skin to a invisible skin.`);
                    
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Bad Skin [T2]',
                                description: `Kicked a player for Bad Skin [T2] This means the player changed their skin to a invisible skin.`,
                                color: 65280,
                            },
                        ];
                        
                        sendwebhook(config.webhook, embeds);
                    }
                    
                    return CANCEL;
            }
       }
    })