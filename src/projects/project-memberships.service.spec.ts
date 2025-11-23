import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMembershipsService } from './project-memberships.service';

describe('ProjectMembershipsService', () => {
  let service: ProjectMembershipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectMembershipsService],
    }).compile();

    service = module.get<ProjectMembershipsService>(ProjectMembershipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
