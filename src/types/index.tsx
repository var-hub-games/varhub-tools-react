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
    roomStartDiffAccuracyMs: number
}

export interface RoomTimeoutCallback {
    (stepsLeft: number, timeLeftMs: number, expired: boolean): void
}