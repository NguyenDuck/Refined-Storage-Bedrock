import { Block, BlockBreakAfterEvent, BlockPermutation, BlockPlaceAfterEvent, Direction, Vector, world } from "@minecraft/server"
import RSBlock from "./RSBlock"
import { getAllDirection, locationFromDirection, mirrorDirection } from "../utils"

export default abstract class NetworkNode extends RSBlock {

    public Register(): void {        
        this.setNotPushable()
    }

    public override onPlaced(arg: BlockPlaceAfterEvent): void {
        super.onPlaced(arg)
        const { block, dimension } = arg
        if (block.typeId != this.full_name) return

        let blocks = new Map<Direction, Block>()
        let perm = block.permutation.clone()

        getAllDirection().forEach(d => {
            let neighborBlock = dimension.getBlock(Vector.add(block.location, locationFromDirection(d)))
            if (neighborBlock && neighborBlock.hasTag("refinedstorage:component")) {
                blocks.set(d, neighborBlock)
            }
        })

        blocks.forEach((v, k) => {
            perm = perm.withState("refinedstorage:" + k.toLowerCase(), true)
            v.setPermutation(v.permutation.clone().withState("refinedstorage:" + mirrorDirection(k).toLowerCase(), true))
        })

        block.setPermutation(perm)
    }

    public override onBreak(arg: BlockBreakAfterEvent): void {
        super.onPlaced(arg)
        const { block: air, brokenBlockPermutation: block, dimension } = arg
        if (block.type.id != this.full_name) return

        this.getConnectedDirections(block).forEach(d => {
            let b = dimension.getBlock(Vector.add(air.location, locationFromDirection(d)))
            if (b && b.hasTag("refinedstorage:connectable")) {
                b.setPermutation(b.permutation.withState("refinedstorage:" + mirrorDirection(d).toLowerCase(), false))
            }
        })
    }

    public getConnectedDirections(permutation: BlockPermutation): Direction[] {
        const directions = []
        const states = permutation.getAllStates()
        if (states["refinedstorage:north"]) directions.push(Direction.North)
        if (states["refinedstorage:south"]) directions.push(Direction.South)
        if (states["refinedstorage:east"]) directions.push(Direction.East)
        if (states["refinedstorage:west"]) directions.push(Direction.West)
        if (states["refinedstorage:up"]) directions.push(Direction.Up)
        if (states["refinedstorage:down"]) directions.push(Direction.Down)
        return directions
    }
}