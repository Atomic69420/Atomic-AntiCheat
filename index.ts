import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { LoginPacket } from "bdsx/bds/packets";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { events } from "bdsx/event";
import * as fetch from "node-fetch"
export type pdatar = {
    ip: string;
    username: string;
    xuid: string;
    uuid: string;
    tid: number;
    deviceos: number;
    devicemodel: string;
    deviceid: string;
};

export const pdb = new Map<NetworkIdentifier, pdatar>();

const login = (pkt: LoginPacket, ni: NetworkIdentifier) => {
    const connreq = pkt.connreq;
    if (connreq) {
        const cert = connreq.cert;
        const connreqdata = connreq.getJsonValue()!;
        const pdata: pdatar = {
            ip: ni.toString().split(":")[0],
            username: cert.getIdentityName(),
            xuid: cert.getXuid(),
            uuid: cert.getIdentityString(),
            tid: cert.json.value()["extraData"]["titleId"],
            deviceos: connreqdata["DeviceOS"],
            devicemodel: connreqdata["DeviceModel"],
            deviceid: connreq.getDeviceId()

        };
        pdb.set(ni, pdata);
    }
}
events.packetAfter(MinecraftPacketIds.Login).on(login);
function Sequence(): void {
    console.log('\n')
    console.log(`  ___  _                  _         ___  _____ 
 / _ \\| |                (_)       / _ \\/  __ \\
/ /_\\ | |_ ___  _ __ ___  _  ___  / /_\\ | /  \\/
|  _  | __/ _ \\| '_ \` _ \\| |/ __| |  _  | |    
| | | | || (_) | | | | | | | (__  | | | | \\__/\\
\\_| |_|\\__\\___/|_| |_| |_|_|\\___| \\_| |_|\\____/
                                              
                                              
`);
console.log('\n')
    console.log('Successfully Started Loading Sequence!')
    import("./modules/bot");
    import("./modules/badpacket");
    import("./modules/speed")
    import("./modules/crasher")
    }
    events.serverOpen.on(Sequence);

events.serverStop.on(() => {
    events.packetAfter(MinecraftPacketIds.Login).remove(login);
})

export type embed = {
    title: string;
    description?: string;
    color?: number;
};

export const sendwebhook = async (webhook: string, embeds: Embed[]) => {
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
        console.log(`failed to send webhook ${error.message}`)
    }
};