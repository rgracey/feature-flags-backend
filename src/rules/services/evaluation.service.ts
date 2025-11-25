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

            const result = jsonLogic.apply(logic, evaluationContext);

            if (result) {
                return new EvaluationResultDto(
                    rule.value,
                    rule.id,
                );
            }
        }

        return null;
    }
}
