'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
<<<<<<< HEAD
  const [role, setRole] = useState('CUSTOMER') // Default role
=======
  const [role, setRole] = useState('CUSTOMER')
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
<<<<<<< HEAD
      
      // Create user document with UID as document ID in Firestore
=======
      // Create user document with UID as document ID
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
<<<<<<< HEAD
        role, // Save the selected role
        createdAt: new Date().toISOString()
      })

      // Redirect based on role
      switch (role) {
        case 'ADMIN':
          router.push('/admin/dashboard')
          break
        case 'PRODUCTION_MANAGER':
          router.push('/production/dashboard')
          break
        case 'DELIVERY_DRIVER':
          router.push('/delivery/dashboard')
          break
        default:
          router.push('/dashboard') // Default for CUSTOMER
      }
    } catch (err: any) {
      if (err instanceof FirebaseError && err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi zaten kullanımda. Lütfen başka bir e-posta adresi deneyin veya giriş yapın.')
      } else {
        setError(err.message || 'Bir hata oluştu')
=======
        role,
        createdAt: new Date()
      })
      router.push('/dashboard')
    } catch (err) {
      if (err instanceof FirebaseError && err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi zaten kullanımda. Lütfen başka bir e-posta adresi deneyin veya giriş yapın.')
      } else {
        setError((err as Error).message)
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Kayıt Ol</h1>
          {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-6">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">İsim</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rol</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="CUSTOMER">Müşteri</option>
<<<<<<< HEAD
                <option value="ADMIN">Admin</option>
                <option value="PRODUCTION_MANAGER">Üretim Sorumlusu</option>
                <option value="DELIVERY_DRIVER">Teslimatçı</option>
=======
                <option value="PRODUCTION_MANAGER">Üretim Sorumlusu</option>
                <option value="DELIVERY_DRIVER">Teslimatçı</option>
                <option value="ADMIN">Admin</option>
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
              disabled={loading}
            >
              Kayıt Ol
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 