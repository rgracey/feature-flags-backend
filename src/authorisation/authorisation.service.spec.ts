import { Test, TestingModule } from '@nestjs/testing';
import { AuthorisationService } from './authorisation.service';

describe('AuthorisationService', () => {
  let service: AuthorisationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorisationService],
    }).compile();

    service = module.get<AuthorisationService>(AuthorisationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
