import {useCallback, useContext, useEffect, useMemo, useState} from "react"
import RoomContext from "../context/RoomContext"
import {Room} from "@varhub-games/tools/dist/Room";


export default function useDoorBlocklist(room?: Room): [Set<string>, (string) => Promise<void>] {
    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useDoorBlocklist with no <RoomProvider/>");
    const door = usedRoom.door;
    const [blocklist, setBlocklist] = useState(() => door.blockList);

    useEffect(() => {
        const updateState = () => setBlocklist(() => door.blockList);
        door.addEventListener("blocklistChanged", updateState);
        return () => {
            door.removeEventListener("blocklistChanged", updateState);
        }
    }, [door]);

    const block = useCallback((accountId) => {
        return door.block(accountId);
    }, [door])

    return useMemo<[Set<string>, (string) => Promise<void>]>(() => {
        return [blocklist, block];
    }, [blocklist, block]);
}