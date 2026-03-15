import { useEffect, useRef } from 'react'
import { PatchEvent, set, type ObjectInputProps } from 'sanity'
import { Card, Stack, Text } from '@sanity/ui'

type PresetKey =
  | 'auto'
  | 'leftTop'
  | 'centerTop'
  | 'rightTop'
  | 'rightNarrowTop'
  | 'leftBottom'
  | 'centerBottom'
  | 'rightBottom'
  | 'rightNarrowBottom'

type PresetValues = {
  x: number
  y: number
  width: number
  z: number
  preferred: 'landscape' | 'portrait' | 'any'
}

const PRESET_VALUES: Record<Exclude<PresetKey, 'auto'>, PresetValues> = {
  leftTop: { x: 1, y: 1, width: 23, z: 2, preferred: 'portrait' },
  centerTop: { x: 24, y: 8, width: 33, z: 2, preferred: 'landscape' },
  rightTop: { x: 54, y: 2, width: 24, z: 2, preferred: 'portrait' },
  rightNarrowTop: { x: 75, y: 8, width: 17, z: 1, preferred: 'portrait' },
  leftBottom: { x: 1, y: 58, width: 31, z: 1, preferred: 'landscape' },
  centerBottom: { x: 34, y: 50, width: 24, z: 2, preferred: 'portrait' },
  rightBottom: { x: 58, y: 56, width: 24, z: 2, preferred: 'landscape' },
  rightNarrowBottom: { x: 75, y: 64, width: 16, z: 1, preferred: 'portrait' },
}

export default function PreviewLayoutInput(props: ObjectInputProps) {
  const lastPresetRef = useRef<string | undefined>(undefined)
  const hasInitializedRef = useRef(false)
  const preset = typeof props.value?.preset === 'string' ? (props.value.preset as PresetKey) : 'auto'

  useEffect(() => {
    // Prima renderizzazione: memorizziamo il preset corrente ma non patchiamo.
    // Così non sovrascriviamo eventuali override manuali già salvati.
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
      lastPresetRef.current = preset
      return
    }

    // Applica i valori del preset solo quando il preset cambia davvero.
    if (lastPresetRef.current === preset) return
    lastPresetRef.current = preset

    if (preset === 'auto') return
    const values = PRESET_VALUES[preset]
    if (!values) return

    props.onChange(
      PatchEvent.from([
        set(values.x, ['x']),
        set(values.y, ['y']),
        set(values.width, ['width']),
        set(values.z, ['z']),
        set(values.preferred, ['preferred']),
      ])
    )
  }, [preset, props])

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} tone="transparent" border>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Come funziona questo layout
          </Text>
          <Text size={1} muted>
            1. Scegli un preset per partire da una posizione pronta.
          </Text>
          <Text size={1} muted>
            2. I campi X, Y, Larghezza e Z vengono compilati automaticamente.
          </Text>
          <Text size={1} muted>
            3. Puoi rifinire manualmente i valori per spostare la card dove vuoi.
          </Text>
          <Text size={1} muted>
            Nota: questi valori influenzano solo la moodboard della homepage.
          </Text>
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  )
}
