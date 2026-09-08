import { Component, HostListener, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import {
  Visualisatie,
  getAllVisualisaties,
  getStyleUrl,
  VisualisatieCategory,
  VisualisatieOption,
} from './enumVisualisatie'
import { LocationComponent } from './location/location.component'
import { OlmapComponent } from './olmap/olmap.component'
import { ShowlinkComponent } from './showlink/showlink.component'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { SearchComponent } from './search/search.component'
import { environment } from '../environments/environment'
import { LocalStorageService } from './local-storage-service'
export const demoSettings = {
  demoVisualisatieRotate: false,
  demoLocatieRotate: false,
  previewFeature: false,  // !environment.production,
  demoLocationApi: true
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports:[CommonModule, FormsModule, MatButtonModule, LocationComponent, OlmapComponent, ShowlinkComponent, SearchComponent]

})
export class AppComponent implements OnInit {
  enumFromValue = <T extends Record<string, string>>(
    val: string,
    _enum: T,
    errormessage: string = `${val} not in enum`
  ) => {
    const enumName = (Object.keys(_enum) as Array<keyof T>).find(
      (k) => _enum[k] === val
    )
    if (!enumName) throw new Error(errormessage)
    return _enum[enumName]
  };

  visualisatie: VisualisatieOption[] = getAllVisualisaties();
  currentVis = Visualisatie.BGTachtergrond;
  //currentVis = Visualisatie.BRTAchtergrondStandaard;
  isShow: boolean = false;
  styleurl!: string
  searchTerm = ''
  activeCategory: VisualisatieCategory | 'Alle' = 'Alle'
  favoriteVisualisaties: Visualisatie[] = []
  recentVisualisaties: Visualisatie[] = []
  readonly categories: Array<VisualisatieCategory | 'Alle'> = [
    'Alle', 'BGT', 'BAG', 'BRT', 'TOP10NL', 'DKK', 'Bestuurlijke gebieden', 'Wkpb', 'Aangepast'
  ]
  private readonly recentLimit = 3

  constructor(private router: Router, private localStorageService: LocalStorageService) {
    /* do nothing*/
  }

  ngOnInit() {
    this.favoriteVisualisaties = this.readStoredVisualisaties('visualisatieFavorites')
    this.recentVisualisaties = this.readStoredVisualisaties('visualisatieRecent')
  }

  toggleShow() {
    this.isShow = !this.isShow
    this.visualisatie = getAllVisualisaties()
  }

  @HostListener('document:keydown.escape')
  closeVisualisatieMenu(): void {
    this.isShow = false
  }

  receiveTitle(data: Visualisatie) {
    this.currentVis = data

    this.styleurl = getStyleUrl(this.currentVis, "netherlandsrdnewquad").styleUrl!
  }

  onSelect(vis: Visualisatie): void {
    this.currentVis = vis
    this.isShow = false
    this.searchTerm = ''
    this.activeCategory = 'Alle'
    this.recentVisualisaties = [vis, ...this.recentVisualisaties.filter(item => item !== vis)].slice(0, this.recentLimit)
    this.persistVisualisations('visualisatieRecent', this.recentVisualisaties)
  }

  get filteredVisualisaties(): VisualisatieOption[] {
    const term = this.searchTerm.trim().toLocaleLowerCase()
    return this.visualisatie.filter(option => {
      const matchesCategory = this.activeCategory === 'Alle' || option.category === this.activeCategory
      const matchesSearch = !term || option.title.toLocaleLowerCase().includes(term)
      return matchesCategory && matchesSearch
    })
  }

  get groupedVisualisaties(): Array<{ category: VisualisatieCategory, options: VisualisatieOption[] }> {
    const groups = new Map<VisualisatieCategory, VisualisatieOption[]>()
    for (const option of this.filteredVisualisaties) {
      const options = groups.get(option.category) ?? []
      options.push(option)
      groups.set(option.category, options)
    }
    return Array.from(groups, ([category, options]) => ({ category, options }))
  }

  get favoriteOptions(): VisualisatieOption[] {
    return this.optionsForValues(this.favoriteVisualisaties)
  }

  get recentOptions(): VisualisatieOption[] {
    return this.optionsForValues(this.recentVisualisaties)
  }

  isFavorite(vis: Visualisatie): boolean {
    return this.favoriteVisualisaties.includes(vis)
  }

  toggleFavorite(vis: Visualisatie, event: Event): void {
    event.stopPropagation()
    this.favoriteVisualisaties = this.isFavorite(vis)
      ? this.favoriteVisualisaties.filter(item => item !== vis)
      : [...this.favoriteVisualisaties, vis]
    this.persistVisualisations('visualisatieFavorites', this.favoriteVisualisaties)
  }

  trackByVisualisatie(_index: number, option: VisualisatieOption): Visualisatie {
    return option.visualisatie
  }

  private optionsForValues(values: Visualisatie[]): VisualisatieOption[] {
    return values
      .map(value => this.visualisatie.find(option => option.visualisatie === value))
      .filter((option): option is VisualisatieOption => option !== undefined)
  }

  private readStoredVisualisaties(key: 'visualisatieFavorites' | 'visualisatieRecent'): Visualisatie[] {
    const stored = this.localStorageService.get(key)
    if (!stored) return []
    try {
      const available = new Set(this.visualisatie.map(option => option.visualisatie))
      const values = JSON.parse(stored) as unknown
      if (!Array.isArray(values)) return []
      return values.filter((value): value is Visualisatie => typeof value === 'string' && available.has(value as Visualisatie))
    } catch {
      return []
    }
  }

  private persistVisualisations(key: 'visualisatieFavorites' | 'visualisatieRecent', values: Visualisatie[]): void {
    this.localStorageService.set({ key, value: JSON.stringify(values) })
  }
}
