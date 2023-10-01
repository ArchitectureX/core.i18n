import React, { createContext, FC, ReactElement, useContext, useMemo } from 'react'
import translations from './translations'

export type Locales = 'de-de' | 'en-gb' | 'en-us' | 'es-mx' | 'fr-fr' | 'it-it' | 'pt-br'
export type Translations = keyof typeof translations

type ContextProps = {
  t: (key: Translations, replacements?: any, forceLocale?: Locales) => string
  locale: Locales
}

const I18nContext = createContext<ContextProps>({} as ContextProps)

type Props = {
  children: ReactElement
  locale: Locales
}

export const I18nProvider: FC<Props> = ({ children, locale = 'en-us' }) => {
  const t = (key: Translations, replacements?: any, forceLocale?: Locales) => {
    const translation = translations[key]
    const currentLocale = forceLocale || locale
    let text = (translation && translation[currentLocale]) || (key as Translations)

    const matches = text.match(/\{(.*?)\}/g)

    if (matches) {
      matches.forEach((match: string) => {
        const tag = match.replace(/[{}]/g, '')
        const replacement = replacements[tag]

        if (replacement) {
          // @ts-ignore
          text = text.replace(`{${tag}}`, replacement) as Translations
        }
      })
    }

    return text
  }

  const context = useMemo(
    () => ({
      locale,
      t
    }),
    [locale, t]
  )

  return <I18nContext.Provider value={context}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
