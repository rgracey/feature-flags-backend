export class FeatureFlagWithKeyAlreadyExistsError extends Error {
    constructor(key: string) {
        super(`Feature flag with key '${key}' already exists`);
    }
}