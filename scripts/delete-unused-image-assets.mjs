// Trova gli asset immagine che non hanno piu riferimenti nel dataset corrente.
// Esecuzione anteprima: npx sanity exec scripts/delete-unused-image-assets.mjs --with-user-token
// Esecuzione cancellazione: npx sanity exec scripts/delete-unused-image-assets.mjs --with-user-token -- --delete

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-06-19'})
const shouldDelete = process.argv.includes('--delete')

// `references(^._id)` conta i documenti che puntano a ciascun asset immagine.
const orphanedAssetsQuery = `
  *[_type == "sanity.imageAsset"]{
    _id,
    originalFilename,
    "refCount": count(*[references(^._id)])
  }[refCount == 0]
`

async function main() {
  const orphanedAssets = await client.fetch(orphanedAssetsQuery)

  if (orphanedAssets.length === 0) {
    console.log('Nessun asset immagine orfano trovato.')
    return
  }

  console.log(`Trovati ${orphanedAssets.length} asset immagine orfani:`)
  orphanedAssets.forEach((asset) => {
    console.log(`- ${asset._id} (${asset.originalFilename ?? 'senza nome'})`)
  })

  if (!shouldDelete) {
    console.log('')
    console.log('Anteprima completata. Per cancellarli davvero rilancia con: -- --delete')
    return
  }

  // La transaction tiene insieme la pulizia di tutti gli asset trovati.
  const transaction = client.transaction()
  orphanedAssets.forEach((asset) => {
    transaction.delete(asset._id)
  })

  await transaction.commit()
  console.log(`Eliminati ${orphanedAssets.length} asset immagine orfani.`)
}

main().catch((error) => {
  console.error('Errore durante la pulizia degli asset immagine orfani.')
  console.error(error)
  process.exit(1)
})
