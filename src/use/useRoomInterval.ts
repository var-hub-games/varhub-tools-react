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
    callOnExpired: false,
}
export default function useRoomInterval(
    timeValue: number,
    stepMs: number,
    callback: RoomTimeoutCallback,
    options: RoomTimeoutOptions = defaultOptions,
    room?: Room
): void {
    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useRoomInterval with no <RoomProvider/>");
    const { roomStartDiffMs } = useRoomData(usedRoom);
    const staticCallback = useLatestCallback(callback);
    const { callOnExpired } = options;

    useEffect(() => {
        if (roomStartDiffMs == null) return;
        const fullTimeout = timeValue - performance.now() + roomStartDiffMs;
        if (fullTimeout < 0) {
            staticCallback(0, fullTimeout, true);
            return;
        }
        const timeout = fullTimeout % stepMs;
        let counter = Math.floor(fullTimeout / stepMs);
        let i: number|null = null;
        const t = setTimeout(() => {
            const diff = timeValue - performance.now() + roomStartDiffMs;
            staticCallback(counter--, diff, false);
            if (counter > 0) {
                i = setInterval(() => {
                    const diff = timeValue - performance.now() + roomStartDiffMs;
                    staticCallback(counter--, diff, false);
                    if (counter < 0 && i != null) clearInterval(i);
                }, stepMs);
            }
        }, timeout);
        return () => {
            clearTimeout(t);
            if (i != null) clearInterval(i);
        }
    }, [timeValue, stepMs, roomStartDiffMs, callOnExpired, stepMs]);
}















