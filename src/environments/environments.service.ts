import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ProjectsService } from 'src/projects';
import { Environment } from './environment.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CreateEnvironmentDto } from './dtos';

@Injectable()
export class EnvironmentsService {
    constructor(
        @InjectRepository(Environment)
        private readonly environmentsRepository: EntityRepository<Environment>,
        private readonly entityManager: EntityManager,
        private readonly projectsService: ProjectsService,
    ) { }

    /**
     * Create a new environment for a project
     * @param userId the ID of the user creating the environment
     * @param projectId the ID of the project to create the environment in
     * @param createEnvironmentDto the data to create the environment with
     * @returns the newly created environment
     */
    async createEnvironmentForProject(userId: string, projectId: string, createEnvironmentDto: CreateEnvironmentDto) {
        if (!this.projectsService.isUserAMemberOfProject(userId, projectId)) {
            throw new Error('User does not have access to this project');
        }

        const environment = this.environmentsRepository.create({
            name: createEnvironmentDto.name,
            project: projectId,
            createdBy: userId,
        });

        await this.entityManager.persistAndFlush(environment);
        return environment;
    }

    /**
     * Get all environments for a project that a user has access to
     * @param userId the ID of the user trying to access the environments for a project
     * @param projectId the ID of the project to get environments for
     * @returns the environments for the project
     */
    async getAllEnvironmentsForProject(userId: string, projectId: string) {
        if (!this.projectsService.isUserAMemberOfProject(userId, projectId)) {
            throw new Error('User does not have access to this project');
        }

        return this.environmentsRepository.find(
            { project: { id: projectId } }
        );
    }
}
