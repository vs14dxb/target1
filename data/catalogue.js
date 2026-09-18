'use strict';

const categories = [
  { slug: 'paints-coatings', name: 'Paints & Coatings', description: 'Interior, exterior, wood and metal finishes from Asian Paints, Birla Opus, Berger and Indigo Paints.', image: '/assets/images/catalog/paint-v2.webp', color: 'var(--color-buttercup)', icon: 'paint', featured: true },
  { slug: 'power-tools', name: 'Power Tools', description: 'Corded and cordless tools selected for renovation, fabrication and site work.', image: '/assets/images/catalog/tools-v2.webp', color: 'var(--color-forest-ink)', icon: 'drill', featured: true },
  { slug: 'hand-tools', name: 'Hand Tools', description: 'Reliable everyday tools for preparation, fitting, repair and maintenance.', image: '/assets/images/catalog/tools-v2.webp', color: 'var(--color-wheat)', icon: 'wrench', featured: false },
  { slug: 'plumbing', name: 'Plumbing', description: 'Pipes, valves, fittings and repair essentials for domestic and project work.', image: '/assets/images/catalog/plumbing-v2.webp', color: 'var(--color-cobalt-pop)', icon: 'pipe', featured: true },
  { slug: 'electrical', name: 'Electrical', description: 'Cables, switches, sockets and distribution essentials for safe installations.', image: '/assets/images/catalog/electrical-v2.webp', color: 'var(--color-buttercup)', icon: 'switch', featured: false },
  { slug: 'fasteners', name: 'Fasteners', description: 'Screws, bolts, anchors and fixings matched to the material and load.', image: '/assets/images/catalog/fasteners-v2.webp', color: 'var(--color-stone)', icon: 'bolt', featured: false },
  { slug: 'construction-tools', name: 'Construction Tools', description: 'Measuring, masonry and finishing tools for accurate work on site.', image: '/assets/images/catalog/construction-safety-v2.webp', color: 'var(--color-terracotta)', icon: 'tape', featured: false },
  { slug: 'safety-products', name: 'Safety Products', description: 'Everyday PPE for safer preparation, painting and construction work.', image: '/assets/images/catalog/construction-safety-v2.webp', color: 'var(--color-marigold)', icon: 'helmet', featured: false },
  { slug: 'adhesives-chemicals', name: 'Adhesives & Chemicals', description: 'Sealants, bonding products and construction chemicals for durable repairs.', image: '/assets/images/catalog/building-maintenance-v2.webp', color: 'var(--color-rust)', icon: 'glue', featured: false },
  { slug: 'building-hardware', name: 'Building Hardware', description: 'Hinges, locks and handles for doors, cabinets and finishing work.', image: '/assets/images/catalog/building-maintenance-v2.webp', color: 'var(--color-olive-stone)', icon: 'hinge', featured: false },
  { slug: 'general-hardware', name: 'General Hardware', description: 'Practical workshop, maintenance and household essentials in one place.', image: '/assets/images/catalog/building-maintenance-v2.webp', color: 'var(--color-linen-blush)', icon: 'box', featured: false },
];

