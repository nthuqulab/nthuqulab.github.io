// Data Loader - Dynamically loads content from multiple JSON files
class DataLoader {
  constructor(language = 'en') {
    this.data = {};
    this.language = language;
  }

  async loadData() {
    try {
      // Get language suffix
      const langSuffix = this.language === 'zh' ? '.zh' : '';

      // Define all data files to load
      const dataFiles = {
        site: `./data/site${langSuffix}.json`,
        navigation: `./data/navigation${langSuffix}.json`,
        hero: `./data/hero${langSuffix}.json`,
        about: `./data/about${langSuffix}.json`,
        fields: `./data/fields${langSuffix}.json`,
        members: `./data/members${langSuffix}.json`,
        research: `./data/student_history_research${langSuffix}.json`,
        researchMeta: `./data/research_meta${langSuffix}.json`,
        publications: `./data/teacher_publish${langSuffix}.json`,
        publicationsMeta: `./data/publications_meta${langSuffix}.json`,
        contact: `./data/contact${langSuffix}.json`,
        footer: `./data/footer${langSuffix}.json`
      };

      // Load all files in parallel
      const promises = Object.entries(dataFiles).map(async ([key, path]) => {
        const response = await fetch(path);
        const data = await response.json();
        return { key, data };
      });

      const results = await Promise.all(promises);

      // Store results in this.data
      results.forEach(({ key, data }) => {
        this.data[key] = data;
      });

      return this.data;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }

  renderSite() {
    if (!this.data) return;

    // Update page title
    document.title = this.data.site.title;

    // Update logo
    const logo = document.querySelector('.sitename');
    if (logo) logo.textContent = this.data.site.logo;
  }

  renderNavigation() {
    if (!this.data) return;

    const navMenu = document.querySelector('#navmenu ul');
    if (!navMenu) return;

    navMenu.innerHTML = this.data.navigation.map(item => `
      <li><a href="${item.href}" class="${item.active ? 'active' : ''}">${item.label}</a></li>
    `).join('');

    // Add mobile nav toggle
    navMenu.innerHTML += '<i class="mobile-nav-toggle d-xl-none bi bi-list"></i>';

    // Set up mobile nav toggle functionality
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

    // Toggle function
    const toggleMobileNav = () => {
      document.body.classList.toggle('mobile-nav-active');
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    };

    // Toggle button click handler
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener('click', toggleMobileNav);
    }

    // Close mobile nav when clicking on navigation links
    const navLinks = document.querySelectorAll('#navmenu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (document.body.classList.contains('mobile-nav-active')) {
          document.body.classList.remove('mobile-nav-active');
          if (mobileNavToggleBtn) {
            mobileNavToggleBtn.classList.remove('bi-x');
            mobileNavToggleBtn.classList.add('bi-list');
          }
        }
      });
    });
  }

  renderHero() {
    if (!this.data) return;

    const hero = this.data.hero;

    // Update hero title
    const heroTitle = document.querySelector('.hero-title');
    const welcomeText = localStorage.getItem('language') === 'zh' ? '歡迎來到' : 'Welcome to';
    if (heroTitle) {
      heroTitle.innerHTML = `${welcomeText} <i class="text-primary">${hero.titleHighlight}</i>`;
    }

    // Update hero description
    const heroDesc = document.querySelector('.hero-description');
    if (heroDesc) heroDesc.textContent = hero.description;

    // Update hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) heroImage.src = hero.image;

    // Update buttons
    const heroActions = document.querySelector('.hero-actions');
    if (heroActions) {
      heroActions.innerHTML = hero.buttons.map(btn => `
        <a href="${btn.href}" class="btn-${btn.type}">${btn.text}</a>
      `).join('');
    }

    // Update floating cards
    const floatingElements = document.querySelector('.floating-elements');
    if (floatingElements) {
      floatingElements.innerHTML = hero.floatingCards.map((card, index) => `
        <div class="floating-card card-${index + 1}">
          <i class="bi ${card.icon}"></i>
          <span>${card.text}</span>
        </div>
      `).join('');
    }
  }

  renderAbout() {
    if (!this.data) return;

    const about = this.data.about;

    // Update section badge
    const badge = document.querySelector('.section-badge');
    if (badge) badge.textContent = about.badge;

    // Update title
    const title = document.querySelector('#about .section-header h2');
    if (title) title.textContent = about.title;

    // Update lead text
    const leadText = document.querySelector('.lead-text');
    if (leadText) leadText.textContent = about.leadText;

    // Update description
    const descText = document.querySelector('.description-text');
    if (descText) descText.textContent = about.description;
  }

  renderFields() {
    if (!this.data) return;

    const fields = this.data.fields;

    // Update section title and description
    const sectionTitle = document.querySelector('#fields .section-title h2');
    if (sectionTitle) sectionTitle.textContent = fields.sectionTitle;

    const sectionTitleShadow = document.querySelector('#fields .section-title .description-title');
    if (sectionTitleShadow) sectionTitleShadow.textContent = fields.sectionTitle;

    const sectionDesc = document.querySelector('#fields .section-title p');
    if (sectionDesc) sectionDesc.textContent = fields.description;

    // Render tabs navigation in 2x2 grid
    const navTabs = document.querySelector('.nav-tabs');
    if (navTabs) {
      // Add grid class to nav-tabs
      navTabs.classList.add('nav-tabs-grid');

      navTabs.innerHTML = fields.tabs.map((tab, index) => `
        <li class="nav-item col-6">
          <a class="nav-link ${index === 0 ? 'active show' : ''}" data-bs-toggle="tab" data-bs-target="#${tab.id}">
            <div class="tab-icon">
              <i class="bi ${tab.icon}"></i>
            </div>
            <div class="tab-content">
              <h5>${tab.title}</h5>
              <span>${tab.subtitle}</span>
            </div>
          </a>
        </li>
      `).join('');
    }

    // Render tab content
    const tabContents = document.querySelectorAll('#fields .tab-content');
    const tabContent = tabContents[tabContents.length - 1]; // Select the last .tab-content
    if (tabContent) {
      tabContent.innerHTML = fields.tabs.map((tab, index) => `
        <div class="tab-pane fade ${index === 0 ? 'active show' : ''}" id="${tab.id}">
          <div class="content-wrapper">
            <div class="icon-badge">
              <i class="bi ${tab.icon}"></i>
            </div>
            <h3>${tab.fullTitle}</h3>
            <p>${tab.description}</p>
          </div>
        </div>
      `).join('');
    }
  }

  renderMembers() {
    if (!this.data) return;

    const members = this.data.members;

    // Update section title and description
    const sectionTitle = document.querySelector('#members .section-title h2');
    if (sectionTitle) sectionTitle.textContent = members.sectionTitle;

    const sectionTitleShadow = document.querySelector('#members .section-title .description-title');
    if (sectionTitleShadow) sectionTitleShadow.textContent = members.sectionTitle;

    const sectionDesc = document.querySelector('#members .section-title p');
    if (sectionDesc) sectionDesc.textContent = members.description;

    // Update tab labels from data
    if (members.tabs) {
      const allTab = document.querySelector('.member-tab[data-tag="all"]');
      if (allTab) allTab.textContent = members.tabs.all;
      const currentTab = document.querySelector('.member-tab[data-tag="current"]');
      if (currentTab) currentTab.textContent = members.tabs.current;
      const pastTab = document.querySelector('.member-tab[data-tag="past"]');
      if (pastTab) pastTab.textContent = members.tabs.past;
    }

    // Render member items
    const memberMasonry = document.querySelector('.member-masonry');
    if (memberMasonry) {
      memberMasonry.innerHTML = members.items.map((member, index) => {
        // Calculate image position bias if available
        const biasStyle = member.bias
          ? `style="object-position: ${member.bias[0]}% ${member.bias[1]}%;"`
          : '';

        // Add cursor pointer and click handler if link exists
        const cursorStyle = member.link ? 'style="cursor: pointer;"' : '';
        const onclickAttr = member.link ? `onclick="window.open('${member.link}', '_blank')"` : '';

        const tag = member.tag || 'current';

        return `
          <div class="member-item ${member.highlight ? 'highlight' : ''}" data-tag="${tag}" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="member-content" ${cursorStyle} ${onclickAttr}>
              <div class="client-info">
                <div class="client-image">
                  <img src="${member.image}" alt="${member.name}" ${biasStyle}>
                </div>
                <div class="client-details">
                  <h3>${member.name}</h3>
                  <span class="position">${member.position}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    this.initMemberTabs();
  }

  initMemberTabs() {
    const tabs = document.querySelectorAll('.member-tab');

    const applyFilter = (tag) => {
      document.querySelectorAll('.member-item').forEach(item => {
        if (tag === 'all' || item.dataset.tag === tag) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        applyFilter(tab.dataset.tag);
      });
    });

    // Apply initial filter based on active tab
    const activeTab = document.querySelector('.member-tab.active');
    if (activeTab) applyFilter(activeTab.dataset.tag);
  }

  renderResearch() {
    if (!this.data || !this.data.research) return;

    // Update section title and description
    if (this.data.researchMeta) {
      const sectionTitle = document.querySelector('#research .section-title .description-title');
      if (sectionTitle) sectionTitle.textContent = this.data.researchMeta.sectionTitle;

      const title = document.querySelector('#research .section-title h2');
      if (title) title.textContent = this.data.researchMeta.title;

      const description = document.querySelector('#research .section-title p');
      if (description) description.textContent = this.data.researchMeta.description;

      // Update search placeholder
      const searchInput = document.getElementById('research-search');
      if (searchInput && this.data.researchMeta.searchPlaceholder) {
        searchInput.placeholder = this.data.researchMeta.searchPlaceholder;
      }

      // Update loading text (will be replaced by count later)
      const countText = document.getElementById('research-count-text');
      if (countText && this.data.researchMeta.loadingText) {
        countText.textContent = this.data.researchMeta.loadingText;
      }
    }

    // Render research items
    const researchContainer = document.querySelector('.research-container');
    if (!researchContainer) return;

    const advisorText = localStorage.getItem('language') === 'zh' ? '指導教授' : 'Advisor';
    const downloadText = localStorage.getItem('language') === 'zh' ? '下載論文' : 'Download Thesis';

    researchContainer.innerHTML = this.data.research.map((item, index) => `
      <div class="research-item" data-aos="fade-up" data-aos-delay="${index * 50}"
           data-title="${item.title.toLowerCase()}"
           data-author="${item.author.toLowerCase()}"
           data-advisor="${item.advisor ? item.advisor.toLowerCase() : ''}"
           data-year="${item.year || ''}">
        <div class="research-content">
          <h4 class="research-title">${item.title}</h4>
          <div class="research-meta">
            <span class="research-author"><i class="bi bi-person"></i> ${item.author}</span>
            ${item.advisor ? `<span class="research-advisor"><i class="bi bi-mortarboard"></i> ${advisorText}: ${item.advisor}</span>` : ''}
            ${item.year ? `<span class="research-year"><i class="bi bi-calendar"></i> ${item.year}</span>` : ''}
          </div>
          ${item.download_link ? `
            <a href="${item.download_link}" target="_blank" class="research-link">
              <i class="bi bi-download"></i> ${downloadText}
            </a>
          ` : ''}
        </div>
      </div>
    `).join('');

    // Add "no results" message element
    const noResultsEl = document.createElement('div');
    noResultsEl.className = 'research-no-results';
    noResultsEl.innerHTML = `
      <i class="bi bi-search"></i>
      <h4>No research found</h4>
      <p>Try adjusting your search terms</p>
    `;
    researchContainer.appendChild(noResultsEl);

    // Initialize search functionality
    this.initResearchSearch();

    // Update count
    this.updateResearchCount();
  }

  initResearchSearch() {
    const searchInput = document.getElementById('research-search');
    const clearBtn = document.getElementById('research-clear');
    const researchItems = document.querySelectorAll('.research-item');
    const noResults = document.querySelector('.research-no-results');

    if (!searchInput) return;

    // Search functionality
    const performSearch = () => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      let visibleCount = 0;

      researchItems.forEach(item => {
        const title = item.dataset.title || '';
        const author = item.dataset.author || '';
        const advisor = item.dataset.advisor || '';
        const year = item.dataset.year || '';

        const matches = title.includes(searchTerm) ||
                       author.includes(searchTerm) ||
                       advisor.includes(searchTerm) ||
                       year.includes(searchTerm);

        if (matches) {
          item.classList.remove('hidden');
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });

      // Show/hide no results message
      if (visibleCount === 0 && searchTerm !== '') {
        noResults.classList.add('show');
      } else {
        noResults.classList.remove('show');
      }

      // Show/hide clear button
      clearBtn.style.display = searchTerm ? 'flex' : 'none';

      // Update count
      this.updateResearchCount(visibleCount);
    };

    // Event listeners
    searchInput.addEventListener('input', performSearch);

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      performSearch();
      searchInput.focus();
    });

    // Clear on Escape key
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        performSearch();
      }
    });
  }

  updateResearchCount(visible) {
    const countText = document.getElementById('research-count-text');
    if (!countText) return;

    const researchItems = document.querySelectorAll('.research-item');
    const actualTotal = researchItems.length;

    if (visible === undefined) {
      countText.textContent = `Showing ${actualTotal} research ${actualTotal === 1 ? 'paper' : 'papers'}`;
    } else {
      countText.textContent = `Showing ${visible} of ${actualTotal} research ${actualTotal === 1 ? 'paper' : 'papers'}`;
    }
  }

  renderPublications() {
    if (!this.data || !this.data.publications) return;

    // Update section title and description
    if (this.data.publicationsMeta) {
      const sectionTitle = document.querySelector('#publications .section-title .description-title');
      if (sectionTitle) sectionTitle.textContent = this.data.publicationsMeta.sectionTitle;

      const title = document.querySelector('#publications .section-title h2');
      if (title) title.textContent = this.data.publicationsMeta.title;

      const description = document.querySelector('#publications .section-title p');
      if (description) description.textContent = this.data.publicationsMeta.description;

      // Update tab labels
      if (this.data.publicationsMeta.tabs) {
        const allTab = document.querySelector('.pub-tab[data-category="all"]');
        if (allTab) allTab.textContent = this.data.publicationsMeta.tabs.all;

        const conferenceTab = document.querySelector('.pub-tab[data-category="conference"]');
        if (conferenceTab) conferenceTab.textContent = this.data.publicationsMeta.tabs.conference;

        const preprintsTab = document.querySelector('.pub-tab[data-category="preprints"]');
        if (preprintsTab) preprintsTab.textContent = this.data.publicationsMeta.tabs.preprints;
      }

      // Update search placeholder
      const searchInput = document.getElementById('publications-search');
      if (searchInput && this.data.publicationsMeta.searchPlaceholder) {
        searchInput.placeholder = this.data.publicationsMeta.searchPlaceholder;
      }

      // Update loading text (will be replaced by count later)
      const countText = document.getElementById('publications-count-text');
      if (countText && this.data.publicationsMeta.loadingText) {
        countText.textContent = this.data.publicationsMeta.loadingText;
      }
    }

    // Render publications
    const publicationsContainer = document.querySelector('.publications-container');
    if (!publicationsContainer) return;

    const { conference_papers, preprints } = this.data.publications;

    // Combine all publications with category
    const allPublications = [
      ...conference_papers.map(pub => ({ ...pub, category: 'conference' })),
      ...preprints.map(pub => ({ ...pub, category: 'preprints' }))
    ];

    const preprintText = localStorage.getItem('language') === 'zh' ? '預印本' : 'Preprint';
    const conferenceText = localStorage.getItem('language') === 'zh' ? '會議論文' : 'Conference Paper';
    const viewPaperText = localStorage.getItem('language') === 'zh' ? '查看論文' : 'View Paper';


    publicationsContainer.innerHTML = allPublications.map((pub, index) => `
      <div class="publication-item" data-aos="fade-up" data-aos-delay="${index * 30}"
           data-category="${pub.category}"
           data-title="${pub.title.toLowerCase()}"
           data-authors="${pub.authors.join(' ').toLowerCase()}"
           data-venue="${pub.venue ? pub.venue.toLowerCase() : ''}"
           data-year="${pub.year}">
        <div class="publication-content">
          <h4 class="publication-title">${pub.title}</h4>
          <div class="publication-authors">${pub.authors.join(', ')}</div>
          <div class="publication-meta">
            <span class="publication-badge">${pub.category === 'conference' ? conferenceText : preprintText}</span>
            <span><i class="bi bi-calendar"></i> ${pub.year}</span>
            ${pub.arXiv_id ? `<span><i class="bi bi-file-earmark-text"></i> arXiv:${pub.arXiv_id}</span>` : ''}
          </div>
          ${pub.venue ? `<div class="publication-venue"><i class="bi bi-geo-alt"></i>${pub.venue}</div>` : ''}
          <div class="publication-links">
            ${pub.url ? `<a href="${pub.url}" target="_blank" class="publication-link"><i class="bi bi-link-45deg"></i> ${viewPaperText}</a>` : ''}
            ${pub.arXiv_id ? `<a href="https://arxiv.org/abs/${pub.arXiv_id}" target="_blank" class="publication-link"><i class="bi bi-file-pdf"></i> arXiv PDF</a>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    // Add "no results" message element
    const noResultsEl = document.createElement('div');
    noResultsEl.className = 'publications-no-results';
    noResultsEl.innerHTML = `
      <i class="bi bi-search"></i>
      <h4>No publications found</h4>
      <p>Try adjusting your search terms or filters</p>
    `;
    publicationsContainer.appendChild(noResultsEl);

    // Initialize functionality
    this.initPublicationsTabs();
    this.initPublicationsSearch();
    this.updatePublicationsCount();
  }

  initPublicationsTabs() {
    const tabs = document.querySelectorAll('.pub-tab');
    const publicationItems = document.querySelectorAll('.publication-item');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const category = tab.dataset.category;

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter publications
        let visibleCount = 0;
        publicationItems.forEach(item => {
          if (category === 'all' || item.dataset.category === category) {
            item.classList.remove('hidden');
            visibleCount++;
          } else {
            item.classList.add('hidden');
          }
        });

        // Update count
        this.updatePublicationsCount(visibleCount);

        // Clear search when switching tabs
        const searchInput = document.getElementById('publications-search');
        if (searchInput) searchInput.value = '';
        const clearBtn = document.getElementById('publications-clear');
        if (clearBtn) clearBtn.style.display = 'none';
      });
    });
  }

  initPublicationsSearch() {
    const searchInput = document.getElementById('publications-search');
    const clearBtn = document.getElementById('publications-clear');
    const publicationItems = document.querySelectorAll('.publication-item');
    const noResults = document.querySelector('.publications-no-results');

    if (!searchInput) return;

    const performSearch = () => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const activeCategory = document.querySelector('.pub-tab.active').dataset.category;
      let visibleCount = 0;

      publicationItems.forEach(item => {
        const title = item.dataset.title || '';
        const authors = item.dataset.authors || '';
        const venue = item.dataset.venue || '';
        const year = item.dataset.year || '';
        const category = item.dataset.category;

        const matchesSearch = title.includes(searchTerm) ||
                            authors.includes(searchTerm) ||
                            venue.includes(searchTerm) ||
                            year.includes(searchTerm);

        const matchesCategory = activeCategory === 'all' || category === activeCategory;

        if (matchesSearch && matchesCategory) {
          item.classList.remove('hidden');
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });

      // Show/hide no results message
      if (visibleCount === 0 && searchTerm !== '') {
        noResults.classList.add('show');
      } else {
        noResults.classList.remove('show');
      }

      // Show/hide clear button
      clearBtn.style.display = searchTerm ? 'flex' : 'none';

      // Update count
      this.updatePublicationsCount(visibleCount);
    };

    // Event listeners
    searchInput.addEventListener('input', performSearch);

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      performSearch();
      searchInput.focus();
    });

    // Clear on Escape key
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        performSearch();
      }
    });
  }

  updatePublicationsCount(visible) {
    const countText = document.getElementById('publications-count-text');
    if (!countText) return;

    const publicationItems = document.querySelectorAll('.publication-item');
    const actualTotal = publicationItems.length;

    if (visible === undefined) {
      countText.textContent = `Showing ${actualTotal} ${actualTotal === 1 ? 'publication' : 'publications'}`;
    } else {
      countText.textContent = `Showing ${visible} of ${actualTotal} ${actualTotal === 1 ? 'publication' : 'publications'}`;
    }
  }

  renderContact() {
    if (!this.data) return;

    const contact = this.data.contact;

    // Update section title and description
    const sectionTitle = document.querySelector('#contact .section-title h2');
    if (sectionTitle) sectionTitle.textContent = contact.sectionTitle;

    const sectionDesc = document.querySelector('#contact .section-title p');
    if (sectionDesc) sectionDesc.textContent = contact.description;

    // Update contact badge
    const badge = document.querySelector('#contact .section-category');
    if (badge) badge.textContent = contact.badge;

    // Update contact title
    const title = document.querySelector('#contact .contact-content h2');
    if (title) title.textContent = contact.title;

    // Update lead text
    const leadText = document.querySelector('#contact .contact-content .lead');
    if (leadText) leadText.textContent = contact.leadText;

    // Update labels
    if (contact.labels) {
      const emailLabel = document.getElementById('email-label');
      if (emailLabel) emailLabel.textContent = contact.labels.email;

      const officeLabel = document.getElementById('office-label');
      if (officeLabel) officeLabel.textContent = contact.labels.office;
    }

    // Update email
    const emailLink = document.querySelector('#contact .info-link');
    if (emailLink) {
      emailLink.textContent = contact.info.email;
      emailLink.href = `mailto:${contact.info.email}`;
    }

    // Update office
    const officeText = document.querySelector('#contact .info-text');
    if (officeText) officeText.textContent = contact.info.office;

    // Update map link
    const mapLink = document.getElementById('map-link');
    if (mapLink && contact.info.mapLink) {
      mapLink.href = contact.info.mapLink;
    }

    // Update map button text
    const mapButtonText = document.getElementById('map-button-text');
    if (mapButtonText && contact.mapButtonText) {
      mapButtonText.textContent = contact.mapButtonText;
    }
  }

  renderFooter() {
    if (!this.data) return;

    const footer = this.data.footer;

    // Update footer logo
    const footerLogo = document.querySelector('.footer .sitename');
    if (footerLogo) footerLogo.textContent = footer.logo;

    // Update footer description
    const footerDesc = document.querySelector('.footer-about p');
    if (footerDesc) footerDesc.textContent = footer.description;

    // Update social links
    const socialLinks = document.querySelector('.social-links');
    if (socialLinks) {
      socialLinks.innerHTML = footer.socialLinks.map(link => `
        <a href="${link.url}"><i class="bi ${link.icon}"></i></a>
      `).join('');
    }

    // Update footer contact
    const footerContact = document.querySelector('.footer-contact');
    if (footerContact) {
      const phoneHTML = footer.contact.phone
        ? `<p class="mt-4"><strong>Phone:</strong> <span>${footer.contact.phone}</span></p>`
        : '';

      footerContact.innerHTML = `
        <h4 id="footer-contact-title">${footer.contact.title}</h4>
        <p>${footer.contact.address}</p>
        <p>${footer.contact.city}</p>
        <p>${footer.contact.country}</p>
        ${phoneHTML}
        <p><strong>Email:</strong> <span>${footer.contact.email}</span></p>
      `;
    }
  }

  async init() {
    await this.loadData();

    if (this.data) {
      this.renderSite();
      this.renderNavigation();
      this.renderHero();
      this.renderAbout();
      this.renderFields();
      this.renderMembers();
      this.renderResearch();
      this.renderPublications();
      this.renderContact();
      this.renderFooter();

      console.log('All data loaded and rendered successfully');
    }
  }
}

// Global loader instance
let loader;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Get saved language preference or default to English
  const savedLanguage = localStorage.getItem('language') || 'en';

  // Initialize loader with saved language
  loader = new DataLoader(savedLanguage);
  loader.init();

  // Initialize features
  initLanguageToggle();
  initDarkMode();
});

// Language Toggle
function initLanguageToggle() {
  const langToggle = document.getElementById('lang-toggle');
  const langText = langToggle.querySelector('.lang-text');

  // Update button text based on current language
  const updateButtonText = () => {
    const currentLang = localStorage.getItem('language') || 'en';
    langText.textContent = currentLang === 'en' ? '中文' : 'EN';
  };

  // Initialize button text
  updateButtonText();

  // Toggle language on button click
  langToggle.addEventListener('click', async () => {
    const currentLang = localStorage.getItem('language') || 'en';
    const newLang = currentLang === 'en' ? 'zh' : 'en';

    // Save language preference
    localStorage.setItem('language', newLang);

    // Update button text
    updateButtonText();

    // Reload content with new language
    loader.language = newLang;
    await loader.loadData();

    if (loader.data) {
      loader.renderSite();
      loader.renderNavigation();
      loader.renderHero();
      loader.renderAbout();
      loader.renderFields();
      loader.renderMembers();
      loader.renderResearch();
      loader.renderPublications();
      loader.renderContact();
      loader.renderFooter();

      console.log(`Content reloaded in ${newLang === 'en' ? 'English' : 'Chinese'}`);
    }
  });
}

// Dark Mode Toggle
function initDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const body = document.body;
  const icon = darkModeToggle.querySelector('i');

  // Check for saved dark mode preference
  const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';

  // Apply saved preference
  if (darkModeEnabled) {
    body.classList.add('dark-mode');
    icon.classList.remove('bi-moon-fill');
    icon.classList.add('bi-sun-fill');
  }

  // Toggle dark mode on button click
  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
      // Switch to sun icon (light mode option)
      icon.classList.remove('bi-moon-fill');
      icon.classList.add('bi-sun-fill');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      // Switch to moon icon (dark mode option)
      icon.classList.remove('bi-sun-fill');
      icon.classList.add('bi-moon-fill');
      localStorage.setItem('darkMode', 'disabled');
    }
  });
}
