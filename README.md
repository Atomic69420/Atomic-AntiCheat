# Atomic AntiCheat
Atomic AntiCheat is a simple bdsx anticheat to stop hackers and is based off of the detections from https://github.com/Atomic69420/RelayAC

## Restrictions
Please read the license file which contains a Creative Commons CC BY-NC-ND 4.0 license this license basically says in short terms "You may Share, copy and redistribute as long as you show credit like this was made by Atomic69420 and provide a link to this license and indicate if changes were made, You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use. You may not use the material for commercial purposes. If you remix, transform, or build upon the material, you may not distribute the modified material basically meaning if you make changes to any other file than the config.json you may not redistribute. You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits. So if you wish to redistribute meaning give the code to other people you have to provide credit and a link to this license so best way to do that is provide the github link and if you made changes to the code in a file other than config.json you may not give it to other people. I dont want you changing the code or copying it for another project without credit.



## How To Use
When first using this anticheat it is advised you edit the config.json to add webhooks so you can better view hackers trying to attack your bdsx server from discord and since this is a very customizable anticheat we offer to change the prefix for the kick message which will appear when hackers get kicked it is set to [Atomic-AntiCheat] as default. Also change the discord field within the config to your discord link or discord invite code if you do have a discord server that is related to your bdsx server otherwise it will appear in the kick message as None. The modules section of the config allows you to toggle detections by turning them on by setting the value to true and turning them off by setting the value to false. The mongodburl is a required value to be fulfilled if not fulfilled the anticheat will have an error. To fulfill this value you can create a database on mongodb.com or by downloading mongodb and using mongodb://localhost:27017/anticheat as the value, I recommend watching a youtube tutorial for a more in-depth guide on how to get a mongodburl via mongodb.com.

## Config
- discord: your discord link, will be displayed in kick messages.
- prefix: the kick title in kick messages.
- webhook: your discord webhook link, useful for seeing what Atomic-AntiCheat has been detecting from your discord.
- mongodburl: your mongodburl link, required to use this anticheat you can get this by creating a database on mongodb.com or downloading mongodb and using mongodb://localhost:27017/anticheat as the url. I advise watching a youtube tutorial for further information.
- modules: a list of modules to enable or disable modules are documented below.
## Features
- [x] Discord webhook support
- [x] Customizable
- [ ] Punishment options
- [ ] Whitelist for individual modules
- [ ] Lockdown system
- [x] Seed hider (not recommended)
## Detections
### Combat
- [x] Reach
- [ ] Autoclicker
### Movement
- [x] Speed Hacks
### Misc
- [x] Bots
- [x] Bad Packets
- [x] Crasher
- [x] Invisible Skins
- [ ] Device Blocking
- [x] NoFall
- [x] .xp
- [x] VPNs/Proxies
- [ ] Alt Detection
- [x] Device ID Spoof
- [ ] Device Spoof/Edition Faker
### Bot Detections
- Bot [T1] (Kicks players who have their title id set to 2047319603 this is used in bedrock protocol for authentication but also used by Nintendo players.)
- Bot [T2] (Kicks players who have their device model set to PrismarineJS this is used in bedrock protocol for login details.)
- Bot [T3] (Kicks players who request a sub client login which is a fake player that can often cause confusion.)
- Bot [T4] (Kicks players who have their client random id as a string for it is to be a number.)
- Bot [T5] (Kicks players who send a tick_sync packet which is used in bedrock protocol.)
### Bad Packet Detections
- Bad Packet [T1] (Kicks players who send a move player packet this is only used when ServerAuthoritativeMovementMode is false and is used in hack clients for some movement hacks.)
- Bad Packet [T2] (Kicks players who send a EntityEvent packet with a event of 34 which means they are attempting to gain xp through hacks.)
### Speed Detections
- Speed [T1] (Kicks players who are going to fast such has 0.5 which is fast according to the servers calculations although if ServerAuthoritativeMovementMode is false this check will not be implemented.)
### Crasher Detections
- Crasher [T1] (Kicks players who attempt to send a /me, /tell, /w or /msg command which can have a @e in it causing for a large message or unexpected behavior from the server.)
- Crasher [T2] (Kicks players who send more than or 20 messages in 1 second since sending alot of messages can freeze the server but this detection can not stop it from freezing.)
### Reach Detections
- Reach [T1] (Kicks players who hit a entity from or more than 4 blocks away.)
### Invisible Skin Detections
- Bad Skin [T1] (Kicks players who try to join with a invisible skin equipped.)
- Bad Skin [T2] (Kicks players who try to change to a invisible skin while ingame.)
### NoFall Detections
- NoFall [T1] (Kicks players who respawn when they are not dead which is the method used in NoFall for horion.)
### VPN/Proxy Detections
- Anti VPN [T1] (Kicks players who are using a proxy or VPN.)
### Device ID Spoof Detections
- Device ID Spoof [T1] (Kicks players who are on the same device but have a different device id.)
