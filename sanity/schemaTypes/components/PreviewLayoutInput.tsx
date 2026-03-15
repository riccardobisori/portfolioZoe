import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { PatchEvent, set, setIfMissing, unset, type ObjectInputProps, useClient, useFormValue } from 'sanity'
import { Box, Button, Card, Flex, Stack, Text } from '@sanity/ui'
import { urlFor } from '../../lib/image'

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
  | 'leftThird'
  | 'centerThird'
  | 'rightThird'
  | 'rightNarrowThird'

type PresetValues = {
  x: number
  y: number
  width: number
  z: number
  preferred: 'landscape' | 'portrait' | 'any'
}

const PRESET_VALUES: Record<Exclude<PresetKey, 'auto'>, PresetValues> = {
  leftTop: { x: 1, y: 1, width: 23, z: 2, preferred: 'portrait' },
  centerTop: { x: 24, y: 6, width: 33, z: 2, preferred: 'landscape' },
  rightTop: { x: 54, y: 2, width: 24, z: 2, preferred: 'portrait' },
  rightNarrowTop: { x: 75, y: 6, width: 17, z: 1, preferred: 'portrait' },
  leftBottom: { x: 1, y: 39, width: 31, z: 1, preferred: 'landscape' },
  centerBottom: { x: 34, y: 34, width: 24, z: 2, preferred: 'portrait' },
  rightBottom: { x: 58, y: 38, width: 24, z: 2, preferred: 'landscape' },
  rightNarrowBottom: { x: 75, y: 44, width: 16, z: 1, preferred: 'portrait' },
  leftThird: { x: 2, y: 70, width: 22, z: 2, preferred: 'portrait' },
  centerThird: { x: 26, y: 74, width: 32, z: 1, preferred: 'landscape' },
  rightThird: { x: 59, y: 68, width: 24, z: 2, preferred: 'portrait' },
  rightNarrowThird: { x: 84, y: 76, width: 15, z: 1, preferred: 'portrait' },
}

const PRESET_LABELS: Record<Exclude<PresetKey, 'auto'>, string> = {
  leftTop: 'LT',
  centerTop: 'CT',
  rightTop: 'RT',
  rightNarrowTop: 'RNT',
  leftBottom: 'LB',
  centerBottom: 'CB',
  rightBottom: 'RB',
  rightNarrowBottom: 'RNB',
  leftThird: 'LT3',
  centerThird: 'CT3',
  rightThird: 'RT3',
  rightNarrowThird: 'RNT3',
}

type Preferred = 'landscape' | 'portrait' | 'any'
type LayoutValues = {
  x: number
  y: number
  width: number
  z: number
  preferred: Preferred
}

type ImageAssetRef = {
  asset?: {
    _ref?: string
  }
}

type DocumentWithImage = {
  _id?: string
  title?: string
  featured?: boolean
  mainImage?: ImageAssetRef
  previewLayout?: PreviewLayoutRaw
}

type DesktopBreakpointKey = 'desktop1024' | 'desktop1440' | 'desktop1920'

type PreviewLayoutRaw = {
  preset?: PresetKey
  x?: number
  y?: number
  width?: number
  z?: number
  preferred?: Preferred
  responsive?: Partial<Record<DesktopBreakpointKey, Omit<PreviewLayoutRaw, 'responsive'>>>
}

type FeaturedWorkPreview = {
  _id: string
  title?: string
  mainImage?: ImageAssetRef
  previewLayout?: PreviewLayoutRaw
}

type ReferenceCard = {
  _id: string
  title: string
  imageUrl: string | null
  x: number
  y: number
  width: number
  z: number
  preferred: Preferred
  aspectRatio: string
  topPx?: number
  offsetX: number
  offsetY: number
  manual: boolean
  row: number
}

type DragMode = 'move' | 'resize'
type DragState = {
  mode: DragMode
  startClientX: number
  startClientY: number
  startLayout: LayoutValues
  rectWidth: number
  rectHeight: number
}

const DEFAULT_LAYOUT: LayoutValues = {
  x: 24,
  y: 8,
  width: 33,
  z: 2,
  preferred: 'any',
}

const MOODBOARD_SLOT_SEQUENCE: PresetValues[] = [
  PRESET_VALUES.leftTop,
  PRESET_VALUES.centerTop,
  PRESET_VALUES.rightTop,
  PRESET_VALUES.rightNarrowTop,
  PRESET_VALUES.leftBottom,
  PRESET_VALUES.centerBottom,
  PRESET_VALUES.rightBottom,
  PRESET_VALUES.rightNarrowBottom,
  PRESET_VALUES.leftThird,
  PRESET_VALUES.centerThird,
  PRESET_VALUES.rightThird,
  PRESET_VALUES.rightNarrowThird,
]

