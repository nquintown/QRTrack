'use client'

import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'

export default function HeroLottie() {
  const [animationData, setAnimationData] = useState(null)

  useEffect(() => {
    fetch('/hero-lottie.json')
      .then((r) => r.json())
      .then(setAnimationData)
  }, [])

  if (!animationData) return <div className="w-56 h-56 mx-auto" />

  return (
    <div className="flex justify-center">
      <Lottie
        animationData={animationData}
        loop
        style={{ width: 224, height: 224 }}
      />
    </div>
  )
}
