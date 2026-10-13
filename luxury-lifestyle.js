/* ============================================================
 ALON HISTORYVERSE 24 — LUXURY LIFESTYLE
 File: luxury-lifestyle.js
 Version: 4.1.0-marketplace-api
 Owner: Baba Thecno Guru
============================================================ */
(() => {
  'use strict';

  const VERSION = '4.1.0-marketplace-api';
  const API_BASE = String(
    window.ALON_LUXURY_API_BASE ||
    'https://alon-historyverse-marketplace-api.bthecnoguru.workers.dev'
  ).replace(/\/$/, '');

  const TOKEN_KEY = 'alon-historyverse-luxury-api-token';

  let apiToken = '';
  try {
    apiToken = localStorage.getItem(TOKEN_KEY) || '';
  } catch {}

  let apiUser = null;
  let listingCache = [];
  let savedCache = [];
  let messageCache = [];
  let authMode = 'login';

  async function api(path, options = {}) {
    if (!API_BASE) {
      throw new Error('Marketplace API URL is not configured.');
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (apiToken) {
      headers.Authorization = `Bearer ${apiToken}`;
    }

    let response;

    try {
      response = await fetch(API_BASE + path, {
        method: options.method || 'GET',
        headers,
        body: options.body === undefined
          ? undefined
          : JSON.stringify(options.body),
        cache: 'no-store'
      });
    } catch {
      throw new Error(
        'Cannot connect to the ALON Marketplace API. Check the Worker deployment, database and internet connection.'
      );
    }

    let data = {};
    try {
      data = await response.json();
    } catch {}

    if (!response.ok || data.ok === false) {
      if (response.status === 401) {
        apiToken = '';
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch {}
      }

      throw new Error(
        data.message ||
        data.error ||
        `Request failed (${response.status}).`
      );
    }

    return data;
  }

  const luxuryListingsPath = (id = '') =>
    '/api/marketplace/listings' +
    (id ? '/' + encodeURIComponent(id) : '') +
    '?marketplace=luxury';

  function storeToken(token) {
    apiToken = String(token || '');

    try {
      if (apiToken) {
        localStorage.setItem(TOKEN_KEY, apiToken);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {}
  }

  function isOwnListing(item) {
    return Boolean(
      apiUser &&
      (
        item?.ownerId === apiUser.id ||
        item?.sellerId === apiUser.id
      )
    );
  }

  async function refreshRemoteData() {
    const [listingResult, savedResult, messageResult] =
      await Promise.all([
        api(luxuryListingsPath()),
        api('/api/marketplace/saved'),
        api('/api/marketplace/messages')
      ]);

    listingCache = Array.isArray(listingResult.records)
      ? listingResult.records
      : [];

    savedCache = Array.isArray(savedResult.saved)
      ? savedResult.saved
          .filter(item => item.marketplace === 'luxury')
          .map(item => item.record_id)
      : [];

    messageCache = Array.isArray(messageResult.messages)
      ? messageResult.messages
          .filter(item => item.marketplace === 'luxury')
          .map(item => ({
            ...item,
            subject: item.listingTitle || 'Luxury enquiry',
            body: item.text || '',
            direction:
              apiUser && item.fromId === apiUser.id
                ? 'outgoing'
                : 'incoming'
          }))
      : [];
  }

  const CATEGORIES = [
    {
      name: 'Luxury Cars & Supercars',
      group: 'Motoring',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=82',
      hint: 'Grand touring, performance and collector cars'
    },
    {
      name: 'Classic & Collector Cars',
      group: 'Motoring',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=82',
      hint: 'Rare classics and collectible automobiles'
    },
    {
      name: 'Luxury SUVs',
      group: 'Motoring',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=82',
      hint: 'Premium SUVs and executive 4x4s'
    },
    {
      name: 'Luxury Bikes & Motorcycles',
      group: 'Motoring',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=82',
      hint: 'Premium motorcycles and touring machines'
    },
    {
      name: 'Luxury Trucks',
      group: 'Motoring',
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=82',
      hint: 'Premium trucks and specialist vehicles'
    },
    {
      name: 'Private Jets',
      group: 'Private Aviation',
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=82',
      hint: 'Private jet ownership and availability'
    },
    {
      name: 'Helicopters',
      group: 'Private Aviation',
      image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=800&q=82',
      hint: 'Private and executive rotorcraft'
    },
    {
      name: 'Luxury Aircraft',
      group: 'Private Aviation',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=82',
      hint: 'Business aircraft and aviation assets'
    },
    {
      name: 'Yachts & Superyachts',
      group: 'Marine',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=82',
      hint: 'Yachts, superyachts and motor vessels'
    },
    {
      name: 'Sailing Yachts',
      group: 'Marine',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=82',
      hint: 'Sailing yachts and blue-water vessels'
    },
    {
      name: 'Luxury Watches',
      group: 'Personal Luxury',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=82',
      hint: 'Fine watches and collector timepieces'
    },
    {
      name: 'Fine Jewellery',
      group: 'Personal Luxury',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=82',
      hint: 'Fine jewellery and precious stones'
    },
    {
      name: 'Designer Handbags',
      group: 'Personal Luxury',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=82',
      hint: 'Authentic designer bags and accessories'
    },
    {
      name: 'Luxury Fashion',
      group: 'Personal Luxury',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=82',
      hint: 'Premium fashion and wardrobe pieces'
    },
    {
      name: 'Luxury Villas',
      group: 'Real Estate',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=82',
      hint: 'Private villas and luxury residences'
    },
    {
      name: 'Penthouses',
      group: 'Real Estate',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=82',
      hint: 'Skyline residences and penthouses'
    },
    {
      name: 'Private Estates',
      group: 'Real Estate',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=82',
      hint: 'Landmark estates and private compounds'
    },
    {
      name: 'Luxury Apartments',
      group: 'Real Estate',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=82',
      hint: 'Exceptional apartments and residences'
    },
    {
      name: 'Private Islands & Land',
      group: 'Real Estate',
      image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=82',
      hint: 'Private islands, land and development sites'
    },
    {
      name: 'Luxury Hotels & Resorts',
      group: 'Hospitality',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=82',
      hint: 'Hotels, resorts and hospitality properties'
    },
    {
      name: 'Luxury Holiday Rentals',
      group: 'Hospitality',
      image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=800&q=82',
      hint: 'Private stays and exceptional retreats'
    },
    {
      name: 'Private Retreats',
      group: 'Hospitality',
      image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=800&q=82',
      hint: 'Remote escapes and wellness retreats'
    },
    {
      name: 'Luxury Interiors & Furniture',
      group: 'Design & Living',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=82',
      hint: 'Exceptional interiors and designer furniture'
    },
    {
      name: 'Fine Art & Collectibles',
      group: 'Design & Living',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=82',
      hint: 'Artworks and authenticated collectibles'
    },
    {
      name: 'Premium Home Technology',
      group: 'Design & Living',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=82',
      hint: 'Premium smart-home and entertainment systems'
    },
    {
      name: 'Luxury RVs & Motorhomes',
      group: 'Travel',
      image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9abc9e2?auto=format&fit=crop&w=800&q=82',
      hint: 'Luxury touring vehicles and motorhomes'
    },
    {
      name: 'Luxury Travel Experiences',
      group: 'Travel',
      image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=82',
      hint: 'Private travel and bespoke experiences'
    },
    {
      name: 'Equestrian Estates & Horses',
      group: 'Lifestyle',
      image: 'https://images.unsplash.com/photo-1534307677768-3e8f1c1c7f8f?auto=format&fit=crop&w=800&q=82',
      hint: 'Equestrian properties and horse facilities'
    },
    {
      name: 'Luxury Fitness & Wellness',
      group: 'Lifestyle',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=82',
      hint: 'Premium wellness and fitness equipment'
    },
    {
      name: 'Premium Sports Equipment',
      group: 'Lifestyle',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=82',
      hint: 'Specialist sports and recreation equipment'
    },
    {
      name: 'Luxury Event Venues',
      group: 'Experiences',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=82',
      hint: 'Exceptional venues for private events'
    },
    {
      name: 'Other Luxury Assets',
      group: 'Curated',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=82',
      hint: 'Other exceptional lifestyle assets'
    }
  ];

  const $ = id => document.getElementById(id);

  const escapeHTML = value =>
    String(value ?? '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));

  const escapeAttr = escapeHTML;

  const uid = prefix =>
    `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  const session = () => apiUser;
  const currentEmail = () => (apiUser?.email || '').toLowerCase();
  const listings = () => listingCache;
  const savedItems = () => savedCache;
  const messages = () => messageCache;

  function toast(message) {
    const el = $('luxToast');
    if (!el) {
      console.log(message);
      return;
    }

    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(window.__luxToastTimer);

    window.__luxToastTimer = setTimeout(() => {
      el.classList.remove('is-visible');
    }, 3000);
  }

  function money(value, currency) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return 'Contact for price';

    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency || 'USD',
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return `${currency || 'USD'} ${amount.toLocaleString()}`;
    }
  }

  function renderCategories() {
    const container = $('luxCategoryGrid');
    if (!container) return;

    const groups = [...new Set(CATEGORIES.map(item => item.group))];

    container.innerHTML = groups.map(group => {
      const cards = CATEGORIES
        .filter(item => item.group === group)
        .map(item => `
          <button class="lux-category-card"
            type="button"
            data-lux-category="${escapeAttr(item.name)}">
            <img src="${escapeAttr(item.image)}"
              alt="${escapeAttr(item.name)}"
              loading="lazy">
            <span class="lux-category-shade"></span>
            <span class="lux-category-copy">
              <strong>${escapeHTML(item.name)}</strong>
              <small>${escapeHTML(item.hint)}</small>
            </span>
          </button>
        `).join('');

      return `
        <section class="lux-category-group">
          <h3>${escapeHTML(group)}</h3>
          <div class="lux-category-cards">${cards}</div>
        </section>
      `;
    }).join('');
  }

  function initCountrySelects() {
    const countrySelect = $('luxFilterCountry');
    if (!countrySelect) return;

    const countries = [...new Set(
      listings().map(item => item.country).filter(Boolean)
    )].sort();

    const previous = countrySelect.value;

    countrySelect.innerHTML =
      '<option value="">All countries</option>' +
      countries.map(country =>
        `<option value="${escapeAttr(country)}">${escapeHTML(country)}</option>`
      ).join('');

    countrySelect.value = previous;
  }

  function filteredListings() {
    const search = ($('luxSearch')?.value || '').trim().toLowerCase();
    const category = $('luxFilterCategory')?.value || '';
    const country = $('luxFilterCountry')?.value || '';
    const condition = $('luxFilterCondition')?.value || '';
    const minPrice = Number($('luxMinPrice')?.value || 0);
    const maxPrice = Number($('luxMaxPrice')?.value || 0);
    const sort = $('luxSort')?.value || 'newest';

    let result = listings().filter(item => {
      if (item.status && !['active', 'published'].includes(item.status)) {
        return false;
      }

      if (category && item.category !== category) return false;
      if (country && item.country !== country) return false;
      if (condition && item.condition !== condition) return false;

      if (minPrice && Number(item.price || 0) < minPrice) return false;
      if (maxPrice && Number(item.price || 0) > maxPrice) return false;

      if (search) {
        const searchable = [
          item.title,
          item.category,
          item.brand,
          item.model,
          item.country,
          item.state,
          item.city,
          item.description,
          item.features
        ].join(' ').toLowerCase();

        if (!searchable.includes(search)) return false;
      }

      return true;
    });

    result.sort((a, b) => {
      if (sort === 'price-low') return Number(a.price || 0) - Number(b.price || 0);
      if (sort === 'price-high') return Number(b.price || 0) - Number(a.price || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return result;
  }

  function renderListings() {
    const container = $('luxListingsGrid');
    if (!container) return;

    const result = filteredListings();

    if (!result.length) {
      container.innerHTML = `
        <div class="lux-empty">
          No listings match your search yet. Try another category or location.
        </div>
      `;
      return;
    }

    container.innerHTML = result.map(item => {
      const photos = Array.isArray(item.photos) ? item.photos : [];
      const photo = photos[0] || '';
      const own = isOwnListing(item);
      const saved = savedItems().includes(item.id);

      return `
        <article class="lux-listing-card">
          <div class="lux-listing-image">
            ${photo
              ? `<img src="${escapeAttr(photo)}" alt="${escapeAttr(item.title)}" loading="lazy">`
              : '<div class="lux-no-image">No photo available</div>'}
            <span class="lux-condition">${escapeHTML(item.condition || 'Available')}</span>
          </div>
          <div class="lux-listing-content">
            <small class="lux-listing-category">${escapeHTML(item.category || 'Luxury asset')}</small>
            <h3>${escapeHTML(item.title || 'Untitled listing')}</h3>
            <p class="lux-listing-location">
              ${escapeHTML([item.city, item.state, item.country].filter(Boolean).join(', '))}
            </p>
            <p class="lux-listing-price">${money(item.price, item.currency)}</p>
            <div class="lux-listing-actions">
              <button class="lux-btn lux-btn-gold" type="button"
                data-lux-details="${escapeAttr(item.id)}">View details</button>
              <button class="lux-btn" type="button"
                data-lux-save="${escapeAttr(item.id)}">
                ${saved ? 'Remove saved' : 'Save'}
              </button>
              ${own ? `
                <button class="lux-btn" type="button"
                  data-lux-edit="${escapeAttr(item.id)}">Edit</button>
                <button class="lux-btn" type="button"
                  data-lux-delete="${escapeAttr(item.id)}">Delete</button>
              ` : `
                <button class="lux-btn" type="button"
                  data-lux-contact="${escapeAttr(item.id)}">Contact seller</button>
              `}
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function showModal(title, html, eyebrow = '') {
    $('luxModalTitle').textContent = title;
    $('luxModalEyebrow').textContent = eyebrow;
    $('luxModalBody').innerHTML = html;
    $('luxModalOverlay').hidden = false;
    document.body.classList.add('lux-modal-open');
  }

  function closeModal() {
    $('luxModalOverlay').hidden = true;
    document.body.classList.remove('lux-modal-open');
  }

  function openDetails(id) {
    const item = listings().find(record => record.id === id);
    if (!item) return;

    const photos = Array.isArray(item.photos) ? item.photos : [];

    showModal(
      item.title || 'Luxury listing',
      `
        <div class="lux-detail-gallery">
          ${photos.map(photo => `
            <img src="${escapeAttr(photo)}"
              alt="${escapeAttr(item.title || 'Luxury asset')}"
              loading="lazy">
          `).join('')}
        </div>
        <p class="lux-listing-price">${money(item.price, item.currency)}</p>
        <p><strong>Category:</strong> ${escapeHTML(item.category || '')}</p>
        <p><strong>Condition:</strong> ${escapeHTML(item.condition || '')}</p>
        <p><strong>Location:</strong> ${escapeHTML(
          [item.city, item.state, item.country].filter(Boolean).join(', ')
        )}</p>
        <p>${escapeHTML(item.description || 'No description provided.')}</p>
        ${item.features
          ? `<p><strong>Features:</strong> ${escapeHTML(item.features)}</p>`
          : ''}
        <div class="lux-form-actions">
          ${isOwnListing(item) ? '' : `
            <button class="lux-btn lux-btn-gold"
              type="button" data-lux-contact="${escapeAttr(item.id)}">
              Contact seller
            </button>
          `}
          <button class="lux-btn" type="button"
            data-lux-modal-cancel>Close</button>
        </div>
      `,
      'LISTING DETAILS'
    );
  }

  function openListingForm(item = null) {
    const editing = Boolean(item);
    const value = item || {};

    showModal(
      editing ? 'Edit your listing' : 'Create a luxury listing',
      `
        <form id="luxListingForm" class="lux-form">
          <div class="lux-field">
            <label for="luxItemTitle">Title</label>
            <input id="luxItemTitle" name="title" required maxlength="180"
              value="${escapeAttr(value.title || '')}">
          </div>

          <div class="lux-field">
            <label for="luxItemCategory">Category</label>
            <select id="luxItemCategory" name="category" required>
              ${CATEGORIES.map(category => `
                <option value="${escapeAttr(category.name)}"
                  ${value.category === category.name ? 'selected' : ''}>
                  ${escapeHTML(category.name)}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="lux-field">
            <label for="luxItemBrand">Brand</label>
            <input id="luxItemBrand" name="brand" maxlength="120"
              value="${escapeAttr(value.brand || '')}">
          </div>

          <div class="lux-field">
            <label for="luxItemModel">Model</label>
            <input id="luxItemModel" name="model" maxlength="120"
              value="${escapeAttr(value.model || '')}">
          </div>

          <div class="lux-field">
            <label for="luxItemCondition">Availability / condition</label>
            <select id="luxItemCondition" name="condition" required>
              ${['For sale', 'For rent', 'New', 'Pre-owned', 'Available'].map(option => `
                <option value="${escapeAttr(option)}"
                  ${value.condition === option ? 'selected' : ''}>
                  ${escapeHTML(option)}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="lux-field">
            <label for="luxItemPrice">Price (optional)</label>
            <input id="luxItemPrice" name="price" type="number"
              min="0" step="any" value="${escapeAttr(value.price ?? '')}">
          </div>

          <div class="lux-field">
            <label for="luxItemCurrency">Currency</label>
            <select id="luxItemCurrency" name="currency">
              ${['USD', 'INR', 'EUR', 'GBP', 'AED', 'SGD', 'AUD', 'CAD'].map(currency => `
                <option value="${currency}"
                  ${value.currency === currency ? 'selected' : ''}>
                  ${currency}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="lux-field">
            <label for="luxItemCountry">Country</label>
            <input id="luxItemCountry" name="country" required maxlength="100"
              value="${escapeAttr(value.country || '')}">
          </div>

          <div class="lux-field">
            <label for="luxItemState">State / province</label>
            <input id="luxItemState" name="state" maxlength="100"
              value="${escapeAttr(value.state || '')}">
          </div>

          <div class="lux-field">
            <label for="luxItemCity">City</label>
            <input id="luxItemCity" name="city" required maxlength="100"
              value="${escapeAttr(value.city || '')}">
          </div>

          <div class="lux-field">
            <label for="luxItemPhotos">Photo URLs (one per line)</label>
            <textarea id="luxItemPhotos" name="photos" rows="3"
              placeholder="https://example.com/photo.jpg">${escapeHTML(
                Array.isArray(value.photos) ? value.photos.join('\n') : ''
              )}</textarea>
          </div>

          <div class="lux-field">
            <label for="luxItemDescription">Description</label>
            <textarea id="luxItemDescription" name="description"
              rows="4" maxlength="5000">${escapeHTML(value.description || '')}</textarea>
          </div>

          <div class="lux-field">
            <label for="luxItemFeatures">Features / specifications</label>
            <textarea id="luxItemFeatures" name="features"
              rows="3" maxlength="3000">${escapeHTML(value.features || '')}</textarea>
          </div>

          <div class="lux-form-actions">
            <button class="lux-btn" type="button" data-lux-modal-cancel>
              Cancel
            </button>
            <button class="lux-btn lux-btn-gold" type="submit">
              ${editing ? 'Save changes' : 'Publish listing'}
            </button>
          </div>
        </form>
      `,
      editing ? 'UPDATE LISTING' : 'SELL OR RENT'
    );

    const form = $('luxListingForm');

    form.addEventListener('submit', async event => {
      event.preventDefault();

      const submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;

      try {
        const fd = new FormData(form);

        const photos = String(fd.get('photos') || '')
          .split(/\r?\n/)
          .map(photo => photo.trim())
          .filter(Boolean)
          .filter(photo => /^https?:\/\//i.test(photo))
          .slice(0, 12);

        const record = {
          title: String(fd.get('title') || '').trim(),
          category: String(fd.get('category') || ''),
          brand: String(fd.get('brand') || '').trim(),
          model: String(fd.get('model') || '').trim(),
          condition: String(fd.get('condition') || ''),
          price: fd.get('price') === '' ? null : Number(fd.get('price')),
          currency: String(fd.get('currency') || 'USD'),
          country: String(fd.get('country') || '').trim(),
          state: String(fd.get('state') || '').trim(),
          city: String(fd.get('city') || '').trim(),
          photos,
          description: String(fd.get('description') || '').trim(),
          features: String(fd.get('features') || '').trim(),
          status: 'active'
        };

        if (!record.title || !record.country || !record.city) {
          throw new Error('Enter the title, country and city.');
        }

        if (editing) {
          await api(luxuryListingsPath(item.id), {
            method: 'PUT',
            body: { record }
          });
        } else {
          await api(luxuryListingsPath(), {
            method: 'POST',
            body: { record }
          });
        }

        await refreshRemoteData();
        initCountrySelects();
        renderListings();
        renderCounts();
        closeModal();

        toast(editing
          ? 'Listing updated successfully.'
          : 'Listing published successfully.');
      } catch (error) {
        toast(error.message || 'Listing could not be saved.');
      } finally {
        submit.disabled = false;
      }
    });
  }

  function contactSeller(id) {
    const item = listings().find(record => record.id === id);
    if (!item) return;

    if (isOwnListing(item)) {
      toast('This is your own listing.');
      return;
    }

    showModal(
      'Contact seller',
      `
        <form id="luxContactForm" class="lux-form">
          <div class="lux-field">
            <label for="luxContactSubject">Subject</label>
            <input id="luxContactSubject" name="subject"
              required maxlength="180"
              value="Enquiry about ${escapeAttr(item.title || 'luxury listing')}">
          </div>

          <div class="lux-field">
            <label for="luxContactBody">Message</label>
            <textarea id="luxContactBody" name="body"
              rows="5" required maxlength="2500"
              placeholder="I would like to learn more about this listing..."></textarea>
          </div>

          <div class="lux-form-actions">
            <button class="lux-btn" type="button" data-lux-modal-cancel>
              Cancel
            </button>
            <button class="lux-btn lux-btn-gold" type="submit">
              Send message
            </button>
          </div>
        </form>
      `,
      'SELLER ENQUIRY'
    );

    $('luxContactForm').addEventListener('submit', async event => {
      event.preventDefault();

      const form = event.currentTarget;
      const submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;

      try {
        const fd = new FormData(form);

        if (!item.ownerId && !item.sellerId) {
          throw new Error('The seller account is not available for messaging.');
        }

        const subject = String(fd.get('subject') || '').trim();
        const body = String(fd.get('body') || '').trim();

        await api('/api/marketplace/messages', {
          method: 'POST',
          body: {
            marketplace: 'luxury',
            listingId: item.id,
            listingTitle: item.title,
            toId: item.ownerId || item.sellerId,
            text: (subject + '\n\n' + body).slice(0, 3000)
          }
        });

        await refreshRemoteData();
        closeModal();
        renderCounts();
        toast('Your message was sent to the seller inbox.');
      } catch (error) {
        toast(error.message || 'Message could not be sent.');
      } finally {
        submit.disabled = false;
      }
    });
  }

  async function toggleSaved(id) {
    try {
      const wasSaved = savedItems().includes(id);

      await api('/api/marketplace/saved', {
        method: wasSaved ? 'DELETE' : 'POST',
        body: {
          marketplace: 'luxury',
          recordId: id
        }
      });

      await refreshRemoteData();
      renderListings();
      renderCounts();

      toast(wasSaved
        ? 'Removed from saved listings.'
        : 'Added to saved listings.');
    } catch (error) {
      toast(error.message || 'Saved collection could not be updated.');
    }
  }

  function showSaved() {
    const ids = savedItems();
    const items = listings().filter(item => ids.includes(item.id));

    const html = items.length
      ? `<div class="lux-inbox-list">${items.map(item => `
          <div class="lux-message">
            <strong>${escapeHTML(item.title)}</strong>
            <p>${escapeHTML(item.category || '')}</p>
            <p>${money(item.price, item.currency)}</p>
            <button class="lux-btn" type="button"
              data-lux-details="${escapeAttr(item.id)}">View listing</button>
            <button class="lux-btn" type="button"
              data-lux-save="${escapeAttr(item.id)}">Remove saved</button>
          </div>
        `).join('')}</div>`
      : '<div class="lux-empty">Your saved collection is empty.</div>';

    showModal('Your saved collection', html, 'PRIVATE COLLECTION');
  }

  function showInbox() {
    const mine = messages();

    const html = mine.length
      ? `<div class="lux-inbox-list">${mine.map(message => `
          <article class="lux-message">
            <strong>${escapeHTML(message.subject || message.listingTitle || 'Luxury enquiry')}</strong>
            <p>${escapeHTML(message.body)}</p>
            <small>
              ${escapeHTML(message.direction === 'outgoing' ? 'Sent by you' : 'Received')}
              · ${escapeHTML(new Date(message.createdAt).toLocaleString())}
              ${message.listingTitle ? ' · ' + escapeHTML(message.listingTitle) : ''}
              ${message.read ? ' · Read' : ''}
            </small>
          </article>
        `).join('')}</div>`
      : '<div class="lux-empty">Your server inbox is empty. Messages from other signed-in users will appear here.</div>';

    showModal(
      'Seller inbox & messages',
      `${html}<div class="lux-divider"></div>
       <p class="lux-help">Messages are retrieved from the ALON Marketplace API and are visible only to their sender and recipient.</p>`,
      'PRIVATE COMMUNICATIONS'
    );
  }

  function renderCounts() {
    $('luxSavedCount').textContent = String(savedItems().length);
    $('luxInboxCount').textContent = String(messages().length);
  }

  function deleteListing(id) {
    const item = listings().find(record => record.id === id);
    if (!item) return;

    if (!isOwnListing(item)) {
      toast('You can only delete your own listings.');
      return;
    }

    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) {
      return;
    }

    api(luxuryListingsPath(id), { method: 'DELETE' })
      .then(async () => {
        await refreshRemoteData();
        renderListings();
        renderCounts();
        toast('Listing deleted from the server.');
      })
      .catch(error => {
        toast(error.message || 'Listing could not be deleted.');
      });
  }

  function clearFilters() {
    [
      'luxSearch',
      'luxFilterCategory',
      'luxFilterCountry',
      'luxFilterCondition',
      'luxMinPrice',
      'luxMaxPrice'
    ].forEach(id => {
      const el = $(id);
      if (el) el.value = '';
    });

    $('luxSort').value = 'newest';
    renderListings();
  }

  function openTerms() {
    showModal(
      'Terms of Use',
      `<p style="color:#d2d2d7;line-height:1.8">
        Luxury Lifestyle is a listing and discovery interface. Users are
        responsible for accurate descriptions, lawful ownership or authority
        to list, rights to all uploaded images, and independent verification
        of seller identity, asset condition, title, registration, availability
        and transaction documents. The platform does not guarantee any listing,
        seller, item, valuation or transaction. Never send money or sensitive
        documents solely because of a listing. The platform is a listing and
        messaging service; it does not process payments or guarantee a
        transaction. Verify all sellers, ownership, documents and assets
        independently.
      </p>`,
      'LEGAL'
    );
  }

  function openPrivacy() {
    showModal(
      'Privacy notice',
      `<p style="color:#d2d2d7;line-height:1.8">
        Account authentication, listings, saved items and messages are handled
        by the ALON Marketplace API using an authorization token. Avoid sharing
        your password and sign out on shared devices. Contact the site owner
        for account deletion or privacy requests.
      </p>`,
      'LEGAL'
    );
  }

  function setAuthMode(mode) {
    authMode = mode;

    const title = $('luxLoginTitle');
    const password = $('luxLoginPassword');
    const submit = $('luxLoginForm').querySelector('button[type="submit"]');

    if (mode === 'register') {
      title.textContent = 'Create your account.';
      password.autocomplete = 'new-password';
      password.minLength = 0;
      password.placeholder = 'Enter your password';
      submit.innerHTML = 'Create secure account <span aria-hidden="true">↗</span>';
      $('luxLoginError').textContent =
        'Enter a valid email, password, and accept the Terms.';
    } else {
      title.textContent = 'Welcome back.';
      password.autocomplete = 'current-password';
      password.minLength = 0;
      password.placeholder = 'Your account password';
      submit.innerHTML = 'Sign in securely <span aria-hidden="true">↗</span>';
      $('luxLoginError').textContent =
        'Sign in to manage your private collection, listings and conversations.';
    }

    const toggle = $('luxAuthToggle');
    if (toggle) {
      toggle.textContent = mode === 'register'
        ? 'Already have an account? Sign in'
        : 'New to Luxury Lifestyle? Create account';
    }

    const name = $('luxRegisterNameWrap');
    if (name) name.hidden = mode !== 'register';

    $('luxLoginTerms').required = mode === 'register';
  }

  async function login(event) {
    event.preventDefault();

    const email = $('luxLoginEmail').value.trim().toLowerCase();
    const password = $('luxLoginPassword').value;
    const accepted = $('luxLoginTerms').checked;

    if (!email || !password || (authMode === 'register' && !accepted)) {
      $('luxLoginError').textContent = authMode === 'register'
        ? 'Enter a valid email and password, then accept the Terms.'
        : 'Enter your email and password.';
      return;
    }

    const submit = $('luxLoginForm').querySelector('button[type="submit"]');
    submit.disabled = true;

    try {
      let result;

      if (authMode === 'register') {
        result = await api('/api/auth/register', {
          method: 'POST',
          body: {
            email,
            password,
            displayName: $('luxRegisterName').value.trim(),
            termsAccepted: accepted
          }
        });
      } else {
        result = await api('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        });
      }

      storeToken(result.token);
      apiUser = result.user;

      await refreshRemoteData();

      $('luxLoginPassword').value = '';
      showApp();

      toast(authMode === 'register'
        ? 'Secure account created.'
        : 'Signed in securely.');
    } catch (error) {
      $('luxLoginError').textContent =
        error.message || 'Authentication failed. Check your details and try again.';
    } finally {
      submit.disabled = false;
    }
  }

  function showApp() {
    document.body.classList.remove('lux-login-mode');
    $('luxLoginScreen').hidden = true;
    $('luxApp').hidden = false;

    renderCategories();
    initCountrySelects();
    renderListings();
    renderCounts();

    $('luxYear').textContent = String(new Date().getFullYear());
  }

  async function logout() {
    try {
      if (apiToken) {
        await api('/api/auth/logout', { method: 'POST' });
      }
    } catch {}

    storeToken('');
    apiUser = null;
    listingCache = [];
    savedCache = [];
    messageCache = [];

    $('luxLoginPassword').value = '';
    $('luxLoginScreen').hidden = false;
    $('luxApp').hidden = true;
    document.body.classList.add('lux-login-mode');

    setAuthMode('login');
    toast('You have signed out.');
  }

  async function bootSecureApp() {
    const form = $('luxLoginForm');

    if (!$('luxAuthToggle')) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.id = 'luxAuthToggle';
      toggle.className = 'lux-btn';
      toggle.style.width = '100%';
      toggle.style.marginTop = '10px';
      toggle.textContent = 'New to Luxury Lifestyle? Create account';

      form.insertBefore(toggle, $('luxLoginError'));

      toggle.addEventListener('click', () => {
        setAuthMode(authMode === 'login' ? 'register' : 'login');
      });
    }

    if (!$('luxRegisterNameWrap')) {
      const wrap = document.createElement('div');
      wrap.id = 'luxRegisterNameWrap';
      wrap.className = 'lux-field';
      wrap.hidden = true;
      wrap.innerHTML = `
        <label for="luxRegisterName">Display name</label>
        <input id="luxRegisterName" name="displayName"
          maxlength="100" autocomplete="name"
          placeholder="Your name or business">
      `;

      form.insertBefore(wrap, $('luxLoginEmail').closest('.lux-field'));
    }

    if (!apiToken) {
      document.body.classList.add('lux-login-mode');
      $('luxLoginScreen').hidden = false;
      $('luxApp').hidden = true;
      setAuthMode('login');
      return;
    }

    try {
      const result = await api('/api/auth/session');
      apiUser = result.user;

      await refreshRemoteData();
      showApp();
    } catch (error) {
      apiUser = null;
      document.body.classList.add('lux-login-mode');
      $('luxLoginScreen').hidden = false;
      $('luxApp').hidden = true;
      setAuthMode('login');

      $('luxLoginError').textContent =
        error.message || 'Your session could not be verified. Please sign in again.';
    }
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('button,a');
    if (!target) return;

    if (target.matches('[data-lux-open-terms]')) {
      event.preventDefault();
      openTerms();
      return;
    }

    if (target.matches('[data-lux-open-privacy]')) {
      event.preventDefault();
      openPrivacy();
      return;
    }

    if (target.matches('[data-lux-category]')) {
      $('luxFilterCategory').value = target.dataset.luxCategory;
      renderListings();
      $('luxShowroom').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (target.matches('[data-lux-details]')) {
      openDetails(target.dataset.luxDetails);
      return;
    }

    if (target.matches('[data-lux-save]')) {
      toggleSaved(target.dataset.luxSave);
      return;
    }

    if (target.matches('[data-lux-contact]')) {
      contactSeller(target.dataset.luxContact);
      return;
    }

    if (target.matches('[data-lux-edit]')) {
      const item = listings().find(record => record.id === target.dataset.luxEdit);
      if (item) openListingForm(item);
      return;
    }

    if (target.matches('[data-lux-delete]')) {
      deleteListing(target.dataset.luxDelete);
      return;
    }

    if (target.matches('[data-lux-clear]')) {
      clearFilters();
      return;
    }

    if (target.matches('[data-lux-modal-cancel]')) {
      closeModal();
    }
  });

  $('luxLoginForm').addEventListener('submit', login);
  $('luxModalClose').addEventListener('click', closeModal);

  $('luxModalOverlay').addEventListener('click', event => {
    if (event.target === $('luxModalOverlay')) closeModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !$('luxModalOverlay').hidden) {
      closeModal();
    }
  });

  [
    'luxSearch',
    'luxFilterCategory',
    'luxFilterCountry',
    'luxFilterCondition',
    'luxMinPrice',
    'luxMaxPrice',
    'luxSort'
  ].forEach(id => {
    $(id).addEventListener('input', renderListings);
  });

  $('luxClearFilters').addEventListener('click', clearFilters);
  $('luxAddListingButton').addEventListener('click', () => openListingForm());
  $('luxHeroListButton').addEventListener('click', () => openListingForm());
  $('luxInboxButton').addEventListener('click', showInbox);
  $('luxSavedButton').addEventListener('click', showSaved);
  $('luxLogoutButton').addEventListener('click', logout);

  bootSecureApp();

  document.addEventListener('click', () => {
    if (window.__luxSoundEnabled) return;
    window.__luxSoundEnabled = true;
  }, { once: true });

  window.ALONLuxuryLifestyle = {
    version: VERSION,
    categories: CATEGORIES.map(category => category.name),
    refresh: renderListings,
    logout
  };
})();