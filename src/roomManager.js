let roomVariables = require("roomVariables")

require("roomFunctions")
require("creepFunctions")

let creepManager = require("creepManager")
let powerCreepManager = require("powerCreepManager")
    /* let antifa = require("antifa") */

let construction = require("construction")

let findRampartPlacement = require("findRampartPlacement")
let findAnchor = require("findAnchor")

let roomPlanner = require("roomPlanner")

let defenseManager = require("defenseManager")
let taskManager = require("taskManager")

let spawnManager = require("spawnManager")

let nukerManager = require("nukerManager")
let towerManager = require("towerManager")
let links = require("links")
let labs = require("labs")
let terminals = require("terminals")
let factories = require("factories")
let powerSpawns = require("powerSpawns")

let visuals = require("visuals")

function roomManager() {

    let totalCpuUsed = Game.cpu.getUsed()

    let consoleMessage = ``

    for (let roomName in Game.rooms) {

        let room = Game.rooms[roomName]

        // CPU tracking values

        let roomCpuUsed = Game.cpu.getUsed()

        let cpuUsed = Game.cpu.getUsed()

        consoleMessage += `
        ` + room.name + `
        --------------------------------------------------------
        `

        // Run room scripts

        //

        if (room.controller && room.controller.my) findAnchor(room)

        //

        cpuUsed = Game.cpu.getUsed()

        let {
            creeps,
            structures,
            constructionSites,
            specialStructures,
        } = roomVariables(room)

        totalCpuUsed += Game.cpu.getUsed()
        cpuUsed = Game.cpu.getUsed() - cpuUsed
        consoleMessage += `roomVariables: ` + cpuUsed.toFixed(2) + `
        `

        //

        cpuUsed = Game.cpu.getUsed()

        let creepManagerConsoleMessage = creepManager(room, creeps.myCreeps)

        totalCpuUsed += Game.cpu.getUsed()
        cpuUsed = Game.cpu.getUsed() - cpuUsed
        consoleMessage += `creepManager: ` + cpuUsed.toFixed(2) + `
        `

        consoleMessage += `
        ` + creepManagerConsoleMessage + `
        `
            //

        cpuUsed = Game.cpu.getUsed()

        /* let creepManagerConsoleMessage =  */
        powerCreepManager(room)

        totalCpuUsed += Game.cpu.getUsed()
        cpuUsed = Game.cpu.getUsed() - cpuUsed
        consoleMessage += `powerCreepManager: ` + cpuUsed.toFixed(2) + `
                `

        /* consoleMessage += `
                 ` + creepManagerConsoleMessage.consoleMessage + `
                 ` */

        //

        cpuUsed = Game.cpu.getUsed()

        taskManager(room, creeps.myCreeps)

        totalCpuUsed += Game.cpu.getUsed()
        cpuUsed = Game.cpu.getUsed() - cpuUsed
        consoleMessage += `taskManager: ` + cpuUsed.toFixed(2) + `
        `

        //

        /*         cpuUsed = Game.cpu.getUsed()

                antifa(room, creeps)

                totalCpuUsed += Game.cpu.getUsed()
                cpuUsed = Game.cpu.getUsed() - cpuUsed
                consoleMessage += `antifa: ` + cpuUsed.toFixed(2) + `
                ` */

        //

        /* trafficManager(room, creeps.myCreeps) */

        //

        cpuUsed = Game.cpu.getUsed()

        visuals(room, structures, specialStructures, constructionSites)

        totalCpuUsed += Game.cpu.getUsed()
        cpuUsed = Game.cpu.getUsed() - cpuUsed
        consoleMessage += `visuals: ` + cpuUsed.toFixed(2) + `
                    `

        //

        let combatHappened = false

        if ((room.controller && room.controller.my) || room.memory.stage == "remoteRoom") {

            let eventLog = room.getEventLog()
            let combatEvents = eventLog.filter(eventObject => eventObject.event == EVENT_ATTACK)

            for (let event of combatEvents) {

                let target = Game.getObjectById(event.data.targetId)

                if (!target) continue
                if (!target.my) continue

                combatHappened = true
                break
            }
        }

        // Commune only scripts

        if (room.controller && room.controller.my) {

            // PLEASE MOVE THIS TO A DEDICATED FILE

            //

            for (let depositId in room.memory.deposits) {

                let deposit = room.memory.deposits[depositId]

                if (Game.time > deposit.decayBy) delete deposit
            }

            //

            let hostiles = room.find(FIND_HOSTILE_CREEPS, {
                filter: hostileCreep => !allyList.includes(hostileCreep.owner.username) && hostileCreep.owner.username != "Invader" && hostileCreep.hasPartsOfTypes([ATTACK, RANGED_ATTACK, WORK])
            })

            if (combatHappened && hostiles.length > 0) room.controller.activateSafeMode()

            //

            room.memory.storedEnergy = room.get("storedEnergy")

            //

            cpuUsed = Game.cpu.getUsed()

            findAnchor(room)

            totalCpuUsed += Game.cpu.getUsed()
            cpuUsed = Game.cpu.getUsed() - cpuUsed
            consoleMessage += `findAnchor: ` + cpuUsed.toFixed(2) + `
                        `

            //

            cpuUsed = Game.cpu.getUsed()

            findRampartPlacement(room)

            totalCpuUsed += Game.cpu.getUsed()
            cpuUsed = Game.cpu.getUsed() - cpuUsed
            consoleMessage += `findRampartPlacement: ` + cpuUsed.toFixed(2) + `
                        `

            //

            cpuUsed = Game.cpu.getUsed()

            construction(room, specialStructures)

            totalCpuUsed += Game.cpu.getUsed()
            cpuUsed = Game.cpu.getUsed() - cpuUsed
            consoleMessage += `construction: ` + cpuUsed.toFixed(2) + `
            `

            //

            cpuUsed = Game.cpu.getUsed()

            defenseManager(room, creeps)

            totalCpuUsed += Game.cpu.getUsed()
            cpuUsed = Game.cpu.getUsed() - cpuUsed
            consoleMessage += `defenseManager: ` + cpuUsed.toFixed(2) + `
            `

            //

            cpuUsed = Game.cpu.getUsed()

            spawnManager(room, structures.spawns, specialStructures)

            totalCpuUsed += Game.cpu.getUsed()
            cpuUsed = Game.cpu.getUsed() - cpuUsed
            consoleMessage += `spawnManager: ` + cpuUsed.toFixed(2) + `
            `

            //

            cpuUsed = Game.cpu.getUsed()

            towerManager(room)

            totalCpuUsed += Game.cpu.getUsed()
            cpuUsed = Game.cpu.getUsed() - cpuUsed
            consoleMessage += `towerManager: ` + cpuUsed.toFixed(2) + `
            `

            //

            cpuUsed = Game.cpu.getUsed()

            if (Game.time % 10 == 0) {

                terminals(room)
            }

            totalCpuUsed += Game.cpu.getUsed()
            cpuUsed = Game.cpu.getUsed() - cpuUsed
            consoleMessage += `terminals: ` + cpuUsed.toFixed(2) + `
            `

            //

            cpuUsed = Game.cpu.getUsed()

            factories(structures.factory)

            totalCpuUsed += Game.cpu.getUsed()
            cpuUsed = Game.cpu.getUsed() - cpuUsed
            consoleMessage += `factories: ` + cpuUsed.toFixed(2) + `
            `

            //

            cpuUsed = Game.cpu.getUsed()

            powerSpawns(structures.powerSpawn)

            totalCpuUsed += Game.cpu.getUsed()
            cpuUsed = Game.cpu.getUsed() - cpuUsed
            consoleMessage += `powerSpawns: ` + cpuUsed.toFixed(2) + `
            `

            //

            cpuUsed = Game.cpu.getUsed()

            links(room, specialStructures.links)

            totalCpuUsed += Game.cpu.getUsed()
            cpuUsed = Game.cpu.getUsed() - cpuUsed
            consoleMessage += `links: ` + cpuUsed.toFixed(2) + `
            `

            //

            cpuUsed = Game.cpu.getUsed()

            labs(room, structures, specialStructures)

            totalCpuUsed += Game.cpu.getUsed()
            cpuUsed = Game.cpu.getUsed() - cpuUsed
            consoleMessage += `labs: ` + cpuUsed.toFixed(2) + `
            `

            //

            cpuUsed = Game.cpu.getUsed()

            roomPlanner(room)

            totalCpuUsed += Game.cpu.getUsed()
            cpuUsed = Game.cpu.getUsed() - cpuUsed
            consoleMessage += `roomPlanner: ` + cpuUsed.toFixed(2) + `
            `
        }

        Memory.data.roomManager[room.name] = {}
        Memory.data.roomManager[room.name].cpuUsage = (Game.cpu.getUsed() - roomCpuUsed).toFixed(2)
        Memory.data.roomManager[room.name].storedEnergy = room.get("storedEnergy")
        Memory.data.roomManager[room.name].myCreeps = creeps.myCreeps.length
    }

    return {
        consoleMessage: consoleMessage,
    }
}

module.exports = roomManager