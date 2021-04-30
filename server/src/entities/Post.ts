import { Entity as TypeormEntity } from "typeorm";
import Entity from "./Entity";

@TypeormEntity()
export class Post extends Entity {}
