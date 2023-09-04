import RSEntity from "../entity/RSEntity";
import RSBlock from "./RSBlock";


export default abstract class RSBlockEntity<T extends RSEntity> extends RSBlock {
    protected entity: T;
}