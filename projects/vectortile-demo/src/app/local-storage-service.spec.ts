import { TestBed } from '@angular/core/testing'

import { LocalStorageService } from './local-storage-service'

describe('LocalStorageServiceService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    if (!service) {
      throw new Error('LocalStorageService was not created')
    }
  });

  it('stores and reads recent visualisaties', () => {
    service.set({ key: 'visualisatieRecent', value: JSON.stringify(['BGT Achtergrond']) });

    if (service.get('visualisatieRecent') !== JSON.stringify(['BGT Achtergrond'])) {
      throw new Error('Recent visualisaties were not stored correctly')
    }
  });

  afterEach(() => {
    localStorage.clear();
  });
});
