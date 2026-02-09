# Scavenger Hunt

This is a scavenger hunt web game designed to guide players through various locations. Players will solve clues and complete challenges at each location to progress through the game.

This application is optimized and restricted to mobile usage.

## How it Works?

The application is built using [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/), and built with [export optimization](https://nextjs.org/docs/pages/guides/static-exports) for deployment on static hosting platforms like [GitHub Pages](https://pages.github.com/).

> Some features, debugging and tests have been optimized using [GitHub Copilot](https://github.com/features/copilot) with [Claude Sonnet 4.5](https://www.anthropic.com/news/claude-sonnet-4-5) agent.

The application uses [OpenStreetMap](https://www.openstreetmap.org/) via [Leaflet](https://leafletjs.com/) and [React Leaflet](https://react-leaflet.js.org/) for interactive maps, with geocoding provided by [Nominatim](https://nominatim.openstreetmap.org/).

### Configure a Hunt

Edit the [`config.json` file](config.json) and add your own hunt and places:

```json
{
  "hunts": [
    {
      "slug": "my-own-hunt", // Unique slug identifier for the hunt (used in URLs)
      "title": "My Own Hunt", // Title of the hunt
      "coordinates": {
        // Coordinates of the starting point
        "lat": "latitude of the starting point",
        "lng": "longitude of the starting point"
      },
      "rules": "Your custom rules for the hunt. <p>It supports HTML formatting.</p>", // Rules of the hunt
      "manuscript": "Your custom manuscript or story for the hunt. <p>It supports HTML formatting.</p>", // Manuscript or story of the hunt
      "phrase": "The complete phrase to complete the hunt.", // The complete phrase to complete the hunt
      "defaultKeywods": ["phrase", "to"], // Default keywords when starting the hunt
      "places": [
        {
          "name": "A location", // Name of the location
          "description": "Description of the location. <p>It supports HTML formatting.</p>", // Description of the location
          "coordinates": {
            // Coordinates of the location
            "lat": "latitude of the location",
            "lng": "longitude of the location"
          },
          "coordinateMargin": 0.0005, // Optional: Margin of error for coordinate proximity check (in degrees, ~111m per 0.001 at equator). Default is 0.001 (~111m)
          "item": { // Action or clue at the location (the image will be displayed after the location description)
            "type": "item-type",
            "options": {
              // Item options
            }
          }
        },
        {
          "name": "Another location",
          "description": "Description of the location. <p>It supports HTML formatting.</p>",
          "coordinates": {
            "lat": "latitude of the location",
            "lng": "longitude of the location"
          },
          "coordinateMargin": 0.0007, // Optional: Margin of error for coordinate proximity check (in degrees, ~111m per 0.001 at equator). Default is 0.001 (~111m)
          "item": {
            "type": "item-type",
            "options": {
              // Item options
            }
          }
        }
        // ... more places
      ]
    }
    // ... more hunts
  ]
}
```

The application supports the following items:

#### Clickable Image

An image with clickable areas that trigger actions when clicked.

```json
{
  "type": "clickable-image",
  "options": {
    "image": "/assets/my-own-hunt/club/image.png", // Path to the image
    "debug": false, // Enable debug mode to see clickable areas
    "clickableAreas": [
      {
        // Position of the clickable area
        "bottom": "10%",
        "left": "10%",
        "width": "12%",
        "height": "12%",
        "action": {
          // An action with options: keyword, another clue, etc.
        }
      },
      {
        // Position of the clickable area
        "top": "33%",
        "right": "10%",
        "width": "20%",
        "height": "48%",
        "action": {
          // Another action with options: keyword, another clue, etc.
        }
      }
      // ... more clickable areas
    ]
  }
}
```

#### Image

An image without any action nor clickable area.

```json
{
  "type": "image",
  "options": {
    "image": "/assets/my-own-hunt/image.png"
  }
}
```

#### Scratch Card

An image with scratchable area that reveals a hidden message or clue when scratched.

```json
{
  "type": "scratch-card",
  "options": {
    "image": "/assets/my-own-hunt/image.png", // Path to the scratchable image
    "width": 340, // Width of the scratch card
    "height": 380, // Height of the scratch card
    "scratchableAreas": [
      {
        // Position of the scratchable area
        "top": "45%",
        "right": "15%",
        "width": "10%",
        "height": "20%",
        "text": "Place aux Oignons" // Text revealed when scratched
      },
      {
        // Position of the scratchable area
        "bottom": "15%",
        "left": "15%",
        "width": "12%",
        "height": "15%",
        "text": "Lorem", // Text revealed when scratched
        "keyword": true // Whether this text is a keyword to collect
      }
      // ... more scratchable areas
    ]
  }
}
```

#### Card Flip

An image that can be flipped to reveal another image on the back.

```json
{
  "type": "card-flip",
  "options": {
    "front": "/assets/my-own-hunt/front.png", // Path to the front face
    "back": "/assets/my-own-hunt/back.jpg" // Path to the back face
  }
}
```

#### Page Flip

A book with pages that can be flipped to reveal content on the back.

```json
{
  "type": "page-flip",
  "options": {
    "image": "/assets/my-own-hunt/books.png", // Path of an image of books
    "pages": [
      // A page with HTML content
      {
        "text": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Pellentesque bibendum mauris in malesuada congue. Donec ultrices ipsum tortor, id sollicitudin eros gravida eu. Etiam</p>"
      },
      // ... more pages with HTML content
      // A page with {keyword}XXX{/keyword} tag
      {
        "text": "<p>libero lacinia gravida <strong>{keyword}Lorem{/keyword}</strong> (click me!).</p><p>Vivamus dignissim velit ac nunc faucibus, in tristique urna posuere. Aenean commodo augue nec mauris ultricies blandit. Proin vel ligula eu ligula vestibulum</p>"
      },
      // ... more pages with HTML content
    ]
  }
}
```

#### Three Fiber

A box with a 3D model that can be rotated.

```json
{
  "type": "three-fiber",
  "options": {
    "image": "/assets/my-own-hunt/box.png", // Path to the box image
    "textures": [
      // Each face of the 3D box may reveal a keyword or a text
      "/assets/my-own-hunt/textures/right.png", // Path to the right face texture
      "/assets/my-own-hunt/textures/left.png", // Path to the left face texture
      "/assets/my-own-hunt/textures/top.png", // Path to the top face texture
      "/assets/my-own-hunt/textures/bottom.png", // Path to the bottom face texture
      "/assets/my-own-hunt/textures/front.png", // Path to the front face texture
      "/assets/my-own-hunt/textures/background.png" // Path to the background face texture
    ],
    "keyword": "Lorem" // Keyword revealed on one of the faces
  }
}
```

#### Magnifier

An image with a magnifying glass that reveals hidden details when hovered over.

```json
{
  "type": "magnifier",
  "options": {
    "image": "/assets/my-own-hunt/image.jpg", // Path to the image
    "keyword": "Lorem", // Keyword revealed with the magnifier
    "keywordPosition": {"x": 130, "y": 440} // Position of the keyword in pixels
  }
}
```

#### Keyword

A clickable keyword that can be collected directly.

```json
{
  "type": "keyword",
  "options": {
    "keyword": "Lorem", // The keyword to collect
    "debug": false // Enable debug mode to highlight the keyword
  }
}
```

### Run Locally

### Run Locally

Install the dependencies and run the development server:

```bash
npm install
npm run dev
```

Application is available at [http://localhost:3000](http://localhost:3000).

### CI

This project includes [GitHub Actions workflows](https://docs.github.com/actions/using-workflows/about-workflows) to test the application with [Playwright](https://playwright.dev/) on the following devices:

* Mobile Chrome (Galaxy S24)
* Mobile Firefox (Galaxy S24)
* Mobile Safari (iPhone 15 and iPhone SE (3rd gen))

### Deploy on GitHub Pages

Go to "_Actions_" repository tab and run the workflow named "_Deploy Next.js site to Pages_" to deploy the application to GitHub Pages.

### Undeploy from GitHub Pages

Go to "Actions" repository tab and run the workflow named "_Undeploy from GitHub Pages_" to remove the application from GitHub Pages.

## Config Validation

The `config.json` file is **automatically validated using [Zod](https://zod.dev/)** to ensure data integrity and prevent errors.

### Validate your config

Before committing changes to `config.json`, you can validate it manually:

```bash
npm run validate:config
```

This will check:
- ✅ All required fields are present
- ✅ Data types are correct (strings, numbers, URLs, etc.)
- ✅ Item types are valid
- ✅ Structure matches the expected schema

### Automatic validation

The validation happens automatically:
1. **During build** - `npm run build` will fail if config is invalid
2. **At runtime** - The app won't start with an invalid config
3. **Manual check** - Use `npm run validate:config` anytime

### Example error output

If you have an error in your config, you'll see:

```
❌ Error validating config.json file:

1. hunts → 0 → coordinates → lat
   Invalid input: expected number, received string

Total: 1 error(s) detected

💡 Check the structure and types in config.json
```

## License

This application is licensed under the [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) License.

## Credits

This application uses the following open-source libraries and resources:

* [Next.js](https://nextjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Zod](https://zod.dev/)
* [React Components](https://www.reactcomponents.com/)
* [Playwright](https://playwright.dev/)
* [GitHub Copilot](https://github.com/features/copilot)
* [OpenStreetMap](https://www.openstreetmap.org/) and [OpenStreetMap Contributors](https://www.openstreetmap.org/copyright)
* [Leaflet](https://leafletjs.com/)
* [React Leaflet](https://react-leaflet.js.org/)
* [Leaflet GeoSearch](https://github.com/smeijer/leaflet-geosearch)
* [Nominatim](https://nominatim.openstreetmap.org/)
* [Fontsource](https://fontsource.org/) - Open source fonts:
  * [Geist Sans](https://vercel.com/font) (Vercel)
  * [Geist Mono](https://vercel.com/font) (Vercel)
  * [Cinzel](https://fonts.google.com/specimen/Cinzel) (Natanael Gama)
  * [Crimson Text](https://fonts.google.com/specimen/Crimson+Text) (Sebastian Kosch)
  * [Dancing Script](https://fonts.google.com/specimen/Dancing+Script) (Impallari Type)
* [Aaron Wong - React Card Flip](https://github.com/AaronCCWong/react-card-flip)
* [Josh Mc Farlin - React Looking Glass](https://github.com/Josh-McFarlin/react-looking-glass)
* [Oleg Nodlik - React Page Flip](https://github.com/Nodlik/react-pageflip)
* [Shudhanshu Gunjal - React Scratch Card](https://github.com/gshudhanshu/react-scratchcard-v4)
* [Poimandres - React Three Fiber](https://github.com/pmndrs/react-three-fiber)

All other credits belong to [Vincent CHALAMON](https://github.com/vincentchalamon) for the original idea, design and developments of the application.
