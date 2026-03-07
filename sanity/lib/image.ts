import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// Crea il builder per gli URL delle immagini
const builder = createImageUrlBuilder({ projectId, dataset })

// Funzione helper che usiamo nei componenti per ottenere l'URL
// dell'immagine con dimensioni e formato specifici
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}
