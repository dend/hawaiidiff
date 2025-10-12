/**
 * Format timestamp from WebP filename (YYYY_MM_DD_HH_MM.webp)
 * Returns formatted string "MMM DD, YYYY, h:mm A" or "Timestamp unavailable"
 */
function formatTimestamp(filename) {
  if (!filename) {
    return 'Timestamp unavailable';
  }

  // Extract timestamp from filename: YYYY_MM_DD_HH_MM.webp
  const match = filename.match(/(\d{4})_(\d{2})_(\d{2})_(\d{2})_(\d{2})/);
  
  if (!match) {
    return 'Timestamp unavailable';
  }

  const [, year, month, day, hour, minute] = match;
  
  try {
    // Create date object
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // JavaScript months are 0-indexed
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );

    // Validate date
    if (isNaN(date.getTime())) {
      return 'Timestamp unavailable';
    }

    // Format using Intl.DateTimeFormat
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return formatter.format(date);
  } catch (error) {
    return 'Timestamp unavailable';
  }
}

/**
 * Initialize timestamp formatting on page load
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find all elements with data-timestamp attribute
  const timestampElements = document.querySelectorAll('[data-timestamp]');
  
  timestampElements.forEach(element => {
    const filename = element.getAttribute('data-timestamp');
    element.textContent = formatTimestamp(filename);
  });
  
  // Initialize keyboard navigation for camera detail pages
  initKeyboardNavigation();
});

/**
 * Keyboard navigation for camera detail pages
 */
function initKeyboardNavigation() {
  // Only initialize on camera detail pages
  if (!document.querySelector('.camera-navigation')) {
    return;
  }
  
  document.addEventListener('keydown', function(event) {
    // Don't trigger if user is typing in an input field
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.isContentEditable) {
      return;
    }
    
    const prevButton = document.querySelector('.nav-prev');
    const nextButton = document.querySelector('.nav-next');
    
    // Left arrow or 'p' for previous
    if (event.key === 'ArrowLeft' || event.key === 'p') {
      event.preventDefault();
      if (prevButton) {
        prevButton.click();
      }
    }
    
    // Right arrow or 'n' for next
    if (event.key === 'ArrowRight' || event.key === 'n') {
      event.preventDefault();
      if (nextButton) {
        nextButton.click();
      }
    }
    
    // Home key to go to first camera
    if (event.key === 'Home') {
      event.preventDefault();
      window.location.href = '/';
    }
  });
}
