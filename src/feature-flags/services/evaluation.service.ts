import { Injectable } from '@nestjs/common';
import { EvaluationContextDto, EvaluationResultDto } from '../dtos';
import { FeatureFlagsService } from './feature-flags.service';
import { FeatureFlagNotFound } from '../errors';
import * as jsonLogic from 'json-logic-js';

@Injectable()
export class EvaluationService {
    constructor(
        private readonly featureFlagsService: FeatureFlagsService,
    ) { }

    async evaluateFeatureFlag(
        userId: string,
        projectId: string,
        featureFlagKey: string,
        evaluationContext: EvaluationContextDto
    ): Promise<EvaluationResultDto> {
        const featureFlag = await this.featureFlagsService.getFeatureFlagByKeyForProject(
            userId,
            projectId,
            featureFlagKey
        );

        if (!featureFlag) {
            throw new FeatureFlagNotFound(featureFlagKey);
        }

        for (const rule of featureFlag.rules) {
            // Convert each condition into a JsonLogic expression
            const jsonLogicConditions = rule.conditions.map(condition => ({
                [condition.operator]: [{ var: condition.attribute }, condition.value]
            }));

            const logic = { or: jsonLogicConditions };

            const result = jsonLogic.apply(logic, evaluationContext);

            if (result) {
                return new EvaluationResultDto(
                    rule.value,
                    featureFlag.valueType,
                );
            }
        }

        return new EvaluationResultDto(
            featureFlag.defaultValue,
            featureFlag.valueType,
        );
    }
}
