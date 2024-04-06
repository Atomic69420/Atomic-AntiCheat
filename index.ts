import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { LoginPacket } from "bdsx/bds/packets";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { events } from "bdsx/event";
import { detectBots } from "./modules/bot.ts"
export type pdatar = {
    ip: string;
    username: string;
    xuid: string;
    uuid: string;
    tid: number;
    deviceos: string;
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
events.serverOpen.on(() => {
	console.log('[Atomic-AntiCheat] Successfully Started Loading Sequence!')
    detectBots()
});
events.serverStop.on(() => {
    events.packetAfter(MinecraftPacketIds.Login).remove(login);
})