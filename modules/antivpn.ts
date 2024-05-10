import * as fs from "fs";
import * as path from "path";
import * as http from 'http'
import { sendwebhook, embed } from "../index";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";

    console.log('[Atomic-AntiCheat] Loaded VPN/Proxy Detections')
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
          antivpn: {
            [key: string]: boolean;
            T1?: boolean;
          }
      };
    }
    const configdata = fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8');
    const config: acconfig = JSON.parse(configdata);
    async function getproxy(ip: string): Promise<{ proxy: boolean }> {
        const options = {
            hostname: 'ip-api.com',
            path: `/json/${ip}?fields=proxy`,
            headers: {
                'Accept-Language': 'en-US'
            }
        };
    
        return new Promise<{ proxy: boolean }>((resolve, reject) => {
            const req = http.get(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    const response = JSON.parse(data);
                    resolve(response);
                });
            });
    
            req.on('error', (err) => {
                console.error('Error:', err);
                reject(err);
            });
    
            req.end();
        });
    }
    events.packetAfter(MinecraftPacketIds.Login).on(async (pkt, ni) => {
        if (config.modules.antivpn.T1 === false) return;
        const connreq = pkt.connreq;
        if (connreq) {
            const cert = connreq.cert
            const username = cert.getIdentityName()
            const connreqdata = connreq.getJsonValue()!;
            const proxyStatus = await getproxy(ni.getAddress())
            if (proxyStatus.proxy === true) {
                bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Anti VPN [T1]\nDiscord: ${config.discord}`);
                console.log(`${config.prefix}\nPlayer ${username} was kicked for Anti VPN [T1] This means the player was using a vpn, VPNIP: ${ni.getAddress()}.`)
                if (config.webhook !== "None") {
                  const embeds: embed[] = [
                    {
                        title: 'Anti VPN [T1]',
                        description: `Kicked ${username} for Anti VPN [T1] This means the player was using a vpn, VPNIP: ${ni.getAddress()}`,
                        color: 65280,
                    },
                ];
                
                sendwebhook(config.webhook, embeds);
                }
            }
            }
        })