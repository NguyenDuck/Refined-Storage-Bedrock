import { Block, BlockInventoryComponent, BlockType, Direction, MinecraftBlockTypes, Vector, Vector3, system, world } from "@minecraft/server"
import RefinedStorageBlock from "./block"
import { getAllDirection, locationFromDirection, mirrorDirection, vectorToString } from "../utils"
import Exporter from "./Exporter"

const paths = new Map<string, Block[]>()

export default class Importer extends RefinedStorageBlock {

    public static readonly type: BlockType = MinecraftBlockTypes.get("refinedstorage:cable")

    public static Register(): void {
        this.setNotPushable(this.type)
        system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceBlock, sourceEntity }) => {
            try {
                if (id != "refinedstorage:importer") return

                let block: Importer

                if (sourceEntity) {
                    block = new Importer(sourceEntity.dimension.getBlock(sourceEntity.location))
                }

                if (sourceBlock) {
                    block = new Importer(sourceBlock)
                }

                block.pullItem()

            } catch (e) {
                console.warn(`${e} ${e.stack}`)
            }
        })
    }

    public get direction(): Direction {
        switch (this.getBlockState("refinedstorage:module_direction") as string) {
            case "north": return Direction.North
            case "south": return Direction.South
            case "east": return Direction.East
            case "west": return Direction.West
            case "up": return Direction.Up
            case "down": return Direction.Down
        }
    }

    public pullItem() {
        if (this.findExporter()) {
            const invBlockFrom = this.block.dimension.getBlock(Vector.add(this.block.location, locationFromDirection(mirrorDirection(this.direction))))
            const invFrom = invBlockFrom.getComponent(BlockInventoryComponent.componentId) as BlockInventoryComponent
            if (!invFrom || !invFrom.isValid()) return console.warn("Invalid inventory from at position " + vectorToString(invBlockFrom.location))
            const key = vectorToString(this.block.location)
            const v = paths.get(key)
            const b = new Exporter(v[0])
            
            const invBlockTo = b.dimension.getBlock(Vector.add(b.block.location, locationFromDirection(mirrorDirection(b.direction))))
            const invTo = invBlockTo.getComponent(BlockInventoryComponent.componentId) as BlockInventoryComponent
            if (!invTo || !invTo.isValid()) return console.warn("Invalid inventory to at position " + vectorToString(invBlockTo.location))

            for (let i = 0; i < invTo.container.emptySlotsCount; i++) {
                for (let i1 = 0; i1 < invFrom.container.size; i1++) {
                    let slot = invFrom.container.getSlot(i1)
                    if (slot.isValid() && slot.amount) {
                        if (slot.amount > 1) {
                            let item = slot.getItem().clone()
                            item.amount -= 1
                            invFrom.container.setItem(i1, item)
                            item.amount = 1
                            invTo.container.addItem(item)
                            return
                        } else {
                            let item = slot.getItem().clone()
                            invFrom.container.setItem(i1, undefined)
                            item.amount = 1
                            invTo.container.addItem(item)
                            return
                        }
                    }
                }
            }
        }
    }

    private findExporter() {
        const key = vectorToString(this.block.location)
        if (paths.has(key)) {
            for (const b of paths.get(key)) {
                if (!b.isValid() || !b.hasTag("refinedstorage:component")) {
                    paths.delete(key)
                    break
                } else {
                    system.run(() => b.dimension.runCommandAsync(`particle minecraft:villager_happy ${b.location.x} ${b.location.y + 0.5} ${b.location.z}`))
                }
            }
        }
        
        if (paths.has(key)) return true
        class Node {
            public position: Vector3
            constructor(public block: Block, public parent: Node | null = null) {
                this.position = block.location
            }
        }

        function getNeighbors(node: Node): Node[] {
            const neighbors: Node[] = []
            const direction = getAllDirection()
            direction.map(d => {
                let block = node.block.dimension.getBlock(Vector.add(node.position, locationFromDirection(d)))
                if (block.hasTag("refinedstorage:component")) neighbors.push(new Node(block, node))
            })
            return neighbors
        }

        function findPathBFS(start: Block): Block[] | null {
            const queue: Node[] = []
            const visitedNodes: Set<string> = new Set()

            const startNode = new Node(start)
            queue.push(startNode)
            visitedNodes.add(`${start.x} ${start.y} ${start.z}`)

            while (queue.length > 0) {
                const currentNode = queue.shift()

                if (!currentNode) continue

                const neighbors = getNeighbors(currentNode)

                for (const neighbor of neighbors) {
                    const neighborKey = `${neighbor.position.x} ${neighbor.position.y} ${neighbor.position.z}`

                    if (!visitedNodes.has(neighborKey)) {
                        neighbor.parent = currentNode

                        if (neighbor.block.type === Exporter.type) {
                            let currentNode = neighbor
                            const blocks = []
                            while (currentNode.parent != null) {
                                blocks.push(currentNode.block)
                                currentNode = currentNode.parent
                            }
                            return blocks
                        }

                        queue.push(neighbor)
                        visitedNodes.add(neighborKey)
                    }
                }
            }

            return null
        }

        const shortestPath = findPathBFS(this.block)

        if (shortestPath !== null) {
            paths.set(key, shortestPath)
            shortestPath.map(b => b.dimension.runCommandAsync(`particle minecraft:villager_happy ${b.location.x} ${b.location.y + 0.5} ${b.location.z}`))
            return true
        }

        return false

    }
}
