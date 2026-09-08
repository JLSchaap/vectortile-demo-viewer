
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
    if (!component.filteredVisualisaties.every(option => option.category === 'BAG')) {
      throw new Error('The BAG search filter returned another category')
    }

    component.searchTerm = ''
    component.activeCategory = 'BRT'
    if (!component.filteredVisualisaties.every(option => option.category === 'BRT')) {
      throw new Error('The BRT category filter returned another category')
    }
  })

  it('filters visualisaties to DKK options', () => {
    component.selectCategory('DKK')

    const options = component.filteredVisualisaties
    const titles = options.map(option => option.title)
    if (options.length !== 2 || !options.every(option => option.category === 'DKK') || JSON.stringify(titles) !== JSON.stringify([
      'Kadastrale kaart Standaard visualisatie',
      'Kadastrale kaart Kwaliteits visualisatie',
    ])) {
      throw new Error('The DKK filter did not return the expected visualisaties')
    }
  })

  it('filters visualisaties to TOP10NL options through category selection', () => {
    component.selectCategory('TOP10NL')

    const options = component.filteredVisualisaties
    if (options.length !== 4 || !options.every(option => option.category === 'TOP10NL')) {
      throw new Error('The TOP10NL filter did not return only TOP10NL visualisaties')
    }
  })

  it('selects a visualisatie and stores it as recent', () => {
    component.onSelect(Visualisatie.BGTstandaard)

    if (component.currentVis !== Visualisatie.BGTstandaard || JSON.stringify(component.recentVisualisaties) !== JSON.stringify([Visualisatie.BGTstandaard])) {
      throw new Error('The visualisatie selection was not stored as recent')
    }
  })

  it('keeps the three most recent selections without duplicates', () => {
    component.onSelect(Visualisatie.BGTstandaard)
    component.onSelect(Visualisatie.Bagstd)
    component.onSelect(Visualisatie.BRTStandaardDarkmode_Annotation)
    component.onSelect(Visualisatie.Bagstd)

    const recent = component.recentVisualisaties
    if (JSON.stringify(recent) !== JSON.stringify([
      Visualisatie.Bagstd,
      Visualisatie.BRTStandaardDarkmode_Annotation,
      Visualisatie.BGTstandaard,
    ])) {
      throw new Error('Recent visualisaties were not ordered or limited correctly')
    }
  })

  it('ignores invalid stored recent visualisaties', () => {
    storage.set({ key: 'visualisatieRecent', value: JSON.stringify(['unknown', Visualisatie.BGTachtergrond]) })
    const restored = new AppComponent({} as never, storage)
    restored.ngOnInit()

    if (JSON.stringify(restored.recentVisualisaties) !== JSON.stringify([Visualisatie.BGTachtergrond])) {
      throw new Error('Invalid stored visualisaties were not ignored')
    }
  })
})
