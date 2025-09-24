import { useEffect, useMemo, useState } from 'react'
import { toISODateInput } from '../utils'
import './Reservations.css'
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
    await api.deleteReservation(id)
    setItems((prev) => prev.filter((it) => it.id !== id))
    if (editingId === id) cancelEdit()
  }

  async function markReceived(id) {
    const updated = await api.receiveReservation(id)
    setItems((prev) => prev.map((it) => (it.id === id ? updated : it)))
    // Notify other screens (e.g., Borrowings) to refresh
    window.dispatchEvent(new Event('borrowings:refresh'))
  }

  return (
    <div className="section reservations">
      <form className="card form" onSubmit={editingId ? saveEdit : createReservation}>
        <div className="form-header">
          <h2>Reservations Management</h2>
          <div className="toolbar">
            <label>Status Filter</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="RECEIVED">Received</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="grid">
          <div>
            <label>Member ID</label>
            <input name="memberId" value={form.memberId} onChange={handleChange} placeholder="member ObjectId or code" required />
          </div>
          <div>
            <label>Book ID</label>
            <input name="bookId" value={form.bookId} onChange={handleChange} placeholder="book ObjectId or code" required />
          </div>
          <div>
            <label>Reservation Date</label>
            <input type="date" name="reservationDate" value={form.reservationDate} onChange={handleChange} required />
          </div>
          <div>
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="PENDING">PENDING</option>
              <option value="RECEIVED">RECEIVED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
        <div className="actions">
          {editingId ? (
            <>
              <button type="submit">Save</button>
              <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <button type="submit">Create</button>
          )}
        </div>
      </form>

      <div className="card table">
        <table>
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
                  <span className={`badge ${it.status === 'PENDING' ? 'warning' : it.status === 'RECEIVED' ? 'success' : 'secondary'}`}>{it.status}</span>
                </td>
                <td className="row-actions">
                  <button className="small" onClick={() => startEdit(it.id)}>Edit</button>
                  <button className="small secondary" onClick={() => remove(it.id)}>Delete</button>
                  {it.status !== 'RECEIVED' && (
                    <button className="small success" onClick={() => markReceived(it.id)}>Mark Received</button>
                  )}
                </td>
              </tr>
            ))}
            {visibleItems.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">No records</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
