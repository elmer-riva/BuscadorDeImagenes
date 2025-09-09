"use strict";

const inputEl = document.querySelector(".search_input");
const searchEl = document.querySelector(".fa-search");
const galleryContainer = document.querySelector(".image_gallery");
const btnLoad = document.querySelector(".btn_load");
const formEl = document.querySelector("form");

const API_KEY = "t-1PAyfarxTFtxPEUVK62P8ED4rZkE5FFkOou4UhJns";
let keywordSearch = "";
let page = 1;

btnLoad.style.display = "none";

const imageSizes = ["", "v_img", "h_img", "l_img"];

function getRandomSizeClass() {
  const randomIndex = Math.floor(Math.random() * imageSizes.length);
  return imageSizes[randomIndex];
}

async function searchImage() {
  const currentKeyword = inputEl.value;

  if (currentKeyword.trim() === "") {
    alert("Por favor, ingresa un término de búsqueda.");
    return;
  }

  if (page === 1) {
    keywordSearch = currentKeyword;
  }

  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keywordSearch}&client_id=${API_KEY}&per_page=12`; // Más imágenes por página para variar el grid

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    const data = await response.json();
    const results = data.results;

    if (results.length === 0 && page === 1) {
      galleryContainer.innerHTML =
        "<p style='text-align: center; width: 100%; grid-column: 1 / -1;'>No se encontraron imágenes para tu búsqueda.</p>";
      btnLoad.style.display = "none";
      return;
    } else if (results.length === 0 && page > 1) {
      btnLoad.textContent = "No hay más imágenes";
      btnLoad.disabled = true;
      return;
    }

    if (page === 1) {
      galleryContainer.innerHTML = "";
    }

    const newImagesHTML = results
      .map((result) => {
        const randomClass = getRandomSizeClass();
        return `
        <div class="${randomClass}">
          <a href="${result.links.html}" target="_blank">
            <img src="${result.urls.small}" alt="${
          result.alt_description || keywordSearch
        }" />
          </a>
        </div>
      `;
      })
      .join("");

    galleryContainer.innerHTML += newImagesHTML;

    if (data.total_pages && page < data.total_pages) {
        btnLoad.style.display = "block";
        btnLoad.textContent = "Cargar más";
        btnLoad.disabled = false;
    } else {
        btnLoad.style.display = "block";
        btnLoad.textContent = "No hay más imágenes";
        btnLoad.disabled = true;
    }


  } catch (error) {
    console.error("Falló la obtención de imágenes:", error);
    galleryContainer.innerHTML =
      "<p style='text-align: center; width: 100%; grid-column: 1 / -1;'>Ocurrió un error al cargar las imágenes. Inténtalo de nuevo.</p>";
    btnLoad.style.display = "none";
  }
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  page = 1;
  galleryContainer.innerHTML = "";
  btnLoad.style.display = "none";
  searchImage();
});

searchEl.addEventListener("click", () => {
  page = 1;
  galleryContainer.innerHTML = "";
  btnLoad.style.display = "none";
  searchImage();
});

btnLoad.addEventListener("click", () => {
  page++;
  searchImage();
});