const products = [
  { slug: 'interior-wall-paint', categorySlug: 'paints-coatings', name: 'Interior Wall Paint', color: 'var(--color-buttercup)', icon: 'paint', shortSpec: 'Emulsions and finishes for interior walls and ceilings' },
  { slug: 'exterior-wall-paint', categorySlug: 'paints-coatings', name: 'Exterior Wall Paint', color: 'var(--color-cobalt-pop)', icon: 'paint', shortSpec: 'Weather-resistant exterior coatings and finishes' },
  { slug: 'wall-primer-putty', categorySlug: 'paints-coatings', name: 'Wall Primer & Putty', color: 'var(--color-stone)', icon: 'paint', shortSpec: 'Surface preparation for smooth, durable paintwork' },
  { slug: 'wood-metal-finishes', categorySlug: 'paints-coatings', name: 'Wood & Metal Finishes', color: 'var(--color-rust)', icon: 'paint', shortSpec: 'Enamels, wood coatings and protective finishes' },
  { slug: 'painting-tools', categorySlug: 'paints-coatings', name: 'Painting Tools & Accessories', color: 'var(--color-wheat)', icon: 'paint', shortSpec: 'Brushes, rollers, trays, tapes and preparation tools' },
  { slug: 'cordless-drill-driver', categorySlug: 'power-tools', name: 'Cordless Drill Driver', color: 'var(--color-forest-ink)', icon: 'drill', shortSpec: 'Battery-powered, variable speed' },
  { slug: 'angle-grinder', categorySlug: 'power-tools', name: 'Angle Grinder', color: 'var(--color-stone)', icon: 'drill', shortSpec: 'Corded, disc-driven cutting and grinding' },
  { slug: 'impact-wrench', categorySlug: 'power-tools', name: 'Impact Wrench', color: 'var(--color-wheat)', icon: 'drill', shortSpec: 'High-torque fastening tool' },

  { slug: 'claw-hammer', categorySlug: 'hand-tools', name: 'Claw Hammer', color: 'var(--color-wheat)', icon: 'wrench', shortSpec: 'Steel head, fibreglass handle' },
  { slug: 'adjustable-wrench-set', categorySlug: 'hand-tools', name: 'Adjustable Wrench Set', color: 'var(--color-rust)', icon: 'wrench', shortSpec: 'Multi-size set' },
  { slug: 'screwdriver-set', categorySlug: 'hand-tools', name: 'Screwdriver Set', color: 'var(--color-saffron)', icon: 'wrench', shortSpec: 'Flat and Phillips tips, multi-piece' },

  { slug: 'pvc-pipe-fittings', categorySlug: 'plumbing', name: 'PVC Pipe Fittings', color: 'var(--color-cobalt-pop)', icon: 'pipe', shortSpec: 'Elbows, tees and couplers' },
  { slug: 'ball-valve', categorySlug: 'plumbing', name: 'Ball Valve', color: 'var(--color-stone)', icon: 'pipe', shortSpec: 'Quarter-turn shutoff valve' },
  { slug: 'pipe-wrench', categorySlug: 'plumbing', name: 'Pipe Wrench', color: 'var(--color-rust)', icon: 'pipe', shortSpec: 'Adjustable jaw, heavy-duty' },

  { slug: 'modular-switch-socket', categorySlug: 'electrical', name: 'Modular Switch & Socket', color: 'var(--color-buttercup)', icon: 'switch', shortSpec: 'Modular plate-mount' },
  { slug: 'electrical-cable', categorySlug: 'electrical', name: 'Electrical Cable', color: 'var(--color-saffron)', icon: 'switch', shortSpec: 'Copper conductor, insulated' },
  { slug: 'mcb-distribution-box', categorySlug: 'electrical', name: 'MCB Distribution Box', color: 'var(--color-olive-stone)', icon: 'switch', shortSpec: 'Multi-way circuit protection enclosure' },

  { slug: 'stainless-steel-screws', categorySlug: 'fasteners', name: 'Stainless Steel Screws', color: 'var(--color-stone)', icon: 'bolt', shortSpec: 'Corrosion-resistant, multiple sizes' },
  { slug: 'hex-bolts-nuts', categorySlug: 'fasteners', name: 'Hex Bolts & Nuts', color: 'var(--color-wheat)', icon: 'bolt', shortSpec: 'Standard hex head, zinc-plated' },
  { slug: 'wall-anchors', categorySlug: 'fasteners', name: 'Wall Anchors', color: 'var(--color-linen-blush)', icon: 'bolt', shortSpec: 'Plastic expansion anchors' },

  { slug: 'concrete-trowel', categorySlug: 'construction-tools', name: 'Concrete Trowel', color: 'var(--color-terracotta)', icon: 'tape', shortSpec: 'Finishing trowel, steel blade' },
  { slug: 'spirit-level', categorySlug: 'construction-tools', name: 'Spirit Level', color: 'var(--color-olive-stone)', icon: 'tape', shortSpec: 'Aluminium body, multi-vial' },
  { slug: 'measuring-tape', categorySlug: 'construction-tools', name: 'Measuring Tape', color: 'var(--color-marigold)', icon: 'tape', shortSpec: 'Retractable, metric/imperial' },

  { slug: 'safety-helmet', categorySlug: 'safety-products', name: 'Safety Helmet', color: 'var(--color-marigold)', icon: 'helmet', shortSpec: 'Adjustable harness, site-rated' },
  { slug: 'safety-gloves', categorySlug: 'safety-products', name: 'Safety Gloves', color: 'var(--color-rose-clay)', icon: 'helmet', shortSpec: 'Cut-resistant work gloves' },
  { slug: 'safety-goggles', categorySlug: 'safety-products', name: 'Safety Goggles', color: 'var(--color-cobalt-pop)', icon: 'helmet', shortSpec: 'Anti-fog, impact-resistant lens' },

  { slug: 'silicone-sealant', categorySlug: 'adhesives-chemicals', name: 'Silicone Sealant', color: 'var(--color-rust)', icon: 'glue', shortSpec: 'General-purpose sealant cartridge' },
  { slug: 'construction-adhesive', categorySlug: 'adhesives-chemicals', name: 'Construction Adhesive', color: 'var(--color-terracotta)', icon: 'glue', shortSpec: 'High-strength bonding adhesive' },
  { slug: 'waterproofing-compound', categorySlug: 'adhesives-chemicals', name: 'Waterproofing Compound', color: 'var(--color-stone)', icon: 'glue', shortSpec: 'Cementitious waterproof coating' },

  { slug: 'door-hinges', categorySlug: 'building-hardware', name: 'Door Hinges', color: 'var(--color-olive-stone)', icon: 'hinge', shortSpec: 'Steel butt hinges' },
  { slug: 'cylindrical-lock-set', categorySlug: 'building-hardware', name: 'Cylindrical Lock Set', color: 'var(--color-forest-ink)', icon: 'hinge', shortSpec: 'Door lockset with cylinder' },
  { slug: 'cabinet-handles', categorySlug: 'building-hardware', name: 'Cabinet Handles', color: 'var(--color-saffron)', icon: 'hinge', shortSpec: 'Furniture-mount pull handles' },

  { slug: 'cable-ties-clips', categorySlug: 'general-hardware', name: 'Cable Ties & Clips', color: 'var(--color-linen-blush)', icon: 'box', shortSpec: 'Nylon ties, multiple lengths' },
  { slug: 'tool-storage-box', categorySlug: 'general-hardware', name: 'Tool Storage Box', color: 'var(--color-wheat)', icon: 'box', shortSpec: 'Multi-compartment storage case' },
  { slug: 'multi-purpose-tape', categorySlug: 'general-hardware', name: 'Multi-Purpose Tape', color: 'var(--color-stone)', icon: 'box', shortSpec: 'General-purpose adhesive tape' },
];

module.exports = { categories, products };
