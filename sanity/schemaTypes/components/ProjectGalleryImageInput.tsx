'use client'

import {useMemo} from 'react'
import {Box, Button, Card, Flex, Grid, Stack, Text} from '@sanity/ui'
import {PatchEvent, set, unset, type ObjectInputProps, useFormValue} from 'sanity'
import {urlFor} from '../../lib/image'

type SanityImageValue = {
  _type?: 'image'
  asset?: {
    _type?: 'reference'
    _ref?: string
  }
  crop?: {
    _type?: 'sanity.imageCrop'
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
  hotspot?: {
    _type?: 'sanity.imageHotspot'
    x?: number
    y?: number
    height?: number
    width?: number
  }
}

type ProjectDocumentValue = {
  gallery?: SanityImageValue[]
  detailLayout?: Array<{
    _key?: string
    primaryImage?: SanityImageValue
    secondaryImage?: SanityImageValue
    tertiaryImage?: SanityImageValue
    quaternaryImage?: SanityImageValue
  }>
}

type PathSegment = string | number | {_key?: string}

// Normalizza l'immagine scelta dalla gallery nel formato atteso da un campo `image`.
function cloneGalleryImage(image: SanityImageValue): SanityImageValue {
  return {
    _type: 'image',
    asset: image.asset
      ? {
          _type: 'reference',
          _ref: image.asset._ref,
        }
      : undefined,
    crop: image.crop,
    hotspot: image.hotspot,
  }
}

// Permette di scegliere solo tra le immagini gia presenti nella gallery del progetto.
export default function ProjectGalleryImageInput(props: ObjectInputProps<SanityImageValue>) {
  const documentValue = useFormValue([]) as ProjectDocumentValue | undefined
  const currentRowKey = useMemo(() => {
    const keyedSegment = (props.path as PathSegment[]).find(
      (segment): segment is {_key?: string} =>
        typeof segment === 'object' && segment !== null && '_key' in segment,
    )

    return keyedSegment?._key
  }, [props.path])
  const gallery = useMemo(
    () =>
      (documentValue?.gallery ?? []).filter(
        (image): image is SanityImageValue => Boolean(image?.asset?._ref),
      ),
    [documentValue?.gallery],
  )
  const usedAssetRefs = useMemo(() => {
    const refs = new Set<string>()

    ;(documentValue?.detailLayout ?? []).forEach((row) => {
      if (row._key === currentRowKey) return

      ;[row.primaryImage, row.secondaryImage, row.tertiaryImage, row.quaternaryImage].forEach((image) => {
        const assetRef = image?.asset?._ref
        if (assetRef) refs.add(assetRef)
      })
    })

    return refs
  }, [currentRowKey, documentValue?.detailLayout])
  const selectedRef = props.value?.asset?._ref

  // Aggiorna il campo copiando asset e hotspot dalla gallery invece di aprire il media picker globale.
  const handleSelect = (image: SanityImageValue) => {
    props.onChange(PatchEvent.from(set(cloneGalleryImage(image))))
  }

  // Rimuove la scelta corrente quando la riga editoriale va svuotata o cambiata.
  const handleClear = () => {
    props.onChange(PatchEvent.from(unset()))
  }

  if (gallery.length === 0) {
    return (
      <Card padding={3} radius={2} tone="caution" border>
        <Stack space={2}>
          <Text size={1} weight="medium">
            Nessuna immagine disponibile
          </Text>
          <Text size={1}>
            Aggiungi prima le immagini nel campo "Galleria immagini", poi potrai riutilizzarle qui.
          </Text>
        </Stack>
      </Card>
    )
  }

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} tone="transparent" border>
        <Stack space={3}>
          <Flex align="center" justify="space-between" gap={3} wrap="wrap">
            <Stack space={2} flex={1}>
              <Text size={1} weight="medium">
                Seleziona dalla gallery del progetto
              </Text>
              <Text size={1} muted>
                Questo campo puo usare solo immagini gia presenti nella galleria sopra.
              </Text>
            </Stack>
            {selectedRef ? (
              <Button mode="ghost" text="Rimuovi selezione" onClick={handleClear} />
            ) : null}
          </Flex>
          <Text size={1} muted>
            Le immagini gia usate in altre righe editoriali sono marcate con "Gia usata".
          </Text>

          <Grid columns={[2, 3, 4]} gap={3}>
            {gallery.map((image, index) => {
              const assetRef = image.asset?._ref
              if (!assetRef) return null

              const previewUrl = urlFor(image).width(500).height(700).fit('crop').quality(84).url()
              const isSelected = selectedRef === assetRef
              const isUsedElsewhere = usedAssetRefs.has(assetRef)

              return (
                <Card
                  key={`${assetRef}-${index}`}
                  padding={2}
                  radius={2}
                  border
                  tone={isSelected ? 'primary' : 'transparent'}
                  style={{
                    cursor: props.readOnly ? 'default' : 'pointer',
                  }}
                  onClick={props.readOnly ? undefined : () => handleSelect(image)}
                >
                  <Stack space={2}>
                    <Box
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '4 / 5',
                        overflow: 'hidden',
                        background: 'rgba(0,0,0,0.05)',
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        />
                        {isUsedElsewhere ? (
                          <div
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: '8px',
                              padding: '4px 8px',
                              background: 'rgba(26,24,20,0.82)',
                              color: '#fff',
                              fontSize: '11px',
                              lineHeight: 1,
                              letterSpacing: '0.02em',
                            }}
                          >
                            Gia usata
                          </div>
                        ) : null}
                    </Box>
                    <Stack space={1}>
                      <Text size={1} weight={isSelected ? 'medium' : 'regular'}>
                        Immagine {index + 1}
                      </Text>
                      {isSelected ? (
                        <Text size={0} muted>
                          Selezionata in questa riga
                        </Text>
                      ) : isUsedElsewhere ? (
                        <Text size={0} muted>
                          Usata in un'altra riga editoriale
                        </Text>
                      ) : null}
                    </Stack>
                  </Stack>
                </Card>
              )
            })}
          </Grid>
        </Stack>
      </Card>
    </Stack>
  )
}
