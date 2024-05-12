import * as fs from "fs";
import * as path from "path";
import { sendwebhook, embed } from "../index";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { CANCEL } from "bdsx/common";
console.log('[Atomic-AntiCheat] Loaded Device Blocking')
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
      },
      deviceblock: {
        [key: string]: boolean;
        Windows?: boolean,
        Android?: boolean,
        iOS?: boolean,
        Xbox?: boolean,
        PlayStation?: boolean,
        Nintendo?: boolean

      }
  };
}
const configdata = fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8');
const config: acconfig = JSON.parse(configdata);
events.packetAfter(MinecraftPacketIds.Login).on((pkt, ni) => {
    const connreq = pkt.connreq;
    if (connreq) {
        const cert = connreq.getCertificate();
        if (cert && cert.getIdentityName() && cert.getXuid() && cert.getIdentityString()) {
            const tid = cert.json.value()["extraData"]["titleId"];
            const username = cert.getIdentityName()
            let device;
            if (tid === "1739947436" && config.modules.deviceblock.Android === true) {
                device = "Android";
            } else if (tid === "1810924247" && config.modules.deviceblock.iOS === true) {
                device = "iOS";
            } else if (tid === "896928775" && config.modules.deviceblock.Windows === true) {
                device = "Windows";
            } else if (tid === "2044456598" && config.modules.deviceblock.PlayStation === true) {
                device = "PlayStation";
            } else if (tid === "2047319603" && config.modules.deviceblock.Nintendo === true) {
                device = "Nintendo";
            } else if (tid === "1828326430" && config.modules.deviceblock.Xbox === true) {
                device = "Xbox";
            }

            if (device) {
                bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Blocked Device: ${device}\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\nPlayer ${username} was kicked for Blocked Device This means the player joined on ${device} which is blocked.`);
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Blocked Device',
                                description: `Kicked ${username} for Blocked Device This means the player joined on ${device} which is blocked.`,
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