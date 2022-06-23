// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    setTitle: 'SET_TITLE'
    addOption: 'ADD_OPTION'
    setOption: 'SET_OPTION'
    findIndex: 'DELETE'
    initialize: 'xstate.init'
    delete: 'DELETE'
    focusNext: ''
    sendClearIndex: ''
    clearIndex: 'CLEAR_DELETE_INDEX'
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
    isEditable: ''
    isDeletable: 'DELETE'
  }
  eventsCausingDelays: {}
  matchesStates:
    | 'idle'
    | 'editing'
    | 'readonly'
    | 'deleting'
    | 'deleting.delete'
    | 'deleting.focusNext'
    | 'deleting.clearIndex'
    | { deleting?: 'delete' | 'focusNext' | 'clearIndex' }
  tags: never
}
