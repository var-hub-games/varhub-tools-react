import {useContext, useEffect, useState} from "react"
import {Room} from "@varhub-games/tools/dist/Room";
import {Door} from "@varhub-games/tools/dist/Door";
import RoomContext from "../context/RoomContext"


export default function useDoor(room?: Room): Door {
    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useDoor with no <RoomProvider/>");
    const door = usedRoom.door;
    const [, update] = useState({})

    useEffect(() => {
        const updateState = () => update({});
        door.addEventListener("update", updateState);
        return () => {
            door.removeEventListener("update", updateState);
        }
    }, [door]);

    return door;
}