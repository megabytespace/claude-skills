---
name: "image-profiling"
description: "GPT-4o vision batch profiling for AI build pipelines — scores, placement, alt text, colors"
updated: "2026-04-24"
---

# GPT-4o Vision Image Profiling

Bridge between visual assets and text-only AI builders. Profile every candidate image BEFORE the build so the builder makes informed placement decisions without seeing images.

## Architecture
Batch 5 images per GPT-4o call (multi-image vision). Process 3 batches parallel = 15 images/round. Max 60 images in 4 rounds ≈ 90s. Cost: ~$0.01-0.02/image.

## Profile Schema
```json
{
  "name": "hero-storefront.webp",
  "url": "https://r2.example.com/assets/hero-storefront.webp",
  "source": "discovered|generated|scraped|uploaded",
  "description": "Warm interior shot of a busy coffee shop with exposed brick walls",
  "keywords": ["coffee", "interior", "warm", "cozy", "brick"],
  "quality_score": 8,
  "relevance_score": 9,
  "suggested_placement": "hero|about|services|gallery|team|testimonials|background",
  "alt_text": "Interior of Main Street Coffee with customers at wooden tables",
  "dominant_colors": ["#8B4513", "#F5F5DC", "#2F4F4F"]
}
```

## System Prompt Pattern
```
You are an expert visual curator for professional websites. For each image:
1. Describe what's in it (2 sentences max)
2. Rate quality 1-10 (composition, lighting, resolution, professionalism)
3. Rate relevance 1-10 (how well it fits a {business_type} website)
4. Suggest ONE placement: hero|about|services|gallery|team|testimonials|background
5. Write descriptive alt text (SEO-friendly, includes business context)
6. Extract 3-5 dominant hex colors
Return JSON array matching the profile schema.
```

## Top-Pick Selection Algorithm
1. Sort by `quality_score * 0.4 + relevance_score * 0.6` descending
2. Hero: highest combined score, prefer wide/landscape, quality≥7
3. Logo: source=uploaded|discovered with "logo" in name/description, else generated
4. About: top 3 by relevance with "interior"|"team"|"story" keywords
5. Services: top 3 matching service-related keywords
6. Gallery: remaining images quality≥6, deduplicated by dominant_colors similarity

## Integration with Build Pipelines
Pre-container: collect 50-100 candidate images from all APIs → batch profile → select top picks → write `_image_profiles.json` as context file. Builder reads profiles, uses every top-pick in its suggested placement. Alt text pre-written. No guessing, no vision needed in build step.

## Cost Management
5 images/call × $0.01-0.02 per image. 60 images = $0.60-1.20. Skip duplicates (hash-based dedup before profiling). Skip images <100px or >5MB. Timeout: 30s per batch call, 90s total phase.
