import React, { FC } from "react";
import RoomContext from "../context/RoomContext";
import RoomDataContext from "../context/RoomDataContext";
import {Room} from "@varhub-games/tools/dist/Room";
import useRoomData from "../use/useRoomData";


export interface RoomProviderProps {
    room: Room
}
export const RoomProvider: FC<RoomProviderProps> = ({room, children}) => {

    const roomData = useRoomData(room);

    return (
        <RoomContext.Provider value={room}>
            <RoomDataContext.Provider value={roomData}>
                {children}
            </RoomDataContext.Provider>
        </RoomContext.Provider>
    );
}