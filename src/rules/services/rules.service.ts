import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { AuthorisationService } from 'src/authorisation';
import { FeatureFlagRuleDto, SegmentRuleDto } from '../dtos/rule.dto';
import { Ruleset } from '../entities/ruleset.entity';
import { FeatureFlagRule, SegmentRule } from '../types';

@Injectable()
export class RulesService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly authorisationService: AuthorisationService,
    ) { }

    async upsertFlagRuleset(userId: string, flagId: string, rulesData: FeatureFlagRuleDto[]) {
        const mappedRules: FeatureFlagRule[] = rulesData.map((ruleData) => ({
            type: 'feature_flag',
            ...ruleData,
        }));

        await this.upsertRuleset(userId, flagId, mappedRules);
    }

    async upsertSegmentRuleset(userId: string, segmentId: string, rulesData: SegmentRuleDto[]) {
        const mappedRules: SegmentRule[] = rulesData.map((ruleData) => ({
            type: 'segment',
            ...ruleData,
        }));

        await this.upsertRuleset(userId, segmentId, mappedRules);
    }

    async getRulesetByParentId(parentId: string): Promise<Ruleset | null> {
        // TODO: How do we authorise this?

        return this.entityManager.findOne(Ruleset, { parentId });
    }

    private async upsertRuleset(userId: string, parentId: string, rulesData: (FeatureFlagRule | SegmentRule)[]) {
        // TODO - authorisation
        // await this.authorisationService...

        // TODO - validate segment IDs in rulesData exist

        this.entityManager.transactional(async (em) => {
            let ruleset = await em.findOne(Ruleset, { parentId });

            if (!ruleset) {
                ruleset = em.create(Ruleset, {
                    parentId,
                    rules: rulesData,
                });
            } else {
                ruleset.rules = rulesData;
            }

            await em.persistAndFlush(ruleset);
            return ruleset;
        });
    }

    // async getRules(parentId: string): Promise<Rule[]> {
    //     // TODO: How do we authorise this?

    //     return this.rulesRepository.find({ parentId }, { orderBy: { order: 'ASC' } });
    // }

    // @CreateRequestContext()
    // async upsertRules(userId: string, parentId: string, rulesData: RuleDto[]): Promise<Rule[]> {
    //     // TODO: How do we authorise this?
    //     return await this.entityManager.transactional(async (em) => {
    //         const existingRules = await em.find(Rule, { parentId });

    //         const rulesToDelete = existingRules.filter(
    //             (existingRule) => !rulesData.some((ruleData) => ruleData.id === existingRule.id)
    //         );

    //         if (rulesToDelete.length > 0) {
    //             await em.nativeDelete(Rule, rulesToDelete.map((r) => r.id));
    //         }

    //         for (let i = 0; i < rulesData.length; i++) {
    //             const ruleData = rulesData[i];
    //             if (ruleData.id) {
    //                 // Update existing rule
    //                 const existingRule = existingRules.find((r) => r.id === ruleData.id);

    //                 if (!existingRule) {
    //                     throw new UpdateNonExistentRuleError(ruleData.id);
    //                 }

    //                 existingRule.name = ruleData.name;
    //                 existingRule.order = i;
    //                 // TODO - validate conditions (does segment exist?, valid operators?)
    //                 existingRule.conditions = ruleData.conditions;
    //                 existingRule.value = ruleData.value;
    //                 existingRule.rolloutPercentage = ruleData.rolloutPercentage;
    //                 existingRule.updatedBy = em.getReference(User, userId);
    //                 em.persist(existingRule);

    //                 continue;
    //             }
    //             // Create new rule
    //             const newRule = em.create(Rule, {
    //                 name: ruleData.name,
    //                 order: i,
    //                 parentId: parentId,
    //                 conditions: ruleData.conditions,
    //                 value: ruleData.value,
    //                 rolloutPercentage: ruleData.rolloutPercentage,
    //                 createdBy: userId,
    //             });
    //             em.persist(newRule);
    //         }

    //         em.flush();

    //         return em.find(Rule, { parentId }, { orderBy: { order: 'ASC' } });
    //     });
    // }
}