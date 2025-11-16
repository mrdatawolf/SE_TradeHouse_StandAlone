// GPS Manager - Handles user location storage and parsing
class GPSManager {
  constructor() {
    this.storageKey = 'se_user_gps';
    this.userGPS = this.loadGPS();
  }

  // Parse Space Engineers GPS format
  // Example: GPS:My Base:12345:67890:-54321:
  parseGPS(gpsString) {
    if (!gpsString || !gpsString.trim()) {
      return null;
    }

    // Try SE GPS format: GPS:Name:X:Y:Z:
    const seFormat = /GPS:([^:]*):([^:]+):([^:]+):([^:]+):/i;
    const seMatch = gpsString.match(seFormat);

    if (seMatch) {
      return {
        name: seMatch[1].trim() || 'My Location',
        x: parseFloat(seMatch[2]) || 0,
        y: parseFloat(seMatch[3]) || 0,
        z: parseFloat(seMatch[4]) || 0,
        raw: gpsString
      };
    }

    // Try simple format: X,Y,Z or X Y Z
    const simpleFormat = /(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/;
    const simpleMatch = gpsString.match(simpleFormat);

    if (simpleMatch) {
      return {
        name: 'My Location',
        x: parseFloat(simpleMatch[1]) || 0,
        y: parseFloat(simpleMatch[2]) || 0,
        z: parseFloat(simpleMatch[3]) || 0,
        raw: gpsString
      };
    }

    return null;
  }

  // Save GPS to localStorage
  saveGPS(gpsString) {
    const parsed = this.parseGPS(gpsString);
    if (!parsed) {
      throw new Error('Invalid GPS format. Expected: GPS:Name:X:Y:Z: or X,Y,Z');
    }

    this.userGPS = parsed;
    localStorage.setItem(this.storageKey, JSON.stringify(parsed));

    // Dispatch event for other components to listen
    window.dispatchEvent(new CustomEvent('gpsUpdated', { detail: parsed }));

    return parsed;
  }

  // Load GPS from localStorage
  loadGPS() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading GPS:', e);
    }
    return null;
  }

  // Get current user GPS
  getGPS() {
    return this.userGPS;
  }

  // Check if user has GPS set
  hasGPS() {
    return this.userGPS !== null;
  }

  // Clear GPS
  clearGPS() {
    this.userGPS = null;
    localStorage.removeItem(this.storageKey);
    window.dispatchEvent(new CustomEvent('gpsCleared'));
  }

  // Calculate distance between two GPS points
  calculateDistance(gps1, gps2) {
    if (!gps1 || !gps2) return 0;

    const dx = gps2.x - gps1.x;
    const dy = gps2.y - gps1.y;
    const dz = gps2.z - gps1.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // Format distance for display
  formatDistance(distance) {
    if (distance < 1000) {
      return Math.round(distance) + ' m';
    } else if (distance < 1000000) {
      return (distance / 1000).toFixed(2) + ' km';
    } else {
      return (distance / 1000000).toFixed(2) + ' Mm';
    }
  }

  // Create GPS modal UI
  createGPSModal() {
    const modal = document.createElement('div');
    modal.id = 'gps-modal';
    modal.className = 'gps-modal';
    modal.innerHTML = `
      <div class="gps-modal-overlay"></div>
      <div class="gps-modal-content">
        <div class="gps-modal-header">
          <h2>Set Your GPS Location</h2>
          <button class="gps-modal-close" id="gps-close-btn">&times;</button>
        </div>
        <div class="gps-modal-body">
          <p class="gps-help-text">
            Enter your GPS coordinates from Space Engineers. You can copy GPS from the game by pressing K,
            clicking on a GPS marker, and using the copy button.
          </p>

          <div class="gps-form-group">
            <label for="gps-input">GPS Coordinates</label>
            <input
              type="text"
              id="gps-input"
              placeholder="GPS:My Base:12345:67890:-54321:"
              value="${this.userGPS ? this.userGPS.raw : ''}"
            >
            <small>Format: GPS:Name:X:Y:Z: or just X,Y,Z</small>
          </div>

          ${this.userGPS ? `
            <div class="gps-current">
              <h3>Current Location</h3>
              <div class="gps-info">
                <div class="gps-info-row">
                  <span class="gps-label">Name:</span>
                  <span class="gps-value">${this.escapeHtml(this.userGPS.name)}</span>
                </div>
                <div class="gps-info-row">
                  <span class="gps-label">X:</span>
                  <span class="gps-value">${this.userGPS.x.toLocaleString()}</span>
                </div>
                <div class="gps-info-row">
                  <span class="gps-label">Y:</span>
                  <span class="gps-value">${this.userGPS.y.toLocaleString()}</span>
                </div>
                <div class="gps-info-row">
                  <span class="gps-label">Z:</span>
                  <span class="gps-value">${this.userGPS.z.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ` : ''}

          <div class="gps-modal-actions">
            <button class="btn btn-primary" id="gps-save-btn">Save Location</button>
            ${this.userGPS ? '<button class="btn btn-secondary" id="gps-clear-btn">Clear Location</button>' : ''}
            <button class="btn btn-secondary" id="gps-cancel-btn">Cancel</button>
          </div>

          <div class="gps-error hidden" id="gps-error"></div>
        </div>
      </div>
    `;

    return modal;
  }

  // Show GPS modal
  showModal() {
    // Remove existing modal if any
    const existing = document.getElementById('gps-modal');
    if (existing) {
      existing.remove();
    }

    const modal = this.createGPSModal();
    document.body.appendChild(modal);

    // Bind events
    const closeBtn = document.getElementById('gps-close-btn');
    const saveBtn = document.getElementById('gps-save-btn');
    const clearBtn = document.getElementById('gps-clear-btn');
    const cancelBtn = document.getElementById('gps-cancel-btn');
    const overlay = modal.querySelector('.gps-modal-overlay');
    const input = document.getElementById('gps-input');
    const errorDiv = document.getElementById('gps-error');

    const closeModal = () => {
      modal.classList.add('closing');
      setTimeout(() => modal.remove(), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    saveBtn.addEventListener('click', () => {
      try {
        const gpsString = input.value.trim();
        if (!gpsString) {
          throw new Error('Please enter GPS coordinates');
        }

        this.saveGPS(gpsString);
        errorDiv.classList.add('hidden');
        closeModal();

        // Show success message
        this.showNotification('GPS location saved successfully!', 'success');
      } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearGPS();
        this.showNotification('GPS location cleared', 'info');
        closeModal();
      });
    }

    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10);
  }

  // Show notification
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `gps-notification gps-notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // HTML escape helper
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Add GPS button to navigation
  addGPSButtonToNav() {
    // Wait for navigation to load
    setTimeout(() => {
      const nav = document.querySelector('.nav-links');
      if (!nav) return;

      const gpsButton = document.createElement('li');
      gpsButton.className = 'nav-item gps-nav-item';
      gpsButton.innerHTML = `
        <a href="#" class="nav-link" id="gps-nav-button">
          <span class="nav-icon">📍</span>
          ${this.hasGPS() ? 'My Location' : 'Set Location'}
        </a>
      `;

      nav.appendChild(gpsButton);

      document.getElementById('gps-nav-button').addEventListener('click', (e) => {
        e.preventDefault();
        this.showModal();
      });

      // Update button text when GPS changes
      window.addEventListener('gpsUpdated', () => {
        const btn = document.getElementById('gps-nav-button');
        if (btn) {
          btn.innerHTML = '<span class="nav-icon">📍</span>My Location';
        }
      });

      window.addEventListener('gpsCleared', () => {
        const btn = document.getElementById('gps-nav-button');
        if (btn) {
          btn.innerHTML = '<span class="nav-icon">📍</span>Set Location';
        }
      });
    }, 500);
  }
}

// Create global instance
window.gpsManager = new GPSManager();

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  window.gpsManager.addGPSButtonToNav();
});
