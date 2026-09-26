// Official Drinks Menu for Super E Luxury Hotel & Suites Ltd.
// Sourced directly from official hotel drinks price boards

export interface DrinkItem {
  id: string;
  name: string;
  category: DrinkCategoryKey;
  price: number;
  description?: string;
  volumeOrServing?: string;
  featured?: boolean;
  popular?: boolean;
}

export type DrinkCategoryKey = 
  | 'soft-drinks'
  | 'beer'
  | 'other-beverages'
  | 'gin-whisky'
  | 'non-alcoholic-wine'
  | 'red-alcoholic-wine';

export interface DrinkCategory {
  key: DrinkCategoryKey;
  name: string;
  tagline: string;
  description: string;
  badge?: string;
}

export const DRINK_CATEGORIES: DrinkCategory[] = [
  {
    key: 'soft-drinks',
    name: 'Soft Drinks & Chilled Juices',
    tagline: 'Crisp, Refreshing & Chilled',
    description: 'Ice-cold carbonated sodas, rich dairy yogurts, malt beverages, and natural fruit juices.',
    badge: '15 Varieties',
  },
  {
    key: 'beer',
    name: 'Cold Beers & Ciders',
    tagline: 'Ice Cold Stouts, Lagers & Flavoured Beers',
    description: 'Premium Nigerian & international lagers, smooth stouts, craft ciders, and malt-infused beers served frosty.',
    badge: '17 Brands',
  },
  {
    key: 'other-beverages',
    name: 'Herbal Bitters & Energy Drinks',
    tagline: 'Revitalizing & Herbal Infusions',
    description: 'Classic bitters, revitalizing energy infusions, and bold herbal blends.',
    badge: 'Popular',
  },
  {
    key: 'gin-whisky',
    name: 'Gin, Whisky, Cognac & Spirits',
    tagline: 'Top-Shelf Whiskies, Cognacs & Luxury Spirits',
    description: 'Fine aged Scotch, Irish whiskey, Tennessee whiskey, VSOP/XO cognacs, vodkas, and premium liqueurs.',
    badge: '30 Premium Labels',
  },
  {
    key: 'non-alcoholic-wine',
    name: 'Non-Alcoholic Wines',
    tagline: 'Sparkling & Sweet Red Celebration Wines',
    description: 'Luxurious alcohol-free red and sparkling wines, ideal for family celebrations, toasts, and refined dining.',
    badge: '12 Selections',
  },
  {
    key: 'red-alcoholic-wine',
    name: 'Red Alcoholic Wine & Sparkling',
    tagline: 'Rich Reds, Rose & Sparkling Champagne-Style Wines',
    description: 'Curated bottles of sweet reds, brut sparkling, crisp rosés, and full-bodied table wines.',
    badge: '20 Bottles',
  },
];

