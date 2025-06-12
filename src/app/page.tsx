import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-8">Global Sipariş Takip Sistemi</h1>
          <p className="text-xl mb-12">Siparişlerinizi dünyanın her yerinden takip edin</p>
          
          <div className="space-x-4">
            <Link 
              href="/track"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Sipariş Takip
            </Link>
            <Link 
              href="/login"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Giriş Yap
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Gerçek Zamanlı Takip</h3>
            <p>Siparişlerinizin durumunu anlık olarak takip edin</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Global Erişim</h3>
            <p>Dünyanın her yerinden siparişlerinize erişin</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Bildirimler</h3>
            <p>Önemli güncellemelerden anında haberdar olun</p>
          </div>
        </div>
      </div>
    </main>
  )
}
