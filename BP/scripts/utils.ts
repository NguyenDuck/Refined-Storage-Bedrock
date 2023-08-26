import { Direction, Vector, Vector3 } from "@minecraft/server";

export function getAllDirection() {
    return [Direction.North, Direction.South, Direction.East, Direction.West, Direction.Up, Direction.Down]
}

export function mirrorDirection(direction: Direction): Direction {
    switch (direction) {
        case Direction.North:
            return Direction.South
        case Direction.South:
            return Direction.North
        case Direction.East:
            return Direction.West
        case Direction.West:
            return Direction.East
        case Direction.Up:
            return Direction.Down
        case Direction.Down:
            return Direction.Up
    }
}

export function locationFromDirection(direction: Direction): Vector {
    switch (direction) {
        case Direction.North:
            return new Vector(0, 0, -1)
        case Direction.South:
            return new Vector(0, 0, 1)
        case Direction.East:
            return new Vector(1, 0, 0)
        case Direction.West:
            return new Vector(-1, 0, 0)
        case Direction.Up:
            return new Vector(0, 1, 0)
        case Direction.Down:
            return new Vector(0, -1, 0)
    }
}

export function vectorToString(vector: Vector3): string {
    return `${vector.x} ${vector.y} ${vector.z}`
}