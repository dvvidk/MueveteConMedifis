# Muévete a tu ritmo

Sitio educativo interactivo sobre metabolismo, quema de grasa y hábitos, para personas con sobrepeso u obesidad y sus familias.

## Estructura
- `site/`: la aplicación web (HTML, CSS y JavaScript). Es lo que se publica.
- `site/js/data.js`: hábitos y preguntas del quiz, editables sin tocar el resto.
- `python/zonas.py`: la misma fórmula de la calculadora, usable por línea de comandos.
- `tests/`: pruebas en Python que verifican la fórmula. El flujo de GitHub las corre antes de publicar.

## Publicar
1. Sube todo el contenido de esta carpeta a un repositorio (rama `main`).
2. En **Settings → Pages → Source**, elige **GitHub Actions**.
3. Cada `push` prueba y publica el sitio en `https://TU-USUARIO.github.io/NOMBRE-REPO/`.

## Videos
Guarda `.mp4` en `site/videos/` con los nombres: `caminar`, `pausa`, `escalera`, `fuerza`, `sueno`, `comida`.

## Probar en local
`cd site && python -m http.server 8000` y abre http://localhost:8000. Pruebas: `pip install pytest && pytest`.

Contenido educativo; no reemplaza atención profesional.
