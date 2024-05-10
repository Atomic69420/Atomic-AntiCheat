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
    devicemodel: String,
    deviceid: String
});

export const PData = mongoose.model("PData", pdataSchema);

const login = async (pkt: LoginPacket, ni: NetworkIdentifier) => {
    const connreq = pkt.connreq;
    if (connreq) {
        const cert = connreq.getCertificate();
        const connreqdata = connreq.getJsonValue()!;

        if (cert && cert.getIdentityName() && cert.getXuid() && cert.getIdentityString()) {
            const pdatar = await PData.findOne({ xuid: cert.getXuid() });

            if (!pdatar) {
                const pdata = new PData({
                    ip: ni.getAddress(),
                    username: cert.getIdentityName(),
                    xuid: cert.getXuid(),
                    uuid: cert.getIdentityString(),
                    tid: cert.json.value()["extraData"]["titleId"],
                    deviceos: connreqdata["DeviceOS"],
                    devicemodel: connreqdata["DeviceModel"],
                    deviceid: connreq.getDeviceId()
                });
                await pdata.save();
            } else {
                if (pdatar.devicemodel === connreqdata["DeviceModel"] && pdatar.deviceid !== connreq.getDeviceId() && config.modules.deviceidspoof.T1 === true) {
                    bedrockServer.serverInstance.disconnectClient(ni, `${config.prefix}\nYou Have Been Kicked!\nReason: Device ID Spoof [T1]\nDiscord: ${config.discord}`);
                    console.log(`${config.prefix}\nPlayer ${cert.getIdentityName()} was kicked for Device ID Spoof [T1] This means the player is using a device id spoofer.`);
                    if (config.webhook !== "None") {
                        const embeds: embed[] = [
                            {
                                title: 'Device ID Spoof [T1]',
                                description: `Kicked ${cert.getIdentityName()} for Device ID Spoof [T1] This means the player is using a device id spoofer.`,
                                color: 65280,
                            },
                        ];
                        sendwebhook(config.webhook, embeds);
                    }
                    return;
                }
                pdatar.username = cert.getIdentityName();
                pdatar.xuid = cert.getXuid();
                pdatar.uuid = cert.getIdentityString();
                pdatar.tid = cert.json.value()["extraData"]["titleId"];
                pdatar.deviceos = connreqdata["DeviceOS"];
                pdatar.devicemodel = connreqdata["DeviceModel"];
                pdatar.deviceid = connreq.getDeviceId();
                await pdatar.save();
            }
        } else {
            throw new Error(`Failed to get login data for a player.`)
        }
    }
};

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
    console.log('[Atomic-AntiCheat] Loaded Device ID Spoof Detections');
    import("./modules/bot");
    import("./modules/badpacket");
    import("./modules/speed");
    import("./modules/crasher");
    import("./modules/reach");
    import("./modules/badskin");
    import("./modules/nofall");
    import("./modules/seedhide");
    import("./modules/antivpn");
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
