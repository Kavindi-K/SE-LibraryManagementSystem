import { useEffect, useMemo, useState } from 'react'
import { toISODateInput } from '../utils'
import './AdminTheme.css'
import { api } from '../api'

const STORAGE_KEY = 'reservations'

function emptyForm() {
  const reservationDate = new Date()
  return {
    _id: '',
    reservationNumber: '',
    memberId: '',
    bookId: '',
    reservationDate: toISODateInput(reservationDate),
    status: 'PENDING',
  }
}

export default function Reservations() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm())
  const [editingId, setEditingId] = useState('')
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    api.listReservations().then(setItems).catch(() => {})
  }, [])

  const visibleItems = useMemo(() => {
    if (filter === 'ALL') return items
    return items.filter((it) => it.status === filter)
  }, [items, filter])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function createReservation(e) {
    e.preventDefault()
    const payload = { memberId: form.memberId, bookId: form.bookId, reservationDate: form.reservationDate, status: form.status || 'PENDING' }
    const created = await api.createReservation(payload)
    setItems((prev) => [created, ...prev])
    setForm(emptyForm())
  }

  function startEdit(id) {
    const item = items.find((it) => it.id === id)
    if (!item) return
    setEditingId(id)
    setForm({
      _id: id,
      reservationNumber: item.reservationNumber,
      memberId: item.memberId,
      bookId: item.bookId,
      reservationDate: toISODateInput(item.reservationDate),
      status: item.status,
    })
  }

  async function saveEdit(e) {
    e.preventDefault()
    const payload = { memberId: form.memberId, bookId: form.bookId, reservationDate: form.reservationDate, status: form.status }
    const updated = await api.updateReservation(editingId, payload)
    setItems((prev) => prev.map((it) => (it.id === editingId ? updated : it)))
    setEditingId('')
    setForm(emptyForm())
  }

  function cancelEdit() {
    setEditingId('')
    setForm(emptyForm())
  }

  async function remove(id) {
    if (window.confirm('Are you sure you want to delete this reservation? This action cannot be undone.')) {
      await api.deleteReservation(id)
      setItems((prev) => prev.filter((it) => it.id !== id))
      if (editingId === id) cancelEdit()
    }
  }

  async function markReceived(id) {
    const updated = await api.receiveReservation(id)
    setItems((prev) => prev.map((it) => (it.id === id ? updated : it)))
    // Notify other screens (e.g., Borrowings) to refresh
    window.dispatchEvent(new Event('borrowings:refresh'))
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <div className="admin-form-container">
        <div className="admin-form-header">
          <h2>Reservations Management</h2>
          <div className="admin-flex admin-gap-md">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="admin-filter-select">
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="RECEIVED">Received</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
        
        <form onSubmit={editingId ? saveEdit : createReservation}>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>Member ID</label>
              <input name="memberId" value={form.memberId} onChange={handleChange} placeholder="member ObjectId or code" required className="admin-form-input" />
            </div>
            <div className="admin-form-group">
              <label>Book ID</label>
              <input name="bookId" value={form.bookId} onChange={handleChange} placeholder="book ObjectId or code" required className="admin-form-input" />
            </div>
            <div className="admin-form-group">
              <label>Reservation Date</label>
              <input type="date" name="reservationDate" value={form.reservationDate} onChange={handleChange} required className="admin-form-input" />
            </div>
            <div className="admin-form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="admin-form-select">
                <option value="PENDING">PENDING</option>
                <option value="RECEIVED">RECEIVED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
          
          <div className="admin-flex admin-gap-md" style={{ marginTop: '20px' }}>
            {editingId ? (
              <>
                <button type="submit" className="admin-btn admin-btn-primary">Save</button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={cancelEdit}>Cancel</button>
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
              <th>Reserve No</th>
              <th>Member</th>
              <th>Book</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((it, idx) => (
              <tr key={it.id}>
                <td>{idx + 1}</td>
                <td>{it.reservationNumber}</td>
                <td>{it.memberId}</td>
                <td>{it.bookId}</td>
                <td>{toISODateInput(it.reservationDate)}</td>
                <td>
                  <span className={`admin-badge ${it.status === 'PENDING' ? 'admin-badge-warning' : it.status === 'RECEIVED' ? 'admin-badge-success' : 'admin-badge-secondary'}`}>
                    {it.status}
                  </span>
                </td>
                <td>
                  <div className="admin-flex admin-gap-sm">
                    <button className="admin-btn admin-btn-sm admin-btn-info" onClick={() => startEdit(it.id)}>Edit</button>
                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => remove(it.id)}>Delete</button>
                    {it.status !== 'RECEIVED' && (
                      <button className="admin-btn admin-btn-sm admin-btn-success" onClick={() => markReceived(it.id)}>Mark Received</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {visibleItems.length === 0 && (
              <tr>
                <td colSpan={7} className="admin-text-center" style={{ padding: '40px', color: 'var(--admin-gray-500)', fontStyle: 'italic' }}>No records</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
