import { AggFunctionOptions } from '@/constants/constants'
export const strEmptyFilter = (type) => {
  return type || '-'
}

export const aggregatorFilter = (value) => {
  const agg = AggFunctionOptions.find(item => {
    return item.value === value
  })

  if (agg) {
    return agg.label
  }

  return value
}
