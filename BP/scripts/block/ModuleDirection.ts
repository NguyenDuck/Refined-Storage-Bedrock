import { Block, BlockBreakAfterEvent, BlockPermutation, Direction } from "@minecraft/server";
import NetworkNode from "./NetworkNode";
import { mirrorDirection, toDirection } from "../utils";

export default abstract class ModuleDirection extends NetworkNode {

    public override onBreak(arg: BlockBreakAfterEvent): void {
        super.onBreak(arg)
        const { block } = arg
        if (block.typeId != this.full_name) return

        block.setPermutation(block.permutation.withState("refinedstorage:" + this.getModuleDirection(block).toLowerCase(), false))
    }

    public getModuleDirection(block: Block | BlockPermutation): Direction {
        if (block instanceof Block) block = block.permutation
        return mirrorDirection(toDirection(block.getState("minecraft:block_face") as string))
    }
}