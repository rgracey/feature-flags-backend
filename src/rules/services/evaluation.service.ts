import { Injectable } from '@nestjs/common';
import { EvaluationContextDto, EvaluationResultDto } from '../dtos';
import * as jsonLogic from 'json-logic-js';
import { Rule } from '../entities';

@Injectable()
export class EvaluationService {
    constructor() { }

    async evaluate(
        evaluationContext: EvaluationContextDto,
        rules: Rule[]
    ): Promise<EvaluationResultDto | null> {
        for (const rule of rules) {
            // Convert each condition into a JsonLogic expression
            const jsonLogicConditions = rule.conditions.map(condition => ({
                [condition.operator]: [{ var: condition.attribute }, condition.value]
            }));

            const logic = { or: jsonLogicConditions };

            const result = jsonLogic.apply(logic, evaluationContext.attributes);

            if (!result) {
                continue; // rule does not match
            }

            const percentage = this.hashToPercentage(evaluationContext.stableId, rule.id);
            if (percentage >= rule.rolloutPercentage) {
                continue; // user falls outside rollout
            }

            return new EvaluationResultDto(
                rule.value,
                rule.id,
            );
        }

        return null;
    }

    private hashToPercentage(stableId: string, ruleId: string): number {
        let hash = 0;
        const combined = stableId + ruleId;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }

        return Math.abs(hash) % 100;
    }
}
