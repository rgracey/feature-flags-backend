import { Injectable } from '@nestjs/common';
import { EvaluationContextDto, EvaluationResultDto } from '../dtos';
import * as jsonLogic from 'json-logic-js';
import { Rule } from '../entities';
import { Condition } from '../types';
import { RulesService } from './rules.service';

@Injectable()
export class EvaluationService {
    constructor(
        private readonly rulesService: RulesService,
    ) { }

    async evaluate(
        evaluationContext: EvaluationContextDto,
        rules: Rule[]
    ): Promise<EvaluationResultDto | null> {
        const results = await Promise.all(
            rules.map(async (rule) => {
                return this.evaluateRule(evaluationContext, rule);
            })
        );

        return results.find((res) => res !== null) || null;
    }

    private async evaluateRule(
        evaluationContext: EvaluationContextDto,
        rule: Rule
    ): Promise<EvaluationResultDto | null> {
        const conditionResults = await Promise.all(
            rule.conditions.map(async (condition) => {
                switch (condition.type) {
                    case 'attribute':
                        return this.evaluateAttributeCondition(
                            condition,
                            evaluationContext.attributes
                        );
                    case 'segment':
                        return this.evaluateSegmentCondition(
                            condition,
                            evaluationContext
                        );
                    default:
                        throw new Error(`Unknown condition type: ${JSON.stringify(condition)}`);
                }
            })
        );

        if (conditionResults.every((res) => res)) {
            return new EvaluationResultDto(rule.value, rule.id);
        }

        return null;
    }

    private async evaluateSegmentCondition(
        condition: Extract<Condition, { type: 'segment' }>,
        evaluationContext: EvaluationContextDto
    ): Promise<boolean> {
        const rules = await this.rulesService.getRules(condition.segmentId);

        return (await Promise.all(
            rules.map(async (rule) => {
                return this.evaluateRule(evaluationContext, rule);
            })
        )).some((res) => !!res);
    }

    private evaluateAttributeCondition(
        condition: Extract<Condition, { type: 'attribute' }>,
        attributes: EvaluationContextDto['attributes']
    ): boolean {
        const logic: jsonLogic.RulesLogic<jsonLogic.AdditionalOperation> = {
            and: [{
                [condition.operator]: [{ var: condition.attribute }, condition.value]
            }]
        };

        return jsonLogic.apply(logic, attributes);
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
