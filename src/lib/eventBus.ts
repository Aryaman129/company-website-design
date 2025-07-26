// Event Bus for cross-component communication
class EventBus {
  private events: { [key: string]: Function[] } = {}

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(cb => cb !== callback)
  }

  emit(event: string, data?: any) {
    if (!this.events[event]) return
    this.events[event].forEach(callback => callback(data))
  }

  once(event: string, callback: Function) {
    const onceCallback = (data: any) => {
      callback(data)
      this.off(event, onceCallback)
    }
    this.on(event, onceCallback)
  }
}

export const eventBus = new EventBus()

// Event types
export const EVENTS = {
  DATA_UPDATED: 'data_updated',
  PRODUCT_UPDATED: 'product_updated',
  CONTENT_UPDATED: 'content_updated',
  SETTINGS_UPDATED: 'settings_updated',
  MEDIA_UPDATED: 'media_updated',
  TESTIMONIAL_UPDATED: 'testimonial_updated'
} as const
