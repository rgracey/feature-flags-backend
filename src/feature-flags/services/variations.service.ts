import { Injectable } from '@nestjs/common';
import { Variation } from '../entities/variation.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class VariationsService {
    constructor(
        @InjectRepository(Variation)
        private readonly variationsRepository: EntityRepository<Variation>,
    ) { }

    async getVariationById(variationId: string) {
        return this.variationsRepository.findOne({ id: variationId });
    }

    async getVariationsForFlag(flagId: string) {
        return this.variationsRepository.find({ flag: flagId });
    }
}
