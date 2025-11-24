export class FeatureFlagNotFound extends Error {
    constructor(key: string) {
        super(`Feature flag with key '${key}' not found`);
    }
}