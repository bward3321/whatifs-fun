// Higher or Lower Game Datasets
// All values are real-world accurate and rounded for readability

export const categories = [
  {
    id: "population",
    name: "Country Population",
    slug: "population",
    description: "Guess whether a country's population is higher or lower in this addictive comparison game. Test your geography knowledge now.",
    unit: "people",
    formatPrefix: "",
    formatSuffix: "",
    image: "https://images.unsplash.com/photo-1642764984395-d032bf643e70?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHwxfHxjcm93ZGVkJTIwY2l0eSUyMGFlcmlhbCUyMHZpZXclMjBwZW9wbGV8ZW58MHx8fHwxNzcxMTIyNjk3fDA&ixlib=rb-4.1.0&q=85",
    icon: "Globe",
    color: "#10B981",
    seoTitle: "HIGHER OR LOWER: Country Population Game",
    seoMeta: "Guess whether a country's population is higher or lower in this addictive comparison game. Test your geography knowledge now.",
    faqs: [
      { q: "What is the most populated country in the world?", a: "India is currently the most populated country with over 1.4 billion people, having surpassed China in 2023." },
      { q: "What is the population of Brazil?", a: "Brazil has approximately 214 million people, making it the 7th most populated country in the world." },
      { q: "How is population measured?", a: "Population is typically measured through national census counts and estimated through birth/death rates, migration data, and statistical modeling." },
    ],
    intro: "How well do you know world populations? In this game, you'll compare countries and guess which has more people. From tiny island nations to massive superpowers — can you tell the difference?",
  },
  {
    id: "box-office",
    name: "Movie Box Office",
    slug: "box-office",
    description: "Can you guess which movie earned more at the box office? Test your film knowledge in this fun comparison game.",
    unit: "USD",
    formatPrefix: "$",
    formatSuffix: "",
    image: "https://images.unsplash.com/photo-1621276336795-925346853745?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0cmUlMjBhdWRpZW5jZSUyMHBvcGNvcm4lMjBjaW5lbWF8ZW58MHx8fHwxNzcxMTIyNjk4fDA&ixlib=rb-4.1.0&q=85",
    icon: "Film",
    color: "#F59E0B",
    seoTitle: "HIGHER OR LOWER: Movie Box Office Game",
    seoMeta: "Can you guess which movie earned more at the box office? Test your film knowledge in this fun comparison game.",
    faqs: [
      { q: "What is the highest-grossing movie of all time?", a: "Avatar (2009) holds the record with approximately $2.92 billion in worldwide box office gross." },
      { q: "How is box office revenue calculated?", a: "Box office revenue is the total ticket sales from theatrical releases worldwide, not including home video, streaming, or merchandise." },
      { q: "What movie made the most money in its opening weekend?", a: "Avengers: Endgame holds the record for the biggest opening weekend with $357 million domestically." },
    ],
    intro: "Think you know which blockbusters dominated the box office? Compare movies head-to-head and guess which earned more. From cult classics to billion-dollar franchises — test your cinema IQ!",
  },
  {
    id: "nba-salary",
    name: "NBA Player Salaries",
    slug: "nba-salary",
    description: "Which NBA player earns more? Guess higher or lower in this basketball salary comparison game.",
    unit: "USD/year",
    formatPrefix: "$",
    formatSuffix: "",
    image: "https://images.unsplash.com/photo-1577415924319-d05a46e5998c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwcGxheWVyJTIwZHVua2luZyUyMGFyZW5hJTIwZHJhbWF0aWMlMjBsaWdodGluZ3xlbnwwfHx8fDE3NzExMjI2OTl8MA&ixlib=rb-4.1.0&q=85",
    icon: "Trophy",
    color: "#EF4444",
    seoTitle: "HIGHER OR LOWER: NBA Player Salary Game",
    seoMeta: "Which NBA player earns more? Guess higher or lower in this basketball salary comparison game.",
    faqs: [
      { q: "Who is the highest-paid NBA player?", a: "Stephen Curry and Nikola Jokic are among the highest-paid NBA players, each earning over $50 million per year." },
      { q: "How are NBA salaries determined?", a: "NBA salaries are determined by individual contracts negotiated between players and teams, subject to a salary cap set by the league." },
      { q: "What is the NBA salary cap?", a: "The NBA salary cap for the 2024-25 season is approximately $141 million per team." },
    ],
    intro: "The NBA's biggest stars earn eye-watering salaries. Can you guess which player takes home more? From superstars to rising phenoms — put your basketball knowledge to the test!",
  },
  {
    id: "animals",
    name: "Animal Weight",
    slug: "animals",
    description: "Can you guess which animal weighs more? Test your wildlife knowledge in this fun comparison game.",
    unit: "kg",
    formatPrefix: "",
    formatSuffix: " kg",
    image: "https://images.unsplash.com/photo-1759520277895-69185ef95e4f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwxfHxlbGVwaGFudCUyMGFmcmljYW4lMjBzYXZhbm5haCUyMHdpbGRsaWZlJTIwY2xvc2UlMjB1cHxlbnwwfHx8fDE3NzExMjI3MDB8MA&ixlib=rb-4.1.0&q=85",
    icon: "PawPrint",
    color: "#8B5CF6",
    seoTitle: "HIGHER OR LOWER: Animal Weight Game",
    seoMeta: "Can you guess which animal weighs more? Test your wildlife knowledge in this fun comparison game.",
    faqs: [
      { q: "What is the heaviest animal on Earth?", a: "The blue whale is the heaviest animal ever known, weighing up to 150,000 kg (150 tonnes)." },
      { q: "How much does an elephant weigh?", a: "An African elephant typically weighs between 4,000 and 6,000 kg, making it the heaviest land animal." },
      { q: "What is the lightest mammal?", a: "The Etruscan shrew is one of the lightest mammals, weighing only about 1.8 grams." },
    ],
    intro: "From the mighty blue whale to the tiny hummingbird, the animal kingdom is full of surprises. Can you guess which creature weighs more? Play and find out!",
  },
  {
    id: "gdp",
    name: "Country GDP",
    slug: "gdp",
    description: "Guess whether a country's GDP is higher or lower in this educational economics game.",
    unit: "USD",
    formatPrefix: "$",
    formatSuffix: "",
    image: "https://images.unsplash.com/photo-1761587941453-bd1790225d52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA6MTJ8MHwxfHNlYXJjaHwxfHxnbG9iYWwlMjBlY29ub215JTIwc3RvY2slMjBtYXJrZXQlMjBncmFwaCUyMGZpbmFuY2V8ZW58MHx8fHwxNzcxMTIyNzAwfDA&ixlib=rb-4.1.0&q=85",
    icon: "TrendingUp",
    color: "#06B6D4",
    seoTitle: "HIGHER OR LOWER: Country GDP Game",
    seoMeta: "Guess whether a country's GDP is higher or lower in this educational economics game.",
    faqs: [
      { q: "Which country has the highest GDP?", a: "The United States has the highest GDP at approximately $25.5 trillion, followed by China at about $18 trillion." },
      { q: "How is GDP measured?", a: "GDP (Gross Domestic Product) measures the total value of goods and services produced within a country in a given year, typically measured in US dollars." },
      { q: "What is GDP per capita?", a: "GDP per capita divides a country's GDP by its population, giving a per-person measure of economic output. Luxembourg and Singapore often top this list." },
    ],
    intro: "How well do you know the global economy? Compare countries and guess which one has a higher GDP. From economic powerhouses to developing nations — can you spot the difference?",
  },
];

