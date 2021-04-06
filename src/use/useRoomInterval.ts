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
        if (stepMs == null) return;
        if (timeValue == null) return;
        if (roomStartDiffMs == null) return;
        if (!usedRoom) return;
        const stableRoom = usedRoom;

        const fullTimeout = stableRoom.getTimeLeft(timeValue);
        if (fullTimeout < 0) {
            staticCallback(0, fullTimeout, true);
            return;
        }
        const timeout = fullTimeout % stepMs;
        let counter = Math.floor(fullTimeout / stepMs);

        // fixing time diff, do not use setInterval here
        let t = setTimeout(handleTime, timeout);
        function handleTime(){
            let diff = stableRoom.getTimeLeft(timeValue);
            staticCallback(counter--, diff, false);
            if (counter < 0) return;
            let timeout = diff - (stepMs * counter);
            while (timeout <= 0) {
                staticCallback(counter--, diff, false);
                diff = stableRoom.getTimeLeft(timeValue);
                timeout = diff - (stepMs * counter);
            }
            if (counter < 0) return;
            t = setTimeout(handleTime, timeout);
        }

        return () => {
            clearTimeout(t);
        }
    }, [timeValue, stepMs, roomStartDiffMs, callOnExpired, stepMs, usedRoom]);
}















