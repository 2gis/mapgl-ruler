const DEFAULT_LOCALE = 'en';

const DICTIONARY = {
    start: {
        en: 'Start',
        ru: 'Старт',
    },
    addPoint: {
        en: 'Add point',
        ru: 'Добавить точку',
    },
    meter: {
        en: 'm',
        ru: 'м',
    },
    kilometer: {
        en: 'km',
        ru: 'км',
    },
} as const;

type L10nKey = keyof typeof DICTIONARY;

/**
 * @hidden
 * @internal
 */
export function getTranslation(key: L10nKey, locale: string = DEFAULT_LOCALE) {
    return DICTIONARY[key][locale] ?? DICTIONARY[key][DEFAULT_LOCALE];
}