// Dataset items for each category
export const datasets = {
  population: [
    { name: "China", value: 1412000000 },
    { name: "India", value: 1408000000 },
    { name: "United States", value: 331000000 },
    { name: "Indonesia", value: 274000000 },
    { name: "Pakistan", value: 231000000 },
    { name: "Brazil", value: 214000000 },
    { name: "Nigeria", value: 218000000 },
    { name: "Bangladesh", value: 171000000 },
    { name: "Russia", value: 146000000 },
    { name: "Mexico", value: 129000000 },
    { name: "Japan", value: 125000000 },
    { name: "Ethiopia", value: 121000000 },
    { name: "Philippines", value: 113000000 },
    { name: "Egypt", value: 104000000 },
    { name: "Vietnam", value: 99000000 },
    { name: "DR Congo", value: 99000000 },
    { name: "Turkey", value: 85000000 },
    { name: "Germany", value: 83000000 },
    { name: "Iran", value: 87000000 },
    { name: "Thailand", value: 72000000 },
    { name: "United Kingdom", value: 67000000 },
    { name: "France", value: 68000000 },
    { name: "Italy", value: 59000000 },
    { name: "South Africa", value: 60000000 },
    { name: "Tanzania", value: 63000000 },
    { name: "South Korea", value: 52000000 },
    { name: "Colombia", value: 51000000 },
    { name: "Spain", value: 47000000 },
    { name: "Kenya", value: 55000000 },
    { name: "Argentina", value: 46000000 },
    { name: "Algeria", value: 45000000 },
    { name: "Sudan", value: 45000000 },
    { name: "Uganda", value: 48000000 },
    { name: "Ukraine", value: 44000000 },
    { name: "Iraq", value: 42000000 },
    { name: "Canada", value: 39000000 },
    { name: "Poland", value: 38000000 },
    { name: "Morocco", value: 37000000 },
    { name: "Saudi Arabia", value: 36000000 },
    { name: "Uzbekistan", value: 34000000 },
    { name: "Peru", value: 33000000 },
    { name: "Malaysia", value: 33000000 },
    { name: "Australia", value: 26000000 },
    { name: "Ghana", value: 33000000 },
    { name: "Nepal", value: 30000000 },
    { name: "Venezuela", value: 28000000 },
    { name: "Sri Lanka", value: 22000000 },
    { name: "Chile", value: 19000000 },
    { name: "Netherlands", value: 18000000 },
    { name: "Cuba", value: 11000000 },
    { name: "Sweden", value: 10000000 },
    { name: "Portugal", value: 10000000 },
    { name: "Greece", value: 10000000 },
    { name: "New Zealand", value: 5000000 },
    { name: "Ireland", value: 5000000 },
    { name: "Norway", value: 5000000 },
    { name: "Singapore", value: 6000000 },
    { name: "Switzerland", value: 9000000 },
    { name: "Iceland", value: 370000 },
    { name: "Luxembourg", value: 640000 },
  ],

  "box-office": [
    { name: "Avatar", value: 2923000000 },
    { name: "Avengers: Endgame", value: 2799000000 },
    { name: "Avatar: The Way of Water", value: 2320000000 },
    { name: "Titanic", value: 2264000000 },
    { name: "Star Wars: The Force Awakens", value: 2071000000 },
    { name: "Avengers: Infinity War", value: 2048000000 },
    { name: "Spider-Man: No Way Home", value: 1921000000 },
    { name: "Inside Out 2", value: 1698000000 },
    { name: "Jurassic World", value: 1671000000 },
    { name: "The Lion King (2019)", value: 1663000000 },
    { name: "The Avengers", value: 1519000000 },
    { name: "Furious 7", value: 1516000000 },
    { name: "Top Gun: Maverick", value: 1496000000 },
    { name: "Frozen II", value: 1453000000 },
    { name: "Barbie", value: 1442000000 },
    { name: "Harry Potter and the Deathly Hallows Part 2", value: 1342000000 },
    { name: "Black Panther", value: 1349000000 },
    { name: "Star Wars: The Last Jedi", value: 1333000000 },
    { name: "Jurassic World: Fallen Kingdom", value: 1310000000 },
    { name: "Frozen", value: 1281000000 },
    { name: "Beauty and the Beast (2017)", value: 1264000000 },
    { name: "Incredibles 2", value: 1243000000 },
    { name: "The Fate of the Furious", value: 1236000000 },
    { name: "Iron Man 3", value: 1215000000 },
    { name: "Minions", value: 1159000000 },
    { name: "Captain America: Civil War", value: 1153000000 },
    { name: "Aquaman", value: 1148000000 },
    { name: "The Lord of the Rings: Return of the King", value: 1142000000 },
    { name: "Spider-Man: Far From Home", value: 1132000000 },
    { name: "Captain Marvel", value: 1129000000 },
    { name: "Transformers: Dark of the Moon", value: 1124000000 },
    { name: "Skyfall", value: 1109000000 },
    { name: "Transformers: Age of Extinction", value: 1104000000 },
    { name: "The Dark Knight Rises", value: 1081000000 },
    { name: "Joker", value: 1074000000 },
    { name: "Toy Story 4", value: 1073000000 },
    { name: "Toy Story 3", value: 1067000000 },
    { name: "Pirates of the Caribbean: Dead Man's Chest", value: 1066000000 },
    { name: "The Dark Knight", value: 1006000000 },
    { name: "Rogue One: A Star Wars Story", value: 1056000000 },
    { name: "Oppenheimer", value: 953000000 },
    { name: "Deadpool & Wolverine", value: 1338000000 },
    { name: "The Super Mario Bros. Movie", value: 1362000000 },
    { name: "Moana 2", value: 1005000000 },
    { name: "Wicked", value: 634000000 },
  ],

  "nba-salary": [
    { name: "Stephen Curry", value: 55800000 },
    { name: "Nikola Jokic", value: 51400000 },
    { name: "Joel Embiid", value: 51400000 },
    { name: "LeBron James", value: 48700000 },
    { name: "Kevin Durant", value: 49900000 },
    { name: "Giannis Antetokounmpo", value: 48800000 },
    { name: "Luka Doncic", value: 43000000 },
    { name: "Jayson Tatum", value: 34800000 },
    { name: "Damian Lillard", value: 45600000 },
    { name: "Anthony Davis", value: 43200000 },
    { name: "Kawhi Leonard", value: 49300000 },
    { name: "Paul George", value: 49300000 },
    { name: "Jimmy Butler", value: 48800000 },
    { name: "Devin Booker", value: 36000000 },
    { name: "Trae Young", value: 40000000 },
    { name: "Ja Morant", value: 34000000 },
    { name: "Zion Williamson", value: 36000000 },
    { name: "Karl-Anthony Towns", value: 36000000 },
    { name: "Anthony Edwards", value: 42200000 },
    { name: "Shai Gilgeous-Alexander", value: 40600000 },
    { name: "Donovan Mitchell", value: 34800000 },
    { name: "Tyrese Haliburton", value: 34000000 },
    { name: "Domantas Sabonis", value: 31000000 },
    { name: "Jalen Brunson", value: 36900000 },
    { name: "Victor Wembanyama", value: 12700000 },
    { name: "Paolo Banchero", value: 11600000 },
    { name: "Chet Holmgren", value: 10900000 },
    { name: "Brandon Ingram", value: 36000000 },
    { name: "De'Aaron Fox", value: 34000000 },
    { name: "Bam Adebayo", value: 34800000 },
    { name: "Fred VanVleet", value: 42800000 },
    { name: "Pascal Siakam", value: 37900000 },
    { name: "Bradley Beal", value: 50200000 },
    { name: "Rudy Gobert", value: 38200000 },
    { name: "Chris Paul", value: 16400000 },
    { name: "Russell Westbrook", value: 4000000 },
    { name: "Kyrie Irving", value: 41000000 },
    { name: "James Harden", value: 35000000 },
    { name: "Lauri Markkanen", value: 32000000 },
    { name: "Scottie Barnes", value: 9100000 },
  ],

  animals: [
    { name: "Blue Whale", value: 150000 },
    { name: "African Elephant", value: 6000 },
    { name: "White Rhinoceros", value: 2300 },
    { name: "Hippopotamus", value: 1800 },
    { name: "Giraffe", value: 1200 },
    { name: "American Bison", value: 900 },
    { name: "Polar Bear", value: 450 },
    { name: "Grizzly Bear", value: 360 },
    { name: "Gorilla", value: 220 },
    { name: "Lion", value: 190 },
    { name: "Tiger", value: 220 },
    { name: "Giant Panda", value: 120 },
    { name: "Dolphin", value: 200 },
    { name: "Cheetah", value: 54 },
    { name: "Gray Wolf", value: 45 },
    { name: "Red Kangaroo", value: 90 },
    { name: "Emperor Penguin", value: 40 },
    { name: "Bald Eagle", value: 6 },
    { name: "Komodo Dragon", value: 70 },
    { name: "Anaconda", value: 250 },
    { name: "Ostrich", value: 130 },
    { name: "Crocodile", value: 1000 },
    { name: "Walrus", value: 1200 },
    { name: "Moose", value: 500 },
    { name: "Leopard", value: 70 },
    { name: "Zebra", value: 350 },
    { name: "Orangutan", value: 100 },
    { name: "Capybara", value: 55 },
    { name: "Wombat", value: 30 },
    { name: "Beaver", value: 25 },
    { name: "Orca", value: 5000 },
    { name: "Manatee", value: 500 },
    { name: "Sea Turtle", value: 300 },
    { name: "Giant Tortoise", value: 250 },
    { name: "Snow Leopard", value: 50 },
    { name: "Chimpanzee", value: 60 },
    { name: "Koala", value: 12 },
    { name: "Red Fox", value: 7 },
    { name: "Wolverine", value: 14 },
    { name: "Armadillo", value: 6 },
  ],

  gdp: [
    { name: "United States", value: 25500000000000 },
    { name: "China", value: 18000000000000 },
    { name: "Japan", value: 4200000000000 },
    { name: "Germany", value: 4100000000000 },
    { name: "India", value: 3500000000000 },
    { name: "United Kingdom", value: 3100000000000 },
    { name: "France", value: 2800000000000 },
    { name: "Canada", value: 2100000000000 },
    { name: "Italy", value: 2000000000000 },
    { name: "Brazil", value: 1900000000000 },
    { name: "Russia", value: 1800000000000 },
    { name: "South Korea", value: 1700000000000 },
    { name: "Australia", value: 1700000000000 },
    { name: "Mexico", value: 1300000000000 },
    { name: "Spain", value: 1400000000000 },
    { name: "Indonesia", value: 1300000000000 },
    { name: "Netherlands", value: 1000000000000 },
    { name: "Saudi Arabia", value: 1100000000000 },
    { name: "Turkey", value: 900000000000 },
    { name: "Switzerland", value: 870000000000 },
    { name: "Poland", value: 690000000000 },
    { name: "Sweden", value: 590000000000 },
    { name: "Belgium", value: 580000000000 },
    { name: "Norway", value: 580000000000 },
    { name: "Argentina", value: 630000000000 },
    { name: "Thailand", value: 500000000000 },
    { name: "Israel", value: 520000000000 },
    { name: "Nigeria", value: 470000000000 },
    { name: "Ireland", value: 530000000000 },
    { name: "Austria", value: 480000000000 },
    { name: "South Africa", value: 400000000000 },
    { name: "Singapore", value: 400000000000 },
    { name: "Egypt", value: 400000000000 },
    { name: "Philippines", value: 400000000000 },
    { name: "Vietnam", value: 410000000000 },
    { name: "Pakistan", value: 350000000000 },
    { name: "Chile", value: 300000000000 },
    { name: "Colombia", value: 340000000000 },
    { name: "New Zealand", value: 250000000000 },
    { name: "Portugal", value: 260000000000 },
    { name: "Greece", value: 220000000000 },
    { name: "Peru", value: 240000000000 },
    { name: "Ukraine", value: 160000000000 },
    { name: "Kenya", value: 110000000000 },
    { name: "Iceland", value: 28000000000 },
    { name: "Luxembourg", value: 85000000000 },
  ],
};

