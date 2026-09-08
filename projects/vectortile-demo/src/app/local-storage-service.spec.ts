import { TestBed } from '@angular/core/testing'

import { LocalStorageService } from './local-storage-service'

describe('LocalStorageServiceService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('stores and reads visualisatie preferences', () => {
    service.set({ key: 'visualisatieFavorites', value: JSON.stringify(['BGT Achtergrond']) });

    expect(service.get('visualisatieFavorites')).toBe(JSON.stringify(['BGT Achtergrond']));
  });

  afterEach(() => {
    localStorage.clear();
  });
});
