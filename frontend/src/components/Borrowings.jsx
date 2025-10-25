import { useEffect, useMemo, useState } from 'react'
import { addDays, toISODateInput } from '../utils'
import './AdminTheme.css'
import { api } from '../api'

const STORAGE_KEY = 'borrowings'

function emptyForm() {
  const borrowDate = new Date()
  const dueDate = addDays(borrowDate, 14)
  return {
    _id: '',
    borrowingNumber: '',
    memberId: '',
    bookId: '',
    borrowDate: toISODateInput(borrowDate),
    dueDate: toISODateInput(dueDate),
    returnDate: '',
    status: 'ACTIVE',
    lateFee: 0,
  }
}

export default function Borrowings() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm())
  const [editingId, setEditingId] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    function load() { api.listBorrowings().then(setItems).catch(() => {}) }
    load()
    const handler = () => load()
    window.addEventListener('borrowings:refresh', handler)
    return () => window.removeEventListener('borrowings:refresh', handler)
  }, [])

  const visibleItems = useMemo(() => {
    let filtered = items
    if (filter === 'ACTIVE') filtered = filtered.filter((it) => it.status === 'ACTIVE')
    if (filter === 'RETURNED') filtered = filtered.filter((it) => it.status === 'RETURNED')

    if (search.trim() !== '') {
      const lower = search.toLowerCase()
      filtered = filtered.filter(
        (it) =>
          it.bookId.toLowerCase().includes(lower) ||
          it.memberId.toLowerCase().includes(lower) ||
          toISODateInput(it.borrowDate).includes(lower)
      )
    }
    return filtered
  }, [items, filter, search])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function createBorrowing(e) {
    e.preventDefault()
    const payload = {
      memberId: form.memberId,
      bookId: form.bookId,
      borrowDate: form.borrowDate,
      dueDate: form.dueDate,
      returnDate: form.returnDate || null,
    }
    const created = await api.createBorrowing(payload)
    setItems((prev) => [created, ...prev])
    setForm(emptyForm())
  }

  function startEdit(id) {
    const item = items.find((it) => it.id === id)
    if (!item) return
    setEditingId(id)
    setForm({
      _id: id,
      borrowingNumber: item.borrowingNumber,
      memberId: item.memberId,
      bookId: item.bookId,
      borrowDate: toISODateInput(item.borrowDate),
      dueDate: toISODateInput(item.dueDate),
      returnDate: item.returnDate ? toISODateInput(item.returnDate) : '',
      status: item.status,
      lateFee: item.lateFee,
    })
  }

  async function saveEdit(e) {
    e.preventDefault()
    const payload = {
      memberId: form.memberId,
      bookId: form.bookId,
      borrowDate: form.borrowDate,
      dueDate: form.dueDate,
      returnDate: form.returnDate || null,
    }
    const updated = await api.updateBorrowing(editingId, payload)
    setItems((prev) => prev.map((it) => (it.id === editingId ? updated : it)))
    setEditingId('')
    setForm(emptyForm())
  }

  function cancelEdit() {
    setEditingId('')
    setForm(emptyForm())
  }

  async function remove(id) {
    if (window.confirm('Are you sure you want to delete this borrowing record? This action cannot be undone.')) {
      await api.deleteBorrowing(id)
      setItems((prev) => prev.filter((it) => it.id !== id))
      if (editingId === id) cancelEdit()
    }
  }

  async function markReturned(id) {
    const updated = await api.returnBorrowing(id)
    setItems((prev) => prev.map((it) => (it.id === id ? updated : it)))
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <div className="admin-form-container">
        <div className="admin-form-header">
          <h2>Borrowings Management</h2>
          <div className="admin-flex admin-gap-md">
            <input
              type="text"
              className="admin-search-input"
              placeholder="Search Book ID, Member ID, Borrow Date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '400px' }}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="admin-filter-select">
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="RETURNED">Returned</option>
            </select>
          </div>
        </div>

        <form onSubmit={editingId ? saveEdit : createBorrowing}>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>Member ID</label>
              <input
                name="memberId"
                value={form.memberId}
                onChange={handleChange}
                placeholder="member ObjectId or code"
                required
                className="admin-form-input"
              />
            </div>
            <div className="admin-form-group">
              <label>Book ID</label>
              <input
                name="bookId"
                value={form.bookId}
                onChange={handleChange}
                placeholder="book ObjectId or code"
                required
                className="admin-form-input"
              />
            </div>
            <div className="admin-form-group">
              <label>Borrow Date</label>
              <input type="date" name="borrowDate" value={form.borrowDate} onChange={handleChange} required className="admin-form-input" />
            </div>
            <div className="admin-form-group">
              <label>Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required className="admin-form-input" />
            </div>
            <div className="admin-form-group">
              <label>Return Date</label>
              <input type="date" name="returnDate" value={form.returnDate} onChange={handleChange} className="admin-form-input" />
            </div>
          </div>

          <div className="admin-flex admin-gap-md" style={{ marginTop: '20px' }}>
            {editingId ? (
              <>
                <button type="submit" className="admin-btn admin-btn-primary">Save</button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={cancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <button type="submit" className="admin-btn admin-btn-primary">Create</button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Borrow No</th>
              <th>Member</th>
              <th>Book</th>
              <th>Borrow</th>
              <th>Due</th>
              <th>Return</th>
              <th>Status</th>
              <th>Late Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((it, idx) => (
              <tr key={it.id}>
                <td>{idx + 1}</td>
                <td>{it.borrowingNumber}</td>
                <td>{it.memberId}</td>
                <td>{it.bookId}</td>
                <td>{toISODateInput(it.borrowDate)}</td>
                <td>{toISODateInput(it.dueDate)}</td>
                <td>{it.returnDate ? toISODateInput(it.returnDate) : '-'}</td>
                <td>
                  <span className={`admin-badge ${it.status === 'ACTIVE' ? 'admin-badge-warning' : 'admin-badge-success'}`}>
                    {it.status}
                  </span>
                </td>
                <td>Rs. {it.lateFee || 0}</td>
                <td>
                  <div className="admin-flex admin-gap-sm">
                    <button className="admin-btn admin-btn-sm admin-btn-info" onClick={() => startEdit(it.id)}>
                      Edit
                    </button>
                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => remove(it.id)}>
                      Delete
                    </button>
                    {it.status !== 'RETURNED' && (
                      <button className="admin-btn admin-btn-sm admin-btn-success" onClick={() => markReturned(it.id)}>
                        Return
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {visibleItems.length === 0 && (
              <tr>
                <td colSpan={10} className="admin-text-center" style={{ padding: '40px', color: 'var(--admin-gray-500)', fontStyle: 'italic' }}>
                  No records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
