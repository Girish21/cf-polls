import type { ActorRefFrom } from 'xstate'
import { assign } from 'xstate'
import { createMachine } from 'xstate'
import { sendParent } from 'xstate/lib/actions'

export let createPollItemMachine = ({
  added = false,
  editable,
  id,
  option,
  votes,
}: {
  added?: boolean
  editable: boolean
} & Omit<PollItem, 'ref'>) =>
  createMachine(
    {
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      tsTypes: {} as import('./poll-item-machine.typegen').Typegen0,
      id: `poll-item-${id}`,
      schema: { context: {} as PollItem, events: {} as TEvent },
      context: { id, option, votes },
      initial: 'idle',
      preserveActionOrder: true,
      states: {
        idle: {
          always: [
            { target: 'focus', cond: 'isAdded' },
            { target: 'editing', cond: 'isEditable' },
            { target: 'readonly' },
          ],
        },
        editing: {
          on: {
            SET_OPTION: {
              actions: ['setOption', 'notifyParent'],
            },
          },
        },
        focus: {
          on: {
            SET_REF: {
              actions: ['setRef', 'focus'],
              target: 'editing',
            },
          },
        },
        readonly: {},
      },
      on: {
        SET_REF: {
          actions: ['setRef'],
        },
        FOCUS: {
          actions: 'focus',
        },
      },
    },
    {
      actions: {
        setOption: assign({ option: (_, event) => event.option }),
        notifyParent: sendParent((_, event) => ({
          type: 'SET_OPTION',
          id: event.id,
          option: event.option,
        })),
        setRef: assign({ domRef: (_, event) => event.domRef }),
        focus: ctx => ctx.domRef?.focus(),
      },
      guards: {
        isEditable: _ => editable,
        isAdded: _ => added,
      },
    },
  )

export type PollItemMachine = ActorRefFrom<typeof createPollItemMachine>

export type PollItem = {
  id: string
  option: string
  votes: number
  domRef?: HTMLDivElement
}

type TEvent =
  | { type: 'FOCUS' }
  | { type: 'SET_OPTION'; id: string; option: string }
  | { type: 'SET_REF'; domRef: HTMLDivElement }
