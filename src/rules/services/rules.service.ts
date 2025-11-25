import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Rule } from '../entities';
import { AuthorisationService } from 'src/authorisation';
import { RuleDto } from '../dtos/rule.dto';
import { UpdateNonExistentRuleError } from '../errors';
import { User } from 'src/users/user.entity';

@Injectable()
export class RulesService {
    constructor(
        @InjectRepository(Rule)
        private readonly rulesRepository: EntityRepository<Rule>,
        private readonly entityManager: EntityManager,
        private readonly authorisationService: AuthorisationService,
    ) { }

    async getRules(parentId: string): Promise<Rule[]> {
        // TODO: How do we authorise this?

        return this.rulesRepository.find({ parentId }, { orderBy: { order: 'ASC' } });
    }

    async upsertRules(userId: string, parentId: string, rulesData: RuleDto[]): Promise<Rule[]> {
        // TODO: How do we authorise this?

        await this.entityManager.transactional(async (em) => {
            const existingRules = await this.rulesRepository.find({ parentId });

            const rulesToDelete = existingRules.filter(
                (existingRule) => !rulesData.some((ruleData) => ruleData.id === existingRule.id)
            );

            if (rulesToDelete.length > 0) {
                await em.nativeDelete(Rule, rulesToDelete.map((r) => r.id));
            }

            for (let i = 0; i < rulesData.length; i++) {
                const ruleData = rulesData[i];
                if (ruleData.id) {
                    // Update existing rule
                    const existingRule = existingRules.find((r) => r.id === ruleData.id);

                    if (!existingRule) {
                        throw new UpdateNonExistentRuleError(ruleData.id);
                    }

                    existingRule.name = ruleData.name;
                    existingRule.order = i;
                    existingRule.conditions = ruleData.conditions;
                    existingRule.value = ruleData.value;
                    existingRule.rolloutPercentage = ruleData.rolloutPercentage;
                    existingRule.updatedBy = this.entityManager.getReference(User, userId);
                    em.persist(existingRule);

                    continue;
                }
                // Create new rule
                const newRule = this.rulesRepository.create({
                    name: ruleData.name,
                    order: i,
                    parentId: parentId,
                    conditions: ruleData.conditions,
                    value: ruleData.value,
                    rolloutPercentage: ruleData.rolloutPercentage,
                    createdBy: userId,
                });
                em.persist(newRule);
            }

            await em.flush();
        });

        return this.rulesRepository.find({ parentId }, { orderBy: { order: 'ASC' } });
    }
}