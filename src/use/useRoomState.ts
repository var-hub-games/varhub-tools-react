import {useState, useEffect, useContext} from "react"
import {Room} from "@varhub-games/tools/dist/Room";
import {RoomData} from "../context/RoomDataContext";
import RoomContext from "../context/RoomContext";

export default function useRoomState(room?: Room): any {
    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useRoomState with no <RoomProvider/>");
    const [state, setState] = useState<RoomData>(() => usedRoom.state);


    useEffect(() => {
        const updateData = () => setState(() => usedRoom.state);
        usedRoom.addEventListener("enter", updateData);
        usedRoom.addEventListener("stateChange", updateData);
        return () => {
            usedRoom.removeEventListener("enter", updateData);
            usedRoom.removeEventListener("stateChange", updateData);
        };
    }, [usedRoom]);
    return state;
}

function buildRoomData(room: Room): RoomData{
    return {
        entered: room.entered,
        connected: room.connected,
        id: room.id,
        connectionId: room.connectionId,
        destroyed: room.destroyed,
        name: room.name,
        owned: room.owned,
        resource: room.resource
    }
}