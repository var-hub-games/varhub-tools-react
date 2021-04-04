import {useState, useEffect, useContext} from "react"
import {Room} from "@varhub-games/tools/dist/Room";
import {RoomData} from "../context/RoomDataContext";
import RoomContext from "../context/RoomContext";

export default function useRoomData(room?: Room): RoomData {
    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useRoomData with no <RoomProvider/>");
    const [data, setData] = useState<RoomData>(() => buildRoomData(usedRoom));


    useEffect(() => {
        const updateData = () => setData(buildRoomData(usedRoom));
        usedRoom.addEventListener("connect", updateData);
        usedRoom.addEventListener("connectionInfo", updateData);
        usedRoom.addEventListener("disconnect", updateData);
        usedRoom.addEventListener("enter", updateData);
        usedRoom.addEventListener("destroy", updateData);
        return () => {
            usedRoom.removeEventListener("connect", updateData);
            usedRoom.removeEventListener("connectionInfo", updateData);
            usedRoom.removeEventListener("disconnect", updateData);
            usedRoom.removeEventListener("enter", updateData);
            usedRoom.removeEventListener("destroy", updateData);
        };
    }, [usedRoom]);
    return data;
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