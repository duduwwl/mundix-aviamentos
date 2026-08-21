/* Liga as fotos reais às variantes carregadas pelo Firebase, sem duplicar o catálogo. */
(function () {
  const exactVariantFolders = {
    anne: ['anne', 'webp'],
    'barroco-maxcolor': ['barroco-maxcolor', 'webp'],
    encanto: ['encanto', 'webp'],
    'meliah-premium-35': ['meliah-premium-35', 'webp'],
    'meliah-lux': ['meliah-lux', 'png'],
    'unique-3': ['unique-3', 'png'],
    'unique-5': ['unique-5', 'png'],
    'unique-8': ['unique-8', 'png']
  };
  const unavailableVariants = new Set(['unique-3|unique3-outono', 'unique-8|unique8-cookie']);
  const preferredCatalogPhotos = {
    'meliah-premium-35': 'premium35-rosa-bebe'
  };

  function attachExactVariantPhotos(catalog) {
    catalog.products.forEach(product => {
      const variantFolder = exactVariantFolders[product.id];
      if (!variantFolder || !Array.isArray(product.colors)) return;
      const [folder, extension] = variantFolder;
      product.colors = product.colors
        .filter(color => !unavailableVariants.has(`${product.id}|${color.id}`))
        .map(color => ({ ...color, image: `assets/variants/${folder}/${color.id}.${extension}` }));
      const preferred = product.colors.find(color => color.id === preferredCatalogPhotos[product.id]);
      if (preferred) product.image = preferred.image;
    });
    return catalog;
  }

  window.MundixReady = (window.MundixReady || Promise.resolve(window.Mundix)).then(attachExactVariantPhotos);
})();
