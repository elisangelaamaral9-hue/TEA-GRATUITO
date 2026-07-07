let data = [];
const resultsContainer = document.getElementById("results");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const filterInput = document.getElementById("filterInput");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const toTop = document.getElementById("toTop");
const suggestForm = document.getElementById("suggestForm");
const chips = document.querySelectorAll(".chip");
let activeCategory = "";
/* ===========================
CARREGAR DADOS DO JSON
=========================== */
async function loadData() {
try {
const response = await fetch("./date.json");
if (!response.ok) {
throw new Error(`Erro ${response.status}`);
}
data = await response.json();
render(data);
updateCounter();
updateMapMarkers(data);
} catch (error) {
console.error("Erro ao carregar o date.json:", error);
if (resultsContainer) {
resultsContainer.innerHTML = `
<p class="empty-message">
Não foi possível carregar os dados. Verifique se o arquivo date.json está na raiz do
projeto.
</p>
`;
}
}
}
/* ===========================
RENDERIZAÇÃO DOS CARDS
=========================== */
function render(list = data) {
if (!resultsContainer) return;
resultsContainer.innerHTML = list.map(item => `
<article class="card reveal">
<span class="tag-soft">${item.categoria || "Serviço"}</span>
<h3>${item.nome || "Nome não informado"}</h3>
<p>${item.descricao || "Descrição não informada."}</p>
${item.contato ? `<p><strong>Contato:</strong> ${item.contato}</p>` : ""}
${item.endereco ? `<p><strong>Endereço:</strong> ${item.endereco}</p>` : ""}
${item.link ? `
<a
href="${item.link}"
target="_blank"
rel="noopener noreferrer"
class="btn-text details-link"
style="margin-top:auto; align-self:flex-start;"
aria-label="Ver mais detalhes sobre ${item.nome}"
>
Ver mais detalhes
</a>
` : ""}
</article>
`).join("");
if (resultCount) {
resultCount.textContent =
`${list.length} ${list.length === 1 ? "resultado encontrado" : "resultados encontrados"}`
;
}
if (emptyState) {
emptyState.style.display = list.length ? "none" : "block";
}
observeReveal();
}
/* ===========================
FILTROS E BUSCA
=========================== */
function getFilteredData(query = "", category = "") {
const normalizedQuery = query.toLowerCase().trim();
const normalizedCategory = category.toLowerCase().trim();
return data.filter(item => {
const nome = (item.nome || "").toLowerCase();
const categoria = (item.categoria || "").toLowerCase();
const descricao = (item.descricao || "").toLowerCase();
const endereco = (item.endereco || "").toLowerCase();
const contato = (item.contato || "").toLowerCase();
const matchesQuery =
!normalizedQuery ||
nome.includes(normalizedQuery) ||
categoria.includes(normalizedQuery) ||
descricao.includes(normalizedQuery) ||
endereco.includes(normalizedQuery) ||
contato.includes(normalizedQuery);
const matchesCategory =
!normalizedCategory || categoria.includes(normalizedCategory);
return matchesQuery && matchesCategory;
});
}
function applyFilters() {
const query = searchInput?.value || filterInput?.value || "";
const filtered = getFilteredData(query, activeCategory);
render(filtered);
updateActiveChip(activeCategory);
updateMapMarkers(filtered);
}
if (filterInput && searchInput) {
[filterInput, searchInput].forEach(input => {
input.addEventListener("input", e => {
const value = e.target.value;
filterInput.value = value;
searchInput.value = value;
applyFilters();
});
});
}
chips.forEach(chip => {
chip.addEventListener("click", () => {
const selected = chip.dataset.filter || "";
activeCategory = activeCategory === selected ? "" : selected;
applyFilters();
});
});
if (clearBtn) {
clearBtn.addEventListener("click", () => {
activeCategory = "";
if (filterInput) filterInput.value = "";
if (searchInput) searchInput.value = "";
applyFilters();
});
}
function updateActiveChip(category) {
chips.forEach(chip => {
const isActive = chip.dataset.filter === category;
chip.classList.toggle("active", isActive);
chip.setAttribute("aria-pressed", isActive ? "true" : "false");
});
}
/* ===========================
FORMULÁRIO DE SUGESTÃO
=========================== */
if (suggestForm) {
suggestForm.addEventListener("submit", e => {
e.preventDefault();
alert("Recebemos sua indicação com muito carinho! Vamos analisar os dados em breve.");
suggestForm.reset();
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
if (accessibilityBtn && accessibilityPanel) {
accessibilityBtn.addEventListener("click", () => {
accessibilityPanel.classList.toggle("active");
const isOpen = accessibilityPanel.classList.contains("active");
accessibilityBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
});
document.addEventListener("click", e => {
if (
!accessibilityPanel.contains(e.target) &&
!accessibilityBtn.contains(e.target)
) {
accessibilityPanel.classList.remove("active");
accessibilityBtn.setAttribute("aria-expanded", "false");
}
});
}
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
salvarPreferencias();
}
});
}
if (decreaseFont) {
decreaseFont.addEventListener("click", () => {
if (fontSize > 80) {
fontSize -= 10;
document.documentElement.style.fontSize = fontSize + "%";
salvarFonte();
salvarPreferencias();
}
});
}
function salvarPreferencias() {
const preferencias = {
dark: body.classList.contains("dark"),
contrast: body.classList.contains("contrast"),
reading: body.classList.contains("reading"),
fontSize
};
localStorage.setItem("teaPreferencias", JSON.stringify(preferencias));
}
function carregarPreferencias() {
const preferencias = JSON.parse(localStorage.getItem("teaPreferencias"));
if (!preferencias) return;
if (preferencias.dark) body.classList.add("dark");
if (preferencias.contrast) body.classList.add("contrast");
if (preferencias.reading) body.classList.add("reading");
if (preferencias.fontSize) {
fontSize = preferencias.fontSize;
document.documentElement.style.fontSize = fontSize + "%";
}
}
if (darkMode) {
darkMode.addEventListener("click", () => {
body.classList.toggle("dark");
salvarPreferencias();
});
}
if (contrastMode) {
contrastMode.addEventListener("click", () => {
body.classList.toggle("contrast");
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
/* ===========================
CONTADOR
=========================== */
function updateCounter() {
document.querySelectorAll("[data-target]").forEach(el => {
const target = el.dataset.target === "0" ? data.length : Number(el.dataset.target) || 0;
let count = 0;
const speed = 20;
const increment = Math.max(1, Math.ceil(target / speed));
const updateCount = () => {
if (count < target) {
count = Math.min(count + increment, target);
el.textContent = count;
setTimeout(updateCount, 50);
} else {
el.textContent = target;
}
};
updateCount();
});
}
/* ===========================
SCROLL REVEAL
=========================== */
let revealObserver;
function observeReveal() {
if (revealObserver) {
revealObserver.disconnect();
}
const observerOptions = {
threshold: 0.1,
rootMargin: "0px 0px -50px 0px"
};
revealObserver = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add("visible");
}
});
}, observerOptions);
document.querySelectorAll(".reveal").forEach(el => {
revealObserver.observe(el);
});
}
/* ===========================
BOTÃO VOLTAR AO TOPO
=========================== */
if (toTop) {
window.addEventListener("scroll", () => {
toTop.classList.toggle("show", window.scrollY > 600);
});
toTop.addEventListener("click", () => {
window.scrollTo({
top: 0,
behavior: "smooth"
});
});
}
/* ===========================
MAPA LEAFLET
=========================== */
let map;
let markersLayer;
function initMap() {
const mapElement = document.getElementById("map");
if (!mapElement || typeof L === "undefined") return;
map = L.map("map").setView([-23.55052, -46.633308], 11);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
attribution: "© OpenStreetMap"
}).addTo(map);
markersLayer = L.layerGroup().addTo(map);
setTimeout(() => {
map.invalidateSize();
}, 300);
}
function updateMapMarkers(list = data) {
if (!map || !markersLayer) return;
markersLayer.clearLayers();
const placesWithLocation = list.filter(item =>
typeof item.lat === "number" &&
typeof item.lng === "number"
);
placesWithLocation.forEach(item => {
L.marker([item.lat, item.lng])
.addTo(markersLayer)
.bindPopup(`
<strong>${item.nome}</strong><br>
${item.categoria || ""}<br>
${item.endereco || ""}
`);
});
if (placesWithLocation.length) {
const bounds = placesWithLocation.map(item => [item.lat, item.lng]);
map.fitBounds(bounds, { padding: [30, 30] });
}
}
/* ===========================
INICIAR SITE
=========================== */
document.addEventListener("DOMContentLoaded", () => {
initMap();
loadData();
})
