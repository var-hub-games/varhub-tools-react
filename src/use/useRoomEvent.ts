import {useEffect, useContext} from "react"
import {Room, RoomEvents} from "@varhub-games/tools/dist/Room";
import RoomContext from "../context/RoomContext";
import useLatestCallback from "./useLatestCallback";


export default function useRoomEvent<E extends keyof RoomEvents>(
    eventName: E,
    eventHandler: (event: RoomEvents[E]) => void,
    room?: Room
): void {
    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useRoomEvent with no <RoomProvider/>");
    const staticEventHandler = useLatestCallback(eventHandler);

    useEffect(() => {
        usedRoom.addEventListener(eventName, staticEventHandler);
        return () => usedRoom.removeEventListener(eventName, staticEventHandler);
    }, [usedRoom, eventName]);
}