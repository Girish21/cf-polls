// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    setRef: 'SET_REF'
    focus: 'FOCUS' | 'SET_REF'
    setOption: 'SET_OPTION'
    notifyParent: 'SET_OPTION'
  }
  internalEvents: {
    '': { type: '' }
    'xstate.init': { type: 'xstate.init' }
  }
  invokeSrcNameMap: {}
  missingImplementations: {
    actions: never
    services: never
    guards: never
    delays: never
  }
  eventsCausingServices: {}
  eventsCausingGuards: {
    isAdded: ''
    isEditable: ''
  }
  eventsCausingDelays: {}
  matchesStates: 'idle' | 'editing' | 'focus' | 'readonly'
  tags: never
}
