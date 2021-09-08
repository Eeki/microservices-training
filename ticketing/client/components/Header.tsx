import React from 'react'
import Link from 'next/link'

import type { CurrentUser } from '../types'

interface LinkType {
  label: string
  href: string
}

export default function Header({ currentUser }: CurrentUser): JSX.Element {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ].filter((linkConfig) => linkConfig) as LinkType[]

  const linkElements = links.map(({ href, label }) => (
    <li key={href} className="nav-item">
      <Link href={href}>
        <a className="nav-link">{label}</a>
      </Link>
    </li>
  ))

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/">
          <a className="navbar-brand">GetTix</a>
        </Link>
        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center">{linkElements}</ul>
        </div>
      </div>
    </nav>
  )
}
