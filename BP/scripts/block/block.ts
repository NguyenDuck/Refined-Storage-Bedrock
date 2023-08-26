import { Block, BlockType, world } from "@minecraft/server"

export default class RefinedStorageBlock {

    protected name: string
    protected full_name: string

    protected static setNotPushable(type: BlockType): void {
        world.beforeEvents.pistonActivate.subscribe(arg => {
            const {block, piston} = arg
            for (const location of piston.getAttachedBlocks()) {
                const attachedBlock = block.dimension.getBlock(location).type
                if (attachedBlock == type) {
                    arg.cancel = true
                    return
                }
            }
        })
    }

    constructor(public block: Block) {
        this.full_name = block.typeId
        this.name = this.full_name.split(":")[1]
    }

    public get dimension() {
        return this.block.dimension
    }

    protected get permutation() {
        return this.block.permutation
    }

    protected getItemStack() {
        return this.permutation.getItemStack()
    }

    protected getBlockState(name: string): string | number | boolean | undefined {
        return this.permutation.getState(name)
    }

    protected getBlockStates() {
        return this.permutation.getAllStates()
    }

    protected setBlockStates(states: { [name: string]: string | number | boolean | undefined }): Boolean {
        for (const state in states) {
            if (states[state] === undefined) continue
            if (!this.permutation.withState(state, states[state])) return false
        }
        return true
    }

    protected hasBlockStates(states: { [name: string]: string | number | boolean | undefined }): boolean {
        for (const state in states) {
            if (states[state] === undefined) continue
            if (this.getBlockState(state) === undefined) return false
        }
        return true
    }
}