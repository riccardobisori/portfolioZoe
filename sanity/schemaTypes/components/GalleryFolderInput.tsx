'use client'

import {useEffect, useRef, useState, type ChangeEvent} from 'react'
import {Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {PatchEvent, set, type ArrayOfObjectsInputProps, useClient} from 'sanity'
import {apiVersion} from '../../env'

type GalleryImageValue = {
  _key: string
  _type: 'image'
  asset: {
    _type: 'reference'
    _ref: string
  }
}

// Converte l'asset appena caricato nel formato atteso dall'array `gallery`.
function createImageItem(assetRef: string): GalleryImageValue {
  return {
    _key: crypto.randomUUID(),
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: assetRef,
    },
  }
}

// Mantiene l'ordine stabile di import usando prima il percorso relativo, poi il nome file.
function sortFiles(files: File[]) {
  return [...files].sort((a, b) => {
    const left = a.webkitRelativePath || a.name
    const right = b.webkitRelativePath || b.name
    return left.localeCompare(right, undefined, {numeric: true, sensitivity: 'base'})
  })
}

// Carica i file uno alla volta per raccogliere sia gli upload riusciti sia quelli falliti.
async function uploadFiles(
  files: File[],
  upload: (file: File) => Promise<GalleryImageValue | null>,
) {
  const uploadedItems: GalleryImageValue[] = []
  const failedFiles: string[] = []

  for (const file of files) {
    try {
      const item = await upload(file)
      if (item) {
        uploadedItems.push(item)
      }
    } catch {
      failedFiles.push(file.webkitRelativePath || file.name)
    }
  }

  return {uploadedItems, failedFiles}
}

// Estende l'input standard di Sanity con azioni rapide per immagini multiple o intere cartelle.
export default function GalleryFolderInput(props: ArrayOfObjectsInputProps) {
  const client = useClient({apiVersion})
  const filesInputRef = useRef<HTMLInputElement | null>(null)
  const folderInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // `webkitdirectory` abilita la selezione di cartelle nei browser compatibili con lo Studio.
    if (!folderInputRef.current) return
    folderInputRef.current.setAttribute('webkitdirectory', '')
    folderInputRef.current.setAttribute('directory', '')
  }, [])

  // Filtra i file non immagine, carica gli asset su Sanity e aggiorna la gallery in append.
  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const files = Array.from(input.files ?? []).filter((file) => file.type.startsWith('image/'))

    if (files.length === 0) {
      input.value = ''
      return
    }

    setIsUploading(true)
    setError(null)
    setStatus(`Caricamento di ${files.length} immagini in corso...`)

    const sortedFiles = sortFiles(files)
    const {uploadedItems, failedFiles} = await uploadFiles(sortedFiles, async (file) => {
      const asset = await client.assets.upload('image', file, {
        filename: file.name,
      })

      return createImageItem(asset._id)
    })

    if (uploadedItems.length > 0) {
      const currentValue = (props.value ?? []) as GalleryImageValue[]
      // Ricostruisce l'array completo per evitare patch parziali incoerenti dopo upload multipli.
      props.onChange(
        PatchEvent.from(
          set([...currentValue, ...uploadedItems]),
        ),
      )
    }

    if (failedFiles.length > 0) {
      const failedList = failedFiles.slice(0, 3).join(', ')
      const suffix = failedFiles.length > 3 ? ` e altre ${failedFiles.length - 3}` : ''
      setError(`Alcuni file non sono stati caricati: ${failedList}${suffix}.`)
    } else {
      setError(null)
    }

    setStatus(`${uploadedItems.length} immagini aggiunte alla galleria.`)
    setIsUploading(false)
    input.value = ''
  }

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} tone="transparent" border>
        <Stack space={3}>
          <Text size={1} weight="medium">
            Import rapido galleria
          </Text>
          <Text size={1} muted>
            Puoi selezionare piu immagini insieme oppure importare una cartella intera.
          </Text>
          <Flex gap={2} wrap="wrap">
            <Button
              text="Importa immagini"
              mode="ghost"
              disabled={props.readOnly || isUploading}
              onClick={() => filesInputRef.current?.click()}
            />
            <Button
              text="Importa cartella"
              mode="default"
              disabled={props.readOnly || isUploading}
              onClick={() => folderInputRef.current?.click()}
            />
          </Flex>
          {status ? (
            <Box>
              <Text size={1}>{status}</Text>
            </Box>
          ) : null}
          {error ? (
            <Card padding={2} radius={2} tone="critical">
              <Text size={1}>
                {error}
              </Text>
            </Card>
          ) : null}
        </Stack>
      </Card>

      <input
        ref={filesInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleUpload}
      />

      <input
        ref={folderInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleUpload}
      />

      {props.renderDefault(props)}
    </Stack>
  )
}
