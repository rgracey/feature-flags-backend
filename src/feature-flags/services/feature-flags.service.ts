import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { FeatureFlag } from '../entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AuthorisationService } from 'src/authorisation';
import { CreateFeatureFlagDto, UpdateFeatureFlagDto } from '../dtos';
import { FeatureFlagNotFound, FeatureFlagWithKeyAlreadyExistsError } from '../errors';
import { RulesService } from 'src/rules';
import { UpdateNonExistentRuleError } from 'src/rules/errors';

@Injectable()
export class FeatureFlagsService {
    constructor(
        @InjectRepository(FeatureFlag)
        private readonly featureFlagsRepository: EntityRepository<FeatureFlag>,
        private readonly entityManager: EntityManager,
        private readonly authorisationService: AuthorisationService,
        private readonly rulesService: RulesService,
    ) { }

    /**
     * Update an existing feature flag
     * @param userId the ID of the user updating the feature flag
     * @param projectId the ID of the project this feature flag belongs to
     * @param featureFlagKey the key of the feature flag to update
     * @param updateFeatureFlagDto the data to update the feature flag with
     * @returns the updated feature flag
     */
    async updateFeatureFlag(
        userId: string,
        projectId: string,
        featureFlagKey: string,
        updateFeatureFlagDto: UpdateFeatureFlagDto
    ) {
        if (!(await this.authorisationService.canUpdateFeatureFlag(userId, projectId))) {
            throw new Error('User does not have access to update feature flags in this project');
        }

        const featureFlag = await this.getFeatureFlagByKeyForProject(userId, projectId, featureFlagKey);

        if (!featureFlag) {
            throw new FeatureFlagNotFound(featureFlagKey);
        }

        await this.entityManager.transactional(async (em) => {
            featureFlag.description = updateFeatureFlagDto.description;

            this.rulesService.upsertRules(userId, featureFlag.id, updateFeatureFlagDto.rules);

            await em.persistAndFlush([featureFlag]);
        });

        return this.getFeatureFlagByKeyForProject(userId, projectId, featureFlagKey);
    }

    /**
     * Get a specific feature flag by its key for a project
     * @param userId the ID of the user getting the feature flag
     * @param projectId the ID of the project to get the feature flag in
     * @param featureFlagKey the key of the feature flag to get
     * @returns the feature flag if found, false otherwise
     */
    async getFeatureFlagByKeyForProject(
        userId: string,
        projectId: string,
        featureFlagKey: string
    ) {
        if (!(await this.authorisationService.canGetFeatureFlags(userId, projectId))) {
            throw new Error('User does not have access to this project');
        }

        const featureFlag = await this.featureFlagsRepository.findOne({
            project: { id: projectId },
            key: featureFlagKey
        });

        if (!featureFlag) {
            throw new Error('Feature flag not found');
        }

        const rules = await this.rulesService.getRules(featureFlag.id);
        featureFlag.rules = rules;

        return featureFlag;
    }

    /**
     * Get all feature flags for a project
     * @param userId the ID of the user trying to access the feature flags for a project
     * @param projectId the ID of the project to get feature flags for
     * @returns the feature flags for the project
     */
    async getFeatureFlagsForProject(userId: string, projectId: string) {
        if (!(await this.authorisationService.canGetFeatureFlags(userId, projectId))) {
            throw new Error('User does not have access to this project');
        }

        return this.featureFlagsRepository.find(
            { project: { id: projectId } }
        );
    }

    /**
     * Create a new feature flag for a project
     * @param userId the ID of the user creating the feature flag
     * @param projectId the ID of the project to create the feature flag in
     * @param createFeatureFlagDto the data to create the feature flag with
     * @returns the newly created feature flag
     */
    async createFeatureFlagForProject(
        userId: string,
        projectId: string,
        createFeatureFlagDto: CreateFeatureFlagDto
    ) {
        if (!(await this.authorisationService.canCreateFeatureFlag(userId, projectId))) {
            throw new Error('User does not have access to this project');
        }

        const existingFlagWithKey = await this.featureFlagsRepository.findOne({
            key: createFeatureFlagDto.key,
            project: { id: projectId }
        });

        if (existingFlagWithKey) {
            throw new FeatureFlagWithKeyAlreadyExistsError(createFeatureFlagDto.key);
        }

        const featureFlag = this.featureFlagsRepository.create({
            project: projectId,
            createdBy: userId,
            name: createFeatureFlagDto.name,
            description: createFeatureFlagDto.description,
            defaultValue: createFeatureFlagDto.defaultValue,
            valueType: createFeatureFlagDto.valueType,
            key: createFeatureFlagDto.key,
        });
        await this.entityManager.persistAndFlush(featureFlag);
        return featureFlag;
    }
}