export const OFFICIAL_DRINKS_MENU: DrinkItem[] = [
  // ══════════════════════════════════════════════════
  // SOFT DRINKS (from Board 1)
  // ══════════════════════════════════════════════════
  { id: 'sd-water', name: 'Bottled Pure Water', category: 'soft-drinks', price: 500, volumeOrServing: '75cl Bottle', description: 'Pure chilled premium bottled water', popular: true },
  { id: 'sd-coke', name: 'Coca-Cola (Coke)', category: 'soft-drinks', price: 800, volumeOrServing: '50cl Can/Bottle', description: 'Chilled classic refreshing Coca-Cola' },
  { id: 'sd-fanta', name: 'Fanta Orange', category: 'soft-drinks', price: 800, volumeOrServing: '50cl Can/Bottle', description: 'Sparkling sweet orange soda' },
  { id: 'sd-sprite', name: 'Sprite', category: 'soft-drinks', price: 800, volumeOrServing: '50cl Can/Bottle', description: 'Crisp lemon-lime soda' },
  { id: 'sd-teem', name: 'Teem Bitter Lemon / Soda', category: 'soft-drinks', price: 800, volumeOrServing: '50cl Can/Bottle', description: 'Zesty bitter lemon soda' },
  { id: 'sd-can-malt', name: 'Can Malt', category: 'soft-drinks', price: 1200, volumeOrServing: '33cl Can', description: 'Rich nourishing malt beverage', featured: true },
  { id: 'sd-can-exotic', name: 'Can Chi Exotic', category: 'soft-drinks', price: 1200, volumeOrServing: '33cl Can', description: 'Tropical pineapple & coconut nectar' },
  { id: 'sd-schweppes', name: 'Schweppes (Tonic / Bitter Lemon)', category: 'soft-drinks', price: 1000, volumeOrServing: '33cl Can', description: 'Premium mixer soda' },
  { id: 'sd-fayrouz', name: 'Fayrouz Pear', category: 'soft-drinks', price: 1000, volumeOrServing: '33cl Can', description: 'Sparkling malted apple & pear drink' },
  { id: 'sd-climax', name: 'Climax Energy Drink', category: 'soft-drinks', price: 2000, volumeOrServing: 'Can', description: 'Sparkling herbal energy booster' },
  { id: 'sd-power-horse', name: 'Power Horse Energy Drink', category: 'soft-drinks', price: 2500, volumeOrServing: 'Can', description: 'High-performance energy booster', popular: true },
  { id: 'sd-red-bull', name: 'Red Bull Energy Drink', category: 'soft-drinks', price: 2500, volumeOrServing: '25cl Can', description: 'Vitalizes body and mind', featured: true },
  { id: 'sd-exotic-pack', name: 'Chi Exotic (Full Pack)', category: 'soft-drinks', price: 3000, volumeOrServing: '1 Litre Pack', description: 'Chilled 1L tropical nectar pack' },
  { id: 'sd-hollandia', name: 'Hollandia Yoghurt (Full Pack)', category: 'soft-drinks', price: 3000, volumeOrServing: '1 Litre Pack', description: 'Creamy sweet drinking yogurt (Strawberry/Plain)' },
  { id: 'sd-chivita', name: 'Chivita 100% (Full Pack)', category: 'soft-drinks', price: 3000, volumeOrServing: '1 Litre Pack', description: '100% natural fruit juice (Orange/Apple/Pineapple)' },

  // ══════════════════════════════════════════════════
  // BEER & CIDERS (from Board 1)
  // ══════════════════════════════════════════════════
  { id: 'b-star-radler', name: 'Star Radler (Citrus / Red Fruit)', category: 'beer', price: 1300, volumeOrServing: 'Bottle', description: 'Refreshing beer with real fruit juice' },
  { id: 'b-budweiser', name: 'Budweiser (King of Beers)', category: 'beer', price: 1400, volumeOrServing: '60cl Bottle', description: 'Smooth American lager' },
  { id: 'b-tiger', name: 'Tiger Crystal Lager', category: 'beer', price: 1400, volumeOrServing: '60cl Bottle', description: 'Crystal-cold filtered lager' },
  { id: 'b-goldberg', name: 'Goldberg Lager', category: 'beer', price: 1500, volumeOrServing: '60cl Bottle', description: 'Crisp golden Nigerian lager' },
  { id: 'b-goldberg-black', name: 'Goldberg Black', category: 'beer', price: 1500, volumeOrServing: '60cl Bottle', description: 'Rich dark malt-flavored lager' },
  { id: 'b-life', name: 'Life Continental Lager', category: 'beer', price: 1500, volumeOrServing: '60cl Bottle', description: 'Progressive Eastern Nigerian lager' },
  { id: 'b-star', name: 'Star Lager Beer', category: 'beer', price: 1500, volumeOrServing: '60cl Bottle', description: 'Nigeria’s classic shine-on lager' },
  { id: 'b-desperados', name: 'Desperados Tequila Flavoured Beer', category: 'beer', price: 1500, volumeOrServing: 'Bottle', description: 'Lager flavored with tequila & citrus notes', popular: true },
  { id: 'b-orijin-beer', name: 'Orijin Beer', category: 'beer', price: 1500, volumeOrServing: '60cl Bottle', description: 'Herbal African botanicals infused lager' },
  { id: 'b-trophy', name: 'Trophy Lager', category: 'beer', price: 1500, volumeOrServing: '60cl Bottle', description: 'Honourable full-bodied lager' },
  { id: 'b-trophy-stout', name: 'Trophy Stout', category: 'beer', price: 1500, volumeOrServing: '60cl Bottle', description: 'Rich roasted malt dark stout' },
  { id: 'b-hero', name: 'Hero Lager', category: 'beer', price: 1500, volumeOrServing: '60cl Bottle', description: 'Red cap premium brew' },
  { id: 'b-castle-lite', name: 'Castle Lite', category: 'beer', price: 1500, volumeOrServing: '60cl Bottle', description: 'Extra cold crisp lager' },
  { id: 'b-legend', name: 'Legend Extra Stout', category: 'beer', price: 1600, volumeOrServing: '60cl Bottle', description: 'Full-bodied dark roasted stout' },
  { id: 'b-smirnoff-ice', name: 'Smirnoff Ice', category: 'beer', price: 2000, volumeOrServing: 'Bottle', description: 'Crisp lemon-flavored vodka beverage', featured: true },
  { id: 'b-medium-stout', name: 'Guinness Medium Stout', category: 'beer', price: 2000, volumeOrServing: 'Medium Bottle', description: 'Legendary Guinness foreign extra stout' },
  { id: 'b-smooth', name: 'Guinness Smooth', category: 'beer', price: 2000, volumeOrServing: 'Bottle', description: 'Rich dark velvety smooth stout', popular: true },
  { id: 'b-heineken', name: 'Heineken Lager', category: 'beer', price: 2000, volumeOrServing: '60cl Bottle', description: 'International premium pure malt lager', featured: true },

  // ══════════════════════════════════════════════════
  // OTHER BEVERAGES & BITTERS (from Board 1)
  // ══════════════════════════════════════════════════
  { id: 'ob-small-bitters', name: 'Small Bitters', category: 'other-beverages', price: 2000, volumeOrServing: 'Serving', description: 'Traditional aromatic herbal bitters' },
  { id: 'ob-double-black', name: 'Double Black Blend', category: 'other-beverages', price: 2000, volumeOrServing: 'Serving', description: 'Bold herbal spirited mix' },
  { id: 'ob-bullet', name: 'Bullet Energy Beverage', category: 'other-beverages', price: 2500, volumeOrServing: 'Can', description: 'Intense energy boost' },

  // ══════════════════════════════════════════════════
  // GIN / WHISKY / SPIRITS (from Board 1)
  // ══════════════════════════════════════════════════
  { id: 'gw-best-cream-small', name: 'Best Cream Liqueur (Small)', category: 'gin-whisky', price: 3000, volumeOrServing: 'Small Bottle', description: 'Smooth Irish cream style liqueur' },
  { id: 'gw-orijin-big', name: 'Orijin Spirit (Big Bottle)', category: 'gin-whisky', price: 6000, volumeOrServing: '75cl Bottle', description: 'Herbal spirit blend with sweet orange peel & herbs' },
  { id: 'gw-don-paloma', name: 'Don Paloma Tequila', category: 'gin-whisky', price: 6000, volumeOrServing: 'Bottle', description: 'Smooth party tequila' },
  { id: 'gw-smirnoff-x1', name: 'Smirnoff X1 Intense Chocolate / Plain', category: 'gin-whisky', price: 8500, volumeOrServing: '75cl Bottle', description: 'Triple distilled smooth vodka' },
  { id: 'gw-gordons-moringa', name: 'Gordon’s Moringa London Dry Gin (Big)', category: 'gin-whisky', price: 9000, volumeOrServing: '75cl Bottle', description: 'Classic dry gin infused with moringa extract' },
  { id: 'gw-campari-small', name: 'Campari Bitter Aperitif (Small)', category: 'gin-whisky', price: 10500, volumeOrServing: 'Bottle', description: 'Italian bitter aperitif' },
  { id: 'gw-best-cream-big', name: 'Best Cream Liqueur (Big)', category: 'gin-whisky', price: 11000, volumeOrServing: '75cl Bottle', description: 'Velvety rich cream liqueur' },
  { id: 'gw-flirt-vodka', name: 'Flirt Vodka Plain', category: 'gin-whisky', price: 11200, volumeOrServing: '75cl Bottle', description: 'Pure grain crystal vodka' },
  { id: 'gw-8pm-brandy', name: '8PM Premium Brandy', category: 'gin-whisky', price: 12000, volumeOrServing: '75cl Bottle', description: 'Aged oak cask blended brandy' },
  { id: 'gw-martin-richman', name: 'Martin Richman Whisky', category: 'gin-whisky', price: 12500, volumeOrServing: '75cl Bottle', description: 'Smooth blended grain whisky' },
  { id: 'gw-martin-richman-honey', name: 'Martin Richman Honey Whisky', category: 'gin-whisky', price: 12500, volumeOrServing: '75cl Bottle', description: 'Rich golden honey-infused whisky' },
  { id: 'gw-sir-edward', name: 'Sir Edward’s Blended Scotch Whisky', category: 'gin-whisky', price: 20000, volumeOrServing: '75cl Bottle', description: 'Authentic distilled in Scotland blended whisky' },
  { id: 'gw-old-smuggler', name: 'Old Smuggler Scotch Whisky (Big)', category: 'gin-whisky', price: 20000, volumeOrServing: '75cl Bottle', description: 'Classic Scotch blend since 1835' },
  { id: 'gw-williams-lawson', name: 'William Lawson’s Blended Scotch (Big)', category: 'gin-whisky', price: 20000, volumeOrServing: '75cl Bottle', description: 'Bold no-nonsense Highland Scotch' },
  { id: 'gw-absolut-vodka', name: 'Absolut Vodka Plain (Original)', category: 'gin-whisky', price: 22500, volumeOrServing: '75cl Bottle', description: 'Iconic Swedish winter wheat vodka', featured: true },
  { id: 'gw-red-label', name: 'Johnnie Walker Red Label Blended Scotch', category: 'gin-whisky', price: 26000, volumeOrServing: '75cl Bottle', description: 'World’s best-selling Scotch whisky with vibrant smoky spices' },
  { id: 'gw-glen-silvers', name: 'Glen Silver’s Blended Scotch Whisky', category: 'gin-whisky', price: 27000, volumeOrServing: '75cl Bottle', description: 'Malted barley & grain Speyside tradition' },
  { id: 'gw-campari-medium', name: 'Campari Bitter Aperitif (Medium)', category: 'gin-whisky', price: 28000, volumeOrServing: 'Bottle', description: 'Classic Italian vibrant red bitter aperitif' },
  { id: 'gw-tenjaku', name: 'Tenjaku Pure Japanese Whisky', category: 'gin-whisky', price: 30000, volumeOrServing: '70cl Bottle', description: 'Fuji mineral water refined Japanese whisky' },
  { id: 'gw-baileys-big', name: 'Baileys Original Irish Cream (Big Bottle)', category: 'gin-whisky', price: 30000, volumeOrServing: '75cl Bottle', description: 'World-renowned Irish cream liqueur', featured: true },
  { id: 'gw-johnny-walker', name: 'Johnnie Walker Reserve Blend', category: 'gin-whisky', price: 35000, volumeOrServing: '75cl Bottle', description: 'Iconic Scotch crafted for discerning palates' },
  { id: 'gw-jameson-whisky', name: 'Jameson Irish Whiskey (Original)', category: 'gin-whisky', price: 35000, volumeOrServing: '75cl Bottle', description: 'Triple distilled, twice as smooth Irish whiskey', popular: true, featured: true },
  { id: 'gw-jack-daniel', name: 'Jack Daniel’s Old No. 7 Tennessee Whiskey', category: 'gin-whisky', price: 35000, volumeOrServing: '75cl Bottle', description: 'Charcoal mellowed American whiskey', popular: true, featured: true },
  { id: 'gw-american-honey', name: 'Wild Turkey American Honey (Big)', category: 'gin-whisky', price: 36000, volumeOrServing: '75cl Bottle', description: 'Bourbon liqueur blended with pure honey' },
  { id: 'gw-teeling-small-batch', name: 'Teeling Small Batch Irish Whiskey', category: 'gin-whisky', price: 48500, volumeOrServing: '70cl Bottle', description: 'Finished in rum casks for exotic flavor notes' },
  { id: 'gw-empreur-xo', name: 'Empreur XO Imperial French Brandy', category: 'gin-whisky', price: 55000, volumeOrServing: '75cl Decanter', description: 'Extra old aged French grape brandy' },
  { id: 'gw-black-label', name: 'Johnnie Walker Black Label 12 Years', category: 'gin-whisky', price: 56000, volumeOrServing: '75cl Bottle', description: 'Masterpiece 12-year-old blended Scotch with rich dried fruit & smoke', featured: true },
  { id: 'gw-jameson-black-barrel', name: 'Jameson Black Barrel Triple Distilled', category: 'gin-whisky', price: 59000, volumeOrServing: '75cl Bottle', description: 'Charred bourbon oak barrels for rich spice & vanilla', featured: true },
  { id: 'gw-the-observatory', name: 'The Observatory 20-Year Single Grain Scotch', category: 'gin-whisky', price: 66000, volumeOrServing: '70cl Bottle', description: 'Exquisite aged Scotch finished in sherry oak casks' },
  { id: 'gw-hennessy', name: 'Hennessy VS Cognac', category: 'gin-whisky', price: 80000, volumeOrServing: '75cl Bottle', description: 'The pinnacle of French cognac, bold and fragrant', featured: true, popular: true },

  // ══════════════════════════════════════════════════
  // NON-ALCOHOLIC WINES (from Board 2)
  // ══════════════════════════════════════════════════
  { id: 'naw-rich-lady', name: 'Rich Lady Sweet Red (Non-Alcoholic)', category: 'non-alcoholic-wine', price: 6000, volumeOrServing: '75cl Bottle', description: 'Delightfully sweet non-alcoholic red celebration wine' },
  { id: 'naw-bama', name: 'Bama Red Wine (Alcohol-Free)', category: 'non-alcoholic-wine', price: 6000, volumeOrServing: '75cl Bottle', description: 'Rich red grape juice beverage' },
  { id: 'naw-cape-more', name: 'Cape More Sweet Red Wine', category: 'non-alcoholic-wine', price: 6000, volumeOrServing: '75cl Bottle', description: 'South African style sweet alcohol-free wine' },
  { id: 'naw-castillo-lagomor', name: 'Castillo Lagomor Red', category: 'non-alcoholic-wine', price: 6000, volumeOrServing: '75cl Bottle', description: 'Smooth Spanish style sweet non-alcoholic wine' },
  { id: 'naw-macnelis', name: 'Macnelis Red Wine', category: 'non-alcoholic-wine', price: 7000, volumeOrServing: '75cl Bottle', description: 'Rich velvety red grape drink' },
  { id: 'naw-pure-heaven', name: 'Pure Heaven Sparkling Celebration Wine', category: 'non-alcoholic-wine', price: 8000, volumeOrServing: '75cl Bottle', description: 'Crisp popping sparkling grape wine for family celebrations', featured: true, popular: true },
  { id: 'naw-credo', name: 'Credo Red Wine', category: 'non-alcoholic-wine', price: 9000, volumeOrServing: '75cl Bottle', description: 'Smooth berry bouquet alcohol-free wine' },
  { id: 'naw-louis-monfort', name: 'Louis Monfort Summer Red', category: 'non-alcoholic-wine', price: 10000, volumeOrServing: '75cl Bottle', description: 'Summer fruit aromas, rich ruby red color' },
  { id: 'naw-classic-red', name: 'Classic Red Wine (Non-Alcoholic)', category: 'non-alcoholic-wine', price: 10000, volumeOrServing: '75cl Bottle', description: 'Full-bodied dark grape blend' },
  { id: 'naw-agor-red', name: 'Agor Red Wine (Kosher / Sacramental)', category: 'non-alcoholic-wine', price: 11500, volumeOrServing: '75cl Bottle', description: 'Sweet aromatic dessert sacramental wine' },
  { id: 'naw-agor-chocolate', name: 'Agor Red Chocolate Wine', category: 'non-alcoholic-wine', price: 11500, volumeOrServing: '75cl Bottle', description: 'Decadent infusion of sweet red wine with rich cocoa & chocolate notes', featured: true },
  { id: 'naw-dino-red', name: 'Dino Red Wine', category: 'non-alcoholic-wine', price: 11500, volumeOrServing: '75cl Bottle', description: 'Prestigious full-bodied sweet red wine' },

  // ══════════════════════════════════════════════════
  // RED ALCOHOLIC WINES & SPARKLING (from Board 2)
  // ══════════════════════════════════════════════════
  { id: 'raw-baron-de-valls', name: 'Baron De Valls Red', category: 'red-alcoholic-wine', price: 7000, volumeOrServing: '75cl Bottle', description: 'Spanish ruby red table wine' },
  { id: 'raw-baron-romero', name: 'Baron Romero Red Wine', category: 'red-alcoholic-wine', price: 7000, volumeOrServing: '75cl Bottle', description: 'Smooth daily table red wine from Spain' },
  { id: 'raw-veleta-red', name: 'Veleta Red Wine', category: 'red-alcoholic-wine', price: 7000, volumeOrServing: '75cl Bottle', description: 'Pleasantly sweet Spanish red wine' },
  { id: 'raw-eva-red-grape', name: 'Eva Red Grape Sparkling', category: 'red-alcoholic-wine', price: 8000, volumeOrServing: '75cl Bottle', description: 'Effervescent sweet sparkling grape wine', popular: true },
  { id: 'raw-4th-street-red', name: '4th Street Sweet Red Wine', category: 'red-alcoholic-wine', price: 9000, volumeOrServing: '75cl Bottle', description: 'Fresh, naturally sweet South African red wine', popular: true },
  { id: 'raw-4th-street-rose', name: '4th Street Sweet Rosé', category: 'red-alcoholic-wine', price: 9000, volumeOrServing: '75cl Bottle', description: 'Playful blush rosé with strawberry notes' },
  { id: 'raw-sun-charger-big', name: 'Sun Charger Wine (Big Bottle)', category: 'red-alcoholic-wine', price: 9000, volumeOrServing: 'Bottle', description: 'Energizing herbal fortified wine' },
  { id: 'raw-dominio-derley-red', name: 'Dominio Derley Red', category: 'red-alcoholic-wine', price: 10000, volumeOrServing: '75cl Bottle', description: 'Spanish harvest red wine' },
  { id: 'raw-dominio-derley-sweet', name: 'Dominio Derley Sweet Red', category: 'red-alcoholic-wine', price: 10000, volumeOrServing: '75cl Bottle', description: 'Rich sweet bouquet red wine' },
  { id: 'raw-domino-derley', name: 'Domino Derley Wine', category: 'red-alcoholic-wine', price: 10500, volumeOrServing: '75cl Bottle', description: 'Balanced red wine with fruity aromas' },
  { id: 'raw-dominio-brut', name: 'Dominio Derley Brut Sparkling', category: 'red-alcoholic-wine', price: 12000, volumeOrServing: '75cl Bottle', description: 'Crisp dry effervescent sparkling wine for VIP celebrations' },
  { id: 'raw-dominio-rose', name: 'Dominio Sparkling Rosé', category: 'red-alcoholic-wine', price: 12000, volumeOrServing: '75cl Bottle', description: 'Delicate pink bubbles with berries fragrance' },
  { id: 'raw-four-cousin-red', name: 'Four Cousins Natural Sweet Red', category: 'red-alcoholic-wine', price: 12000, volumeOrServing: '75cl Bottle', description: 'South Africa’s favourite aromatic sweet red wine', popular: true },
  { id: 'raw-sweet-kiss-red', name: 'Sweet Kiss Red Wine', category: 'red-alcoholic-wine', price: 12000, volumeOrServing: '75cl Bottle', description: 'Velvety smooth sweet red wine' },
  { id: 'raw-martin-rose', name: 'Martin Rosé Sparkling Wine', category: 'red-alcoholic-wine', price: 12000, volumeOrServing: '75cl Bottle', description: 'Sparkling pink celebration bubbles' },
  { id: 'raw-carlo-rossi-red', name: 'Carlo Rossi California Red', category: 'red-alcoholic-wine', price: 12500, volumeOrServing: '75cl Bottle', description: 'Smooth, fruit-forward California classic red', featured: true },
  { id: 'raw-carlo-rossi-sweet', name: 'Carlo Rossi Sweet Red', category: 'red-alcoholic-wine', price: 12500, volumeOrServing: '75cl Bottle', description: 'Luscious, rich California sweet red wine', featured: true },
  { id: 'raw-carlo-rossi-peach', name: 'Carlo Rossi Ice Peach Sangria', category: 'red-alcoholic-wine', price: 12500, volumeOrServing: '75cl Bottle', description: 'Vibrant infused wine with natural juicy peach essences' },
  { id: 'raw-star-charger', name: 'Star Charger Wine', category: 'red-alcoholic-wine', price: 15000, volumeOrServing: 'Bottle', description: 'Fortified celebration wine' },
  { id: 'raw-joven-capel-big', name: 'Joven Capel Spanish Wine (Big)', category: 'red-alcoholic-wine', price: 25000, volumeOrServing: 'Magnum Bottle', description: 'Large format premium Spanish harvest wine' },
];

const STORAGE_KEY_DRINKS = 'super_e_official_drinks_menu_v1';

export function getStoredDrinksMenu(): DrinkItem[] {
  if (typeof window === 'undefined') {
    return OFFICIAL_DRINKS_MENU;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY_DRINKS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_DRINKS, JSON.stringify(OFFICIAL_DRINKS_MENU));
      return OFFICIAL_DRINKS_MENU;
    }
    return JSON.parse(saved);
  } catch {
    return OFFICIAL_DRINKS_MENU;
  }
}

export function saveStoredDrinksMenu(items: DrinkItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_DRINKS, JSON.stringify(items));
    window.dispatchEvent(new Event('super_e_drinks_updated'));
  } catch (e) {
    console.error('Failed to save drinks menu:', e);
  }
}
