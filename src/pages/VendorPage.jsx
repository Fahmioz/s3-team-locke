import { Link, useParams, useSearchParams } from 'react-router'
import { useEffect, useState } from 'react'
import { useVendor } from '../hooks/useVendor.js'
import MenuList from '../components/MenuList.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import { useAuth } from '../hooks/useAuth.js'

function VendorPage() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [category, setCategory] = useState(() => params.get('cat') ?? '')
  const { vendor, menu, categories, loading, error } = useVendor(id, category)

  useEffect(() => {
    async function loadPreferredCategory() {
      await Promise.resolve()
      if (authLoading) return

      const urlCategory = params.get('cat') ?? ''
      if (urlCategory || !user) {
        setCategory(urlCategory)
        return
      }

      const storageKey = `ce-category-${user.uid}`
      const savedCategory = localStorage.getItem(storageKey) ?? ''
      setCategory(savedCategory)
      if (savedCategory) setParams({ cat: savedCategory }, { replace: true })
    }

    loadPreferredCategory()
  }, [authLoading, params, setParams, user])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />

  if (!vendor) {
    return (
      <section>
        <h2 className="section-title">Vendor not found</h2>
        <p className="muted">
          There is no vendor called "{id}".{' '}
          <Link to="/">Back to vendors</Link>
        </p>
      </section>
    )
  }

  const items = menu.map((item) => ({ ...item, vendorId: id, vendorName: vendor.name }))

  return (
    <section>
      <p><Link to="/">← All vendors</Link></p>
      <h2 className="section-title">{vendor.name}</h2>
      <p className="muted">{vendor.location} · {vendor.openHours}</p>
      <div className="category-filters">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-filter${category === cat ? ' active' : ''}`}
            onClick={() => {
              const nextCategory = cat === 'All' ? '' : cat
              setCategory(nextCategory)
              setParams({ cat: nextCategory })
              if (user) {
                localStorage.setItem(`ce-category-${user.uid}`, nextCategory)
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      <MenuList items={items} />
    </section>
  )
}

export default VendorPage
