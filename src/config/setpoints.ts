import getEntityType from '../getEntityType'
const DUAL = 'dual' as const

export interface Setpoint {
  hide?: boolean
}

export type Setpoints = Record<string, Setpoint>

export function parseSetpoints(setpoints: Setpoints | false, attributes: any) {
  if (setpoints === false) {
    return {}
  }

  if (setpoints) {
    const def = Object.keys(setpoints)
    return def.reduce((result, name: string) => {
      const sp = setpoints[name]
      return {
        ...result,
        [name]: attributes?.[name],
      }
    }, {})
  }
  const entityType = getEntityType(attributes)
  if (entityType === DUAL) {
    return {
      target_temp_low: attributes.target_temp_low,
      target_temp_high: attributes.target_temp_high,
    }
  }
  return {
    temperature: attributes.temperature,
  }
}

export function filterSetpoints(setpoints: Setpoints | false, temps: any) {
  let def = Object.keys(temps)
  return def.reduce((result, name: string) => {
    if (setpoints && setpoints.hasOwnProperty(name)) {
      const sp = setpoints[name]
      if (sp?.hide) return result
    }
    return {
      ...result,
      [name]: true,
    }
  }, {})
}
