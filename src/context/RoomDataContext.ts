import React from "react";
import {Room} from "@varhub-games/tools/dist/Room";

export interface RoomData {
    id: string
    connected: boolean
    owned: boolean
    entered: boolean
    destroyed: boolean
    connectionId: string|null
    name: string|null
    resource: string|null
}
export default React.createContext<RoomData|null>(null);