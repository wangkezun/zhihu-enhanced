export class DomDispatcher {
  constructor() {
    this._processors = new Map()
    this._observer = null
    this._combined = ''
  }

  register(selector, processor) {
    if (!this._processors.has(selector)) {
      this._processors.set(selector, [])
    }
    this._processors.get(selector).push(processor)
    this._rebuildCombined()
  }

  unregister(selector, processor) {
    const list = this._processors.get(selector)
    if (!list) return
    const idx = list.indexOf(processor)
    if (idx !== -1) list.splice(idx, 1)
    if (list.length === 0) this._processors.delete(selector)
    this._rebuildCombined()
  }

  _rebuildCombined() {
    this._combined = Array.from(this._processors.keys()).join(',')
  }

  start(target) {
    if (this._observer) return
    this._observer = new MutationObserver((mutations) => {
      const combined = this._combined
      if (!combined) return
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== Node.ELEMENT_NODE) continue
          // Layer 1: 快速放行
          if (!n.matches?.(combined) && !n.querySelector(combined)) continue
          // Layer 2: 一次 QSA + 分发
          const matches = n.matches(combined)
            ? [n, ...n.querySelectorAll(combined)]
            : n.querySelectorAll(combined)
          for (const el of matches) {
            for (const [sel, fns] of this._processors) {
              if (el.matches(sel)) {
                for (const fn of fns) fn(el)
              }
            }
          }
        }
      }
    })
    this._observer.observe(target || document.body, {
      childList: true,
      subtree: true,
    })
  }

  stop() {
    if (this._observer) {
      this._observer.disconnect()
      this._observer = null
    }
  }
}
