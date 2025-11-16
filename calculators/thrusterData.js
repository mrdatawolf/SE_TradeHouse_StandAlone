// Space Engineers Thruster Data
// Based on default Space Engineers values

const THRUSTER_DATA = {
  ion: {
    small: {
      small_grid: { force: 14400, power: 0.2 },   // Small Ion on Small Grid
      large_grid: { force: 172800, power: 2.4 }   // Small Ion on Large Grid
    },
    large: {
      small_grid: null,  // Large Ion doesn't exist on Small Grid
      large_grid: { force: 4320000, power: 33.6 }  // Large Ion on Large Grid
    }
  },
  atmospheric: {
    small: {
      small_grid: { force: 96000, power: 0.6 },
      large_grid: { force: 576000, power: 3.6 }
    },
    large: {
      small_grid: null,
      large_grid: { force: 6480000, power: 18 }
    }
  },
  hydrogen: {
    small: {
      small_grid: { force: 112000, power: 0 },  // Hydrogen uses fuel, not power
      large_grid: { force: 1080000, power: 0 }
    },
    large: {
      small_grid: null,
      large_grid: { force: 7200000, power: 0 }
    }
  },
  plasma: {
    small: {
      small_grid: { force: 28800, power: 0.4 },
      large_grid: { force: 345600, power: 4.8 }
    },
    large: {
      small_grid: null,
      large_grid: { force: 8640000, power: 67.2 }
    }
  }
};

const REACTOR_DATA = {
  small: { power: 0.5 },     // Small Reactor: 0.5 MW
  large: { power: 12 },      // Large Reactor: 12 MW
  naquadah: { power: 50 }    // Special/Naquadah Reactor: 50 MW (mod)
};

const PLANET_DATA = {
  space: { gravity: 0, name: 'Space', atmosphereDensity: 0 },
  earth: { gravity: 1.0, name: 'Earth-like', atmosphereDensity: 1.0 },
  moon: { gravity: 0.25, name: 'Moon', atmosphereDensity: 0 },
  mars: { gravity: 0.9, name: 'Mars-like', atmosphereDensity: 0.87 },
  alien: { gravity: 1.1, name: 'Alien', atmosphereDensity: 0.9 },
  titan: { gravity: 0.26, name: 'Titan', atmosphereDensity: 0.5 },
  europa: { gravity: 0.25, name: 'Europa', atmosphereDensity: 0 }
};

const GRAVITY_ACCELERATION = 9.81; // m/s²

// Adjustment factors for different thruster types
const ADJUSTMENTS = {
  ion: {
    minimum: 0.2,    // Ion thrusters work at 20% efficiency minimum
    optimal: 0.0     // Optimal in space (0 atmosphere)
  },
  plasma: {
    minimum: 0.6,    // Plasma thrusters work at 60% efficiency minimum
    optimal: 0.0     // Optimal in space
  },
  atmospheric: {
    minimum: 0.0,    // Atmospheric thrusters don't work in space
    optimal: 1.0     // Optimal at full atmosphere
  },
  hydrogen: {
    minimum: 1.0,    // Hydrogen thrusters always work at 100%
    optimal: 1.0     // No atmospheric dependency
  }
};
