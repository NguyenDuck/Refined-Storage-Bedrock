import { Block, world } from "@minecraft/server";

export default abstract class RSBlock {

    protected setNotPushable(): void {
        world.beforeEvents.pistonActivate.subscribe(arg => {
            const {block, piston} = arg
            for (const location of piston.getAttachedBlocks()) {
                const attachedBlock = block.dimension.getBlock(location)
                if (attachedBlock.typeId == this.fullName) {
                    arg.cancel = true
                    return
                }
            }
        })
    }

    constructor(protected block: Block) {}

    public get name(): string {
        return this.name
    }

    protected set name(value: string) {
        this.name = value
    }

    public get fullName(): string {
        return this.fullName
    }

    public set fullName(value: string) {
        this.fullName = value
    }

    public get dimension() {
        return this.block.dimension
    }

    protected get permutation() {
        return this.block.permutation
    }

    protected get itemStack() {
        return this.permutation.getItemStack()
    }

    private getBlockState(name: string): string | number | boolean | undefined {
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