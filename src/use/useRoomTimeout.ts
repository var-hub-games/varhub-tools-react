import {useContext, useEffect} from "react"
import {Room} from "@varhub-games/tools/dist/Room";
import useRoomData from "../use/useRoomData";
import useLatestCallback from "./useLatestCallback";
import RoomContext from "../context/RoomContext";
import {RoomTimeoutCallback} from "../types";


interface RoomTimeoutOptions {
    callOnExpired?: boolean
}
const defaultOptions = {
    callOnExpired: false
}
export default function useRoomTimeout(
    timeValue: number,
    callback: RoomTimeoutCallback,
    options: RoomTimeoutOptions = defaultOptions,
    room?: Room
): void {
    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useRoomTimeout with no <RoomProvider/>");
    const { roomStartDiffMs } = useRoomData(usedRoom);
    const staticCallback = useLatestCallback(callback);
    const { callOnExpired } = options;

    useEffect(() => {
        if (roomStartDiffMs == null) return;
        const timeout = timeValue - performance.now() + roomStartDiffMs;
        if (timeout < 0) {
            if (callOnExpired) staticCallback(0, timeout, true);
            return;
        }
        const t = setTimeout(() => {
            const diff = timeValue - performance.now() + roomStartDiffMs;
            staticCallback(0, diff, false);
        }, timeout);
        return () => clearTimeout(t);
    }, [timeValue, roomStartDiffMs, callOnExpired]);
}















