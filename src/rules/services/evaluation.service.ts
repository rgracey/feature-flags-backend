import { Injectable } from '@nestjs/common';
import { EvaluationContextDto } from '../dtos';
import * as jsonLogic from 'json-logic-js';
import { Condition, Rule } from '../types';
import { RulesService } from './rules.service';

@Injectable()
export class EvaluationService {
    constructor(
        private readonly rulesService: RulesService,
    ) { }

    async evaluate(
        evaluationContext: EvaluationContextDto,
        rules: Rule[],
    ): Promise<Rule | null> {
        const results = await Promise.all(
            rules.map(async (rule) => {
                const matches = await this.evaluateConditions(
                    evaluationContext,
                    rule
                )

                return matches ? rule : null;
            })
        );

        return results.find(res => res) || null;
    }

    // async evaluateOld(
    //     evaluationContext: EvaluationContextDto,
    //     rules: Rule[]
    // ): Promise<string | null> {
    //     for (const rule of rules) {
    //         switch (rule.type) {
    //             case 'feature_flag':
    //                 const matches = await this.evaluateConditions(
    //                     evaluationContext,
    //                     rule
    //                 );

    //                 if (matches) {
    //                     return rule.variationId;
    //                 }
    //                 break;
    //             case 'segment':
    //                 const segmentMatches = await this.evaluateConditions(
    //                     evaluationContext,
    //                     rule
    //                 );

    //                 if (segmentMatches) {
    //                     return rule.variationId;
    //                 }
    //                 break;
    //             default:
    //                 throw new Error(`Unknown rule type: ${JSON.stringify(rule)}`);
    //         }
    //     }

    //     return null;
    // }

    private async evaluateConditions(
        evaluationContext: EvaluationContextDto,
        rule: Rule,
    ): Promise<boolean> {
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

        return conditionResults.every((res) => res);
    }

    private evaluateAttributeCondition(
        condition: Extract<Condition, { type: 'attribute' }>,
        attributes: EvaluationContextDto['attributes'],
    ): boolean {
        const logic: jsonLogic.RulesLogic<jsonLogic.AdditionalOperation> = {
            and: [{
                [condition.operator]: [{ var: condition.attribute }, condition.value]
            }]
        };

        return jsonLogic.apply(logic, attributes);
    }

    private async evaluateSegmentCondition(
        condition: Extract<Condition, { type: 'segment' }>,
        evaluationContext: EvaluationContextDto
    ): Promise<boolean> {
        const ruleset = await this.rulesService.getRulesetByParentId(condition.segmentId);

        if (!ruleset) {
            // TODO - throw error? This should not happen
            return false;
        }

        const results = await Promise.all(
            ruleset.rules.map(async (rule) =>
                await this.evaluateConditions(
                    evaluationContext,
                    rule
                )
            )
        );

        return results.some((res) => res);
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
