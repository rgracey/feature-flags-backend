import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { FeatureFlag } from './entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AuthorisationService } from 'src/authorisation';
import { CreateFeatureFlagDto } from './dtos';
import { FeatureFlagWithKeyAlreadyExistsError } from './errors';

@Injectable()
export class FeatureFlagsService {
    constructor(
        @InjectRepository(FeatureFlag)
        private readonly featureFlagsRepository: EntityRepository<FeatureFlag>,
        private readonly entityManager: EntityManager,
        private readonly authorisationService: AuthorisationService,
    ) { }

    /**
     * Get all feature flags for a project
     * @param userId the ID of the user trying to access the feature flags for a project
     * @param projectId the ID of the project to get feature flags for
     * @returns the feature flags for the project
     */
    async getFeatureFlagsForProject(userId: string, projectId: string) {
        if (!this.authorisationService.canGetFeatureFlags(userId, projectId)) {
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
        if (!this.authorisationService.canCreateFeatureFlag(userId, projectId)) {
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
