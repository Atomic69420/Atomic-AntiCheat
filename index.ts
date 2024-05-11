import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { LoginPacket } from "bdsx/bds/packets";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { events } from "bdsx/event";
import * as fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";
import * as mongoose from "mongoose";
    interface acconfig {
      discord: string;
      prefix: string;
      webhook: string;
      mongodburl: string;
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
        },
        deviceidspoof: {
          [key: string]: boolean;
          T1?: boolean;
        },
        devicespoof: {
            [key: string]: boolean;
            T1?: boolean;
          },
          altdetection: {
            [key: string]: boolean;
            T1?: boolean;
          }
      };
    }
    const configdata = fs.readFileSync(path.join(__dirname, "./config.json"), 'utf8');
      const config: acconfig = JSON.parse(configdata);
const pdataSchema = new mongoose.Schema({
    ip: String,
    username: String,
    xuid: String,
    uuid: String,
    tid: Number,
    deviceos: Number,
    deviceid: String,
    devicemodel: String,
});

export const PData = mongoose.model("PData", pdataSchema);

const login = async (pkt: LoginPacket, ni: NetworkIdentifier) => {
    const connreq = pkt.connreq;
    if (connreq) {
        const cert = connreq.getCertificate();
        const connreqdata = connreq.getJsonValue()!;
        if (cert && cert.getIdentityName() && cert.getXuid() && cert.getIdentityString()) {
            const ip = ni.getAddress().split("|")[0];
            const tid = cert.json.value()["extraData"]["titleId"];
            const deviceid = connreq.getDeviceId();
            const certUsername = cert.getIdentityName();
            const certXuid = cert.getXuid();
            const certUuid = cert.getIdentityString();
            const certDeviceModel = connreqdata["DeviceModel"];
            const certDeviceOS = connreqdata["DeviceOS"];

            const pdatar = await PData.findOne({ xuid: certXuid });
            const pdataip = await PData.find({ ip: ip });

            if (!pdatar && pdataip.length === 0) {
                const pdata = new PData({
                    ip: ip,
                    username: certUsername,
                    xuid: certXuid,
                    uuid: certUuid,
                    tid: tid,
                    deviceos: certDeviceOS,
                    devicemodel: certDeviceModel,
                    deviceid: deviceid,
                });
                await pdata.save();
            } else {
                if (pdataip.length === 1 && !pdatar && config.modules.altdetection.T1 === true) {
                    bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Alt Detection [T1]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\nPlayer ${certUsername} was kicked for Alt Detection [T1] This means the player has an alt. Real Account: ${pdataip.username}`);
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Alt Detection [T1]',
                                description: `Kicked ${certUsername} for Alt Detection [T1] This means the player has an alt. Real Account: ${pdataip.username}`,
                                color: 65280,
                            },
                        ];
                        sendwebhook(config.webhook, embeds);
                    }
                    return;
                }
                if (pdatar.deviceid !== "null" && pdatar.devicemodel === certDeviceModel && pdatar.deviceid !== deviceid && config.modules.deviceidspoof.T1 === true) {
                    bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Device ID Spoof [T1]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\nPlayer ${certUsername} was kicked for Device ID Spoof [T1] This means the player is using a device id spoofer.`);
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Device ID Spoof [T1]',
                                description: `Kicked ${certUsername} for Device ID Spoof [T1] This means the player is using a device id spoofer.`,
                                color: 65280,
                            },
                        ];
                        sendwebhook(config.webhook, embeds);
                    }
                    return;
                }
                if (pdatar.tid === Number(tid) && pdatar.deviceos !== certDeviceOS && config.modules.devicespoof.T1 === true) {
                    bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Device Spoof [T1]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\nPlayer ${certUsername} was kicked for Device Spoof [T1] This means the player is using a device spoofer.`);
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Device Spoof [T1]',
                                description: `Kicked ${certUsername} for Device Spoof [T1] This means the player is using a device spoofer.`,
                                color: 65280,
                            },
                        ];
                        sendwebhook(config.webhook, embeds);
                    }
                    return;
                }
                pdatar.username = certUsername;
                pdatar.xuid = certXuid;
                pdatar.uuid = certUuid;
                pdatar.tid = tid;
                pdatar.deviceos = certDeviceOS;
                pdatar.deviceid = deviceid;
                pdatar.devicemodel = certDeviceModel;
                await pdatar.save();
            }
        } else {
            throw new Error(`Failed to get login data for a player.`)
        }
    }
};
events.playerJoin.on(async ev => {
    const ip = ev.player.getNetworkIdentifier()?.getAddress().split("|")[0];
    const xuid = ev.player.getNetworkIdentifier()?.getActor()?.getXuid()
    if (ev.isSimulated === true) return;
    if (ip && xuid) {
        const pdata = await PData.findOne({ xuid: xuid });
        pdata.ip = ip
    }
})
events.packetAfter(MinecraftPacketIds.Login).on(login);

function Sequence(): void {
    console.log('\n');
    console.log(`  ___  _                  _         ___  _____ 
 / _ \\| |                (_)       / _ \\/  __ \\
/ /_\\ | |_ ___  _ __ ___  _  ___  / /_\\ | /  \\/
|  _  | __/ _ \\| '_ \` _ \\| |/ __| |  _  | |    
| | | | || (_) | | | | | | | (__  | | | | \\__/\\
\\_| |_|\\__\\___/|_| |_| |_|_|\\___| \\_| |_|\\____/
                                              
                                              
`);
    console.log('\n');
    console.log('Successfully Started Loading Sequence!');
    mongoose.connect(config.mongodburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log(`[Atomic-AntiCheat] Connected to mongodb`);
    }).catch(err => {
        console.error(`Error connecting to mongodb: ${err}`);
    });
    import("./modules/bot");
    import("./modules/badpacket");
    import("./modules/speed");
    import("./modules/crasher");
    import("./modules/reach");
    import("./modules/badskin");
    import("./modules/nofall");
    import("./modules/seedhide");
    import("./modules/antivpn");
    console.log('[Atomic-AntiCheat] Loaded Device ID Spoof Detections');
    console.log('[Atomic-AntiCheat] Loaded Device Spoof Detections');
}

events.serverOpen.on(Sequence);

events.serverStop.on(() => {
    events.packetAfter(MinecraftPacketIds.Login).remove(login);
});

export type embed = {
    title: string;
    description?: string;
    color?: number;
};

export const sendwebhook = async (webhook: string, embeds: embed[]) => {
    try {
        const payload = {
            embeds
        };

        await fetch(webhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.log(`Failed to send webhook: ${error.message}`);
    }
};
