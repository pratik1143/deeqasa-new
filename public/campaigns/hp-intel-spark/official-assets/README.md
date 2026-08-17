# HP & Intel SPARK Program - Official Assets Placeholder

This directory is designated for housing extracted HTML, CSS, JavaScript, fonts, and images from the official **Teleperformance / HP** campaign package (`Deeqasa html.zip`).

## Integration Instructions

1. When `Deeqasa html.zip` is received from Teleperformance, extract all assets into this directory:
   `public/campaigns/hp-intel-spark/official-assets/`

2. **Security & Sanitization Checklist Before Deployment**:
   - Check raw HTML files for duplicate Google Analytics or Google Tag Manager scripts.
   - Remove hardcoded external analytics tags that could collide with GA measurement ID `G-DTLTZJ0DEH`.
   - Update any raw HTML forms to submit lead payloads to DeeQasa's API endpoint:
     `POST /api/hp-intel-spark/lead`
   - Ensure all image paths and asset links are relative or correctly pointing to `/campaigns/hp-intel-spark/official-assets/`.

3. **Lead Attribution Preservation**:
   - Ensure form submissions from the official package include the stored UTM parameters captured by `getStoredUTMAttribution()`.
