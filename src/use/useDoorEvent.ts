import {useEffect, useContext} from "react"
import {Room} from "@varhub-games/tools/dist/Room";
import {DoorEvents} from "@varhub-games/tools/dist/Door";
import RoomContext from "../context/RoomContext";
import useLatestCallback from "./useLatestCallback";


export default function useDoorEvent<E extends keyof DoorEvents>(
    eventName: E,
    eventHandler: (event: DoorEvents[E]) => void,
    room?: Room
): void {
    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useDoorEvent with no <RoomProvider/>");
    const staticEventHandler = useLatestCallback(eventHandler);
    const door = usedRoom.door;

    useEffect(() => {
        door.addEventListener(eventName, staticEventHandler);
        return () => door.removeEventListener(eventName, staticEventHandler);
    }, [door, eventName]);
}