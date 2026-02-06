# Creating PWA Icons

The app requires two icon files for PWA functionality:
- `public/icon-192.png` (192x192 pixels)
- `public/icon-512.png` (512x512 pixels)

## Quick Options:

1. **Use an online icon generator:**
   - Visit https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
   - Upload a square image (at least 512x512)
   - Download the generated icons

2. **Create simple placeholder icons:**
   - Use any image editor to create square images with the text "Habit OS" or a simple habit tracker icon
   - Save as PNG files with the required dimensions

3. **For development:**
   - You can temporarily use any square images renamed to `icon-192.png` and `icon-512.png`
   - The app will work without them, but PWA installation won't show a proper icon

## Recommended Design:
- Simple, recognizable icon
- Works well at small sizes
- Represents habits/tracking (e.g., checkmark, calendar, or progress circle)
