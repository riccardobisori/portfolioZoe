import PreviewLayoutInput from './components/PreviewLayoutInput'
import type { ReactNode } from 'react'

type ValidationRule = {
    required: () => ValidationRule
    min: (value: number) => ValidationRule
    max: (value: number) => ValidationRule
}

const PRESET_POSITION_OPTIONS = [
    { title: 'Auto', value: 'auto' },
    { title: 'Sinistra Alta', value: 'leftTop' },
    { title: 'Centro Alto', value: 'centerTop' },
    { title: 'Destra Alta', value: 'rightTop' },
    { title: 'Destra Stretta Alta', value: 'rightNarrowTop' },
    { title: 'Sinistra Centro', value: 'leftBottom' },
    { title: 'Centro', value: 'centerBottom' },
    { title: 'Destra Centro', value: 'rightBottom' },
    { title: 'Destra Stretta Centro', value: 'rightNarrowBottom' },
    { title: 'Sinistra Bassa', value: 'leftThird' },
    { title: 'Centro Basso', value: 'centerThird' },
    { title: 'Destra Bassa', value: 'rightThird' },
    { title: 'Destra Stretta Bassa', value: 'rightNarrowThird' },
]

const homePreviewCard = {
    name: 'homePreviewCard',
    title: 'Home Preview Card',
    type: 'document',
    fields: [
        {
            name: 'project',
            title: 'Progetto',
            type: 'reference',
            to: [{ type: 'project' }],
            validation: (Rule: ValidationRule) => Rule.required(),
            description: 'Progetto di destinazione (Works o Series).',
        },
        {
            name: 'image',
            title: 'Immagine Card',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule: ValidationRule) => Rule.required(),
            description: 'Foto specifica per questa card nella mixed preview home.',
        },
        {
            name: 'previewLayout',
            title: 'Layout Home',
            type: 'object',
            options: { collapsible: true, collapsed: true },
            components: { input: PreviewLayoutInput },
            fields: [
                {
                    name: 'preset',
                    title: 'Preset posizione',
                    type: 'string',
                    initialValue: 'auto',
                    options: {
                        list: PRESET_POSITION_OPTIONS,
                    },
                },
                {
                    name: 'x',
                    title: 'X (%)',
                    type: 'number',
                    validation: (Rule: ValidationRule) => Rule.min(0).max(90),
                },
                {
                    name: 'y',
                    title: 'Y (%)',
                    type: 'number',
                    validation: (Rule: ValidationRule) => Rule.min(0).max(95),
                },
                {
                    name: 'width',
                    title: 'Larghezza (%)',
                    type: 'number',
                    validation: (Rule: ValidationRule) => Rule.min(10).max(45),
                },
                {
                    name: 'z',
                    title: 'Profondita z-index',
                    type: 'number',
                    validation: (Rule: ValidationRule) => Rule.min(1).max(10),
                },
                {
                    name: 'preferred',
                    title: 'Preferenza orientamento',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Auto', value: 'any' },
                            { title: 'Orizzontale', value: 'landscape' },
                            { title: 'Verticale', value: 'portrait' },
                        ],
                    },
                },
            ],
        },
        {
            name: 'order',
            title: 'Ordine',
            type: 'number',
            initialValue: 100,
            description: 'Ordine manuale delle card in home (crescente).',
        },
        {
            name: 'enabled',
            title: 'Attiva',
            type: 'boolean',
            initialValue: true,
        },
    ],
    preview: {
        select: {
            title: 'project.title',
            subtitle: 'project.kind',
            media: 'image',
        },
        prepare(selection: { title?: string; subtitle?: string; media?: ReactNode }) {
            return {
                title: selection.title ?? 'Card senza progetto',
                subtitle: selection.subtitle ?? 'home preview card',
                media: selection.media,
            }
        },
    },
}

export default homePreviewCard
