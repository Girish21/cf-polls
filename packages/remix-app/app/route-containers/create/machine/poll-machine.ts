import type { InterpreterFrom } from 'xstate'
import { assign, createMachine, spawn } from 'xstate'
import { send } from 'xstate/lib/actions'
import type { PollItem, PollItemMachine } from './poll-item-machine'
import { createPollItemMachine } from './poll-item-machine'

export let pollMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./poll-machine.typegen').Typegen0,
    initial: 'idle',
    schema: { context: {} as TContext, events: {} as TEvent },
    preserveActionOrder: true,
    states: {
      idle: {
        entry: 'initialize',
        always: [
          { target: 'editing', cond: 'isEditable' },
          { target: 'readonly' },
        ],
      },
      editing: {
        on: {
          SET_TITLE: {
            actions: 'setTitle',
          },
          ADD_OPTION: {
            actions: 'addOption',
          },
          SET_OPTION: {
            actions: ['setOption'],
          },
          DELETE: {
            target: 'deleting',
            actions: 'findIndex',
            cond: 'isDeletable',
          },
        },
      },
      readonly: {},
      deleting: {
        initial: 'delete',
        states: {
          delete: {
            entry: 'delete',
            always: 'focusNext',
          },
          focusNext: {
            entry: ['focusNext', 'sendClearIndex'],
            on: {
              CLEAR_DELETE_INDEX: {
                target: 'clearIndex',
              },
            },
          },
          clearIndex: {
            entry: 'clearIndex',
            type: 'final',
          },
        },
        onDone: {
          target: 'editing',
        },
      },
    },
  },
  {
    actions: {
      initialize: assign({
        options: ctx => {
          return ctx.options.length > 0
            ? ctx.options.map(({ id, option, votes }) =>
                createOption({ editable: ctx.editable, id, option, votes }),
              )
            : [createOption({ editable: ctx.editable })]
        },
      }),
      setTitle: assign({ title: (_, event) => event.title }),
      setOption: assign({
        options: (ctx, event) => {
          let id = event.id,
            option = event.option
          let index = ctx.options.findIndex(({ id: _id }) => _id === id)

          if (index === -1) {
            throw new Error('Invalid operation!')
          }

          return [
            ...ctx.options.slice(0, index),
            { ...ctx.options[index], option },
            ...ctx.options.slice(index + 1),
          ]
        },
      }),
      addOption: assign({
        options: ctx => {
          return [
            ...ctx.options,
            createOption({ editable: ctx.editable, added: true }),
          ]
        },
      }),
      findIndex: assign({
        deleteIndex: (ctx, event) => {
          let id = event.id
          let index = ctx.options.findIndex(({ id: _id }) => _id === id)

          if (index === -1) {
            throw new Error('Invalid operation!')
          }

          return index
        },
      }),
      delete: assign({
        options: ctx => {
          return [
            ...ctx.options.slice(0, ctx.deleteIndex),
            ...ctx.options.slice(ctx.deleteIndex + 1),
          ]
        },
      }),
      focusNext: ctx => {
        let index = ctx.deleteIndex - 1

        if (index >= ctx.options.length) {
          index = 0
        }

        ctx.options[index].ref.send({ type: 'FOCUS' })
      },
      sendClearIndex: send({ type: 'CLEAR_DELETE_INDEX' }),
      clearIndex: assign({ deleteIndex: _ => -1 }),
    },
    guards: {
      isEditable: ctx => ctx.editable,
      isDeletable: ctx => ctx.options.length > 1,
    },
  },
)

function createOption({
  added = false,
  editable,
  id = crypto.randomUUID(),
  option = '',
  votes = 0,
}: {
  added?: boolean
  editable: boolean
  id?: string
  option?: string
  votes?: number
}): TContext['options'][number] {
  return {
    id,
    option,
    votes,
    ref: spawn(
      createPollItemMachine({ added, editable, id, option, votes }),
      `option-${id}`,
    ),
  }
}

export type PollMachine = InterpreterFrom<typeof pollMachine>

type TContext = {
  deleteIndex: number
  editable: boolean
  options: Array<Omit<PollItem, 'editable'> & { ref: PollItemMachine }>
  title: string
}

type TEvent =
  | { type: 'EDITABLE' }
  | { type: 'OBSERVE' }
  | { type: 'SET_TITLE'; title: string }
  | { type: 'ADD_OPTION' }
  | { type: 'SET_OPTION'; id: string; option: string }
  | { type: 'DELETE'; id: string }
  | { type: 'CLEAR_DELETE_INDEX' }
