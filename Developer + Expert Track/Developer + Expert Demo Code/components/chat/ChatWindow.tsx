'use client'

import { useEffect, useMemo, useState } from 'react'
import { useChat, type UIMessage } from '@ai-sdk/react'
import { Streamdown } from 'streamdown'
import { Conversation, ConversationContent } from '@/components/ai-elements/conversation'
import { Message, MessageContent } from '@/components/ai-elements/message'
import { Response } from '@/components/ai-elements/response'
import { RotateCcw, X, Send, CircleStop } from 'lucide-react'

const STORAGE_KEY = 'skymarket.chat.v1'

type UITextPart = { type: 'text'; text: string }
function isTextPart(part: unknown): part is UITextPart {
  if (!part || typeof part !== 'object') return false
  const maybe = part as { type?: unknown; text?: unknown }
  return maybe.type === 'text' && typeof maybe.text === 'string'
}

export function ChatWindow({ onClose }: { onClose: () => void }) {
  const [sessionId, setSessionId] = useState(() => Math.random().toString(36).slice(2))
  const initial = useMemo(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  }, [])

  const chat = useChat({ id: sessionId })
  const messages: UIMessage[] = chat.messages
  const setMessages = chat.setMessages
  const [isStreaming, setIsStreaming] = useState(false)
  const [aborter, setAborter] = useState<AbortController | null>(null)
  const [input, setInput] = useState('')

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)) } catch {}
  }, [messages])

  // hydrate initial messages once
  useEffect(() => {
    if (initial && Array.isArray(initial) && initial.length > 0) {
      setMessages(initial as unknown as UIMessage[])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clear = () => {
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
    setSessionId(Math.random().toString(36).slice(2))
  }

  async function sendAndStream() {
    if (!input.trim() || isStreaming) return
    const userMsg: UIMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      parts: [{ type: 'text', text: input }],
    } as UIMessage
    const base = [...messages, userMsg]
    setMessages(base)
    setInput('')

    const ac = new AbortController()
    setAborter(ac)
    setIsStreaming(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: base }),
        signal: ac.signal,
      })
      if (!res.body) {
        setIsStreaming(false)
        setAborter(null)
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''
      // add assistant placeholder
      let assistant = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        parts: [{ type: 'text', text: '' }],
      } as UIMessage
      setMessages(prev => [...prev, assistant])

      // stream chunks
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value, { stream: true })
        const updated = { ...assistant, parts: [{ type: 'text', text: assistantText }] }
        setMessages(prev => [...prev.slice(0, prev.length - 1), updated as UIMessage])
        assistant = updated as UIMessage
      }
    } catch {
      // swallow network aborts; could toast otherwise
    } finally {
      setIsStreaming(false)
      setAborter(null)
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b px-2 py-1">
        <div className="px-1 text-sm font-medium">Assistant</div>
        <div className="flex items-center gap-1">
          {isStreaming ? (
            <button
              onClick={() => aborter?.abort()}
              aria-label="Stop"
              className="rounded p-1 hover:bg-gray-100"
            >
              <CircleStop className="h-4 w-4" />
            </button>
          ) : null}
          <button onClick={clear} aria-label="Clear" className="rounded p-1 hover:bg-gray-100">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Conversation className="flex-1 overflow-y-auto p-2">
        <ConversationContent>
          {messages.map((message) => (
            <Message from={message.role} key={message.id}>
              <MessageContent>
                {message.parts
                  .filter(isTextPart)
                  .map((part, i) => (
                    <Response key={`${message.id}-${i}`}>
                      <Streamdown>{part.text}</Streamdown>
                    </Response>
                  ))}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
      </Conversation>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void sendAndStream()
        }}
        className="flex gap-2 border-t p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border px-4 py-2"
        />
        <button className="flex items-center gap-1 rounded-full bg-black px-4 py-2 text-white" disabled={isStreaming}>
          <Send className="h-4 w-4" />
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatWindow


