import {useContext, useEffect} from "react"
import {Room} from "@varhub-games/tools/dist/Room";
import useRoomData from "../use/useRoomData";
import useLatestCallback from "./useLatestCallback";
import RoomContext from "../context/RoomContext";
import {RoomTimeoutCallback} from "../types";


interface RoomTimeoutOptions {
    callOnExpired?: boolean
    callOnInit?: boolean
    step?: number|null
}
export default function useRoomTimeout(
    timerValue: number|null|undefined,
    callback: RoomTimeoutCallback,
    options: RoomTimeoutOptions = {},
    room?: Room
): void {
    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useRoomTimeout with no <RoomProvider/>");
    const { roomStartDiffMs } = useRoomData(usedRoom);
    const staticCallback = useLatestCallback(callback);
    const { callOnExpired, callOnInit, step } = options;

    useEffect(() => {
        if (timerValue == null) return;
        if (roomStartDiffMs == null) return;
        if (!usedRoom) return;
        const stableRoom = usedRoom;
        const stableTimeValue = timerValue;

        const fullTimeout = stableRoom.getTimeLeft(timerValue);
        if (fullTimeout < 0) {
            staticCallback(0, fullTimeout, true);
            return;
        }
        const stableStepMs = step ?? 0;
        let timeout: number;
        let counter: number;
        if (stableStepMs > 0) {
            timeout = fullTimeout % stableStepMs;
            counter = Math.floor(fullTimeout / stableStepMs);
        } else {
            timeout = fullTimeout;
            counter = 0;
        }

        // call on init
        if (callOnInit) {
            staticCallback(counter+1, fullTimeout, false);
        }

        // fixing time diff, do not use setInterval here
        let t = setTimeout(handleTime, timeout);
        function handleTime(){
            let diff = stableRoom.getTimeLeft(stableTimeValue);
            staticCallback(counter--, diff, false);
            if (counter < 0) return;
            let timeout = diff - (stableStepMs * counter);
            while (timeout <= 0) {
                staticCallback(counter--, diff, false);
                diff = stableRoom.getTimeLeft(stableTimeValue);
                timeout = diff - (stableStepMs * counter);
            }
            if (counter < 0) return;
            t = setTimeout(handleTime, timeout);
        }

        return () => clearTimeout(t);
    }, [timerValue, step, roomStartDiffMs, callOnExpired, usedRoom]);
}















