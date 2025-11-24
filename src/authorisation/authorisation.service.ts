import { Injectable } from '@nestjs/common';
import { ProjectMembershipsService } from 'src/projects';

@Injectable()
export class AuthorisationService {
    constructor(
        private readonly projectMembershipsService: ProjectMembershipsService,
    ) { }

    async canGetFeatureFlags(userId: string, projectId: string): Promise<boolean> {
        return this.projectMembershipsService.isUserAMemberOfProject(userId, projectId);
    }

    async canCreateFeatureFlag(userId: string, projectId: string): Promise<boolean> {
        return this.projectMembershipsService.isUserAMemberOfProject(userId, projectId);
    }

    async canUpdateFeatureFlag(userId: string, projectId: string): Promise<boolean> {
        return this.projectMembershipsService.isUserAMemberOfProject(userId, projectId);
    }

    async canCreateEnvironmentInProject(userId: string, projectId: string): Promise<boolean> {
        return this.projectMembershipsService.isUserAMemberOfProject(userId, projectId);
    }

    async canGetEnvironmentsInProject(userId: string, projectId: string): Promise<boolean> {
        return this.projectMembershipsService.isUserAMemberOfProject(userId, projectId);
    }
}
