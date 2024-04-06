# Atomic AntiCheat
Atomic AntiCheat is a simple bdsx anticheat to stop hackers and is based off of the detections from https://github.com/Atomic69420/RelayAC

## Restrictions
Please read the license file which contains a Creative Commons CC BY-NC-ND 4.0 license this license basically says in short terms "You may Share, copy and redistribute as long as you show credit like this was made by Atomic69420 and provide a link to this license and indicate if changes were made, You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use. You may not use the material for commercial purposes. If you remix, transform, or build upon the material, you may not distribute the modified material basically meaning if you make changes to any other file than the config.json you may not redistribute. You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits. So if you wish to redistribute meaning give the code to other people you have to provide credit and a link to this license so best way to do that is provide the github link and if you made changes to the code in a file other than config.json you may not give it to other people. I dont want you changing the code or copying it for another project without credit.



## How To Use
When first using this anticheat it is advised you edit the config.json to add webhooks so you can better view hackers trying to attack your bdsx server from discord and since this is a very customizable anticheat we offer to change the prefix for the kick message which will appear when hackers get kicked it is set to [Atomic-AntiCheat] as default. Also change the discord field within the config to your discord link or discord invite code if you do have a discord server that is related to your bdsx server otherwise it will appear in the kick message as None. The modules section of the config allows you to toggle detections by turning them on by setting the value to true and turning them off by setting the value to false.


## Detections
### Bot Detections
- Bot [T1] (Kicks players who have their title id set to 2047319603 this is used in bedrock protocol for authentication but also used by Nintendo players.)
- Bot [T2] (Kicks players who have their device model set to PrismarineJS this is used in bedrock protocol for login details.)
- Bot [T3] (Kicks players who request a sub client login which is a fake player that can often cause confusion.)
### Bad Packet Detections
- Bad Packet [T1] (Kicks players who send a move player packet this is only used when ServerAuthoritativeMovementMode is false and is used in hack clients for some movement hacks.)