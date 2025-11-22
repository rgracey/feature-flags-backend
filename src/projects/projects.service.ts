import { EntityManager, EntityRepository, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectsRepository: EntityRepository<Project>,
        private readonly entityManager: EntityManager,
    ) { }

    async createProject(name: string, userId: string): Promise<Project> {
        const project = this.projectsRepository.create({
            name,
            memberships: [
                { user: userId, }
            ]
        });
        await this.entityManager.persistAndFlush(project);
        
        return this.projectsRepository.findOneOrFail({ id: project.id });
    }

    /**
     * Get all projects for a given user
     * @param userId the ID of the user to get all projects for
     * @returns all projects this user has access to
     */
    async getAllProjectsForUser(userId: string): Promise<Project[]> {
        return this.projectsRepository.find(
            { memberships: { user: { id: userId } } }
        );
    }
}
