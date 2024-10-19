// Constantes y variables globales
const canvas = new fabric.Canvas('canvas');
const canvasContainer = document.getElementById('canvasContainer');
const presentation = document.getElementById('presentation');
let currentSelectorImage = null;

// Elementos del DOM
const elements = {
  fileInput: document.getElementById('baseImageUpload'),
  dropZone: document.getElementById('dropZone'),
  imageSelector: document.getElementById('imageSelector'),
  downloadBtn: document.getElementById('downloadBtn'),
  resetBtn: document.getElementById('resetBtn')
};

// Funciones principales
function resizeCanvas() {
  canvas.setDimensions({
    width: canvasContainer.offsetWidth,
    height: canvasContainer.offsetHeight
  });
  canvas.renderAll();
}

function loadImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    fabric.Image.fromURL(e.target.result, (img) => {
      canvas.clear();
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height
      });
      elements.imageSelector.classList.remove('disabled');
      presentation.classList.add('hidden');
    });
  };
  reader.readAsDataURL(file);
}

function addImageToCanvas(imageSrc) {
    if (!canvas.backgroundImage) {
        alert('Please load a base image first.');
        return;
      }
  if (currentSelectorImage) {
    canvas.remove(currentSelectorImage);
  }
  fabric.Image.fromURL(imageSrc, (img) => {
    img.scaleToWidth(100);
    img.set({
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: 'center',
      originY: 'center'
    });
    currentSelectorImage = img;
    canvas.add(img).setActiveObject(img);
  });
}

function downloadCanvas() {
  const link = document.createElement('a');
  link.href = canvas.toDataURL({ format: 'png', quality: 1 });
  link.download = 'runes_rocks_Image.png';
  link.click();
}

function resetCanvas() {
  canvas.clear();
  presentation.classList.remove('hidden');
  currentSelectorImage = null;
  elements.imageSelector.classList.add('disabled');
}
let warningTimeout;

function showWarning() {
    clearTimeout(warningTimeout);
    const warning = document.getElementById('imageSelectorWarning');
    warning.classList.remove('hidden');
    warning.classList.add('fade-in');
    warning.classList.remove('fade-out');
    
    warningTimeout = setTimeout(() => {
        warning.classList.remove('fade-in');
        warning.classList.add('fade-out');
        setTimeout(() => {
            warning.classList.add('hidden');
        }, 500); // Duración de la animación de desvanecimiento
    }, 3000); // Duración de la advertencia visible
}
// Event listeners
function setupEventListeners() {
    elements.imageSelector.addEventListener('click', (e) => {
        if (elements.imageSelector.classList.contains('disabled')) {
            showWarning();
            return;
        }
        const button = e.target.closest('button');
        if (button) {
            const imageSrc = button.getAttribute('data-image-src');
            if (imageSrc) addImageToCanvas(imageSrc);
        }
    });

  elements.fileInput.addEventListener('change', (e) => {
    if (e.target.files?.[0]) loadImage(e.target.files[0]);
  });

  elements.dropZone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    e.stopPropagation();
    elements.dropZone.classList.add('dragover');
  });

  elements.dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    elements.dropZone.classList.remove('dragover');
  });

  elements.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    elements.dropZone.classList.add('dragover');
  });

  elements.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    elements.dropZone.classList.remove('dragover');
    if (e.dataTransfer.files?.[0]) loadImage(e.dataTransfer.files[0]);
  });

  elements.downloadBtn.addEventListener('click', downloadCanvas);
  elements.resetBtn.addEventListener('click', resetCanvas);

  window.addEventListener('resize', resizeCanvas);
}

// Inicialización
function init() {
  setupEventListeners();
  resizeCanvas();
}

init();