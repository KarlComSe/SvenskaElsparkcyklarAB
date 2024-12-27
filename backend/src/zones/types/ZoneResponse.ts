import { Zone } from "../entities/zone";
import { Bicycle } from "src/bicycles/entities/bicycle.entity";
import { ZoneQuery } from "./ZoneQuery";

export type ZoneResponse = {
    filters?: ZoneQuery; 
    zones: (Zone & { bikes?: Bicycle[] })[];
};