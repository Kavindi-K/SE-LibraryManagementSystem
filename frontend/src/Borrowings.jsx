import { useEffect, useMemo, useState } from 'react'
import { addDays, toISODateInput } from './utils'
import './Borrowings.css'
import { api } from './api'

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

  useEffect(() => {
    api.listBorrowings().then(setItems).catch(() => {})
  }, [])

  const visibleItems = useMemo(() => {
    if (filter === 'ALL') return items
    if (filter === 'ACTIVE') return items.filter((it) => it.status === 'ACTIVE')
    if (filter === 'RETURNED') return items.filter((it) => it.status === 'RETURNED')
    return items
  }, [items, filter])

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
    const updatedReturn = form.returnDate || null
    const payload = { memberId: form.memberId, bookId: form.bookId, borrowDate: form.borrowDate, dueDate: form.dueDate, returnDate: updatedReturn }
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
    await api.deleteBorrowing(id)
    setItems((prev) => prev.filter((it) => it.id !== id))
    if (editingId === id) cancelEdit()
  }

  async function markReturned(id) {
    const updated = await api.returnBorrowing(id)
    setItems((prev) => prev.map((it) => (it.id === id ? updated : it)))
  }

  return (
    <div className="section borrowings">
      <div className="section-header card">
        <div className="section-header-row">
          <h2>Borrowings</h2>
          <div className="toolbar">
            <label>Status Filter</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="RETURNED">Returned</option>
            </select>
          </div>
        </div>
      </div>
      <form className="card form" onSubmit={editingId ? saveEdit : createBorrowing}>
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
            <label>Borrow Date</label>
            <input type="date" name="borrowDate" value={form.borrowDate} onChange={handleChange} required />
          </div>
          <div>
            <label>Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required />
          </div>
          <div>
            <label>Return Date</label>
            <input type="date" name="returnDate" value={form.returnDate} onChange={handleChange} />
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
                  <span className={`badge ${it.status === 'ACTIVE' ? 'warning' : 'success'}`}>{it.status}</span>
                </td>
                <td>Rs. {it.lateFee || 0}</td>
                <td className="row-actions">
                  <button className="small" onClick={() => startEdit(it.id)}>Edit</button>
                  <button className="small secondary" onClick={() => remove(it.id)}>Delete</button>
                  {it.status !== 'RETURNED' && (
                    <button className="small success" onClick={() => markReturned(it.id)}>Return</button>
                  )}
                </td>
              </tr>
            ))}
            {visibleItems.length === 0 && (
              <tr>
                <td colSpan={10} className="empty">No records</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