const MOODBOARD_SLOTS = [
  { top: 1, left: 1, width: 23, z: 2, preferred: 'portrait' as Preferred },
  { top: 6, left: 24, width: 33, z: 2, preferred: 'landscape' as Preferred },
  { top: 2, left: 54, width: 24, z: 2, preferred: 'portrait' as Preferred },
  { top: 6, left: 75, width: 17, z: 1, preferred: 'portrait' as Preferred },
  { top: 39, left: 1, width: 31, z: 1, preferred: 'landscape' as Preferred },
  { top: 34, left: 34, width: 24, z: 2, preferred: 'portrait' as Preferred },
  { top: 38, left: 58, width: 24, z: 2, preferred: 'landscape' as Preferred },
  { top: 44, left: 75, width: 16, z: 1, preferred: 'portrait' as Preferred },
  { top: 70, left: 2, width: 22, z: 2, preferred: 'portrait' as Preferred },
  { top: 74, left: 26, width: 32, z: 1, preferred: 'landscape' as Preferred },
  { top: 68, left: 59, width: 24, z: 2, preferred: 'portrait' as Preferred },
  { top: 76, left: 84, width: 15, z: 1, preferred: 'portrait' as Preferred },
]

const MOODBOARD_BASE_HEIGHT = 1800
const MOODBOARD_ROW_HEIGHT = 600

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function snap(value: number, step = 1) {
  return Math.round(value / step) * step
}

function getPreviewAspectRatio(preferred: Preferred) {
  if (preferred === 'portrait') return '2 / 3'
  return '3 / 2'
}

function getImageAspectRatioFromRef(imageRef?: string) {
  const dims = parseImageDimensionsFromRef(imageRef)
  if (!dims) return null
  return `${dims.width} / ${dims.height}`
}

function parseImageDimensionsFromRef(imageRef?: string) {
  if (!imageRef) return null
  const match = imageRef.match(/-(\d+)x(\d+)-/)
  if (!match) return null
  const width = Number(match[1])
  const height = Number(match[2])
  if (!width || !height) return null
  return { width, height }
}

function getBreakpointForViewport(viewportWidth: number): DesktopBreakpointKey {
  if (viewportWidth >= 1760) return 'desktop1920'
  if (viewportWidth >= 1366) return 'desktop1440'
  return 'desktop1024'
}

function resolveLayoutForBreakpoint(
  layout: PreviewLayoutRaw | undefined,
  breakpoint: DesktopBreakpointKey
): PreviewLayoutRaw | undefined {
  if (!layout) return undefined
  const override = layout.responsive?.[breakpoint]
  if (!override) return layout
  return {
    ...layout,
    preset: override.preset ?? layout.preset,
    x: override.x ?? layout.x,
    y: override.y ?? layout.y,
    width: override.width ?? layout.width,
    z: override.z ?? layout.z,
    preferred: override.preferred ?? layout.preferred,
  }
}

function isManualLayout(layout?: PreviewLayoutRaw, breakpoint?: DesktopBreakpointKey) {
  const scoped = breakpoint ? resolveLayoutForBreakpoint(layout, breakpoint) : layout
  if (!scoped) return false
  return (
    (scoped.preset != null && scoped.preset !== 'auto') ||
    scoped.x != null ||
    scoped.y != null ||
    scoped.width != null ||
    scoped.z != null
  )
}

function getLayoutPathPrefix(breakpoint: DesktopBreakpointKey) {
  return ['responsive', breakpoint] as const
}

function readFieldFromScopedLayout(
  layout: PreviewLayoutRaw | undefined,
  breakpoint: DesktopBreakpointKey
) {
  const scoped = resolveLayoutForBreakpoint(layout, breakpoint)
  return {
    preset: scoped?.preset,
    x: scoped?.x,
    y: scoped?.y,
    width: scoped?.width,
    z: scoped?.z,
    preferred: scoped?.preferred,
  }
}

function getMoodboardBaseOffset(preferred: Preferred, row: number, leftPercent: number) {
  const evenRow = row % 2 === 0
  const landscape = preferred === 'landscape'
  const baseOffsetX = landscape ? (evenRow ? -4 : 4) : evenRow ? -2 : 2
  const baseOffsetY = landscape ? (evenRow ? -2 : 4) : evenRow ? -1 : 3
  const rightEdgeOffset = leftPercent >= 70 ? -8 : 0
  return {
    offsetX: baseOffsetX + rightEdgeOffset,
    offsetY: baseOffsetY,
  }
}

function getDesktopScenePadding(viewportWidth: number) {
  const sectionPadding = clamp(viewportWidth * 0.03, 16, 48)
  const canvasLeftSafe = clamp(viewportWidth * 0.008, 4, 14)
  const canvasRightSafe = clamp(viewportWidth * 0.01, 5, 16)
  return {
    left: sectionPadding + canvasLeftSafe,
    right: sectionPadding + canvasRightSafe,
  }
}

