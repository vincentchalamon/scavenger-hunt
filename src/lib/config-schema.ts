import { z } from 'zod';

// Schema for coordinates
const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

// Schema for keyword type actions
const keywordActionSchema = z.object({
  type: z.literal('keyword'),
  options: z.object({
    keyword: z.string(),
    debug: z.boolean().optional(),
  }),
});

// Schema for image type actions
const imageActionSchema = z.object({
  type: z.literal('image'),
  options: z.object({
    image: z.string(),
  }),
});

// Schema for magnifier type actions
const magnifierActionSchema = z.object({
  type: z.literal('magnifier'),
  options: z.object({
    image: z.string(),
  }),
});

// Schema for card-flip type actions
const cardFlipActionSchema = z.object({
  type: z.literal('card-flip'),
  options: z.object({
    front: z.string(),
    back: z.string(),
  }),
});

// Union de toutes les actions possibles
const actionSchema = z.union([
  keywordActionSchema,
  imageActionSchema,
  magnifierActionSchema,
  cardFlipActionSchema,
]);

// Schema for clickable areas
const clickableAreaSchema = z.object({
  top: z.string().optional(),
  bottom: z.string().optional(),
  left: z.string().optional(),
  right: z.string().optional(),
  width: z.string(),
  height: z.string(),
  action: actionSchema,
});

// Schema for clickable-image type item
const clickableImageItemSchema = z.object({
  type: z.literal('clickable-image'),
  options: z.object({
    image: z.string(),
    debug: z.boolean().optional(),
    clickableAreas: z.array(clickableAreaSchema),
  }),
});

// Schema for scratchable areas
const scratchableAreaSchema = z.object({
  top: z.string().optional(),
  bottom: z.string().optional(),
  left: z.string().optional(),
  right: z.string().optional(),
  width: z.string(),
  height: z.string(),
  text: z.string(),
  keyword: z.boolean().optional(),
});

// Schema for scratch-card type item
const scratchCardItemSchema = z.object({
  type: z.literal('scratch-card'),
  options: z.object({
    image: z.string(),
    width: z.number(),
    height: z.number(),
    scratchableAreas: z.array(scratchableAreaSchema),
  }),
});

// Schema for page-flip pages
const pageSchema = z.object({
  text: z.string(),
});

// Schema for page-flip type item
const pageFlipItemSchema = z.object({
  type: z.literal('page-flip'),
  options: z.object({
    image: z.string(),
    pages: z.array(pageSchema),
  }),
});

// Schema for three-fiber type item
const threeFiberItemSchema = z.object({
  type: z.literal('three-fiber'),
  options: z.object({
    image: z.string(),
    textures: z.array(z.string()),
    keyword: z.string(),
  }),
});

// Schema for magnifier type item
const magnifierItemSchema = z.object({
  type: z.literal('magnifier'),
  options: z.object({
    image: z.string(),
    keyword: z.string(),
    keywordPosition: z.object({
      x: z.number(),
      y: z.number(),
    }),
  }),
});

// Union of all possible item types
const itemSchema = z.union([
  clickableImageItemSchema,
  scratchCardItemSchema,
  pageFlipItemSchema,
  threeFiberItemSchema,
  magnifierItemSchema,
]);

// Schema for a place
const placeSchema = z.object({
  name: z.string(),
  description: z.string(),
  link: z.string().url().optional(),
  coordinates: coordinatesSchema,
  coordinateMargin: z.number().positive().optional(), // Margin of error for coordinate proximity check
  item: itemSchema.optional(),
});

// Schema for a hunt
const huntSchema = z.object({
  slug: z.string(),
  name: z.string(),
  lang: z.string().optional(), // Language code (e.g., "fr", "en") or language name
  description: z.string().optional(), // Short description of the hunt
  duration: z.string().optional(), // Estimated duration (e.g., "~2h", "1h30")
  coordinates: coordinatesSchema,
  debug: z.boolean().optional(),
  rules: z.string().optional(), // Deprecated: rules are now in translations
  manuscript: z.string(),
  phrase: z.string(),
  defaultKeywords: z.array(z.string()).optional(),
  places: z.array(placeSchema),
});

// Schema for the complete configuration
export const configSchema = z.object({
  hunts: z.array(huntSchema),
});

