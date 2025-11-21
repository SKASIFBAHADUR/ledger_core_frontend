import { useEffect } from 'react'

const DEFAULT_TITLE = 'LedgerCore Banking'
const DEFAULT_DESCRIPTION =
  'LedgerCore Banking delivers secure customer, account, ledger, and transaction management for modern financial teams.'
const DEFAULT_KEYWORDS =
  'LedgerCore, banking software, core banking, customer management, account management, ledger, transactions'

const ensureMetaTag = (attribute, value) => {
  if (typeof document === 'undefined') return null
  let element = document.head.querySelector(`meta[${attribute}="${value}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, value)
    document.head.appendChild(element)
  }
  return element
}

const updateMetaTag = (attribute, value, content) => {
  if (typeof document === 'undefined' || !content) return
  const element = ensureMetaTag(attribute, value)
  if (element) {
    element.setAttribute('content', content)
  }
}

const usePageMetadata = ({ title, description, keywords } = {}) => {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const pageTitle = title ? `${title} • ${DEFAULT_TITLE}` : DEFAULT_TITLE
    const pageDescription = description || DEFAULT_DESCRIPTION
    const pageKeywords = keywords || DEFAULT_KEYWORDS

    document.title = pageTitle
    updateMetaTag('name', 'description', pageDescription)
    updateMetaTag('name', 'keywords', pageKeywords)
    updateMetaTag('property', 'og:title', pageTitle)
    updateMetaTag('property', 'og:description', pageDescription)
    updateMetaTag('name', 'twitter:title', pageTitle)
    updateMetaTag('name', 'twitter:description', pageDescription)
  }, [title, description, keywords])
}

export default usePageMetadata

