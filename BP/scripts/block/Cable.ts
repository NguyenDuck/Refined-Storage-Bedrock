import { BlockType, Direction, MinecraftBlockTypes, MinecraftItemTypes, Vector, system, world } from "@minecraft/server";
import RefinedStorageBlock from "./block";
import { locationFromDirection, mirrorDirection } from "../utils";


export default class Cable extends RefinedStorageBlock {

    public static readonly type: BlockType = MinecraftBlockTypes.get("refinedstorage:cable")

    public static Register(): void {
        this.setNotPushable(this.type)
    }
}