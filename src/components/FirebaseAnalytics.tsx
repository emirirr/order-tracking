'use client'
import { useEffect } from 'react'
import { analytics } from '@/lib/firebase'
import { logEvent } from 'firebase/analytics'

export default function FirebaseAnalytics() {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view')
    }
  }, [])
  return null
} 