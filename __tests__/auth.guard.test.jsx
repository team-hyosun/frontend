import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { routesConfig } from '../src/routers/router'
import { renderWithRouter } from './test-utils'

describe('Auth Guard', () => {
  it('remember=false → 보호 라우트 진입 시 /auth/login 리다이렉트', async () => {
    localStorage.removeItem('remember')
    sessionStorage.removeItem('AT')

    renderWithRouter(routesConfig, ['/'])

    expect(
      await screen.findByRole('button', { name: /로그인/ })
    ).toBeInTheDocument()
  })
})
