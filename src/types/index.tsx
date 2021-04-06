export interface RoomData {
    id: string
    connected: boolean
    owned: boolean
    entered: boolean
    destroyed: boolean
    connectionId: string|null
    name: string|null
    resource: string|null
    roomStartDiffMs: number|null
}

export interface RoomTimeoutCallback {
    (callbackLeft: number, diffTimeMs: number, expired: boolean): void
}