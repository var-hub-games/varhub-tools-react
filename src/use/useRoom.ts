import {useContext} from "react"
import RoomContext from "../context/RoomContext"
import {Room} from "@varhub-games/tools/dist/Room";


export default function useRoom(): Room {
    const room = useContext(RoomContext);
    if (!room) throw new Error("useRoom with no <RoomProvider/>")
    return room;
}