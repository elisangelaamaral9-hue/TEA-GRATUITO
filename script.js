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

function render(list = data) {
  resultsContainer.innerHTML = list.map(item => `
    <article class="card">
      <span class="tag-soft">${item.tag}</span>
      <h3>${item.nome}</h3>
      <p>${item.descricao}</p>
      <button class="btn-text" style="margin-top:auto; align-self: flex-start;">Ver mais detalhes</button>
    </article>`).join('');
  
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
