import { Injectable } from '@nestjs/common';
import { ProjectMembership } from './entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class ProjectMembershipsService {
    constructor(
        @InjectRepository(ProjectMembership)
        private readonly projectMembershipsRepository: EntityRepository<ProjectMembership>
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

}
