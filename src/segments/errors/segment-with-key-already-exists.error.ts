export class SegmentWithKeyAlreadyExistsError extends Error {
    constructor(segmentKey: string) {
        super(`Segment with key ${segmentKey} already exists in this project`);
    }
}