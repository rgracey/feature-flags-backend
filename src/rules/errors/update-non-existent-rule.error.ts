export class UpdateNonExistentRuleError extends Error {
    constructor(ruleId: string) {
        super(`Cannot update non-existent rule with ID: ${ruleId}`);
    }
}