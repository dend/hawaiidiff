/**
 * Format timestamp from WebP filename (YYYY_MM_DD_HH_MM.webp)
 * Returns formatted HTML with date and times on separate lines
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
    // Create date object in UTC (assuming the timestamp is in Hawaii time)
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

    // Format date only
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Pacific/Honolulu'
    });

    // Format for Hawaii Time (time only)
    const hawaiiFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Pacific/Honolulu'
    });

    // Format for Pacific Time
    const pacificFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Los_Angeles'
    });

    // Format for Eastern Time
    const easternFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    });

    const dateStr = dateFormatter.format(date);
    const hawaiiTime = hawaiiFormatter.format(date);
    const pacificTime = pacificFormatter.format(date);
    const easternTime = easternFormatter.format(date);

    return `<span class="timestamp-date">${dateStr}</span><br>${hawaiiTime} HST<br>${pacificTime} PT<br>${easternTime} ET`;
  } catch (error) {
    return 'Timestamp unavailable';
  }
}

/**
 * Format timestamp for header (inline, single line)
 */
function formatTimestampInline(filename) {
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
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );

    // Validate date
    if (isNaN(date.getTime())) {
      return 'Timestamp unavailable';
    }

    // Format date only
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Pacific/Honolulu'
    });

    // Format for Hawaii Time
    const hawaiiFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Pacific/Honolulu'
    });

    // Format for Pacific Time
    const pacificFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Los_Angeles'
    });

    // Format for Eastern Time
    const easternFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    });

    const dateStr = dateFormatter.format(date);
    const hawaiiTime = hawaiiFormatter.format(date);
    const pacificTime = pacificFormatter.format(date);
    const easternTime = easternFormatter.format(date);

    return `${dateStr} • ${hawaiiTime} HST • ${pacificTime} PT • ${easternTime} ET`;
  } catch (error) {
    return 'Timestamp unavailable';
  }
}

/**
 * Format timestamp for cards (compact, date and HST only)
 */
function formatTimestampCard(filename) {
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
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );

    // Validate date
    if (isNaN(date.getTime())) {
      return 'Timestamp unavailable';
    }

    // Format date with short month
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Pacific/Honolulu'
    });

    // Format for Hawaii Time
    const hawaiiFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Pacific/Honolulu'
    });

    const dateStr = dateFormatter.format(date);
    const hawaiiTime = hawaiiFormatter.format(date);

    return `${dateStr} • ${hawaiiTime} HST`;
  } catch (error) {
    return 'Timestamp unavailable';
  }
}

/**
 * Initialize timestamp formatting on page load
 */
document.addEventListener('DOMContentLoaded', function() {
  // Format header timestamp (inline)
  const headerTimestamp = document.querySelector('.camera-timestamp-header[data-timestamp]');
  if (headerTimestamp) {
    const filename = headerTimestamp.getAttribute('data-timestamp');
    headerTimestamp.innerHTML = formatTimestampInline(filename);
  }
  
  // Format snapshot timestamps (multi-line)
  const snapshotTimestamps = document.querySelectorAll('.snapshot-timestamp[data-timestamp]');
  snapshotTimestamps.forEach(element => {
    const filename = element.getAttribute('data-timestamp');
    element.innerHTML = formatTimestamp(filename);
  });
  
  // Format card timestamps (compact - date and HST only)
  const cardTimestamps = document.querySelectorAll('.camera-timestamp[data-timestamp]');
  cardTimestamps.forEach(element => {
    const filename = element.getAttribute('data-timestamp');
    element.innerHTML = formatTimestampCard(filename);
  });
  
  // Initialize keyboard navigation for camera detail pages
  initKeyboardNavigation();
  
  // Initialize compact header on scroll
  initCompactHeader();
});

/**
 * Compact header on scroll for camera detail pages
 */
function initCompactHeader() {
  const detailHeader = document.querySelector('.camera-detail-header');
  if (!detailHeader) {
    return;
  }
  
  const siteHeader = document.querySelector('.site-header');
  if (!siteHeader) {
    return;
  }
  
  const siteHeaderHeight = siteHeader.offsetHeight;
  let isCompact = false;
  let ticking = false;
  
  // Set the sticky position to be below the site header
  detailHeader.style.top = `${siteHeaderHeight}px`;
  
  // Threshold: need to scroll this much past the header to trigger compact
  const threshold = 100;
  
  function updateHeader() {
    const currentScrollY = window.scrollY;
    
    // If scrolled past the threshold, make compact
    if (currentScrollY > (siteHeaderHeight + threshold) && !isCompact) {
      detailHeader.classList.add('compact');
      isCompact = true;
    } 
    // If scrolled back above the threshold, expand
    else if (currentScrollY <= siteHeaderHeight && isCompact) {
      detailHeader.classList.remove('compact');
      isCompact = false;
    }
    
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

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
