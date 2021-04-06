import {useCallback, useContext, useEffect, useMemo, useState} from "react"
import RoomContext from "../context/RoomContext"
import {Room} from "@varhub-games/tools/dist/Room";


export default function useDoorAllowlist(room?: Room): [Set<string>, (string) => Promise<void>] {
    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useDoorAllowlist with no <RoomProvider/>");
    const door = usedRoom.door;
    const [allowlist, setAllowlist] = useState(() => door.allowList);

    useEffect(() => {
        const updateState = () => setAllowlist(() => door.allowList);
        door.addEventListener("allowlistChanged", updateState);
        return () => {
            door.removeEventListener("allowlistChanged", updateState);
        }
    }, [door]);

    const allow = useCallback((accountId) => {
        return door.allow(accountId);
    }, [door])

    return useMemo<[Set<string>, (string) => Promise<void>]>(() => {
        return [allowlist, allow];
    }, [allowlist, allow]);
}