// Smart formatting for display
export function formatValue(value, category) {
  const cat = categories.find((c) => c.slug === category || c.id === category);
  if (!cat) return value.toLocaleString();

  if (cat.slug === "population") {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  }

  if (cat.slug === "box-office" || cat.slug === "gdp") {
    if (value >= 1000000000000) return `$${(value / 1000000000000).toFixed(1)}T`;
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
    return `$${value.toLocaleString()}`;
  }

  if (cat.slug === "nba-salary") {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  }

  if (cat.slug === "animals") {
    return `${value.toLocaleString()} kg`;
  }

  return value.toLocaleString();
}

// Get raw number for CountUp
export function getDisplayNumber(value, category) {
  if (category === "population") {
    if (value >= 1000000000) return { end: parseFloat((value / 1000000000).toFixed(1)), suffix: "B", decimals: 1 };
    if (value >= 1000000) return { end: Math.round(value / 1000000), suffix: "M", decimals: 0 };
    if (value >= 1000) return { end: Math.round(value / 1000), suffix: "K", decimals: 0 };
    return { end: value, suffix: "", decimals: 0 };
  }
  if (category === "box-office" || category === "gdp") {
    if (value >= 1000000000000) return { end: parseFloat((value / 1000000000000).toFixed(1)), prefix: "$", suffix: "T", decimals: 1 };
    if (value >= 1000000000) return { end: parseFloat((value / 1000000000).toFixed(1)), prefix: "$", suffix: "B", decimals: 1 };
    if (value >= 1000000) return { end: Math.round(value / 1000000), prefix: "$", suffix: "M", decimals: 0 };
    return { end: value, prefix: "$", suffix: "", decimals: 0 };
  }
  if (category === "nba-salary") {
    if (value >= 1000000) return { end: parseFloat((value / 1000000).toFixed(1)), prefix: "$", suffix: "M", decimals: 1 };
    return { end: value, prefix: "$", suffix: "", decimals: 0 };
  }
  if (category === "animals") {
    return { end: value, suffix: " kg", decimals: 0 };
  }
  return { end: value, suffix: "", decimals: 0 };
}
