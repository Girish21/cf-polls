import { useActor, useInterpret, useSelector } from '@xstate/react'
import * as React from 'react'
import { ContentEditable } from '~/components'
import type { PollItemMachine, PollMachine } from './machine'
import { pollMachine } from './machine'

function TitleEditable({ service }: { service: PollMachine }) {
  return (
    <div className='mt-8 md:mt-16'>
      <ContentEditable
        autoFocus
        inputProps={{ name: 'title', required: true }}
        placeholder='Which came first, Chicken or Egg?'
        onContentChange={value =>
          service.send({ type: 'SET_TITLE', title: value })
        }
        size='lg'
      />
    </div>
  )
}

function OptionEditable({ actorRef, service }: OptionActorType) {
  let [state, send] = useActor(actorRef)
  let ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (ref.current) {
      send({ type: 'SET_REF', domRef: ref.current })
    }
  }, [send])

  let { id } = state.context

  return (
    <ContentEditable
      ref={ref}
      size='md'
      defaultValue={state.context.option}
      onContentChange={option => send({ type: 'SET_OPTION', id, option })}
      onDelete={() => service.send({ type: 'DELETE', id })}
      onEnter={() => service.send({ type: 'ADD_OPTION' })}
      placeholder='Chicken'
    />
  )
}

function Item({ actorRef, service }: OptionActorType) {
  return (
    <li>
      <OptionEditable actorRef={actorRef} service={service} />
    </li>
  )
}
let ItemMemo = React.memo(Item)

function List({ service }: { service: PollMachine }) {
  const list = useSelector(service, state => state.context.options)

  return (
    <ol className='mt-8 flex flex-col gap-3 md:mt-16'>
      {list.map(({ id, ref }) => (
        <ItemMemo key={id} actorRef={ref} service={service} />
      ))}
    </ol>
  )
}

export default function Create() {
  let service = useInterpret(
    pollMachine.withContext({
      editable: true,
      title: '',
      options: [],
      deleteIndex: -1,
    }),
  )

  React.useEffect(() => {
    // service.onTransition(state => {
    //   console.log(state)
    // })
  }, [service])

  return (
    <section className='flex flex-1 flex-col items-center'>
      <div className='w-[min(60ch,100vw-2rem)]'>
        <TitleEditable service={service} />
        <List service={service} />
      </div>
    </section>
  )
}

type OptionActorType = {
  actorRef: PollItemMachine
  service: PollMachine
}
