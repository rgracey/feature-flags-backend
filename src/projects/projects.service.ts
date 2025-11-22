import { EntityManager, EntityRepository, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ProjectMembership, Project } from './entities';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectsRepository: EntityRepository<Project>,
        @InjectRepository(ProjectMembership)
        private readonly projectMembershipsRepository: EntityRepository<ProjectMembership>,
        private readonly entityManager: EntityManager,
    ) { }

    /**
     * Check if a user is a member of a given project
     * @param userId the ID of the user to check
     * @param projectId the ID of the project to check
     * @returns true if the user is a member of the project, false otherwise
     */
    async isUserAMemberOfProject(userId: string, projectId: string): Promise<boolean> {
        const membership = await this.projectMembershipsRepository.findOne({
            user: userId,
            project: projectId,
        });

        return !!membership;
    }

    /**
     * Create a new project
     * @param name name of the project to create
     * @param userId the ID of the user creating the project
     * @returns the newly created project
     */
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
