import { groq } from 'next-sanity'

// Query di tutti i progetti.
export const allProjectsQuery = groq`
  *[_type == "project"] | order(date desc) {
    _id,
    title,
    slug,
    "kind": select(kind == "series" => "series", "work"),
    year,
    description,
    mainImage
  }
`

// Query progetto singolo tramite slug.
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    "kind": select(kind == "series" => "series", "work"),
    year,
    description,
    mainImage,
    // Manteniamo sia la gallery storica sia il nuovo layout editoriale.
    gallery,
    detailLayout[]{
      _key,
      layoutType,
      side,
      text,
      primaryImage,
      zoomImage,
      secondaryImage,
      tertiaryImage,
      quaternaryImage
    }
  }
`

// Query per le impostazioni globali del sito
// [0] prende il primo (e unico) documento di tipo siteSettings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroImage,
    heroTitle,
    heroSubtitle,
  }
`

export const homePreviewCardsQuery = groq`
  *[_type == "homePreviewCard" && coalesce(enabled, true) == true] | order(order asc, _createdAt asc) {
    _id,
    image,
    previewLayout,
    project->{
      _id,
      title,
      slug,
      "kind": select(kind == "series" => "series", "work"),
      year,
      mainImage
    }
  }
`
