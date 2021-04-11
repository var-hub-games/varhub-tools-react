import {useContext, useEffect, useState} from "react"
import {Room} from "@varhub-games/tools/dist/Room";
import useRoomData from "../use/useRoomData";
import useLatestCallback from "./useLatestCallback";
import RoomContext from "../context/RoomContext";
import {RoomTimeoutCallback} from "../types";

interface RoomTimeCounterOptions {
    min?: number
    max?: number
}
export default function useRoomTimeCounter(
    timerStartValue?: number|null,
    stepMs?: number|null,
    {min, max}: RoomTimeCounterOptions = {},
    room?: Room
): number|null {

    const ctxRoom = useContext(RoomContext);
    const usedRoom = room ?? ctxRoom;
    if (!usedRoom) throw new Error("useRoomTimeCounter with no <RoomProvider/>");
    const { roomStartDiffMs } = useRoomData(usedRoom);
    const floorMin = min == null ? null : Math.floor(min);
    const floorMax = max == null ? null : Math.floor(max);

    const [value, setValue] = useState<number|null>(() => {
        if (timerStartValue == null) return null;
        if (roomStartDiffMs == null) return null;
        if (stepMs == null || stepMs <= 0) return null;
        const timePassed = usedRoom.getTimePassed(timerStartValue);
        let value = Math.floor(timePassed / stepMs);
        if (floorMin != null && floorMin > value) return floorMin;
        if (floorMax != null && value >= floorMax) return floorMax;
        return value;
    });

    useEffect(() => {
        if (timerStartValue == null) return;
        if (roomStartDiffMs == null) return;
        if (stepMs == null || stepMs <= 0) return;
        if (!usedRoom) return;
        const stableTimeValue = timerStartValue;
        const stableRoom = usedRoom;
        const stableStepMs = stepMs;

        const timePassed = stableRoom.getTimePassed(stableTimeValue); // 5200
        let calculatedValue: number;
        calculatedValue = Math.floor(timePassed / stableStepMs);
        if (floorMin != null && floorMin > calculatedValue) calculatedValue = floorMin;
        let timeout = stableStepMs - timePassed + (calculatedValue * stableStepMs);
        while (timeout < 0) {
            calculatedValue++
            timeout = stableStepMs - timePassed + (calculatedValue * stableStepMs);
        }

        if (floorMax != null && calculatedValue >= floorMax) {
            setValue(floorMax);
            return;
        } else {
            setValue(calculatedValue);
        }

        let t = setTimeout(handleTime, timeout);
        function handleTime(){
            const timePassed = stableRoom.getTimePassed(stableTimeValue);
            let timeout = stableStepMs - timePassed + (calculatedValue * stableStepMs);
            while (timeout < 0) {
                calculatedValue++
                timeout = stableStepMs - timePassed + (calculatedValue * stableStepMs);
            }
            if (floorMax != null && calculatedValue >= floorMax) {
                setValue(floorMax)
                return;
            }
            setValue(calculatedValue++);
            t = setTimeout(handleTime, timeout);
        }
        return () => clearTimeout(t);
    }, [stepMs, roomStartDiffMs, timerStartValue, usedRoom]);

    return value as any;
}










