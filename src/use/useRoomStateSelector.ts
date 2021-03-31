import {useState, useEffect, useContext} from "react"
import {Room} from "@varhub-games/tools/dist/Room";
import {RoomData} from "../context/RoomDataContext";
import RoomContext from "../context/RoomContext";
import useLatestCallback from "./useLatestCallback";


export default function useRoomStateSelector<S, T>(
    selector: (state: S) => T,
    deps: any[] = [],
    room?: Room
): T|undefined {
    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useRoomStateSelector with no <RoomProvider/>");
    const stableSelector = useLatestCallback((value: S) => {
        try {
            return selector(value)
        } catch {
            return undefined;
        }
    });
    const [state, setState] = useState<T|undefined>(() => stableSelector(usedRoom.state));

    useEffect(() => {
        const updateState = () => setState(() => stableSelector(usedRoom.state));
        usedRoom.addEventListener("enter", updateState);
        usedRoom.addEventListener("stateChange", updateState);
        return () => {
            usedRoom.removeEventListener("enter", updateState);
            usedRoom.removeEventListener("stateChange", updateState);
        };
    }, [usedRoom, ...deps]);
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