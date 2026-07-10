'use client'

export type ListField = { key: string; label: string; multiline?: boolean }

type Props = {
  value: string
  fields: ListField[]
  onChange: (json: string) => void
  addLabel?: string
}

export default function ListEditor({ value, fields, onChange, addLabel = '項目を追加' }: Props) {
  const items: Record<string, string>[] = (() => {
    try { return JSON.parse(value) } catch { return [] }
  })()

  function update(i: number, key: string, val: string) {
    const updated = items.map((item, idx) => idx === i ? { ...item, [key]: val } : item)
    onChange(JSON.stringify(updated))
  }

  function add() {
    const empty = Object.fromEntries(fields.map(f => [f.key, '']))
    onChange(JSON.stringify([...items, empty]))
  }

  function remove(i: number) {
    onChange(JSON.stringify(items.filter((_, idx) => idx !== i)))
  }

  function move(i: number, dir: -1 | 1) {
    const arr = [...items]
    const j = i + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    onChange(JSON.stringify(arr))
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400 font-medium">{i + 1}</span>
            <div className="flex gap-1">
              <button onClick={() => move(i, -1)} className="text-gray-400 hover:text-navy text-xs px-1.5 py-0.5 rounded">↑</button>
              <button onClick={() => move(i, 1)} className="text-gray-400 hover:text-navy text-xs px-1.5 py-0.5 rounded">↓</button>
              <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs px-1.5 py-0.5 rounded">削除</button>
            </div>
          </div>
          <div className="space-y-2">
            {fields.map(({ key, label, multiline }) => (
              <div key={key}>
                <label className="text-xs text-gray-500 block mb-0.5">{label}</label>
                {multiline ? (
                  <textarea
                    className="admin-input min-h-[60px] text-sm"
                    value={item[key] ?? ''}
                    onChange={e => update(i, key, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    className="admin-input text-sm"
                    value={item[key] ?? ''}
                    onChange={e => update(i, key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={add} className="text-xs border border-navy text-navy rounded px-3 py-1.5 hover:bg-navy hover:text-white transition-colors">
        + {addLabel}
      </button>
    </div>
  )
}
