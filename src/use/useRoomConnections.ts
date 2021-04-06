import {useState, useEffect, useContext} from "react"
import {Room} from "@varhub-games/tools/dist/Room";
import {Connection} from "@varhub-games/tools/dist/Connection";
import RoomContext from "../context/RoomContext";


export default function useRoomConnections(room?: Room): Map<string, Connection> {
    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useRoomConnections with no <RoomProvider/>");
    const [data, setData] = useState<Map<string, Connection>>(() => usedRoom.getConnections());


    useEffect(() => {
        const updateData = () => setData(usedRoom.getConnections());
        usedRoom.addEventListener("enter", updateData);
        usedRoom.addEventListener("join", updateData);
        usedRoom.addEventListener("leave", updateData);
        usedRoom.addEventListener("disconnect", updateData);
        usedRoom.addEventListener("destroy", updateData);
        return () => {
            usedRoom.addEventListener("enter", updateData);
            usedRoom.addEventListener("join", updateData);
            usedRoom.addEventListener("leave", updateData);
            usedRoom.addEventListener("disconnect", updateData);
            usedRoom.addEventListener("destroy", updateData);
        };
    }, [usedRoom]);
    return data;
}