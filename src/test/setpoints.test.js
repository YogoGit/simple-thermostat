import { parseSetpoints, filterSetpoints } from '../config/setpoints'

test('single setpoint', () => {
  const match = { temperature: 20 }

  expect(
    parseSetpoints(undefined, { temperature: 20, target_temp_low: 19 })
  ).toEqual(match)

  expect(
    parseSetpoints(
      { temperature: null },
      { temperature: 20, target_temp_low: 19 }
    )
  ).toEqual(match)
})

// This shouldn't happen in real entities
test('single dual setpoint', () => {
  expect(
    parseSetpoints(
      { target_temp_low: null, target_temp_high: null },
      { temperature: 20, target_temp_high: 20 }
    )
  ).toEqual({ target_temp_high: 20 })

  expect(
    parseSetpoints(
      { target_temp_low: null, target_temp_high: null },
      { temperature: 20, target_temp_low: 19 }
    )
  ).toEqual({ target_temp_low: 19 })
})

test('single hidden setpoint', () => {
  expect(
    parseSetpoints(
      { temperature: { hide: true } },
      { temperature: 20, target_temp_low: 19 }
    )
  ).toEqual({ temperature: 20 })

  expect(
    parseSetpoints(
      { target_temp_low: { hide: true } },
      { temperature: 20, target_temp_low: 19 }
    )
  ).toEqual({ target_temp_low: 19 })
})

test('dual setpoints', () => {
  const match = { target_temp_high: 20, target_temp_low: 19 }

  expect(parseSetpoints(undefined, match)).toEqual(match)

  expect(
    parseSetpoints({ target_temp_low: null, target_temp_high: null }, match)
  ).toEqual(match)
})

test('dual setpoint define one', () => {
  let result = parseSetpoints(
    { target_temp_high: null },
    { target_temp_high: 20, target_temp_low: 19 }
  )

  expect(result).toEqual({ target_temp_high: 20 })

  result = parseSetpoints(
    { target_temp_low: null },
    { target_temp_high: 20, target_temp_low: 19 }
  )

  expect(result).toEqual({ target_temp_low: 19 })
})

test('dual setpoints hidden one', () => {
  const match = { target_temp_high: 20, target_temp_low: 19 }

  expect(
    parseSetpoints(
      { target_temp_low: { hide: true }, target_temp_high: null },
      match
    )
  ).toEqual(match)

  expect(
    parseSetpoints(
      { target_temp_low: null, target_temp_high: { hide: true } },
      match
    )
  ).toEqual(match)
})

test('dual setpoint hidden two', () => {
  const result = parseSetpoints(
    { target_temp_low: { hide: true }, target_temp_high: { hide: true } },
    { target_temp_high: 20, target_temp_low: 19 }
  )
  expect(result).toEqual({ target_temp_high: 20, target_temp_low: 19 })
})

test('single null hide setpoint', () => {
  const setpoints = undefined
  const result = parseSetpoints(setpoints, {
    temperature: 20,
    target_temp_low: 19,
  })
  expect(result).toEqual({ temperature: 20 })

  const shown = filterSetpoints(setpoints, result)
  expect(shown).toEqual({ temperature: true })
})

test('single not hide setpoint', () => {
  const setpoints = { temperature: null }
  const result = parseSetpoints(setpoints, {
    temperature: 20,
    target_temp_low: 19,
  })
  expect(result).toEqual({ temperature: 20 })

  const shown = filterSetpoints(setpoints, result)
  expect(shown).toEqual({ temperature: true })
})

test('dual not hide setpoint', () => {
  const setpoints = undefined
  const match = {
    target_temp_high: 20,
    target_temp_low: 19,
  }
  const result = parseSetpoints(setpoints, match)
  expect(result).toEqual(match)

  const shown = filterSetpoints(setpoints, result)
  expect(shown).toEqual({
    target_temp_high: true,
    target_temp_low: true,
  })
})

// This shouldn't happen
test('single hide setpoint', () => {
  const setpoints = { temperature: { hide: true } }
  const result = parseSetpoints(setpoints, {
    temperature: 20,
    target_temp_low: 19,
  })
  expect(result).toEqual({ temperature: 20 })

  const shown = filterSetpoints(setpoints, result)
  expect(shown).toEqual({})
})

test('dual setpoint hide high', () => {
  const attr = { target_temp_high: 20, target_temp_low: 19 }
  const setpoints = { target_temp_low: null, target_temp_high: { hide: true } }

  const result = parseSetpoints(setpoints, attr)
  expect(result).toEqual(attr)

  const shown = filterSetpoints(setpoints, result)
  expect(shown).toEqual({ target_temp_low: true })
})

test('dual setpoint hide low', () => {
  const attr = { target_temp_high: 20, target_temp_low: 19 }
  const setpoints = { target_temp_low: { hide: true }, target_temp_high: null }

  const values = parseSetpoints(setpoints, attr)
  expect(values).toEqual(attr)

  const shown = filterSetpoints(setpoints, values)
  expect(shown).toEqual({ target_temp_high: true })
})

// This shouldn't happen
test('dual hide both', () => {
  const attr = { target_temp_high: 20, target_temp_low: 19 }
  const setpoints = {
    target_temp_low: { hide: true },
    target_temp_high: { hide: true },
  }

  const result = parseSetpoints(setpoints, attr)
  expect(result).toEqual(attr)

  const shown = filterSetpoints(setpoints, result)
  expect(shown).toEqual({})
})