type ActiveAutoPlacement = {
  x: number
  y: number
  width: number
  z: number
  preferred: Preferred
  topPx?: number
  offsetX: number
  offsetY: number
}

const VIEWPORT_PRESETS = [
  { label: 'Laptop', width: 1024 },
  { label: 'Wide Laptop', width: 1280 },
  { label: 'MBP 14', width: 1512 },
  { label: 'Laptop FHD', width: 1536 },
  { label: 'Desktop', width: 1440 },
  { label: 'Desktop FHD', width: 1920 },
] as const

export default function PreviewLayoutInput(props: ObjectInputProps) {
  const client = useClient({ apiVersion: '2026-03-07' })
  const lastPresetRef = useRef<string | undefined>(undefined)
  const lastBreakpointRef = useRef<DesktopBreakpointKey | undefined>(undefined)
  const hasInitializedRef = useRef(false)
  const dragStateRef = useRef<DragState | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [canvasZoom, setCanvasZoom] = useState(0.75)
  const [canvasHeightScale, setCanvasHeightScale] = useState(1)
  const [fitToViewport, setFitToViewport] = useState(true)
  const [viewportWidth, setViewportWidth] = useState<number>(1920)
  const [referenceCards, setReferenceCards] = useState<ReferenceCard[]>([])
  const [activeAutoPlacement, setActiveAutoPlacement] = useState<ActiveAutoPlacement | null>(null)
  const [logicalCanvasHeight, setLogicalCanvasHeight] = useState(MOODBOARD_BASE_HEIGHT)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const activeBreakpoint = useMemo(() => getBreakpointForViewport(viewportWidth), [viewportWidth])
  const scopedFormLayout = useMemo(
    () => readFieldFromScopedLayout(props.value as PreviewLayoutRaw | undefined, activeBreakpoint),
    [activeBreakpoint, props.value]
  )
  const preset = typeof scopedFormLayout.preset === 'string' ? (scopedFormLayout.preset as PresetKey) : 'auto'
  const documentValue = useFormValue([]) as DocumentWithImage | undefined
  const currentDocumentId = documentValue?._id ?? ''
  const mainImage = documentValue?.mainImage
  const previewImageUrl = useMemo(() => {
    if (!mainImage) return null
    try {
      return urlFor(mainImage).width(1400).quality(90).url()
    } catch {
      return null
    }
  }, [mainImage])
  const activeLayout = useMemo<LayoutValues>(() => {
    const presetBase =
      preset !== 'auto' ? PRESET_VALUES[preset as Exclude<PresetKey, 'auto'>] : DEFAULT_LAYOUT

    const preferred = scopedFormLayout.preferred
    const safePreferred: Preferred =
      preferred === 'landscape' || preferred === 'portrait' || preferred === 'any'
        ? preferred
        : presetBase.preferred

    return {
      x: clamp(typeof scopedFormLayout.x === 'number' ? scopedFormLayout.x : presetBase.x, 0, 90),
      y: clamp(typeof scopedFormLayout.y === 'number' ? scopedFormLayout.y : presetBase.y, 0, 95),
      width: clamp(typeof scopedFormLayout.width === 'number' ? scopedFormLayout.width : presetBase.width, 10, 45),
      z: clamp(typeof scopedFormLayout.z === 'number' ? scopedFormLayout.z : presetBase.z, 1, 10),
      preferred: safePreferred,
    }
  }, [preset, scopedFormLayout])
  const activeImageAspectRatio = useMemo(() => {
    const byImageRef = getImageAspectRatioFromRef(mainImage?.asset?._ref)
    return byImageRef ?? getPreviewAspectRatio(activeLayout.preferred)
  }, [activeLayout.preferred, mainImage?.asset?._ref])

  useEffect(() => {
    let cancelled = false

    const normalizeId = (value: string) => value.replace(/^drafts\./, '')
    const currentBaseId = normalizeId(currentDocumentId)

    const resolveLayout = (work: FeaturedWorkPreview, index: number) => {
      const raw = resolveLayoutForBreakpoint(work.previewLayout, activeBreakpoint)
      const presetKey =
        raw?.preset && raw.preset !== 'auto' && PRESET_VALUES[raw.preset]
          ? raw.preset
          : null
      const presetBase = presetKey
        ? PRESET_VALUES[presetKey]
        : MOODBOARD_SLOT_SEQUENCE[index % MOODBOARD_SLOT_SEQUENCE.length]
      const preferred =
        raw?.preferred === 'landscape' || raw?.preferred === 'portrait' || raw?.preferred === 'any'
          ? raw.preferred
          : presetBase.preferred

      return {
        x: clamp(typeof raw?.x === 'number' ? raw.x : presetBase.x, 0, 90),
        y: clamp(typeof raw?.y === 'number' ? raw.y : presetBase.y, 0, 95),
        width: clamp(typeof raw?.width === 'number' ? raw.width : presetBase.width, 10, 45),
        z: clamp(typeof raw?.z === 'number' ? raw.z : presetBase.z, 1, 10),
        preferred,
      }
    }

    const isLandscape = (work: FeaturedWorkPreview) => {
      const dims = parseImageDimensionsFromRef(work.mainImage?.asset?._ref)
      if (!dims) return false
      return dims.width >= dims.height
    }

    const arrangeForMoodboard = (works: FeaturedWorkPreview[]) => {
      const portraits = works.filter((work) => !isLandscape(work))
      const landscapes = works.filter((work) => isLandscape(work))
      const arranged: FeaturedWorkPreview[] = []

      const pullLandscape = () => landscapes.shift() ?? portraits.shift()
      const pullPortrait = () => portraits.shift() ?? landscapes.shift()
      const pullAny = () =>
        (portraits.length >= landscapes.length ? portraits.shift() : landscapes.shift()) ??
        portraits.shift() ??
        landscapes.shift()

      for (let index = 0; index < works.length; index += 1) {
        const slot = MOODBOARD_SLOTS[index % MOODBOARD_SLOTS.length]
        let selected: FeaturedWorkPreview | undefined
        if (slot.preferred === 'landscape') selected = pullLandscape()
        else if (slot.preferred === 'portrait') selected = pullPortrait()
        else selected = pullAny()
        if (selected) arranged.push(selected)
      }

      return arranged
    }

    const loadReferenceCards = async () => {
      const fetchedWorks = await client.fetch<FeaturedWorkPreview[]>(
        `*[_type == "work" && featured == true] | order(date desc) {
          _id,
          title,
          mainImage,
          previewLayout
        }`
      )

      const works = fetchedWorks.map((work) => {
        if (normalizeId(work._id) !== currentBaseId) return work
        return {
          ...work,
          title: documentValue?.title ?? work.title,
          mainImage: documentValue?.mainImage ?? work.mainImage,
          previewLayout: documentValue?.previewLayout ?? work.previewLayout,
        }
      })

      const shouldUseManual = works.some((work) => isManualLayout(work.previewLayout, activeBreakpoint))
      const arrangedWorks = shouldUseManual ? works : arrangeForMoodboard(works)
      const rows = Math.ceil(Math.max(arrangedWorks.length, 1) / MOODBOARD_SLOTS.length)
      const desktopHeight = MOODBOARD_BASE_HEIGHT + Math.max(rows - 1, 0) * MOODBOARD_ROW_HEIGHT

      const cardsWithCurrent = arrangedWorks.map((item, idx) => {
          const layout = resolveLayout(item, idx)
          const slot = MOODBOARD_SLOTS[idx % MOODBOARD_SLOTS.length]
          const row = Math.floor(idx / MOODBOARD_SLOTS.length)
          const manual = isManualLayout(item.previewLayout, activeBreakpoint)
          const baseOffset = manual ? { offsetX: 0, offsetY: 0 } : getMoodboardBaseOffset(layout.preferred, row, slot.left)
          let imageUrl: string | null = null
          if (item.mainImage) {
            try {
              imageUrl = urlFor(item.mainImage).width(900).quality(75).url()
            } catch {
              imageUrl = null
            }
          }
          return {
            _id: item._id,
            title: item.title ?? 'Work',
            imageUrl,
            x: layout.x,
            y: layout.y,
            width: layout.width,
            z: manual ? layout.z : slot.z + row * 8,
            preferred: layout.preferred,
            aspectRatio:
              getImageAspectRatioFromRef(item.mainImage?.asset?._ref) ?? getPreviewAspectRatio(layout.preferred),
            topPx: manual ? undefined : (slot.top / 100) * desktopHeight + row * 490,
            offsetX: baseOffset.offsetX,
            offsetY: baseOffset.offsetY,
            manual,
            row,
          }
        })
      const currentCard = cardsWithCurrent.find((card) => normalizeId(card._id) === currentBaseId)
      const cards = cardsWithCurrent.filter((card) => normalizeId(card._id) !== currentBaseId)

      if (!cancelled) {
        setLogicalCanvasHeight(desktopHeight)
        setReferenceCards(cards)
        setActiveAutoPlacement(
          currentCard
            ? {
                x: currentCard.x,
                y: currentCard.y,
                width: currentCard.width,
                z: currentCard.z,
                preferred: currentCard.preferred,
                topPx: currentCard.topPx,
                offsetX: currentCard.offsetX,
                offsetY: currentCard.offsetY,
              }
            : null
        )
      }
    }

    loadReferenceCards().catch(() => {
      if (!cancelled) {
        setReferenceCards([])
        setActiveAutoPlacement(null)
      }
    })

    return () => {
      cancelled = true
    }
  }, [activeBreakpoint, client, currentDocumentId, documentValue?.mainImage, documentValue?.previewLayout, documentValue?.title])

  const BASE_CANVAS_WIDTH = viewportWidth
  const BASE_CANVAS_HEIGHT = Math.round(logicalCanvasHeight * canvasHeightScale)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || !fitToViewport) return

    const updateFitZoom = () => {
      const availableWidth = viewport.clientWidth - 28
      if (availableWidth <= 0) return
      const fitZoom = clamp(availableWidth / BASE_CANVAS_WIDTH, 0.3, 1.4)
      setCanvasZoom(fitZoom)
    }

    updateFitZoom()
    const observer = new ResizeObserver(updateFitZoom)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [BASE_CANVAS_HEIGHT, BASE_CANVAS_WIDTH, fitToViewport, viewportWidth])

  const currentLayout = useMemo<LayoutValues>(() => {
    if (!isManualLayout(props.value as PreviewLayoutRaw | undefined, activeBreakpoint) && activeAutoPlacement) {
      return {
        x: activeAutoPlacement.x,
        y: activeAutoPlacement.y,
        width: activeAutoPlacement.width,
        z: activeAutoPlacement.z,
        preferred: activeAutoPlacement.preferred,
      }
    }
    return activeLayout
  }, [activeAutoPlacement, activeBreakpoint, activeLayout, props.value])

  const activeCardStyle = useMemo(() => {
    if (!isManualLayout(props.value as PreviewLayoutRaw | undefined, activeBreakpoint) && activeAutoPlacement) {
      return {
        top:
          typeof activeAutoPlacement.topPx === 'number'
            ? `${activeAutoPlacement.topPx * canvasHeightScale * canvasZoom}px`
            : `${currentLayout.y}%`,
        left: `${currentLayout.x}%`,
        width: `${currentLayout.width}%`,
        transform: `translate(${activeAutoPlacement.offsetX * canvasZoom}px, ${activeAutoPlacement.offsetY * canvasZoom}px)`,
      }
    }
    return {
      top: `${currentLayout.y}%`,
      left: `${currentLayout.x}%`,
      width: `${currentLayout.width}%`,
      transform: 'translate(0px, 0px)',
    }
  }, [activeAutoPlacement, activeBreakpoint, canvasHeightScale, canvasZoom, currentLayout, props.value])

  const applyLayoutPatch = useCallback(
    (nextValues: Partial<LayoutValues>) => {
      const pathPrefix = getLayoutPathPrefix(activeBreakpoint)
      const patches: any[] = [setIfMissing({}, ['responsive']), setIfMissing({}, [...pathPrefix])]
      if (typeof nextValues.x === 'number')
        patches.push(set(snap(clamp(nextValues.x, 0, 90)), [...pathPrefix, 'x']))
      if (typeof nextValues.y === 'number')
        patches.push(set(snap(clamp(nextValues.y, 0, 95)), [...pathPrefix, 'y']))
      if (typeof nextValues.width === 'number')
        patches.push(set(snap(clamp(nextValues.width, 10, 45)), [...pathPrefix, 'width']))
      if (typeof nextValues.z === 'number')
        patches.push(set(snap(clamp(nextValues.z, 1, 10)), [...pathPrefix, 'z']))
      if (nextValues.preferred) patches.push(set(nextValues.preferred, [...pathPrefix, 'preferred']))
      if (patches.length > 0) props.onChange(PatchEvent.from(patches))
    },
    [activeBreakpoint, props]
  )

  useEffect(() => {
    // Prima renderizzazione: memorizziamo il preset corrente ma non patchiamo.
    // Così non sovrascriviamo eventuali override manuali già salvati.
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
      lastPresetRef.current = preset
      lastBreakpointRef.current = activeBreakpoint
      return
    }

    if (lastBreakpointRef.current !== activeBreakpoint) {
      lastBreakpointRef.current = activeBreakpoint
      lastPresetRef.current = preset
      return
    }

    // Applica i valori del preset solo quando il preset cambia davvero.
    if (lastPresetRef.current === preset) return
    lastPresetRef.current = preset

    if (preset === 'auto') return
    const values = PRESET_VALUES[preset]
    if (!values) return
    const pathPrefix = getLayoutPathPrefix(activeBreakpoint)

    props.onChange(
      PatchEvent.from([
        setIfMissing({}, ['responsive']),
        setIfMissing({}, [...pathPrefix]),
        set(values.x, [...pathPrefix, 'x']),
        set(values.y, [...pathPrefix, 'y']),
        set(values.width, [...pathPrefix, 'width']),
        set(values.z, [...pathPrefix, 'z']),
        set(values.preferred, [...pathPrefix, 'preferred']),
      ])
    )
  }, [activeBreakpoint, preset, props])

  useEffect(() => {
    if (!isDragging) return

    const onPointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current
      if (!dragState) return

      const deltaXPct = (event.clientX - dragState.startClientX) / dragState.rectWidth * 100
      const deltaYPct = (event.clientY - dragState.startClientY) / dragState.rectHeight * 100

      if (dragState.mode === 'move') {
        applyLayoutPatch({
          x: dragState.startLayout.x + deltaXPct,
          y: dragState.startLayout.y + deltaYPct,
        })
        return
      }

      applyLayoutPatch({
        width: dragState.startLayout.width + deltaXPct,
      })
    }

    const onPointerUp = () => {
      dragStateRef.current = null
      setIsDragging(false)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [applyLayoutPatch, isDragging])

  const startDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, mode: DragMode) => {
      event.preventDefault()
      const canvasEl = canvasRef.current
      if (!canvasEl) return
      const rect = canvasEl.getBoundingClientRect()
      dragStateRef.current = {
        mode,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startLayout: currentLayout,
        rectWidth: rect.width,
        rectHeight: rect.height,
      }
      setIsDragging(true)
    },
    [currentLayout]
  )

  const applyPresetValues = useCallback(() => {
    if (preset === 'auto') return
    const values = PRESET_VALUES[preset]
    if (!values) return
    const pathPrefix = getLayoutPathPrefix(activeBreakpoint)
    props.onChange(
      PatchEvent.from([
        setIfMissing({}, ['responsive']),
        setIfMissing({}, [...pathPrefix]),
        set(values.x, [...pathPrefix, 'x']),
        set(values.y, [...pathPrefix, 'y']),
        set(values.width, [...pathPrefix, 'width']),
        set(values.z, [...pathPrefix, 'z']),
        set(values.preferred, [...pathPrefix, 'preferred']),
      ])
    )
  }, [activeBreakpoint, preset, props])

  const clearManualOverrides = useCallback(() => {
    const pathPrefix = getLayoutPathPrefix(activeBreakpoint)
    props.onChange(
      PatchEvent.from([
        unset([...pathPrefix, 'x']),
        unset([...pathPrefix, 'y']),
        unset([...pathPrefix, 'width']),
        unset([...pathPrefix, 'z']),
        unset([...pathPrefix, 'preferred']),
        unset([...pathPrefix, 'preset']),
      ])
    )
  }, [activeBreakpoint, props])

  const handleCanvasKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const { key, altKey, shiftKey } = event
      const moveStep = shiftKey ? 2 : 1
      let handled = true

      if (altKey) {
        if (key === 'ArrowUp' || key === 'ArrowRight') {
          applyLayoutPatch({ z: currentLayout.z + 1 })
        } else if (key === 'ArrowDown' || key === 'ArrowLeft') {
          applyLayoutPatch({ z: currentLayout.z - 1 })
        } else {
          handled = false
        }
      } else if (shiftKey && (key === 'ArrowLeft' || key === 'ArrowRight')) {
        applyLayoutPatch({
          width: currentLayout.width + (key === 'ArrowRight' ? moveStep : -moveStep),
        })
      } else {
        switch (key) {
          case 'ArrowLeft':
            applyLayoutPatch({ x: currentLayout.x - moveStep })
            break
          case 'ArrowRight':
            applyLayoutPatch({ x: currentLayout.x + moveStep })
            break
          case 'ArrowUp':
            applyLayoutPatch({ y: currentLayout.y - moveStep })
            break
          case 'ArrowDown':
            applyLayoutPatch({ y: currentLayout.y + moveStep })
            break
          default:
            handled = false
            break
        }
      }

      if (handled) event.preventDefault()
    },
    [applyLayoutPatch, currentLayout]
  )

  const canvasWidth = Math.round(BASE_CANVAS_WIDTH * canvasZoom)
  const canvasHeight = Math.round(BASE_CANVAS_HEIGHT * canvasZoom)
  const scenePadding = useMemo(() => {
    const padding = getDesktopScenePadding(viewportWidth)
    return {
      left: padding.left * canvasZoom,
      right: padding.right * canvasZoom,
    }
  }, [canvasZoom, viewportWidth])

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} tone="transparent" border>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Builder Visuale Moodboard
          </Text>
          <Text size={1} muted>
            Trascina la card per spostarla e usa il quadratino in basso a destra per ridimensionarla.
          </Text>
          <Text size={1} muted>
            Lo snap e i limiti sono applicati automaticamente (X: 0-90, Y: 0-95, Width: 10-45).
          </Text>
        </Stack>
      </Card>

      <Card padding={3} radius={2} border tone="default">
        <Stack space={3}>
          <Flex gap={2} align="center" wrap="wrap">
            <Button
              mode="ghost"
              text="Nudge Left"
              onClick={() => applyLayoutPatch({ x: currentLayout.x - 1 })}
            />
            <Button
              mode="ghost"
              text="Nudge Right"
              onClick={() => applyLayoutPatch({ x: currentLayout.x + 1 })}
            />
            <Button
              mode="ghost"
              text="Nudge Up"
              onClick={() => applyLayoutPatch({ y: currentLayout.y - 1 })}
            />
            <Button
              mode="ghost"
              text="Nudge Down"
              onClick={() => applyLayoutPatch({ y: currentLayout.y + 1 })}
            />
            <Button
              mode="ghost"
              text="Z -"
              onClick={() => applyLayoutPatch({ z: currentLayout.z - 1 })}
            />
            <Button
              mode="ghost"
              text="Z +"
              onClick={() => applyLayoutPatch({ z: currentLayout.z + 1 })}
            />
          </Flex>

          <Flex gap={2} align="center" wrap="wrap">
            {VIEWPORT_PRESETS.map((item) => (
              <Button
                key={item.width}
                mode={viewportWidth === item.width ? 'default' : 'ghost'}
                text={`${item.label} ${item.width}`}
                onClick={() => {
                  setViewportWidth(item.width)
                  setFitToViewport(true)
                }}
              />
            ))}
            <Text size={1} muted>
              Viewport
            </Text>
            <Button
              mode={fitToViewport ? 'default' : 'ghost'}
              text={fitToViewport ? 'Fit On' : 'Fit Off'}
              onClick={() => setFitToViewport((prev) => !prev)}
            />
            <Text size={1} muted>
              Editing: {activeBreakpoint} (fallback: base)
            </Text>
          </Flex>

          <Flex gap={2} align="center" wrap="wrap">
            <Button
              mode={currentLayout.preferred === 'any' ? 'default' : 'ghost'}
              text="Orient: Auto"
              onClick={() => applyLayoutPatch({ preferred: 'any' })}
            />
            <Button
              mode={currentLayout.preferred === 'portrait' ? 'default' : 'ghost'}
              text="Orient: Verticale"
              onClick={() => applyLayoutPatch({ preferred: 'portrait' })}
            />
            <Button
              mode={currentLayout.preferred === 'landscape' ? 'default' : 'ghost'}
              text="Orient: Orizzontale"
              onClick={() => applyLayoutPatch({ preferred: 'landscape' })}
            />
            <Button
              mode="ghost"
              text="Zoom -"
              disabled={fitToViewport}
              onClick={() => {
                setFitToViewport(false)
                setCanvasZoom((prev) => clamp(prev - 0.1, 0.3, 1.4))
              }}
            />
            <Button
              mode="ghost"
              text="Zoom 100%"
              disabled={fitToViewport}
              onClick={() => {
                setFitToViewport(false)
                setCanvasZoom(1)
              }}
            />
            <Button
              mode="ghost"
              text="Zoom +"
              disabled={fitToViewport}
              onClick={() => {
                setFitToViewport(false)
                setCanvasZoom((prev) => clamp(prev + 0.1, 0.3, 1.4))
              }}
            />
            <Text size={1} muted>
              {Math.round(canvasZoom * 100)}%
            </Text>
            <Button
              mode="ghost"
              text="Height -"
              onClick={() => setCanvasHeightScale((prev) => clamp(prev - 0.04, 0.7, 1.2))}
            />
            <Button
              mode="ghost"
              text="Height 100%"
              onClick={() => setCanvasHeightScale(1)}
            />
            <Button
              mode="ghost"
              text="Height +"
              onClick={() => setCanvasHeightScale((prev) => clamp(prev + 0.04, 0.7, 1.2))}
            />
            <Text size={1} muted>
              H {Math.round(canvasHeightScale * 100)}%
            </Text>
          </Flex>

          <Box
            ref={viewportRef}
            style={{
              overflow: 'auto',
              maxWidth: '100%',
              maxHeight: '82vh',
              paddingBottom: '0.2rem',
              border: '1px solid rgba(26,24,20,0.1)',
            }}
          >
            <Box
              ref={canvasRef}
              tabIndex={0}
              onKeyDown={handleCanvasKeyDown}
              style={{
                position: 'relative',
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
                border: '1px solid rgba(26,24,20,0.18)',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(247,244,239,0.9) 100%)',
                overflow: 'hidden',
                touchAction: 'none',
                outline: 'none',
              }}
            >
              <Box
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'linear-gradient(to right, rgba(26,24,20,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,24,20,0.08) 1px, transparent 1px)',
                  backgroundSize: '10% 10%',
                }}
              />

              <Box
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${scenePadding.left}px`,
                  right: `${scenePadding.right}px`,
                }}
              >
                <Box
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  {(Object.keys(PRESET_VALUES) as Array<Exclude<PresetKey, 'auto'>>).map((key) => {
                    const slot = PRESET_VALUES[key]
                    const isActivePreset = preset === key
                    const ratio = slot.preferred === 'landscape' ? '3 / 2' : '2 / 3'
                    return (
                      <Box
                        key={key}
                        style={{
                          position: 'absolute',
                          top: `${slot.y}%`,
                          left: `${slot.x}%`,
                          width: `${slot.width}%`,
                          aspectRatio: ratio,
                          border: isActivePreset
                            ? '1px dashed rgba(9,108,255,0.85)'
                            : '1px dashed rgba(26,24,20,0.28)',
                          background: isActivePreset
                            ? 'rgba(9,108,255,0.09)'
                            : 'rgba(26,24,20,0.04)',
                          pointerEvents: 'none',
                        }}
                      >
                        <Box
                          style={{
                            position: 'absolute',
                            right: '4px',
                            top: '4px',
                            fontSize: '10px',
                            letterSpacing: '0.05em',
                            color: isActivePreset ? 'rgba(9,108,255,0.9)' : 'rgba(26,24,20,0.64)',
                          }}
                        >
                          {PRESET_LABELS[key]}
                        </Box>
                      </Box>
                    )
                  })}

                  {referenceCards.map((card) => (
                    <Box
                      key={card._id}
                      style={{
                        position: 'absolute',
                        top:
                          typeof card.topPx === 'number'
                            ? `${card.topPx * canvasHeightScale * canvasZoom}px`
                            : `${card.y}%`,
                        left: `${card.x}%`,
                        width: `${card.width}%`,
                        aspectRatio: card.aspectRatio,
                        border: '1px solid rgba(26,24,20,0.28)',
                        boxShadow: '0 4px 10px rgba(26,24,20,0.12)',
                        zIndex: card.z,
                        overflow: 'hidden',
                        opacity: 0.56,
                        pointerEvents: 'none',
                        filter: 'saturate(0.8)',
                        transform: `translate(${card.offsetX * canvasZoom}px, ${card.offsetY * canvasZoom}px)`,
                      }}
                    >
                      {card.imageUrl ? (
                        <img
                          src={card.imageUrl}
                          alt={card.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <Box
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(26,24,20,0.12)',
                          }}
                        />
                      )}
                    </Box>
                  ))}

                  <Box
                    style={{
                      position: 'absolute',
                      top: activeCardStyle.top,
                      left: activeCardStyle.left,
                      width: activeCardStyle.width,
                      aspectRatio: activeImageAspectRatio,
                      minHeight: '60px',
                      border: '1px solid rgba(26,24,20,0.5)',
                      boxShadow: '0 6px 16px rgba(26,24,20,0.18)',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      userSelect: 'none',
                      touchAction: 'none',
                      zIndex: currentLayout.z,
                      overflow: 'hidden',
                      transform: activeCardStyle.transform,
                    }}
                    onPointerDown={(event) => startDrag(event, 'move')}
                  >
                    {previewImageUrl ? (
                      <img
                        src={previewImageUrl}
                        alt="Anteprima layout"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <Box
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(135deg, rgba(26,24,20,0.12) 0%, rgba(26,24,20,0.06) 100%)',
                        }}
                      />
                    )}
                    <Box
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.14) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                    <Box
                      style={{
                        position: 'absolute',
                        left: '8px',
                        top: '8px',
                        fontSize: '11px',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'rgba(26,24,20,0.9)',
                        background: 'rgba(255,255,255,0.65)',
                        padding: '2px 6px',
                      }}
                    >
                      Drag
                    </Box>
                    <Box
                      style={{
                        position: 'absolute',
                        right: '6px',
                        bottom: '6px',
                        width: '14px',
                        height: '14px',
                        background: 'rgba(26,24,20,0.78)',
                        borderRadius: '2px',
                        cursor: 'nwse-resize',
                      }}
                      onPointerDown={(event) => startDrag(event, 'resize')}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Flex gap={2} align="center" wrap="wrap">
            <Button mode="ghost" text="Preset -> Valori" disabled={preset === 'auto'} onClick={applyPresetValues} />
            <Button mode="ghost" text="Reset Override" onClick={clearManualOverrides} />
            <Text size={1} muted>
              X {currentLayout.x.toFixed(0)}% - Y {currentLayout.y.toFixed(0)}% - W {currentLayout.width.toFixed(0)}% - Z {currentLayout.z} - {currentLayout.preferred}
            </Text>
          </Flex>
        </Stack>
      </Card>

      {props.renderDefault(props)}
    </Stack>
  )
}
