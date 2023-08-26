import { BlockType, Direction, MinecraftBlockTypes } from "@minecraft/server";
import RefinedStorageBlock from "./block";


export default class Exporter extends RefinedStorageBlock {

    public static readonly type: BlockType = MinecraftBlockTypes.get("refinedstorage:exporter")

    public static Register(): void {
        this.setNotPushable(this.type)
    }

    public get direction(): Direction {
        switch(this.getBlockState("refinedstorage:module_direction") as string) {
            case "north": return Direction.North
            case "south": return Direction.South
            case "east": return Direction.East
            case "west": return Direction.West
            case "up": return Direction.Up
            case "down": return Direction.Down
        }
    }
}