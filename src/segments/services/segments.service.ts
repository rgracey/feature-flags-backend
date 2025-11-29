import { Injectable } from '@nestjs/common';
import { CreateSegmentDto } from '../dtos';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Segment } from '../entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AuthorisationService } from 'src/authorisation';
import { SegmentWithKeyAlreadyExistsError } from '../errors';
import { RulesService } from 'src/rules';

@Injectable()
export class SegmentsService {
    constructor(
        @InjectRepository(Segment)
        private readonly segmentsRepository: EntityRepository<Segment>,
        private readonly entityManager: EntityManager,
        private readonly authorisationService: AuthorisationService,
        private readonly rulesService: RulesService,
    ) { }

    /**
     * Find a segment by its key for a specific project
     * @param userId the ID of the user getting the segment
     * @param projectId the ID of the project the segment belongs to
     * @param segmentId the ID of the segment to retrieve
     * @returns the segment if found, null otherwise
     */
    async getSegmentById(
        userId: string,
        projectId: string, // XXX - remove projectId?
        segmentId: string
    ) {
        if (!(await this.authorisationService.canGetSegments(userId, projectId))) {
            throw new Error('User does not have access to get segments in this project');
        }

        return this.segmentsRepository.findOne({
            project: { id: projectId },
            id: segmentId,
        });
    }

    /**
     * Create a new segment in a project
     * @param userId the ID of the user creating the segment
     * @param projectId the ID of the project the segment is being created in
     * @param createSegmentDto the data to create the segment with
     * @returns the newly created segment
     */
    async createSegment(userId: string, projectId: string, createSegmentDto: CreateSegmentDto) {
        if (!(await this.authorisationService.canCreateSegment(userId, projectId))) {
            throw new Error('User does not have access to create segments in this project');
        }

        return await this.entityManager.transactional(async (em) => {
            const segment = em.create(Segment, {
                name: createSegmentDto.name,
                description: createSegmentDto.description,
                project: projectId,
                createdBy: userId,
            });
            await em.persistAndFlush(segment);

            await this.rulesService.upsertSegmentRuleset(userId, segment.id, createSegmentDto.rules);

            return segment;
        });
    }
}
