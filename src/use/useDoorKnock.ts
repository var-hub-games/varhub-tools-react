import {useContext, useEffect, useState} from "react"
import RoomContext from "../context/RoomContext"
import {Room} from "@varhub-games/tools/dist/Room";
import {HubAccount} from "@varhub-games/tools/dist/types";


export default function useDoorKnock(room?: Room): Map<string, HubAccount> {
    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useDoorKnock with no <RoomProvider/>");
    const door = usedRoom.door;
    const [knock, setKnock] = useState(() => door.knock);

    useEffect(() => {
        const updateState = () => setKnock(() => door.knock);
        door.addEventListener("knockChanged", updateState);
        return () => {
            door.removeEventListener("knockChanged", updateState);
        }
    }, [door]);

    return knock;
}