// Thrust Calculator Logic
class ThrustCalculator {
  constructor() {
    this.gridSize = 'large_grid';
    this.dryMass = 10000;
    this.cargoMass = 0;
    this.cargoMultiplier = 1;
    this.planet = 'earth';
    this.gravity = 1.0;
    this.atmosphere = 1.0;
    this.thrusterType = 'ion';
    this.thrusterSize = 'small';

    // Additional thrusters
    this.additionalThrusters = {
      ion: { small: 0, large: 0 },
      atmospheric: { small: 0, large: 0 },
      hydrogen: { small: 0, large: 0 },
      plasma: { small: 0, large: 0 }
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.calculate();
  }

  bindEvents() {
    // Ship configuration
    document.getElementById('grid-size').addEventListener('change', (e) => {
      this.gridSize = e.target.value;
      this.calculate();
    });

    document.getElementById('dry-mass').addEventListener('input', (e) => {
      this.dryMass = parseFloat(e.target.value) || 0;
      this.calculate();
    });

    document.getElementById('cargo-mass').addEventListener('input', (e) => {
      this.cargoMass = parseFloat(e.target.value) || 0;
      this.calculate();
    });

    document.getElementById('cargo-multiplier').addEventListener('input', (e) => {
      this.cargoMultiplier = parseFloat(e.target.value) || 1;
      this.calculate();
    });

    // Environment
    document.getElementById('planet').addEventListener('change', (e) => {
      this.planet = e.target.value;
      const planetData = PLANET_DATA[this.planet];
      this.gravity = planetData.gravity;
      this.atmosphere = planetData.atmosphereDensity;
      document.getElementById('gravity').value = this.gravity;
      document.getElementById('atmosphere').value = this.atmosphere;
      this.calculate();
    });

    // Thruster selection
    document.getElementById('thruster-type').addEventListener('change', (e) => {
      this.thrusterType = e.target.value;
      this.calculate();
    });

    document.getElementById('thruster-size').addEventListener('change', (e) => {
      this.thrusterSize = e.target.value;
      this.calculate();
    });

    // Additional thrusters
    document.getElementById('add-small-ion').addEventListener('input', (e) => {
      this.additionalThrusters.ion.small = parseInt(e.target.value) || 0;
      this.calculate();
    });

    document.getElementById('add-large-ion').addEventListener('input', (e) => {
      this.additionalThrusters.ion.large = parseInt(e.target.value) || 0;
      this.calculate();
    });

    document.getElementById('add-small-atmo').addEventListener('input', (e) => {
      this.additionalThrusters.atmospheric.small = parseInt(e.target.value) || 0;
      this.calculate();
    });

    document.getElementById('add-large-atmo').addEventListener('input', (e) => {
      this.additionalThrusters.atmospheric.large = parseInt(e.target.value) || 0;
      this.calculate();
    });

    document.getElementById('add-small-h2').addEventListener('input', (e) => {
      this.additionalThrusters.hydrogen.small = parseInt(e.target.value) || 0;
      this.calculate();
    });

    document.getElementById('add-large-h2').addEventListener('input', (e) => {
      this.additionalThrusters.hydrogen.large = parseInt(e.target.value) || 0;
      this.calculate();
    });

    document.getElementById('add-small-plasma').addEventListener('input', (e) => {
      this.additionalThrusters.plasma.small = parseInt(e.target.value) || 0;
      this.calculate();
    });

    document.getElementById('add-large-plasma').addEventListener('input', (e) => {
      this.additionalThrusters.plasma.large = parseInt(e.target.value) || 0;
      this.calculate();
    });
  }

  getThrusterEfficiency(type) {
    const adjustments = ADJUSTMENTS[type];
    if (type === 'atmospheric') {
      return this.atmosphere;
    } else if (type === 'hydrogen') {
      return 1.0;
    } else {
      // Ion and Plasma scale with atmosphere (worse in atmosphere)
      return Math.max(adjustments.minimum, 1.0 - this.atmosphere);
    }
  }

  getThrusterData(type, size) {
    const thruster = THRUSTER_DATA[type]?.[size]?.[this.gridSize];
    if (!thruster) return null;

    const efficiency = this.getThrusterEfficiency(type);
    return {
      force: thruster.force * efficiency,
      power: thruster.power
    };
  }

  calculateTotalMass() {
    return this.dryMass + (this.cargoMass / this.cargoMultiplier);
  }

  calculateNewtonsRequired() {
    const totalMass = this.calculateTotalMass();
    return this.gravity * totalMass * GRAVITY_ACCELERATION;
  }

  calculateAdditionalThrust() {
    let totalThrust = 0;
    let totalPower = 0;

    for (const type in this.additionalThrusters) {
      for (const size in this.additionalThrusters[type]) {
        const count = this.additionalThrusters[type][size];
        if (count > 0) {
          const thrusterData = this.getThrusterData(type, size);
          if (thrusterData) {
            totalThrust += thrusterData.force * count;
            totalPower += thrusterData.power * count;
          }
        }
      }
    }

    return { thrust: totalThrust, power: totalPower };
  }

  calculate() {
    const totalMass = this.calculateTotalMass();
    const newtonsRequired = this.calculateNewtonsRequired();
    const additional = this.calculateAdditionalThrust();

    // Get selected thruster data
    const thrusterData = this.getThrusterData(this.thrusterType, this.thrusterSize);

    if (!thrusterData) {
      document.getElementById('thrusters-required').textContent = 'N/A';
      return;
    }

    // Calculate required thrusters (accounting for additional thrust)
    const remainingNewtons = Math.max(0, newtonsRequired - additional.thrust);
    const thrustersRequired = Math.ceil(remainingNewtons / thrusterData.force);

    // Total thrust applied
    const totalThrust = Math.max(newtonsRequired, (thrustersRequired * thrusterData.force) + additional.thrust);

    // Calculate power requirements
    const mainThrusterPower = thrustersRequired * thrusterData.power;
    const totalPower = mainThrusterPower + additional.power;

    // Calculate reactors needed
    const largeReactors = Math.ceil(totalPower / REACTOR_DATA.large.power);
    const smallReactors = Math.ceil(totalPower / REACTOR_DATA.small.power);
    const naquadahReactors = Math.ceil(totalPower / REACTOR_DATA.naquadah.power);

    // Calculate acceleration
    const acceleration = totalMass > 0 ? (totalThrust / totalMass) : 0;

    // Calculate time to speed
    const speeds = [10, 25, 50, 100, 150, 250, 500, 1000];
    const times = {};
    speeds.forEach(speed => {
      times[speed] = acceleration > 0 ? (speed / acceleration).toFixed(2) : '∞';
    });

    // Update UI
    document.getElementById('thrusters-required').textContent = thrustersRequired;
    document.getElementById('total-mass').textContent = totalMass.toLocaleString() + ' kg';
    document.getElementById('newtons-required').textContent = newtonsRequired.toLocaleString() + ' N';
    document.getElementById('newtons-applied').textContent = totalThrust.toLocaleString() + ' N';
    document.getElementById('acceleration').textContent = acceleration.toFixed(2) + ' m/s²';

    document.getElementById('total-power').textContent = totalPower.toFixed(2) + ' MW';
    document.getElementById('large-reactors').textContent = largeReactors;
    document.getElementById('small-reactors').textContent = smallReactors;
    document.getElementById('naquadah-reactors').textContent = naquadahReactors;

    document.getElementById('time-10').textContent = times[10] + 's';
    document.getElementById('time-25').textContent = times[25] + 's';
    document.getElementById('time-50').textContent = times[50] + 's';
    document.getElementById('time-100').textContent = times[100] + 's';
    document.getElementById('time-150').textContent = times[150] + 's';
    document.getElementById('time-250').textContent = times[250] + 's';
    document.getElementById('time-500').textContent = times[500] + 's';
    document.getElementById('time-1000').textContent = times[1000] + 's';
  }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ThrustCalculator();
});
