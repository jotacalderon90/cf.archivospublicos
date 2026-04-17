(function() {
  function initFlexResizers() {
    // Buscar todos los elementos que actúen como resizer
    const resizers = document.querySelectorAll('.resizer');

    resizers.forEach((resizer, index) => {
      // Por defecto, asume que el panel a redimensionar es el elemento anterior (el sidebar).
      // Se puede sobrescribir usando data-target="#mi-sidebar"
      const targetSelector = resizer.getAttribute('data-target');
      const targetPanel = targetSelector ? document.querySelector(targetSelector) : resizer.previousElementSibling;

      if (!targetPanel) return;

      // Es posible configurar estos valores usando atributos data-* en el HTML
      const minWidth = parseInt(resizer.getAttribute('data-min-width') || '120', 10);
      const maxWidth = parseInt(resizer.getAttribute('data-max-width') || '600', 10);
      const collapsedWidth = parseInt(resizer.getAttribute('data-collapsed-width') || '10', 10);
      
      // Clave para localStorage, usa un ID si lo tiene o el índice para hacerla única
      const storageKey = resizer.getAttribute('data-storage-key') || ('flexResizerWidth_' + (targetPanel.id || index));

      let isResizing = false;
      let lastWidth = parseInt(targetPanel.style.width || '300', 10);

      const onBlur = () => {
        if (isResizing) {
          isResizing = false;
          document.body.classList.remove('resizing');
        }
      };

      window.addEventListener('blur', onBlur);

      resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isResizing = true;
        document.body.classList.add('resizing');
      });

      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        // Calculamos el ancho relativo midiendo desde el inicio del panel
        const targetRect = targetPanel.getBoundingClientRect();
        let newWidth = e.clientX - targetRect.left;

        if (newWidth <= minWidth) {
          // Colapsar
          targetPanel.classList.add('resizer-collapsed');
          targetPanel.style.width = collapsedWidth + 'px';
        } else {
          // Expandir
          targetPanel.classList.remove('resizer-collapsed');

          if (newWidth > maxWidth) {
            newWidth = maxWidth;
          }

          targetPanel.style.width = newWidth + 'px';
          lastWidth = newWidth;

          localStorage.setItem(storageKey, newWidth);
        }
      });

      document.addEventListener('mouseup', () => {
        if (isResizing) {
          isResizing = false;
          document.body.classList.remove('resizing');
        }
      });
      
      // Click en el panel colapsado para expandirlo al tamaño anterior
      targetPanel.addEventListener('click', () => {
        if (targetPanel.classList.contains('resizer-collapsed')) {
          targetPanel.classList.remove('resizer-collapsed');

          const savedWidth = localStorage.getItem(storageKey);
          const width = savedWidth ? parseInt(savedWidth, 10) : lastWidth;

          targetPanel.style.width = width + 'px';
        }
      });
      
      // Restaurar el ancho guardado la primera vez que se renderiza
      const savedWidth = localStorage.getItem(storageKey);
      if (savedWidth) {
        lastWidth = parseInt(savedWidth, 10);
        targetPanel.style.width = lastWidth + 'px';
        
        if (lastWidth <= minWidth) { // Si quedó colapsado la última vez
          targetPanel.classList.add('resizer-collapsed');
          targetPanel.style.width = collapsedWidth + 'px';
        } else {
          targetPanel.classList.remove('resizer-collapsed');
        }
      }
    });
  }

  // Auto-iniciar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlexResizers);
  } else {
    initFlexResizers();
  }

  // Guardar en window por si el proyecto recarga el DOM dinámicamente (ej. Vue/React)
  // y se necesita volver a adjuntar los eventos llamando a window.FlexResizer.init()
  window.FlexResizer = {
    init: initFlexResizers
  };

})();
