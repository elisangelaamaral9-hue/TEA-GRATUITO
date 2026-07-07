const data = [
  { nome: "CER III - Lapa", tag: "Saúde Pública", descricao: "Centro Especializado em Reabilitação focado em acolhimento multidisciplinar e humanizado para TEA." },
  { nome: "Instituto Jô Clemente", tag: "Apoio Social", descricao: "Referência em inclusão e diagnóstico, oferecendo suporte contínuo para famílias e desenvolvimento pessoal." },
  { nome: "Amigos do Autista (AMA)", tag: "ONG", descricao: "Um espaço de carinho e aprendizado pioneiro no Brasil, focado na educação e adaptação social." },
  { nome: "CAPS Infantil III", tag: "Saúde Mental", descricao: "Atenção psicossocial especializada, oferecendo um porto seguro para crianças e adolescentes." },
  { nome: "CASA Azul", tag: "Intervenção", descricao: "Terapias pensadas para o desenvolvimento da autonomia através de atividades lúdicas e gentis." },
  { nome: "CEMA - Diagnóstico", tag: "Saúde", descricao: "Exames e diagnósticos com um olhar cuidadoso para o conforto sensorial do paciente autista." }
];

const resultsContainer = document.getElementById('results');
const emptyState = document.getElementById('emptyState');
const resultCount = document.getElementById('resultCount');
const filterInput = document.getElementById('filterInput');
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const toTop = document.getElementById('toTop');
const suggestForm = document.getElementById('suggestForm');
const chips = document.querySelectorAll('.chip');

let activeCategory = '';

function updateActiveChip(value = '') {
  chips.forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === value);
  });
}

/* ===========================
   ACESSIBILIDADE
=========================== */

const body = document.body;

const accessibilityBtn = document.getElementById("accessibilityBtn");
const accessibilityPanel = document.getElementById("accessibilityPanel");

const darkMode = document.getElementById("darkMode");
const contrastMode = document.getElementById("contrastMode");
const readingMode = document.getElementById("readingMode");

const increaseFont = document.getElementById("increaseFont");
const decreaseFont = document.getElementById("decreaseFont");

/* ---------- Menu ---------- */

if (accessibilityBtn && accessibilityPanel) {

    accessibilityBtn.addEventListener("click", () => {
        accessibilityPanel.classList.toggle("active");
        const isOpen = accessibilityPanel.classList.contains("active");
        accessibilityBtn.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", (e) => {

        if (
            !accessibilityPanel.contains(e.target) &&
            !accessibilityBtn.contains(e.target)
        ) {
            accessibilityPanel.classList.remove("active");
            accessibilityBtn.setAttribute("aria-expanded", "false");
        }

    });

}

/* ---------- Fonte ---------- */

let fontSize = Number(localStorage.getItem("fontSize")) || 100;

document.documentElement.style.fontSize = fontSize + "%";

function salvarFonte() {
    localStorage.setItem("fontSize", fontSize);
}

if (increaseFont) {

    increaseFont.addEventListener("click", () => {

        if (fontSize < 140) {

            fontSize += 10;

            document.documentElement.style.fontSize = fontSize + "%";

            salvarFonte();

        }

    });

}

if (decreaseFont) {

    decreaseFont.addEventListener("click", () => {

        if (fontSize > 80) {

            fontSize -= 10;

            document.documentElement.style.fontSize = fontSize + "%";

            salvarFonte();

        }

    });

}

/* ---------- Classes ---------- */

function salvarPreferencias() {

    const preferencias = {
        dark: body.classList.contains("dark"),
        contrast: body.classList.contains("contrast"),
        reading: body.classList.contains("reading"),
        fontSize
    };

    localStorage.setItem(
        "teaPreferencias",
        JSON.stringify(preferencias)
    );

}

function carregarPreferencias() {

    const preferencias = JSON.parse(
        localStorage.getItem("teaPreferencias")
    );

    if (!preferencias) return;

    if (preferencias.dark)
        body.classList.add("dark");

    if (preferencias.contrast)
        body.classList.add("contrast");

    if (preferencias.reading)
        body.classList.add("reading");

    if (preferencias.fontSize) {

        fontSize = preferencias.fontSize;

        document.documentElement.style.fontSize =
            fontSize + "%";

    }

}

if (darkMode) {

    darkMode.addEventListener("click", () => {

        body.classList.toggle("dark");

        salvarPreferencias();

    });

}

if (readingMode) {

    readingMode.addEventListener("click", () => {

        body.classList.toggle("reading");

        salvarPreferencias();

    });

}

carregarPreferencias();

function render(list = data) {
  resultsContainer.innerHTML = list.map(item => `
    <article class="card">
      <span class="tag-soft">${item.tag}</span>
      <h3>${item.nome}</h3>
      <p>${item.descricao}</p>

      <a
        href="${item.link}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-text details-link"
        style="margin-top:auto; align-self:flex-start;"
      >
        Ver mais detalhes
      </a>

    </article>
  `).join('');

  resultCount.textContent = `${list.length} ${list.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}`;
  emptyState.style.display = list.length ? 'none' : 'block';

  const instCount = document.querySelector('[data-target="0"]');
  if (instCount) instCount.dataset.target = data.length;
}

function getFilteredData(query = '', category = '') {
  const normalizedQuery = query.toLowerCase().trim();
  return data.filter(item => {
    const matchesQuery =
      !normalizedQuery ||
      item.nome.toLowerCase().includes(normalizedQuery) ||
      item.tag.toLowerCase().includes(normalizedQuery) ||
      item.descricao.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      !category || item.tag.toLowerCase().includes(category.toLowerCase());

    return matchesQuery && matchesCategory;
  });
}

function applyFilters() {
  const filtered = getFilteredData(filterInput.value, activeCategory);
  render(filtered);
  updateActiveChip(activeCategory);
}

[filterInput, searchInput].forEach(input => {
  input.addEventListener('input', (e) => {
    const val = e.target.value;
    filterInput.value = searchInput.value = val;
    applyFilters();
  });
});

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    activeCategory = chip.dataset.filter;
    applyFilters();
  });
});

clearBtn.onclick = () => {
  activeCategory = '';
  filterInput.value = searchInput.value = '';
  applyFilters();
};

suggestForm.onsubmit = (e) => {
  e.preventDefault();
  alert("Recebemos sua indicação com muito carinho! Vamos analisar os dados em breve.");
  suggestForm.reset();
};

// Counter Animation
document.querySelectorAll('[data-target]').forEach(el => {
  const target = +el.dataset.target || 0;
  let count = 0;
  const updateCount = () => {
    const speed = 20;
    const inc = target / speed;
    if(count < target) {
      count = Math.ceil(count + inc);
      el.textContent = count;
      setTimeout(updateCount, 50);
    } else {
      el.textContent = target;
    }
  };
  updateCount();
});

// Scroll Reveal
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Back to Top
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 600);
});
toTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Init
render();
updateActiveChip(activeCategory);

document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("map");

  if (mapElement && typeof L !== "undefined") {
    const map = L.map("map").setView([-23.55052, -46.633308], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);

    L.marker([-23.55052, -46.633308])
      .addTo(map)
      .bindPopup("<strong>São Paulo - SP</strong><br>Área de atendimento TEA Gratuito")
      .openPopup();

    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }
});
