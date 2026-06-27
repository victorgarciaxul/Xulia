'use client'

import { AVAILABLE_MODELS } from '@/lib/openrouter/models'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  onChange: (modelId: string) => void
  userRole?: string
  canUsePaidModels?: boolean
}

export function ModelSelector({ value, onChange, canUsePaidModels = false }: Props) {
  const available = AVAILABLE_MODELS.filter(m => m.is_free || canUsePaidModels)

  return (
    <div className="flex flex-wrap gap-1.5">
      {available.map(model => {
        const isSelected = value === model.id
        return (
          <button
            key={model.id}
            onClick={() => onChange(model.id)}
            title={model.description}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border',
              isSelected
                ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
            )}
          >
            <span>{model.name}</span>
            {model.is_free ? (
              <span className={cn(
                'text-[10px] px-1 rounded',
                isSelected ? 'bg-violet-500 text-violet-100' : 'bg-green-100 text-green-600'
              )}>
                FREE
              </span>
            ) : (
              <span className={cn(
                'text-[10px] px-1 rounded',
                isSelected ? 'bg-violet-500 text-violet-100' : 'bg-amber-100 text-amber-600'
              )}>
                PRO
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
