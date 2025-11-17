// Planet Data Loader for SE TradeHouse
// Fetches current server planet data from Google Sheets (Sheet 4)

class PlanetDataLoader {
  constructor() {
    this.planets = [];
    this.loaded = false;
  }

  // Fetch planet data from Google Sheets (Sheet 4)
  async loadPlanetData() {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${CONFIG.GOOGLE_SHEET_ID}/export?format=csv&gid=${CONFIG.PLANETS_SHEET_GID}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`Could not load planet data from sheet (GID: ${CONFIG.PLANETS_SHEET_GID}), using fallback data`);
        this.useFallbackData();
        return;
      }

      const data = await response.text();
      this.parsePlanetData(data);
      this.loaded = true;
    } catch (error) {
      console.error('Error loading planet data:', error);
      this.useFallbackData();
    }
  }

  // Parse CSV data from Sheet 4
  // Columns: A=Name, B=X, C=Y, D=Z, E=Gravity
  parsePlanetData(csvData) {
    const lines = csvData.split('\n');
    this.planets = [];

    console.log(`Parsing CSV with ${lines.length} lines`);

    // Skip header row, start from index 1
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = this.parseCSVLine(line);

      // Debug log for lines that might be skipped
      if (columns.length < 5) {
        console.log(`Row ${i + 1} skipped - only ${columns.length} columns:`, columns);
        continue;
      }

      const name = columns[0].trim();
      const x = parseFloat(columns[1]);
      const y = parseFloat(columns[2]);
      const z = parseFloat(columns[3]);
      const gravity = parseFloat(columns[4]);

      // Check for valid data (NaN check)
      if (!name) {
        console.log(`Row ${i + 1} skipped - empty name`);
        continue;
      }

      if (isNaN(x) || isNaN(y) || isNaN(z)) {
        console.log(`Row ${i + 1} "${name}" skipped - invalid coordinates: x=${columns[1]}, y=${columns[2]}, z=${columns[3]}`);
        continue;
      }

      this.planets.push({
        name: name,
        x: x,
        y: y,
        z: z,
        gravity: isNaN(gravity) ? 1.0 : gravity,
        hasAtmosphere: !isNaN(gravity) && gravity > 0
      });

      console.log(`Row ${i + 1} parsed: ${name} at (${x}, ${y}, ${z}) with ${gravity}g`);
    }

    console.log(`✓ Loaded ${this.planets.length} planets from server data`);
  }

  // Parse CSV line handling quoted fields
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  // Fallback data if sheet cannot be loaded
  useFallbackData() {
    this.planets = [
      { name: 'Pertam', x: 0, y: 0, z: 0, gravity: 1.2, hasAtmosphere: true },
      { name: 'Moon', x: 16384, y: 136384, z: -113616, gravity: 0.25, hasAtmosphere: false },
      { name: 'Lezuno', x: 1031072, y: 131072, z: 1631072, gravity: 1.1, hasAtmosphere: true },
      { name: 'Lorus', x: 1200000, y: 0, z: 1200000, gravity: 0.9, hasAtmosphere: true }
    ];
    this.loaded = true;
    console.log('Using fallback planet data');
  }

  // Get all planets
  getPlanets() {
    return this.planets;
  }

  // Get planet by name
  getPlanet(name) {
    return this.planets.find(p => p.name.toLowerCase() === name.toLowerCase());
  }

  // Check if data is loaded
  isLoaded() {
    return this.loaded;
  }
}

// Global instance
window.planetDataLoader = new PlanetDataLoader();
