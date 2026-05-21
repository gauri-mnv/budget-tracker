/* eslint-disable @next/next/no-html-link-for-pages */
import { HandCoins } from 'lucide-react'
import React from 'react'

const Logo = () => {
  return (
    <a href="/" className="flex items-center gap-2">
      <HandCoins className="w-11 h-11 stroke-[1.5] text-[#06acb8]" />

      <p className="font-bold text-3xl bg-gradient-to-r from-[#06acb8] to-[#0778bb] bg-clip-text leading-tight tracking-tighter text-transparent">
        BudgetTracker
      </p>
    </a>
  )
}

export default Logo

export function LogoMobile() {
  return (
    <a href="/" className="flex items-center gap-2">
      <p className="font-bold text-3xl bg-gradient-to-r from-[#06acb8] to-[#0778bb] bg-clip-text leading-tight tracking-tighter text-transparent">
        BudgetTracker
      </p>
    </a>
  )
}