
/* import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

// Example component harnesses – add/remove depending on what's on the page
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

describe('AppComponent with Harnesses', () => {
  let fixture: ComponentFixture<AppComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        // Add your Angular Material modules here
      ]
    }).compileComponents();

    // Load component
    fixture = TestBed.createComponent(AppComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should load the page with expected query params', () => {
    // You can test query params this way
    const url = new URL('http://localhost:4200/?x=155000&y=463000&z=13&r=0&l=1');

    expect(url.searchParams.get('x')).toBe('155000');
    expect(url.searchParams.get('y')).toBe('463000');
    expect(url.searchParams.get('z')).toBe('13');
    expect(url.searchParams.get('r')).toBe('0');
    expect(url.searchParams.get('l')).toBe('1');
  });

  it('should find a button and click it', async () => {
    const button = await loader.getHarness(MatButtonHarness.with({ text: /submit|ok|save/i }));
    await button.click();
  });

  it('should fill an input field', async () => {
    const input = await loader.getHarness(MatInputHarness.with({ selector: '#searchInput' }));
    await input.setValue('463000');
    expect(await input.getValue()).toBe('463000');
  });

  it('should select an option from a mat-select', async () => {
    const select = await loader.getHarness(MatSelectHarness.with({ selector: '#layerSelect' }));
    await select.open();

    const options = await select.getOptions();
    await options[0].click(); // Choose first option

    expect(await select.getValueText()).toBe(await options[0].getText());
  });
});
 */

import { AppComponent } from './app.component'
import { Visualisatie } from './enumVisualisatie'
import { LocalStorageService } from './local-storage-service'

describe('AppComponent visualisatie selection', () => {
  let component: AppComponent
  let storage: LocalStorageService

  beforeEach(() => {
    localStorage.clear()
    storage = new LocalStorageService()
    component = new AppComponent({} as never, storage)
    component.ngOnInit()
  })

  afterEach(() => localStorage.clear())

  it('filters visualisaties by search term and category', () => {
    component.searchTerm = 'BAG'
    expect(component.filteredVisualisaties.every(option => option.category === 'BAG')).toBeTrue()

    component.searchTerm = ''
    component.activeCategory = 'BRT'
    expect(component.filteredVisualisaties.every(option => option.category === 'BRT')).toBeTrue()
  })

  it('adds and removes favorites without changing selection', () => {
    const event = { stopPropagation: () => undefined } as Event
    component.toggleFavorite(Visualisatie.BGTachtergrond, event)

    expect(component.isFavorite(Visualisatie.BGTachtergrond)).toBeTrue()
    expect(component.currentVis).toBe(Visualisatie.BGTachtergrond)

    component.toggleFavorite(Visualisatie.BGTachtergrond, event)
    expect(component.isFavorite(Visualisatie.BGTachtergrond)).toBeFalse()
  })

  it('keeps the three most recent selections without duplicates', () => {
    component.onSelect(Visualisatie.BGTstandaard)
    component.onSelect(Visualisatie.Bagstd)
    component.onSelect(Visualisatie.BRTStandaardDarkmode_Annotation)
    component.onSelect(Visualisatie.Bagstd)

    expect(component.recentVisualisaties).toEqual([
      Visualisatie.Bagstd,
      Visualisatie.BRTStandaardDarkmode_Annotation,
      Visualisatie.BGTstandaard,
    ])
  })

  it('ignores invalid stored visualisaties', () => {
    storage.set({ key: 'visualisatieFavorites', value: JSON.stringify(['unknown', Visualisatie.BGTachtergrond]) })
    const restored = new AppComponent({} as never, storage)
    restored.ngOnInit()

    expect(restored.favoriteVisualisaties).toEqual([Visualisatie.BGTachtergrond])
  })
})
